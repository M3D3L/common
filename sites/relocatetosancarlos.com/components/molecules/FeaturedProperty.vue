<template>
  <section v-if="content" class="relative w-full">
    <Card
      class="lg:grid flex flex-col-reverse border items-stretch overflow-hidden gap-0 lg:grid-cols-2 min-h-[500px]"
    >
      <div class="flex flex-col justify-center px-6 py-10 lg:px-12 lg:py-16">
        <div class="flex items-center gap-2 mb-4">
          <Badge
            variant="default"
            class="px-3 py-1 text-xs uppercase tracking-wider"
          >
            Featured Listing
          </Badge>
          <Badge
            variant="outline"
            class="px-3 py-1 text-xs uppercase tracking-wider"
          >
            {{ content.pricingType === "per/night" ? "Rental" : "For Sale" }}
          </Badge>
        </div>

        <nuxt-link
          :to="`/real-estate${content.slug}`"
          class="hover:text-primary transition-all hover:underline"
          :alt="`View ${content.title} Details`"
        >
          <h2
            class="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl mb-4"
          >
            {{ content.title }}
          </h2>
        </nuxt-link>

        <div class="flex items-center gap-2 mb-6 text-muted-foreground">
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
            <span class="text-xs uppercase text-muted-foreground font-semibold"
              >Bedrooms</span
            >
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
            <span class="text-xs uppercase text-muted-foreground font-semibold"
              >Bathrooms</span
            >
          </div>
          <div class="flex flex-col items-center lg:items-start">
            <div class="flex items-center gap-2 text-primary mb-1">
              <Square :size="20" />
              <span class="font-bold text-xl text-foreground">{{
                content.area || "--"
              }}</span>
            </div>
            <span class="text-xs uppercase text-muted-foreground font-semibold"
              >m² Area</span
            >
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div>
            <p class="text-sm text-muted-foreground font-medium mb-1">Price</p>
            <div class="text-3xl font-bold text-primary">
              {{ formattedPrice }}
            </div>
          </div>

          <nuxt-link
            :to="`/real-estate${content.slug}`"
            class="shrink-0"
            :alt="`View ${content.title} Details`"
          >
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
        :to="`/real-estate${content.slug}`"
        :alt="`View ${content.title} Details`"
      >
        <div class="relative min-h-[350px] lg:min-h-full overflow-hidden">
          <img
            :src="createImgUrl(content)"
            :alt="content.title"
            class="absolute inset-0 object-cover w-full h-full transition-transform hover:scale-105"
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

// Re-using your existing interfaces
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
  expand?: {
    author: {
      name: string;
      title: string;
      avatar: string;
      collectionId: string;
      id: string;
    };
  };
}

interface Props {
  content: PropertyContent | null;
  buttonText?: string;
}

const props = defineProps<Props>();

const createImgUrl = (content: PropertyContent) => {
  if (!content?.cover_image) return "";
  return `${config.public.pocketbaseUrl}api/files/${content.collectionId}/${content.id}/${content.cover_image}`;
};

const getAgentAvatar = (author: any) => {
  return `${config.public.pocketbaseUrl}api/files/${author.collectionId}/${author.id}/${author.avatar}`;
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
  return props.content.pricingType
    ? `${price} ${props.content.pricingType}`
    : price;
});
</script>
