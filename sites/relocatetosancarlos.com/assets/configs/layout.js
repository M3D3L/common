import * as layoutSp from "./layoutSp";
import * as layoutEn from "./layoutEn";

// Default to English, will be updated on client
const currentLayout = ref(layoutEn);

// Only update on client side after hydration
if (process.client) {
  watch(
    () => {
      try {
        const { $isSpanishDomain } = useNuxtApp();
        return $isSpanishDomain;
      } catch {
        return false;
      }
    },
    (isSpanish) => {
      currentLayout.value = isSpanish ? layoutSp : layoutEn;
    },
    { immediate: true }
  );
}

// Create individual exports
const createComputed = (key) => {
  return computed(() => currentLayout.value[key]);
};

export const seoDefaults = createComputed("seoDefaults");
export const contactInfo = createComputed("contactInfo");
export const heroSection = createComputed("heroSection");
export const servicesSection = createComputed("servicesSection");
export const socialsSection = createComputed("socialsSection");
export const propertiesSection = createComputed("propertiesSection");
export const blogSection = createComputed("blogSection");
export const siteMap = createComputed("siteMap");
export const socials = createComputed("socials");
export const realEstateHeroSection = createComputed("realEstateHeroSection");
export const categoryConfigs = createComputed("categoryConfigs");
export const contactSection = createComputed("contactSection");
export const categories = createComputed("categories");
export const categoryHeaders = createComputed("categoryHeaders");
export const categoriesHeaders = createComputed("categoriesHeaders");
