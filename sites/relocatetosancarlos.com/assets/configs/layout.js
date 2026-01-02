import * as layoutSp from "./layoutSp.js";
import * as layoutEn from "./layoutEn.js";

// Internal helper to pick the right file
const getActiveLayout = () => {
  try {
    // This works inside Vue components and Nuxt Hooks
    const url = useRequestURL();
    return url.hostname.endsWith("vivirensancarlos.com") ? layoutSp : layoutEn;
  } catch (e) {
    // Fallback if accessed before Nuxt is ready or on the client-side early
    if (typeof window !== "undefined") {
      return window.location.hostname.endsWith(".mx") ? layoutSp : layoutEn;
    }
    return layoutEn;
  }
};

/**
 * We export "Proxy" objects.
 * When your component calls 'heroSection.title',
 * the proxy intercepts the call and gets the correct data.
 */
const createDynamicExport = (key) => {
  return new Proxy(
    {},
    {
      get(_, prop) {
        const layout = getActiveLayout();
        const target = layout[key];

        // If the target is a function (like a component or utility), bind it
        if (typeof target[prop] === "function") {
          return target[prop].bind(target);
        }
        return target[prop];
      },
      // Required for spread operators and iteration
      ownKeys() {
        return Reflect.ownKeys(getActiveLayout()[key]);
      },
      getOwnPropertyDescriptor(_, prop) {
        return {
          enumerable: true,
          configurable: true,
        };
      },
    }
  );
};

// Exporting your keys exactly as they were
export const seoDefaults = createDynamicExport("seoDefaults");
export const contactInfo = createDynamicExport("contactInfo");
export const heroSection = createDynamicExport("heroSection");
export const servicesSection = createDynamicExport("servicesSection");
export const socialsSection = createDynamicExport("socialsSection");
export const propertiesSection = createDynamicExport("propertiesSection");
export const blogSection = createDynamicExport("blogSection");
export const contactSection = {
  get value() {
    return getActiveLayout().contactSection;
  },
}.value;
export const siteMap = createDynamicExport("siteMap");
export const socials = createDynamicExport("socials");
export const realEstateHeroSection = createDynamicExport(
  "realEstateHeroSection"
);
export const categoryConfigs = createDynamicExport("categoryConfigs");
export const categories = {
  get value() {
    return getActiveLayout().categories;
  },
}.value;
