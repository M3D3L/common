<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <TheNavbar
      :links="navLinks"
      slogan="Real Estate"
      :siteName="contactInfo?.siteName"
    />
    <SectionsModal />
    <main class="w-full">
      <slot />
    </main>

    <SectionsBlogColumn
      v-if="showBlogSection"
      :class="isMenuPage ? 'pb-8' : 'pb-16'"
      :h1="isBlogPage"
      :showPagination="isBlogPage"
      type="relocateBlog"
      v-bind="personalizedBlogSection"
      :title="personalizedBlogSection.title"
      :perPage="isBlogPage ? 10 : 5"
      :newsLetterModule="newsLetterModule"
    />
    <SectionsContact
      :social-links="personalizedSocials"
      v-bind="personalizedContactSection"
    />

    <a
      v-if="scheduleLink"
      :href="scheduleLink"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed z-50 bottom-4 hover:opacity-80 hover:scale-105 transform uppercase px-4 py-2 right-4 flex gap-4 items-center bg-primary text-primary-foreground rounded-lg transition-all whitespace-nowrap shadow-lg"
    >
      <p>{{ scheduleLabel }}</p>

      <!-- <CalendlyButton
        class="hover:scale-125 transition-all duration-150 transform"
        link="https://calendly.com/brendaaigsc/30min"
      />
      <WhatsappButton
        class="hover:scale-125 transition-all duration-150 transform"
        phone="+526444572193"
        message="Hello, I would like to schedule a call!"
      /> -->
    </a>
    <OrganismsBaseFooter
      :links="navLinks"
      :footerConfig
      :contactInfo="personalizedContactInfo"
      :socials="personalizedSocials"
    />

    <!-- <DebugBar /> -->
  </div>
</template>

<script setup lang="ts">
import DebugBar from "@common/components/DebugBar.vue";
import useAuth from "@common/composables/useAuth";

import {
  contactInfo,
  siteMap,
  blogSection,
  contactSection,
  socials,
  footerConfig,
  newsLetterModule,
} from "~/assets/configs/layout";

const route = useRoute();
const { user, isAuthenticated } = useAuth();
const { partner, partnerLandingContent } = useReferralPartner();

const personalizedBlogSection = computed(() => {
  if (!partner.value) return blogSection;
  const blog = partnerLandingContent.value.blog || {};
  return {
    ...blogSection,
    title: blog.title || "Your San Carlos Relocation Guide",
    description:
      blog.description ||
      "Practical local information about property, relocation, and everyday life in San Carlos.",
    imgSrc: "",
    byline: `${partner.value.name} and RelocateToSanCarlos.com`,
  };
});

const showBlogSection = computed(
  () => !partner.value || partnerLandingContent.value.blog?.enabled !== false,
);

const personalizedContactSection = computed(() => {
  if (!partner.value) return contactSection;

  const contact = partnerLandingContent.value.contact || {};

  return {
    ...contactSection,
    title:
      contact.title || `Plan Your San Carlos Move with ${partner.value.name}`,
    description:
      contact.description ||
      `Tell ${partner.value.name} what you are looking for and the local team will coordinate the next step.`,
    contactEmail: partner.value.email || "",
    contactPhone: partner.value.phone || partner.value.whatsapp_phone || "",
    componentText: {
      ...contactSection.componentText,
      header: contact.header || `Connect with ${partner.value.name}`,
      subHeader:
        contact.sub_header ||
        `Share your goals, timing, and property preferences with ${partner.value.name}.`,
    },
  };
});

const personalizedSocials = computed(() => {
  if (!partner.value) return socials;
  const entries = Array.isArray(partner.value.socials)
    ? partner.value.socials
    : partner.value.socials?.socials || [];

  return entries
    .map((entry: any) => {
      const configured = socials.find(
        (social) => social.label.toLowerCase() === entry.label?.toLowerCase(),
      );
      return configured
        ? { ...configured, href: entry.href, label: entry.label }
        : null;
    })
    .filter(Boolean);
});

const personalizedContactInfo = computed(() => {
  if (!partner.value) return contactInfo;
  return {
    ...contactInfo,
    slogan:
      partnerLandingContent.value.footer?.slogan ||
      `San Carlos properties and relocation guidance with ${partner.value.name}.`,
    email: partner.value.email || "",
    phone: partner.value.phone || partner.value.whatsapp_phone || "",
  };
});

const scheduleLink = computed(() =>
  partner.value
    ? partner.value.calendly_url || ""
    : "https://calendly.com/brendaaigsc/30min",
);
const scheduleLabel = computed(() =>
  partner.value ? `schedule with ${partner.value.name}` : "schedule a call",
);

const isVerifiedAgent = computed(
  () => isAuthenticated.value && user.value?.verified === true,
);

const navLinks = computed(() => {
  const links = [...siteMap];

  if (isVerifiedAgent.value) {
    const adminHref = route.path.startsWith("/bienes-raices")
      ? "/bienes-raices/admin/"
      : "/real-estate/admin/";

    if (!links.some((link) => link.href === adminHref)) {
      links.push({
        label: "Admin Dashboard",
        href: adminHref,
      });
    }
  }

  return links;
});

const isBlogPage = computed(() => {
  // Remove leading and trailing slashes, then lowercase
  const path = route.path.replace(/^\/|\/$/g, "").toLowerCase();
  return path === "blog";
});

const isMenuPage = computed(() => route.path.startsWith("/menu"));
</script>
