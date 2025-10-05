<template>
  <div
    class="container relative w-full py-10 md:py-16 font-body bg-background text-foreground"
  >
    <Seo :seoData="computedSeoData" />
    
    <div v-if="pending" class="py-16 text-center text-muted-foreground">
      Loading menu...
    </div>
    <div v-else-if="error" class="py-16 text-center text-red-500">
      Failed to load menu. Please try again later.
    </div>
    <div v-else-if="!data" class="py-16 text-center text-muted-foreground">
      No menu found.
    </div>

    <div v-else class="space-y-8 md:space-y-16">
      <section v-if="business" class="space-y-8 text-center">
        <div class="container flex flex-col gap-4 mt-16 mb-6 md:flex-row md:items-center md:justify-between">
        <TitleBlock class="mb-6" :title="business.name"
          :description="isSpanish ? business.description_ES : business.description_En" />

        <!-- Social Links -->

        <ContainersSocials v-if="business?.isFeatured && business?.socials" :socialLinks="business.socials"
          :columnOnMobile="true" />

      </div>

        

        <div
          v-if="business.gallery?.length && isPremiumUser"
          class="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          <Card
            v-for="(img, i) in business.gallery"
            :key="i"
            class="overflow-hidden"
          >
            <img
              :src="img.url"
              :alt="isSpanish ? img.alt_es : img.alt_en"
              class="object-cover w-full h-full"
            />
          </Card>
        </div>
      </section>

      <div class="flex flex-col-reverse md:flex-row md:gap-8">
        <div class="flex-1">
          <section
            v-for="(category, index) in data.items"
            :id="category.nameEn"
            :key="index"
            class="mb-32 space-y-6"
          >
            <TextSectionTitle
              :title="isSpanish ? category.nameEs : category.nameEn"
              :h1="false"
            />

            <ul class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <li
                v-for="(item, itemIndex) in category.items"
                :key="`${index}-${itemIndex}`"
                class="h-full"
              >
                <Card
                  class="flex flex-col h-full p-5 transition-all hover:shadow-md"
                >
                  <div class="flex flex-col flex-grow space-y-3">
                    <img
                      v-if="item?.image && isPremiumUser"
                      :src="item.image"
                      class="object-cover w-full h-48 rounded-lg"
                    />
                    <div class="flex items-start justify-between">
                      <CardTitle class="text-lg font-semibold leading-tight">
                        {{ isSpanish ? item.nameEs : item.nameEn }}
                      </CardTitle>
                      <span class="text-base font-bold text-primary">
                        {{ item.price ? `$${item.price.toFixed(2)}` : "" }}
                      </span>
                    </div>

                    <CardDescription
                      class="text-sm leading-relaxed text-muted-foreground"
                    >
                      {{ isSpanish ? item.descriptionEs : item.descriptionEn }}
                    </CardDescription>

                    <client-only>
                      <Checkout
                        v-if="item && isPremiumUser"
                        class="self-end pt-3 mt-auto"
                        :phone="business?.contact?.phone || ''"
                        :item="item"
                      />
                    </client-only>
                  </div>
                </Card>
              </li>
            </ul>
          </section>
        </div>

        <aside class="w-full mb-10 md:w-64 md:mt-0">
          <div class="sticky space-y-6 top-32">
            <div v-if="isPremiumUser">
              <h3 class="mb-3 text-lg font-semibold text-foreground">
                Categories
              </h3>
              <ul class="flex flex-col gap-2 text-sm">
                <li v-for="(category, index) in data.items" :key="index">
                  <a
                    :href="`#${category.nameEn}`"
                    class="text-primary hover:underline"
                  >
                    {{ isSpanish ? category.nameEs : category.nameEn }}
                  </a>
                </li>
              </ul>
            </div>

            <Card v-else class="p-4 mt-6 space-y-2 text-center">
              <p class="text-sm font-semibold leading-tight text-foreground">
                <span v-if="isSpanish">¡Anúnciate Aquí!</span>
                <span v-else>Place Your Ad Here</span>
              </p>

              <p class="text-xs text-muted-foreground">
                <span v-if="isSpanish">Llega a miles de clientes locales.</span>
                <span v-else>Reach thousands of local customers.</span>
              </p>

              <a href="/contact/advertising" class="block pt-1">
                <Button variant="secondary" class="w-full h-8 text-xs">
                  <span v-if="isSpanish">Consultar Espacio Publicitario</span>
                  <span v-else>Inquire About Ad Space</span>
                </Button>
              </a>
            </Card>
          </div>
        </aside>
      </div>

      <button
        @click="isSpanish = !isSpanish"
        class="fixed flex flex-col items-center content-center gap-2 right-4 bottom-4"
      >
        <img
          :src="
            isSpanish
              ? '/images/countries/USA.png'
              : '/images/countries/Mexico.png'
          "
          alt="Country Flag"
          class="w-10 h-10"
        />
        {{ isSpanish ? "English" : "Español" }}
      </button>

      <footer
        v-if="business.contact || business.address"
        class="pt-10 mt-16 text-sm text-center border-t border-muted-foreground/20 text-muted-foreground"
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

          <ContainersSocials
            v-if="business?.is_featured"
            :socialLinks="mappedSocials"
          />
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createSeoObject } from "@common/composables/useSeo";
import { Card, CardTitle, CardDescription } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import {
  TwitterLogoIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  InstagramLogoIcon,
} from "@radix-icons/vue";

const { fetchCollection } = usePocketBaseCore();
const route = useRoute();

const isSpanish = ref(false);
const isPremiumUser = computed(() => {
  // For demo purposes, let's assume premium status is determined by a query param
  return data.value?.expand?.business?.is_featured || false;
});

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

const computedSeoData = computed(() => {
  return createSeoObject({
    title: business.value?.name,
    summary: isSpanish
      ? business.value?.description_Sp : business.value?.description_En,
    imageUri: "",
    pubDate: new Date().toISOString(),
    byline: "RelocateToSanCarlos",
  });
});

const business = computed(() => data.value?.expand?.business || null);

const iconMap: Record<string, any> = {
  instagram: InstagramLogoIcon,
  twitter: TwitterLogoIcon,
  linkedin: LinkedinLogoIcon,
  github: GithubLogoIcon,
};

const mappedSocials = computed(() => {
  const socials = business.value?.socials || [];
  return socials.map((s: { platform: string; url: string }) => ({
    href: s.url,
    icon: iconMap[s.platform.toLowerCase()] || GithubLogoIcon,
  }));
});
</script>
