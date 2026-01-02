import { useNuxtApp, useRequestEvent } from "#app";
import * as layoutSp from "./layoutSp.js";
import * as layoutEn from "./layoutEn.js";

export const isSpanishDomain = (host = "") =>
  host === "vivirensancarlos.com" || host.endsWith(".vivirensancarlos.com");

/**
 * SSR-safe way to get the host.
 * We wrap this in a function so it's only called at runtime.
 */
const getHost = () => {
  if (process.client) return window.location.hostname;

  // Inside the Proxy 'get' trap, we can safely access useNuxtApp()
  // as long as the call originates from a Vue component or Nuxt hook.
  try {
    const event = useRequestEvent();
    return (
      event?.node?.req?.headers["x-forwarded-host"] ||
      event?.node?.req?.headers?.host ||
      ""
    );
  } catch (e) {
    // Fallback if called outside of a request context
    return "";
  }
};

const getActiveLayout = () => {
  const host = getHost();
  return isSpanishDomain(host) ? layoutSp : layoutEn;
};

const createDynamicExport = (key) => {
  return new Proxy(
    {},
    {
      get(_, prop) {
        const layout = getActiveLayout();
        const target = layout[key];

        if (!target) return undefined;

        // Logic to handle function binding (e.g. methods in your layout)
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      ownKeys() {
        return Reflect.ownKeys(getActiveLayout()[key] || {});
      },
      getOwnPropertyDescriptor(_, prop) {
        return { enumerable: true, configurable: true };
      },
    }
  );
};

// --- These exports remain identical to your current setup ---
export const seoDefaults = createDynamicExport("seoDefaults");
export const contactInfo = createDynamicExport("contactInfo");
export const heroSection = createDynamicExport("heroSection");
export const servicesSection = createDynamicExport("servicesSection");
export const socialsSection = createDynamicExport("socialsSection");
export const propertiesSection = createDynamicExport("propertiesSection");
export const blogSection = createDynamicExport("blogSection");
export const siteMap = createDynamicExport("siteMap");
export const socials = createDynamicExport("socials");
export const realEstateHeroSection = createDynamicExport(
  "realEstateHeroSection"
);
export const categoryConfigs = createDynamicExport("categoryConfigs");

// For these non-proxy exports, we MUST use a getter.
// If we evaluate .value immediately, it crashes on import.
export const contactSection = createDynamicExport("contactSection");
export const categories = createDynamicExport("categories");
