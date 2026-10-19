import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compileScript, compileStyle, compileTemplate, parse } from "@vue/compiler-sfc";

const filename = new URL("../pages/pantalla.vue", import.meta.url).pathname;
const source = readFileSync(filename, "utf8");
const { descriptor, errors } = parse(source, { filename });

test("TV menu compiles with its script bindings", () => {
  assert.deepEqual(errors, []);
  const script = compileScript(descriptor, { id: "display-menu" });
  const template = compileTemplate({
    source: descriptor.template!.content,
    filename,
    id: "display-menu",
    compilerOptions: { bindingMetadata: script.bindings },
  });
  assert.deepEqual(template.errors, []);
  const style = compileStyle({
    source: descriptor.styles[0]!.content,
    filename,
    id: "display-menu",
    scoped: true,
  });
  assert.deepEqual(style.errors, []);
});

test("main board retains all menu rows and sold-out states, without promotions or catering", () => {
  const board = source.slice(source.indexOf('<section class="menu-board"'), source.indexOf("<aside"));
  assert.match(board, /v-for="section in menuSections"/);
  assert.match(board, /v-for="item in section.items"/);
  assert.match(board, /isOut\(item.name\)/);
  assert.match(board, /money\(item.price\)/);
  assert.doesNotMatch(board, /promoCards|featuredPromo|catering/i);
  assert.doesNotMatch(source, /featurePool|displayDensity/);
});

test("menu overflow flows through a measured horizontal loop without shrinking or limiting rows", () => {
  assert.match(source, /column-fill: auto/);
  assert.match(source, /break-inside: avoid/);
  assert.match(source, /overflow-wrap: anywhere/);
  assert.match(source, /columns\.scrollWidth/);
  assert.match(source, /columns\.getBoundingClientRect\(\)\.width/);
  assert.match(source, /const columnStride = \(width \+ gap\) \/ visibleColumns/);
  assert.match(source, /menuCycleWidth\.value = totalColumns \* columnStride/);
  assert.match(source, /menuOverflow\.value = columns.scrollWidth > width \+ 1/);
  assert.match(source, /v-for="copy in menuOverflow \? 2 : 1"/);
  assert.match(source, /animation: menu-scroll var\(--menu-duration\) linear infinite/);
  assert.match(source, /translateX\(calc\(-1 \* var\(--menu-cycle-width\)\)\)/);
  assert.doesNotMatch(source, /menuSections\.value\.slice|line-clamp|scale\(/);
});

test("menu and promotions scroll independently in horizontal and vertical loops", () => {
  assert.match(source, /const MENU_SCROLL_SPEED = 32/);
  assert.match(source, /const PROMO_SCROLL_SPEED = 24/);
  assert.match(source, /v-for="promo in promoCards"/);
  assert.match(source, /v-for="copy in promoOverflow \? 2 : 1"/);
  assert.match(source, /:aria-hidden="copy === 2"/);
  assert.match(source, /class="promo-track"/);
  assert.match(source, /promoCycleHeight\.value \/ PROMO_SCROLL_SPEED/);
  assert.match(source, /groupHeight - trailingGap > availableHeight \+ 1/);
  assert.match(source, /animation: promo-scroll var\(--promo-duration\) linear infinite/);
  assert.match(source, /translateY\(-50%\)/);
  assert.match(source, /promo\.summary/);
  assert.match(source, /money\(promo.price\)/);
  assert.doesNotMatch(source, /featuredPromo|promo-slide|promo-art|promoTimer|promoPageIndex|rail-pagination|menuTimer|menuPageIndex|board-pagination/);
});

test("layout responds to fonts and viewport changes and cleans up timers", () => {
  assert.match(source, /new ResizeObserver\(scheduleDisplayLayout\)/);
  assert.match(source, /document\.fonts\.ready\.then\(scheduleDisplayLayout\)/);
  assert.match(source, /document\.fonts\.addEventListener\("loadingdone", scheduleDisplayLayout\)/);
  assert.match(source, /resizeObserver\?\.disconnect\(\)/);
  for (const timer of ["clockTimer", "refreshTimer"]) {
    assert.ok(source.includes(`clearInterval(${timer})`));
  }
  assert.match(source, /cancelAnimationFrame\(layoutFrame\)/);
});

test("promotions have a stationary title without the today indicator", () => {
  assert.doesNotMatch(source, /live-dot|>Hoy</);
  assert.match(source, /<aside class="promo-rail" aria-label="Promociones">/);
  assert.match(source, /<h2 class="promo-heading">Promociones<\/h2>/);
  assert.ok(source.indexOf('class="promo-heading"') < source.indexOf('class="promo-viewport"'));
  assert.match(source, /\.promo-rail\s*\{[^}]*grid-template-rows: auto minmax\(0, 1fr\);/);
});

test("marquees pause on focus and reduced-motion leaves original content manually scrollable", () => {
  assert.match(source, /\.promo-viewport:focus .promo-track\s*\{\s*animation-play-state: paused/);
  const reducedMotion = source.slice(source.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(reducedMotion, /\.promo-track.is-scrolling\s*\{\s*animation: none/);
  assert.match(reducedMotion, /\.promo-group\[aria-hidden="true"\]\s*\{\s*display: none/);
  assert.match(reducedMotion, /\.promo-viewport\s*\{\s*overflow-y: auto/);
  assert.match(source, /\.menu-viewport:focus .menu-track\s*\{\s*animation-play-state: paused/);
  assert.match(reducedMotion, /\.menu-track.is-scrolling\s*\{\s*animation: none/);
  assert.match(reducedMotion, /\.menu-columns\[aria-hidden="true"\]\s*\{\s*display: none/);
  assert.match(reducedMotion, /\.menu-viewport\s*\{\s*overflow-x: auto/);
});

test("news fills footer space between intrinsic-width ordering and QR blocks", () => {
  assert.match(source, /\.display-footer\s*\{[^}]*grid-template-columns: auto minmax\(0, 1fr\) auto;/);
  assert.match(source, /\.ticker\s*\{[^}]*grid-column: 2;/);
  assert.match(source, /\.footer-qr\s*\{[^}]*grid-column: 3;/);
});

test("catering uses its own catalog and skips sold-out items", () => {
  assert.match(source, /dishesField: \(\) => "catering",\s*useDailyMenu: \(\) => false/);
  assert.match(source, /cateringData\.groupItems\(group.key\)/);
  assert.match(source, /\.filter\(\(item\) => !isOut\(item.name\)\)/);
  assert.match(source, /v-if="cateringItems.length"/);
  assert.match(source, /:aria-hidden="!cateringVisible"/);
  assert.match(source, /v-for="item in cateringItems"/);
  assert.match(source, /item.image \|\| logoSrc/);
});

test("catering waits thirty seconds, scrolls its full collection downward once, then closes", () => {
  assert.match(source, /const CATERING_HIDDEN_DURATION = 30_000/);
  assert.match(source, /const CATERING_SCROLL_SPEED = 96/);
  assert.doesNotMatch(source, /v-for="copy in cateringOverflow/);
  assert.match(source, /@animationend="onCateringLoopComplete"/);
  assert.match(source, /function onCateringLoopComplete[\s\S]*?setCateringVisible\(false\)/);
  assert.match(source, /if \(!cateringVisible.value\) scheduleCateringCycle\(\)/);
  assert.match(source, /Math.max\(0, cateringCycleHeight.value - cateringViewportHeight.value\) \/ CATERING_SCROLL_SPEED \* 1000/);
  assert.match(source, /animation: catering-scroll var\(--catering-duration\) linear 1 both/);
  assert.match(source, /from \{ transform: translateY\(calc\(var\(--catering-viewport-height\) - 100%\)\); \}/);
  assert.match(source, /to \{ transform: translateY\(0\); \}/);
  assert.doesNotMatch(source.match(/\.catering-group\s*\{[^}]*\}/)?.[0] ?? "", /padding-bottom|margin-bottom/);
  assert.doesNotMatch(source, /@animationiteration|animation: catering-scroll[^;]*infinite/);
  assert.doesNotMatch(source, /CATERING_VISIBLE_DURATION|cateringWindowIndex|visibleCateringItems/);
  assert.match(source, /clearTimeout\(cateringTimer\)/);
  assert.match(source, /clearTimeout\(cateringTransitionTimer\)/);
});

test("catering makes room without clipping the menu and honors reduced motion", () => {
  assert.match(source, /grid-template-columns: minmax\(0, 7fr\) minmax\(0, 3fr\) var\(--catering-width\)/);
  assert.match(source, /menuViewportElement.value\?\.clientWidth \?\? 0\) >= 680 \? 2 : 1/);
  assert.match(source, /"--menu-group-width": menuColumnCount.value === 1 \? "85%" : "100%"/);
  assert.match(source, /column-count: var\(--menu-columns, 2\)/);
  assert.match(source, /\.display-content, .catering-panel\s*\{\s*transition: none/);
  assert.match(source, /viewport.clientHeight \* 0.82/);
  assert.match(source, /\.catering-track.is-scrolling\s*\{\s*animation: none/);
  assert.match(source, /\.catering-collection\s*\{\s*overflow-y: auto/);
  assert.match(source, /Math.max\(CATERING_STILL_DURATION, cateringPassDuration.value\)/);
});

test("catering uses the site's shared fonts rather than a separate serif face", () => {
  assert.doesNotMatch(source, /Georgia|"Times New Roman"/);
  assert.match(source, /\.catering-heading h2\s*\{[^}]*font-weight: 700/);
});

test("date query overrides the menu and date label without being reset by the clock", () => {
  assert.match(source, /parseDisplayDateQuery\(route.query.date\)/);
  assert.match(source, /const selectedDate = computed\(\(\) => datePreview.value.date \?\? currentDate.value\)/);
  assert.match(source, /new Date\(`\$\{selectedDate.value\}T12:00:00-07:00`\)/);
  assert.match(source, /Vista previa · \{\{ datePreview.date \}\}/);
  assert.match(source, /v-else-if="datePreview.error"[^>]*role="alert"/);
  assert.match(source, /currentDate.value = todayISO\(\)/);
  assert.doesNotMatch(source, /selectedDate.value =/);
});
