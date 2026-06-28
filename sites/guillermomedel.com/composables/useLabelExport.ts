export function useLabelExport(fontEmbedApiUrl: string) {
  const fontEmbedCache = ref<string | null>(null);

  function injectFonts(doc: Document) {
    const link1 = doc.createElement("link");
    link1.rel = "preconnect";
    link1.href = "https://fonts.googleapis.com";
    doc.head.appendChild(link1);

    const link2 = doc.createElement("link");
    link2.rel = "preconnect";
    link2.href = "https://fonts.gstatic.com";
    link2.crossOrigin = "anonymous";
    doc.head.appendChild(link2);

    const link3 = doc.createElement("link");
    link3.href = fontEmbedApiUrl;
    link3.rel = "stylesheet";
    doc.head.appendChild(link3);
  }

  async function ensureFontsLoaded(): Promise<void> {
    if (document.fonts.check("700 1em Oswald")) return;

    const style = document.createElement("style");
    style.textContent = `@import url('${fontEmbedApiUrl}');`;
    document.head.appendChild(style);

    await document.fonts.ready;
  }

  async function getFontEmbedCSS(): Promise<string> {
    if (fontEmbedCache.value) return fontEmbedCache.value;

    const cssRes = await fetch(fontEmbedApiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const cssText = await cssRes.text();

    const urlMatches = [
      ...cssText.matchAll(
        /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g,
      ),
    ];
    const woff2Urls = urlMatches.map((m) => m[1]);

    if (woff2Urls.length === 0) {
      console.error("No woff2 URLs found in Google Fonts CSS response");
      return "";
    }

    const base64Fonts = await Promise.all(
      woff2Urls.map(async (url) => {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
        return { url, b64 };
      }),
    );

    let embeddedCSS = cssText;
    for (const { url, b64 } of base64Fonts) {
      embeddedCSS = embeddedCSS.replace(url, `data:font/woff2;base64,${b64}`);
    }

    fontEmbedCache.value = embeddedCSS;
    return embeddedCSS;
  }

  return { injectFonts, ensureFontsLoaded, getFontEmbedCSS };
}
