import * as layoutSp from "./layoutSp";
import * as layoutEn from "./layoutEn";
import { computed } from "vue";

const resolveLayout = () => {
  const { $isSpanishDomain } = useNuxtApp();
  return !$isSpanishDomain ? layoutSp : layoutEn;
};

// Remove 'as any' and the type ': string'
const pick = (key) => computed(() => resolveLayout()[key]);

export const seoDefaults = pick("seoDefaults");
export const contactInfo = pick("contactInfo");
export const heroSection = pick("heroSection");
export const servicesSection = pick("servicesSection");
export const socialsSection = pick("socialsSection");
export const propertiesSection = pick("propertiesSection");
export const blogSection = pick("blogSection");
export const siteMap = pick("siteMap");
export const socials = pick("socials");
export const realEstateHeroSection = pick("realEstateHeroSection");
export const categoryConfigs = pick("categoryConfigs");
export const contactSection = pick("contactSection");
export const categories = pick("categories");
export const categoryHeaders = pick("categoryHeaders");
export const categoriesHeaders = pick("categoriesHeaders");
