import * as layoutSp from "./layoutSp";
import * as layoutEn from "./layoutEn";
import { computed } from "vue";

/**
 * Logic to determine the current active layout
 */
const currentLayout = computed(() => {
  try {
    const { $isSpanishDomain } = useNuxtApp();
    return $isSpanishDomain ? layoutSp : layoutEn;
  } catch (e) {
    return layoutEn;
  }
});

/**
 * Automatically creates a reactive mapping for all layout keys.
 */
const layout = new Proxy(
  {},
  {
    get(_, prop) {
      return computed(() => currentLayout.value[prop]);
    },
  }
);

export const {
  seoDefaults,
  contactInfo,
  heroSection,
  servicesSection,
  socialsSection,
  propertiesSection,
  blogSection,
  siteMap,
  socials,
  realEstateHeroSection,
  categoryConfigs,
  contactSection,
  categories,
  categoryHeaders,
  categoriesHeaders,
} = layout;
