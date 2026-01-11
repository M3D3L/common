<template>
  <Card
    v-if="content"
    class="h-full overflow-hidden transition-shadow duration-300 group hover:shadow-md"
  >
    <CardHeader class="p-0">
      <nuxt-link
        v-if="content?.slug"
        :to="`/real-estate${content.slug}`"
        class="block w-full"
      >
        <div class="relative w-full aspect-[4/3] overflow-hidden bg-muted">
          <img
            :src="createImgUrl(content)"
            :alt="content.title"
            class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </nuxt-link>
    </CardHeader>

    <CardContent class="px-6 pt-6 pb-8 h-full flex flex-col overflow-hidden">
      <div class="mb-2">
        <span class="text-xl font-bold text-foreground">
          {{ formattedPrice }}
        </span>
      </div>

      <div class="space-y-1">
        <nuxt-link
          v-if="content?.slug"
          useChat
          :to="`/real-estate${content.slug}`"
          class="transition-colors text-primary hover:underline"
        >
          <h3 class="text-lg font-bold leading-snug line-clamp-1">
            {{ content.title }}
          </h3>
        </nuxt-link>

        <div
          v-if="content.address"
          class="flex items-center gap-1 text-sm text-muted-foreground"
        >
          <MapPin :size="14" class="shrink-0" />
          <span class="truncate">{{ content.address }}</span>
        </div>
      </div>

      <div
        class="flex items-center gap-4 py-4 mt-4 border-t border-muted/50 text-muted-foreground"
      >
        <div v-if="content.bedrooms" class="flex items-center gap-1.5">
          <Bed :size="16" />
          <span class="text-sm font-medium text-foreground">{{
            content.bedrooms
          }}</span>
        </div>
        <div v-if="content.bathrooms" class="flex items-center gap-1.5">
          <Bath :size="16" />
          <span class="text-sm font-medium text-foreground">{{
            content.bathrooms
          }}</span>
        </div>
        <div v-if="content.area" class="flex items-center gap-1.5">
          <Square :size="16" />
          <span class="text-sm font-medium text-foreground"
            >{{ content.area }} m²</span
          >
        </div>
      </div>

      <p
        v-if="content.description"
        class="text-sm leading-relaxed line-clamp-2 text-muted-foreground"
      >
        {{ content.description }}
      </p>

      <div v-if="displayAmenities.length > 0" class="mt-4 mb-6">
        <div class="flex flex-wrap gap-1.5">
          <Badge
            v-for="(amenity, index) in displayAmenities"
            :key="index"
            variant="secondary"
            class="text-[10px] font-medium px-2 py-0"
          >
            {{ amenity }}
          </Badge>
          <span
            v-if="remainingAmenities > 0"
            class="text-[10px] text-muted-foreground self-center"
          >
            +{{ remainingAmenities }} more
          </span>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 mt-auto">
        <nuxt-link
          v-if="content?.slug"
          :to="`/real-estate${content.slug}`"
          class="w-full"
        >
          <Button class="w-full font-semibold">
            {{ buttonText || "View Listing" }}
          </Button>
        </nuxt-link>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { MapPin, Bed, Bath, Square } from "lucide-vue-next";
import { useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();

export interface PropertyAmenity {
  name: string;
}

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
  amenities?: PropertyAmenity[];
  slug: string;
  collectionId?: string;
}

interface Props {
  content: PropertyContent | null;
  maxAmenities?: number;
  buttonText?: string;
  baseUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxAmenities: 3,
});

const createImgUrl = (content: PropertyContent) => {
  if (!content?.cover_image || !content?.collectionId || !content?.id)
    return "";
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

  if (props.content.pricingType) {
    return `${price} ${props.content.pricingType}`;
  }

  return price;
});

const displayAmenities = computed(() => {
  if (!props.content?.amenities) return [];
  return props.content.amenities
    .slice(0, props.maxAmenities)
    .map((a) => a.name);
});

const remainingAmenities = computed(() => {
  if (!props.content?.amenities) return 0;
  return Math.max(0, props.content.amenities.length - props.maxAmenities);
});
</script>
