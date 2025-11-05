<template>
  <section id="features" class="w-full py-24 md:py-36">
    <div class="container text-center">
      <Badge variant="outline" class="mb-4">{{ badgeText }}</Badge>

      <h2 class="mb-4 text-4xl font-bold md:text-5xl">
        {{ heading }}
      </h2>

      <p class="max-w-3xl mx-auto mb-16 text-lg text-muted-foreground">
        {{ description }}
      </p>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          class="p-8 text-left transition hover:border-primary hover:shadow-xl"
          v-for="(feature, index) in features"
          :key="index"
        >
          <div class="flex flex-row gap-2 items-center">
            <div class="mb-4 text-3xl">{{ feature.icon }}</div>
            <CardTitle class="mb-3 text-xl font-semibold">
              {{ feature.title }}
            </CardTitle>
          </div>
          <CardDescription class="text-base">
            {{ feature.description }}
          </CardDescription>
        </Card>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";

const props = defineProps({
  badgeText: {
    type: String,
    default: "Why Breezy Meals?",
  },
  heading: {
    type: String,
    default: "Made for Your Lifestyle",
  },
  description: {
    type: String,
    default:
      "Whether you're enjoying retirement, managing dietary needs, or simply want more time to enjoy San Carlos, we've got you covered.",
  },
  features: {
    type: Array as () => {
      icon: string;
      title: string;
      description: string;
    }[],
    default: () => [
      {
        title: "Vacuum Fresh",
        description:
          "Every meal is carefully prepared, vacuum-sealed to lock in flavor and nutrients, then clearly labeled with heating instructions.",
        icon: "❄️",
      },
      {
        title: "Local Ingredients",
        description:
          "We partner with local farms to source the freshest ingredients, supporting our community and ensuring quality.",
        icon: "🌱",
      },
      {
        title: "Convenient Delivery",
        description:
          "Enjoy hassle-free delivery right to your doorstep, so you can spend more time enjoying your meal and less time in the kitchen.",
        icon: "🚚",
      },
      {
        title: "Diverse Menu Options",
        description:
          "From classic comfort foods to authentic Mexican dishes, our menu offers something for every palate and dietary need.",
        icon: "🍽️",
      },
      {
        title: "Dietary-Friendly",
        description:
          "We cater to various dietary needs with heart-healthy, diabetic-friendly, and gluten-free options clearly marked on our menu.",
        icon: "❤️",
      },
      {
        title: "Ready in Minutes",
        description:
          "Our meals are designed for quick preparation, allowing you to enjoy a delicious home-cooked meal in just minutes.",
        icon: "⏱️",
      },
    ],
  },
});
</script>
