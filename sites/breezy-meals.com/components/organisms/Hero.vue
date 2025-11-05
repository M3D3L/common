<template>
  <section class="w-full min-h-screen grid content-center">
    <Card
      class="container flex flex-col items-center justify-center py-24 space-y-8 text-center md:py-24"
    >
      <Badge variant="secondary" class="px-4 py-1.5 text-sm">
        {{ badgeText }}
      </Badge>

      <h1
        class="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
      >
        {{ headline }}
        <span class="block mt-2 text-primary">{{ subheadline }}</span>
      </h1>

      <p class="max-w-2xl text-lg text-muted-foreground md:text-xl">
        {{ description }}
      </p>

      <div class="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" class="px-10 py-3 text-lg shadow-lg">
          {{ primaryButton }}
        </Button>
        <Button size="lg" variant="outline" class="px-10 py-3 text-lg">
          {{ secondaryButton }}
        </Button>
      </div>

      <div
        class="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-muted-foreground"
      >
        <div
          v-for="(item, index) in trustIndicators"
          :key="index"
          class="flex items-center gap-2"
        >
          <CheckCircle class="w-5 h-5 text-primary" />
          <span>{{ item }}</span>
        </div>
      </div>
    </Card>
  </section>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { CheckCircle } from "lucide-vue-next";

const props = defineProps({
  badgeText: {
    type: String,
    default: "🌊 Fresh Ocean Breeze, Quick & Easy Meals",
  },
  headline: {
    type: String,
    default: "Delicious, Healthy Meals",
  },
  subheadline: {
    type: String,
    default: "Ready When You Are",
  },
  description: {
    type: String,
    default:
      "Premium frozen meals delivered to your door in San Carlos, Sonora. From classic comfort food to authentic Mexican dishes all vacuum-sealed, labeled, and ready to heat and enjoy.",
  },
  primaryButton: {
    type: String,
    default: "Order Now",
  },
  secondaryButton: {
    type: String,
    default: "View Menu",
  },
  trustIndicators: {
    type: Array as () => string[],
    default: () => [
      "Vacuum Sealed Fresh",
      "Dietary Options Available",
      "Local San Carlos Delivery",
    ],
  },
});
</script>
