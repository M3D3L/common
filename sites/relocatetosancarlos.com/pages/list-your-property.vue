<template>
  <div class="container relative w-full p-6 font-body md:py-10">
    <SeoMeta v-if="sellData" :seoData="computedSeoData" />

    <div
      v-if="sellData"
      class="flex flex-col gap-6 mb-8 md:flex-row md:items-start md:justify-between"
    >
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span
            class="py-1 text-xs font-semibold uppercase rounded-full bg-primary/10 text-primary px-3"
          >
            {{ sellData.hero.label }}
          </span>
          <span class="text-sm text-muted-foreground items-center flex">
            <ClientOnly>
              <MapPin :size="14" class="mr-1" />
              <template #fallback><span class="mr-1">📍</span></template>
            </ClientOnly>
            {{ sellData.hero.location }}
          </span>
        </div>

        <h1
          class="text-3xl text-primary font-extrabold tracking-tight md:text-5xl"
        >
          {{ sellData.hero.title }}
          <span class="text-foreground">{{ sellData.hero.highlight }}</span>
        </h1>

        <p class="text-muted-foreground leading-relaxed max-w-2xl">
          {{ sellData.hero.description }}
        </p>
      </div>
    </div>

    <section v-if="sellData" id="hero" class="w-full mb-10">
      <img
        :src="sellData.hero.image"
        alt="Selling property"
        class="w-full h-auto aspect-video max-h-[500px] object-cover rounded-xl shadow-lg"
        loading="eager"
      />
    </section>

    <section
      v-if="sellData"
      id="details"
      class="grid grid-cols-1 gap-8 lg:grid-cols-3"
    >
      <div class="lg:col-span-2 space-y-10">
        <div class="prose prose-slate max-w-none">
          <h2 class="text-2xl font-bold text-primary">
            {{ sellData.content.whyTitle }}
          </h2>
          <article
            v-html="sellData.content.whyDescription"
            class="mt-4"
          ></article>
        </div>

        <Card class="p-6 md:p-8">
          <h3 class="mb-6 text-xl font-bold border-b pb-4">
            {{ sellData.content.processTitle }}
          </h3>
          <div class="space-y-6">
            <div
              v-for="(step, index) in sellData.steps"
              :key="index"
              class="flex gap-4"
            >
              <div
                class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold"
              >
                {{ index + 1 }}
              </div>
              <div>
                <div class="font-bold text-lg leading-tight">
                  {{ step.name }}
                </div>
                <p class="text-muted-foreground mt-1">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <aside class="relative h-fit">
        <ClientOnly>
          <Card
            class="p-6 lg:sticky lg:top-28 lg:z-10 shadow-lg border-primary/10"
          >
            <h4 class="font-bold text-lg mb-2">{{ sellData.cta.title }}</h4>
            <p class="text-sm text-muted-foreground mb-4">
              {{ sellData.cta.description }}
            </p>

            <div class="space-y-3">
              <a
                :href="`mailto:${contactInfo.email}`"
                class="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Mail :size="16" class="text-primary" /> {{ contactInfo.email }}
              </a>
              <a
                :href="`tel:${contactInfo.phone}`"
                class="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Phone :size="16" class="text-primary" />
                {{ contactInfo.phone }}
              </a>
            </div>
          </Card>
          <template #fallback>
            <div
              class="p-6 border rounded-xl h-40 animate-pulse bg-muted/50"
            ></div>
          </template>
        </ClientOnly>
      </aside>
    </section>

    <section v-if="sellData" id="realtor" class="py-12 scroll-mt-40">
      <h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading">
        {{ sellData.realtor.sectionTitle }}
      </h2>
      <MoleculesRealtorBio
        :heroSection="heroSection"
        :sellData="sellData"
        :socialLinks="computedSocialLinks"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import {
  sellPropertyPage,
  contactInfo,
  heroSection,
  socials,
} from "@local/assets/configs/layout.js";
import { MapPin, Mail, Phone } from "lucide-vue-next";
import { Card } from "@common/components/ui/card";
import { createSeoObject } from "@common/composables/useSeo";

// useAsyncData ensures the static config is part of the Nuxt payload
const { data: sellData } = await useAsyncData("sell-property-data", () => {
  return Promise.resolve(sellPropertyPage);
});

const computedSeoData = computed(() => {
  if (!sellData.value) return null;
  return createSeoObject({
    title: sellData.value.seo?.title,
    summary: sellData.value.seo?.description,
    imageUri: sellData.value.hero?.image,
    keywords: sellData.value.seo?.keywords,
  });
});

const computedSocialLinks = computed(() => {
  return socials.map((s) => ({
    icon: s.icon,
    href: s.href,
    label: s.label,
  }));
});
</script>
