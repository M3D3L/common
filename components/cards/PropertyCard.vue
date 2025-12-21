<template>
  <Card v-if="content" class="h-full overflow-hidden group">
    <CardHeader class="p-0 border-b border-muted">
      <nuxt-link
        v-if="content?.slug"
        :to="baseUrl + content.slug"
        class="w-full"
      >
        <div class="relative w-full h-auto aspect-[4/3]">
          <img
            :src="createImgUrl(content)"
            :alt="content.title"
            class="absolute top-0 bottom-0 left-0 right-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div class="absolute top-3 right-3 z-10">
            <span
              class="px-3 py-1 text-sm font-semibold rounded-full bg-background/90 text-foreground backdrop-blur-sm"
            >
              {{ formattedPrice }}
            </span>
          </div>
        </div>
      </nuxt-link>
    </CardHeader>

    <CardContent class="p-6 lg:p-8">
      <div class="flex flex-col h-full">
        <!-- Title and Address -->
        <div>
          <nuxt-link
            v-if="content?.slug"
            :to="baseUrl + content.slug"
            class="w-full transition-colors hover:text-primary"
          >
            <h3 class="text-xl font-bold line-clamp-1">{{ content.title }}</h3>
          </nuxt-link>

          <div
            v-if="content.address"
            class="flex items-center gap-1 mt-2 text-sm text-muted-foreground"
          >
            <MapPin :size="16" />
            <span>{{ content.address }}</span>
          </div>
        </div>

        <!-- Property Stats -->
        <div class="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div v-if="content.bedrooms" class="flex items-center gap-1">
            <Bed :size="16" />
            <span class="font-medium">{{ content.bedrooms }}</span> bed
          </div>
          <div v-if="content.bathrooms" class="flex items-center gap-1">
            <Bath :size="16" />
            <span class="font-medium">{{ content.bathrooms }}</span> bath
          </div>
          <div v-if="content.area" class="flex items-center gap-1">
            <Square :size="16" />
            <span class="font-medium">{{ content.area }}</span> m²
          </div>
        </div>

        <!-- Description -->
        <p v-if="content.description" class="mt-4 text-sm line-clamp-2">
          {{ content.description }}
        </p>

        <!-- Amenities -->
        <div v-if="displayAmenities.length > 0" class="mt-4 h-full mb-auto">
          <p class="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Amenities
          </p>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="(amenity, index) in displayAmenities"
              :key="index"
              variant="outline"
              class="text-xs"
            >
              {{ amenity }}
            </Badge>
            <Badge
              v-if="remainingAmenities > 0"
              variant="outline"
              class="text-xs font-semibold"
            >
              +{{ remainingAmenities }} more
            </Badge>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="mt-6">
          <nuxt-link
            v-if="content?.slug"
            :to="baseUrl + content.slug"
            class="w-full"
          >
            <Button class="w-full text-xs">{{
              buttonText || "View Details"
            }}</Button>
          </nuxt-link>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardContent } from "~/components/ui/card";
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
  baseUrl: "/properties",
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
