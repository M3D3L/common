<template>
  <div class="min-h-screen bg-background">
    <!-- SEO Meta -->
    <SeoMeta :seoData="seoData" />

    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background"
    >
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="mx-auto max-w-4xl text-center">
          <Badge class="mb-4" variant="secondary">
            {{ sellData.hero.label }}
          </Badge>

          <h1
            class="mb-4 text-4xl font-bold tracking-tight text-primary md:text-6xl"
          >
            {{ sellData.hero.title }}
            <span class="text-foreground">{{ sellData.hero.highlight }}</span>
          </h1>

          <p class="mb-8 text-lg text-muted-foreground md:text-xl">
            {{ sellData.hero.description }}
          </p>

          <div
            class="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <ClientOnly>
              <MapPin :size="16" />
            </ClientOnly>
            <span>{{ sellData.hero.location }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Hero Image -->
    <section class="container mx-auto px-4 -mt-8 mb-16">
      <div class="mx-auto max-w-6xl">
        <img
          :src="sellData.hero.image"
          alt="San Carlos Sonora Property Listing Services"
          class="h-auto w-full rounded-xl object-cover shadow-2xl aspect-[21/9]"
          loading="eager"
        />
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto px-4 pb-16">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-8 lg:grid-cols-3">
          <!-- Left Column - Main Content -->
          <div class="lg:col-span-2 space-y-12">
            <!-- Why List With Brenda -->
            <div>
              <h2 class="mb-6 text-3xl font-bold text-primary">
                {{ sellData.content.whyTitle }}
              </h2>
              <div class="prose prose-slate max-w-none">
                <p class="text-base leading-relaxed text-muted-foreground">
                  {{ sellData.content.whyDescription }}
                </p>
              </div>
            </div>

            <!-- Sales Process -->
            <Card>
              <CardHeader>
                <CardTitle class="text-2xl">{{
                  sellData.content.processTitle
                }}</CardTitle>
              </CardHeader>
              <CardContent class="space-y-6">
                <div
                  v-for="(step, index) in sellData.steps"
                  :key="index"
                  class="flex gap-4"
                >
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <h3 class="mb-2 text-lg font-semibold">
                      {{ step.name }}
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      {{ step.description }}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Benefits Grid -->
            <div>
              <h2 class="mb-6 text-2xl font-bold">
                {{ sellData.content.benefitsTitle }}
              </h2>
              <div class="grid gap-4 sm:grid-cols-2">
                <Card
                  v-for="(benefit, index) in sellData.benefits"
                  :key="index"
                >
                  <CardHeader>
                    <CardTitle class="text-lg">{{ benefit.title }}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p class="text-sm text-muted-foreground">
                      {{ benefit.description }}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <!-- Right Column - Sticky Contact Card -->
          <div class="lg:col-span-1">
            <Card class="sticky top-24 shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle>{{ sellData.cta.title }}</CardTitle>
                <CardDescription>
                  {{ sellData.cta.description }}
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <Separator />

                <div class="space-y-3">
                  <a
                    :href="`mailto:${contactInfo.email}`"
                    class="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                  >
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                    >
                      <ClientOnly>
                        <Mail :size="20" class="text-primary" />
                      </ClientOnly>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-medium text-muted-foreground">
                        {{ sellData.cta.emailLabel }}
                      </p>
                      <p class="text-sm font-medium truncate">
                        {{ contactInfo.email }}
                      </p>
                    </div>
                  </a>

                  <a
                    :href="`tel:${contactInfo.phone}`"
                    class="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                  >
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                    >
                      <ClientOnly>
                        <Phone :size="20" class="text-primary" />
                      </ClientOnly>
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-medium text-muted-foreground">
                        {{ sellData.cta.phoneLabel }}
                      </p>
                      <p class="text-sm font-medium">{{ contactInfo.phone }}</p>
                    </div>
                  </a>
                </div>

                <Separator />

                <Button as-child class="w-full" size="lg">
                  <a
                    :href="`mailto:${contactInfo.email}?subject=Property Listing Inquiry`"
                  >
                    {{ sellData.cta.contactButton }}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Realtor Bio Section -->
    <section class="container mx-auto px-4 py-16 bg-muted/30">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-8 text-3xl font-bold md:text-4xl">
          {{ sellData.realtor.sectionTitle }}
        </h2>
        <MoleculesRealtorBio
          :heroSection="heroSection"
          :sellData="sellData"
          :socialLinks="socialLinks"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  sellPropertyPage,
  contactInfo,
  heroSection,
  socials,
} from "@local/assets/configs/layout.js";
import { MapPin, Mail, Phone } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createSeoObject } from "@common/composables/useSeo";

const sellData = sellPropertyPage;

// SEO data
const seoData = computed(() => {
  return createSeoObject({
    title: sellData.seo?.title,
    summary: sellData.seo?.description,
    imageUri: sellData.hero?.image,
    keywords: sellData.seo?.keywords,
  });
});

// Social links
const socialLinks = computed(() => {
  return socials.map((s) => ({
    icon: s.icon,
    href: s.href,
    label: s.label,
  }));
});
</script>
