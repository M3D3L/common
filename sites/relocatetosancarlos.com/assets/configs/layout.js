import { computed } from "vue";
import * as layoutSp from "~/assets/configs/layoutSp";
import * as layoutEn from "~/assets/configs/layoutEn";

const createLayoutComputed = (key) => {
  return computed(() => {
    // Access the Nuxt app instance
    const nuxtApp = useNuxtApp();

    // Use the provided value from our domain plugin
    // This value is hydrated correctly from Server to Client
    const isSpanish = nuxtApp.$isSpanishDomain;

    const layout = isSpanish ? layoutSp : layoutEn;
    return layout[key];
  });
};

export const seoDefaults = createLayoutComputed("seoDefaults");
export const heroSection = createLayoutComputed("heroSection");
export const propertiesSection = createLayoutComputed("propertiesSection");
export const socialsSection = createLayoutComputed("socialsSection");
export const contactInfo = createLayoutComputed("contactInfo");
export const servicesSection = createLayoutComputed("servicesSection");
export const blogSection = createLayoutComputed("blogSection");
export const siteMap = createLayoutComputed("siteMap");
export const socials = createLayoutComputed("socials");
export const realEstateHeroSection = createLayoutComputed(
  "realEstateHeroSection"
);
export const categoryConfigs = createLayoutComputed("categoryConfigs");
export const contactSection = createLayoutComputed("contactSection");
export const categories = createLayoutComputed("categories");
export const categoryHeaders = createLayoutComputed("categoryHeaders");
export const categoriesHeaders = createLayoutComputed("categoriesHeaders");
