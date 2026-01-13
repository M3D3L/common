<template>
  <section v-if="content" class="relative w-full">
    <Card
      class="lg:grid flex flex-col-reverse border items-stretch overflow-hidden gap-0 lg:grid-cols-2 min-h-[500px]"
      :class="{ 'lg:flex-row-reverse': reverse }"
    >
      <div
        class="flex flex-col justify-center px-6 py-10 lg:px-12 lg:py-16 w-full"
      >
        <div class="flex items-center gap-2 mb-4">
          <Badge
            variant="default"
            class="px-3 py-1 text-xs uppercase tracking-wider"
          >
            {{ badgeText }}
          </Badge>
          <Badge
            variant="outline"
            class="px-3 py-1 text-xs uppercase tracking-wider"
          >
            {{
              content.pricingType === "per/night"
                ? isSp
                  ? "Renta"
                  : "Rental"
                : isSp
                ? "En Venta"
                : "For Sale"
            }}
          </Badge>
        </div>

        <nuxt-link
          :to="localizedSlug"
          class="hover:text-primary transition-all hover:underline"
        >
          <h2
            class="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl mb-4"
          >
            {{ content.title }}
          </h2>
        </nuxt-link>

        <div
          v-if="content?.address"
          class="flex items-center gap-2 mb-6 text-muted-foreground"
        >
          <MapPin :size="18" class="text-primary" />
          <span class="text-lg">{{ content.address }}</span>
        </div>

        <p
          class="text-lg leading-relaxed text-muted-foreground mb-8 line-clamp-3"
        >
          {{ content.description }}
        </p>

        <div class="grid grid-cols-3 gap-4 py-6 mb-8 border-y border-border/60">
          <div class="flex flex-col items-center lg:items-start">
            <div class="flex items-center gap-2 text-primary mb-1">
              <Bed :size="20" />
              <span class="font-bold text-xl text-foreground">{{
                content.bedrooms
              }}</span>
            </div>
          </div>
          <div
            class="flex flex-col items-center lg:items-start border-x border-border/60 px-4"
          >
            <div class="flex items-center gap-2 text-primary mb-1">
              <Bath :size="20" />
              <span class="font-bold text-xl text-foreground">{{
                content.bathrooms
              }}</span>
            </div>
          </div>
          <div class="flex flex-col items-center lg:items-start">
            <div class="flex items-center gap-2 text-primary mb-1">
              <Square :size="20" />
              <span class="font-bold text-xl text-foreground">{{
                content.area || "--"
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div class="text-3xl font-bold text-primary">
            {{ formattedPrice }}
          </div>

          <nuxt-link :to="localizedSlug" class="shrink-0">
            <Button
              size="lg"
              class="px-8 text-md font-bold md:w-auto w-full h-14 shadow-lg hover:shadow-primary/20 transition-all"
            >
              {{ buttonText || "View Full Details" }}
            </Button>
          </nuxt-link>
        </div>
      </div>

      <nuxt-link
        :to="localizedSlug"
        class="block relative w-full h-full min-h-[350px]"
      >
        <div class="absolute inset-0 overflow-hidden">
          <img
            :src="createImgUrl(content)"
            :alt="content.title"
            class="absolute inset-0 object-cover w-full h-full transition-transform duration-500 hover:scale-105 transform translate-z-0"
            loading="lazy"
          />
        </div>
      </nuxt-link>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Card } from "@common/components/ui/card";
import { MapPin, Bed, Bath, Square } from "lucide-vue-next";

const config = useRuntimeConfig();

export interface PropertyContent {
  id: string;
  title: string;
  description?: string;
  address?: string;
  price: number;
  pricingType?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  cover_image: string;
  slug: string;
  collectionId?: string;
}

interface Props {
  content: PropertyContent | null;
  buttonText?: string;
  reverse?: boolean;
  badgeText?: string;
  isSp?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  content: null,
  buttonText: "",
  reverse: false,
  badgeText: "Featured Listing",
  isSp: false,
});

// SINGLE SOURCE OF TRUTH FOR SLUG REWRITING
const localizedSlug = computed(() => {
  if (!props.content?.slug) return "#";

  let slug = props.content.slug;

  if (props.isSp) {
    // 1. Rewrite categories inside the slug
    // We use a mapping to replace the category segment
    const map: Record<string, string> = {
      "/rentals/": "/rentas/",
      "/properties/": "/ventas/",
      "/lots/": "/terrenos/",
    };

    Object.entries(map).forEach(([eng, sp]) => {
      if (slug.startsWith(eng)) {
        slug = slug.replace(eng, sp);
      }
    });

    // 2. Add the Spanish base prefix
    return `/bienes-raices${slug}`;
  }

  // English default prefix
  return `/real-estate${slug}`;
});

const createImgUrl = (content: PropertyContent) => {
  if (!content?.cover_image) return "";
  return `${config.public.pocketbaseUrl}api/files/${content.collectionId}/${content.id}/${content.cover_image}`;
};

const formattedPrice = computed(() => {
  if (!props.content) return "";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const price = formatter.format(props.content.price);

  // Basic translation for price suffix if needed
  let suffix = props.content.pricingType || "";
  if (props.isSp && suffix === "per/night") suffix = "por noche";

  return suffix ? `${price} ${suffix}` : price;
});
</script>
