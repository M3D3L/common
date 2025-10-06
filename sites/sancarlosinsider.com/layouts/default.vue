<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <the-navbar v-if="!useSCDigital"
      :logo="business?.is_featured ? business?.logo : undefined"
      :links="businessMap"
      :show-auth-buttons="false"
      :siteName="contactInfo?.siteName"
      class="fixed top-0 left-0 right-0 z-50 w-full"
    >
      <template #extra-links>
        <template v-if="route.path.includes('/menu') && business && business?.is_featured && route.path.split('/').filter(Boolean).length === 2">
          <CheckoutView
            v-if="checkoutToggled"
            class="absolute inset-0 right-0 z-100"
          />

          <Button
            @click="checkoutToggled = !checkoutToggled"
            aria-label="Toggle checkout"
          >
            <ShoppingBag class="w-5 h-5" />

            <span
              v-if="checkoutStore?.itemCount > 0"
              class="grid items-center w-5 h-5 text-xs font-bold text-center align-middle transform scale-[90%] rounded-full text-background bg-primary"
            >
              {{ checkoutStore?.itemCount > 0 ? checkoutStore?.itemCount : "" }}
            </span>
          </Button>
        </template>
      </template>
    </the-navbar>

    <!-- Header -->
    <header v-else class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div class="container flex items-center justify-between h-16">
        <a href="/" class="text-2xl font-bold tracking-tight">
          SC<span class="text-primary">Digital</span>
        </a>
        <nav class="hidden space-x-6 text-sm font-medium md:flex">
          <a href="#features" class="transition-colors hover:text-primary">Features</a>
          <a href="#pricing" class="transition-colors hover:text-primary">Pricing</a>
          <a href="#success" class="transition-colors hover:text-primary">Success Stories</a>
          <a href="#how" class="transition-colors hover:text-primary">How It Works</a>
          <a href="#faq" class="transition-colors hover:text-primary">FAQ</a>
        </nav>
        <Button size="sm">Start Free</Button>
      </div>
    </header>
    <Modal />
    <div>
      <main class="w-full">
        <slot />
      </main>
    </div>
    <footer
      v-if="business?.contact || business?.address"
      class="pt-10 my-16 text-sm text-center border-t border-muted-foreground/20 text-muted-foreground"
    >
      <div class="flex flex-col items-center gap-2">
        <img
          v-if="business?.logo && business?.is_featured"
          :src="business.logo"
          alt="Business Logo"
          class="h-16 mb-4"
        />

        <span>
          {{ business.address.street }}, {{ business.address.city }},
          {{ business.address.state }}
        </span>
        <a
          v-if="business.contact?.phone"
          :href="`tel:${business.contact.phone}`"
          class="transition-colors hover:text-primary"
        >
          {{ business.contact.phone }}
        </a>
        <a
          v-if="business.contact?.website"
          :href="business.contact.website"
          target="_blank"
          class="transition-colors hover:text-primary"
        >
          {{ business.contact.website }}
        </a>

        <ContainersSocialsIcons
          v-if="business?.socials?.length && business?.is_featured"
          :socials="business.socials"
          :columnOnMobile="false"
          :title="socialTitle"
        />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { contactInfo } from "~/assets/configs/layout";
import { Button } from "@common/components/ui/button";
import Modal from "@common/components/ui/modal/Modal.vue";
import usePocketBase from "@common/composables/usePocketBaseCore";
import { useCheckoutStore } from "~/store/checkoutStore";
import { ShoppingBag } from "lucide-vue-next";

const route = useRoute();

const { fetchCollection } = usePocketBase();
const checkoutStore = useCheckoutStore();

const businessMap = [
  { label: "Home", href: `/${route.params.slug}` },
  { label: "Menu", href: `${route.params.slug}/menu` },
];

const checkoutToggled = ref(false);

const toggleCheckout = () => {
  checkoutToggled.value = !checkoutToggled.value;
};

const useSCDigital = computed(() => route.path === "/" || route.path === "/login" || route.path === "/register");

const { data, pending, error } = await useAsyncData(
  () => `menu-${route.params.slug}`,
  async () => {
    if (!route?.params?.slug) return null;
    try {
      const result = await fetchCollection(
        "menus",
        1,
        1,
        `slug="${route.params.slug}"`,
        "-created",
        "business"
      );
      return result.items.length ? result.items[0] : null;
    } catch (err) {
      console.error("Failed to fetch menu:", err);
      return null;
    }
  }
);

const business = computed(() => data.value?.expand?.business || null);
</script>
