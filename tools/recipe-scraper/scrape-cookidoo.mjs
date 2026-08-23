#!/usr/bin/env node
/**
 * Logs into cookidoo.mx with Puppeteer, walks the "for you" feed (and any
 * "load more" pagination), collects every recipe link, then visits each one
 * to extract the full schema.org Recipe JSON-LD (ingredients + steps).
 *
 * Credentials are requested interactively (password input is hidden) — they
 * are only used in-memory to fill the login form and are never written to
 * disk or logged.
 *
 * Usage:
 *   node tools/recipe-scraper/scrape-cookidoo.mjs
 *   node tools/recipe-scraper/scrape-cookidoo.mjs --limit 10   # test run
 *
 * Browser runs headed so you can solve a CAPTCHA/2FA prompt manually if one
 * appears — the script just waits for the login redirect to complete.
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import {
  extractDetailRecipes,
  extractIndexRecipes,
  mergeRecipes,
  writeOutputs,
} from "./lib/recipe-parser.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "output");
const SAVED_HTML_DIR = path.join(
  __dirname,
  "../../sites/breezy-meals.com/assets",
);
const FOR_YOU_URL = "https://cookidoo.mx/foundation/es-MX/for-you";

const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i !== -1 ? Number(process.argv[i + 1]) : Infinity;
})();

// Requests every N recipes to take a longer, human-like break.
const BREAK_EVERY = 15;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Random delay in [min, max] ms — avoids a fixed, easily-fingerprinted cadence. */
function jitter(min, max) {
  return sleep(min + Math.random() * (max - min));
}

function loadKnownRecipes() {
  const byId = new Map();
  const file = path.join(OUTPUT_DIR, "recipes.json");
  if (fs.existsSync(file)) {
    try {
      const recipes = JSON.parse(fs.readFileSync(file, "utf8"));
      mergeRecipes(
        byId,
        recipes.filter((r) => r.hasDetail),
        recipes.filter((r) => !r.hasDetail),
      );
    } catch {
      // Continue with saved HTML when an old output file is malformed.
    }
  }

  let savedHtmlFiles = 0;
  if (fs.existsSync(SAVED_HTML_DIR)) {
    for (const name of fs.readdirSync(SAVED_HTML_DIR)) {
      if (!name.toLowerCase().endsWith(".html")) continue;
      savedHtmlFiles++;
      const sourceFile = path.join(SAVED_HTML_DIR, name);
      const html = fs.readFileSync(sourceFile, "utf8");
      mergeRecipes(
        byId,
        extractDetailRecipes(html, sourceFile),
        extractIndexRecipes(html, sourceFile),
      );
    }
  }

  return { byId, savedHtmlFiles };
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (a) => {
      rl.close();
      resolve(a);
    }),
  );
}

/** Prompts for a password without echoing it to the terminal. */
function promptHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.resume();
    stdin.setRawMode(true);
    let value = "";
    const onData = (buf) => {
      const char = buf.toString("utf8");
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(value);
        return;
      }
      if (char === "\u0003") process.exit(130); // Ctrl+C
      if (char === "\u007f" || char === "\b") {
        value = value.slice(0, -1);
        return;
      }
      value += char;
    };
    stdin.on("data", onData);
  });
}

async function collectRecipeLinks(page) {
  const links = new Set();
  let previousSize = -1;
  let stableRounds = 0;
  let rounds = 0;
  const MAX_ROUNDS = 60;
  const STABLE_ROUNDS_NEEDED = 4; // recommendation stripes fetch async on scroll-into-view; give them room to land

  while (stableRounds < STABLE_ROUNDS_NEEDED && rounds < MAX_ROUNDS) {
    rounds++;
    const found = await page.$$eval("a[href*='/recipes/recipe/']", (as) =>
      as.map((a) => a.getAttribute("href")),
    );
    for (const href of found) {
      const m = /\/recipes\/recipe\/[^/]+\/(r\d+)/.exec(href);
      if (m) links.add(m[1]);
    }

    if (links.size === previousSize) {
      stableRounds++;
    } else {
      stableRounds = 0;
      previousSize = links.size;
    }

    // Try clicking a "load more" style button if present, else scroll to trigger lazy loading.
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button, a")].find((el) =>
        /cargar más|ver más|mostrar más|load more/i.test(el.textContent || ""),
      );
      if (btn) {
        btn.scrollIntoView({ block: "center" });
        btn.click();
        return true;
      }
      return false;
    });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Recommendation stripes fetch their content async after scrolling into view.
    await page
      .waitForNetworkIdle({ idleTime: 800, timeout: 4000 })
      .catch(() => {});
    await jitter(clicked ? 900 : 600, clicked ? 1900 : 1400);
  }

  return [...links];
}

async function isAuthenticated(page) {
  return page.evaluate(
    () =>
      document.documentElement.classList.contains("is-authenticated") ||
      document.cookie.includes("v-authenticated="),
  );
}

async function main() {
  const email = await prompt("Cookidoo email: ");
  const password = await promptHidden("Cookidoo password: ");

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log("Navigating to Cookidoo (will redirect to login if needed)...");
  await page.goto(FOR_YOU_URL, { waitUntil: "networkidle2" });

  let onLoginPage = await page
    .waitForSelector("#username", { timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (!onLoginPage && !(await isAuthenticated(page))) {
    const loginHref = await page
      .$eval('a[href*="/profile/es-MX/login"]', (link) => link.href)
      .catch(() => null);
    if (!loginHref) {
      throw new Error(
        "Cookidoo is not authenticated and no login link was found on the page.",
      );
    }
    console.log("Public session detected. Opening Cookidoo login...");
    await page.goto(loginHref, { waitUntil: "networkidle2" });
    onLoginPage = await page
      .waitForSelector("#username", { timeout: 15000 })
      .then(() => true)
      .catch(() => false);
  }

  if (onLoginPage) {
    console.log("Filling login form...");
    await page.type("#username", email, { delay: 20 });
    await page.type("#password", password, { delay: 20 });
    await Promise.all([
      page.click("#login-submit-btn"),
      page
        .waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 })
        .catch(() => null),
    ]);

    // Give the user time to clear a CAPTCHA/2FA step manually if one shows up.
    await page
      .waitForFunction(() => location.hostname.includes("cookidoo.mx"), {
        timeout: 120000,
      })
      .catch(() => {
        console.warn(
          "Still not on cookidoo.mx after 2 minutes — finish any remaining login step in the browser window, then this will continue once redirected.",
        );
      });
  }

  if (!page.url().includes("cookidoo.mx")) {
    await page.waitForFunction(
      () => location.hostname.includes("cookidoo.mx"),
      {
        timeout: 0,
      },
    );
  }

  if (!(await isAuthenticated(page))) {
    await page.goto(FOR_YOU_URL, { waitUntil: "networkidle2" });
  }
  if (!(await isAuthenticated(page))) {
    throw new Error(
      "Cookidoo login did not produce an authenticated session; complete any login, CAPTCHA, or 2FA step in the browser and run again.",
    );
  }

  console.log("Logged in. Loading the for-you feed...");
  if (!page.url().startsWith(FOR_YOU_URL)) {
    await page.goto(FOR_YOU_URL, { waitUntil: "networkidle2" });
  }

  const ids = await collectRecipeLinks(page);
  console.log(`Collected ${ids.length} unique recipe link(s).`);

  const { byId, savedHtmlFiles } = loadKnownRecipes();
  console.log(
    `Loaded ${byId.size} known recipe(s) from output cache and ${savedHtmlFiles} saved HTML file(s).`,
  );
  const alreadyDone = new Set(
    [...byId.values()]
      .filter((r) => r.hasDetail && r.steps.length > 0) // retry cached entries with no steps captured
      .map((r) => r.id),
  );
  const noDetailFromCache = [...byId.values()]
    .filter((r) => !r.hasDetail)
    .map((r) => r.id);
  const incomplete = [...byId.values()]
    .filter((r) => r.hasDetail && r.steps.length === 0)
    .map((r) => r.id);
  const targets = [...new Set([...ids, ...noDetailFromCache, ...incomplete])]
    .filter((id) => !alreadyDone.has(id))
    .slice(0, LIMIT);
  console.log(
    `${alreadyDone.size} already have full detail from a previous run — visiting the remaining ${targets.length}.`,
  );
  console.log(
    `Backfill candidates from cache: ${noDetailFromCache.length}; feed scan this run: ${ids.length}.`,
  );

  for (const [i, id] of targets.entries()) {
    const url = `https://cookidoo.mx/recipes/recipe/es-MX/${id}`;
    process.stdout.write(`[${i + 1}/${targets.length}] ${url} ... `);
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      // Cookidoo hydrates the full recipeInstructions into the JSON-LD script
      // client-side after confirming the subscription/auth state, which can
      // land slightly after networkidle2 — wait for it before reading content.
      await page
        .waitForFunction(
          () =>
            [
              ...document.querySelectorAll(
                'script[type="application/ld+json"]',
              ),
            ].some((s) => {
              try {
                const data = JSON.parse(s.textContent || "{}");
                const roots = Array.isArray(data)
                  ? data
                  : Array.isArray(data?.["@graph"])
                    ? data["@graph"]
                    : [data];
                return roots.some((r) => {
                  if (!r || r["@type"] !== "Recipe") return false;
                  const steps = r.recipeInstructions;
                  if (Array.isArray(steps) && steps.length > 0) return true;
                  if (typeof steps === "string" && steps.trim()) return true;
                  return false;
                });
              } catch {
                return false;
              }
            }),
          { timeout: 8000 },
        )
        .catch(() => {}); // some recipes genuinely have no instructions section
      const html = await page.content();
      const detail = extractDetailRecipes(html, url);
      mergeRecipes(byId, detail, []);
      if (detail[0]?.steps?.length > 0) {
        console.log(
          `ok (${detail[0].ingredients.length} ingredients, ${detail[0].steps.length} steps)`,
        );
      } else if (detail.length) {
        console.log(
          "incomplete (recipe metadata found, preparation steps missing)",
        );
      } else {
        console.log("failed (no Recipe JSON-LD found)");
      }
    } catch (err) {
      console.log(`failed (${err.message})`);
    }

    // Periodically save progress + take a longer human-like break.
    if ((i + 1) % BREAK_EVERY === 0) {
      writeOutputs(OUTPUT_DIR, [...byId.values()]);
      await jitter(8000, 15000);
    } else {
      await jitter(1500, 4000); // random pacing instead of a fixed interval
    }
  }

  await browser.close();

  const recipes = [...byId.values()].sort((a, b) =>
    a.title.localeCompare(b.title, "es"),
  );
  const writtenRecipes = writeOutputs(OUTPUT_DIR, recipes);
  const completeCount = writtenRecipes.filter(
    (recipe) => recipe.hasDetail && recipe.steps?.length > 0,
  ).length;
  const incompleteCount = writtenRecipes.filter(
    (recipe) => recipe.hasDetail && !recipe.steps?.length,
  ).length;

  console.log(
    `Stored ${writtenRecipes.length} unique recipe(s): ${completeCount} complete, ` +
      `${incompleteCount} missing preparation steps, ` +
      `${writtenRecipes.filter((r) => !r.hasDetail).length} index-only.`,
  );
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_DIR)}/recipes.json`);
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_DIR)}/recipes.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
