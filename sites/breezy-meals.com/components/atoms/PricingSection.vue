<template>
  <section id="pricing" class="w-full py-24 md:py-36">
    <div class="container max-w-5xl">
      <div class="mb-16 text-center">
        <Badge variant="outline" class="mb-4">{{ badgeText }}</Badge>
        <h2 class="mb-4 text-4xl font-bold md:text-5xl">{{ heading }}</h2>
        <p class="text-lg text-muted-foreground">{{ description }}</p>
      </div>

      <div class="grid gap-8 md:grid-cols-2">
        <!-- Single Meal -->
        <Card class="p-8 border-2">
          <div class="mb-6">
            <h3 class="mb-2 text-2xl font-bold">{{ singlePlan.title }}</h3>
            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-4xl font-bold">{{ singlePlan.price }}</span>
              <span class="text-muted-foreground">{{
                singlePlan.priceNote
              }}</span>
            </div>
            <p class="text-muted-foreground">{{ singlePlan.subtitle }}</p>
          </div>

          <ul class="mb-8 space-y-4">
            <li
              v-for="(feature, index) in singlePlan.features"
              :key="index"
              class="flex items-start gap-3"
            >
              <CheckCircle
                class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <Button variant="outline" class="w-full" size="lg">
            {{ singlePlan.buttonText }}
          </Button>
        </Card>

        <!-- Weekly Package -->
        <Card class="relative p-8 border-2 shadow-xl border-primary">
          <Badge
            class="absolute transform -translate-x-1/2 -top-3 left-1/2 bg-primary"
          >
            {{ weeklyPlan.ribbonText }}
          </Badge>

          <div class="mb-6">
            <h3 class="mb-2 text-2xl font-bold text-primary">
              {{ weeklyPlan.title }}
            </h3>
            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-4xl font-bold">{{
                weeklyPlan.pricePerMeal
              }}</span>
              <span class="text-muted-foreground">{{
                weeklyPlan.perMealNote
              }}</span>
            </div>
            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-2xl font-bold">{{
                weeklyPlan.totalPrice
              }}</span>
              <span class="text-muted-foreground">{{
                weeklyPlan.totalNote
              }}</span>
            </div>
            <p class="text-muted-foreground">{{ weeklyPlan.subtitle }}</p>
          </div>

          <ul class="mb-8 space-y-4">
            <li
              v-for="(feature, index) in weeklyPlan.features"
              :key="index"
              class="flex items-start gap-3"
            >
              <CheckCircle class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span v-html="feature"></span>
            </li>
          </ul>

          <Button class="w-full" size="lg">{{ weeklyPlan.buttonText }}</Button>
          <p class="mt-3 text-sm text-center text-muted-foreground">
            {{ weeklyPlan.note }}
          </p>
        </Card>
      </div>

      <div class="mt-12 text-center">
        <p class="text-lg text-muted-foreground">
          <strong>{{ footerHighlight }}</strong>
          {{ footerText }}
        </p>
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
import { Button } from "@common/components/ui/button";
import { CheckCircle } from "lucide-vue-next";

const props = defineProps({
  badgeText: {
    type: String,
    default: "Simple Pricing",
  },
  heading: {
    type: String,
    default: "Affordable Meal Plans",
  },
  description: {
    type: String,
    default:
      "Quality meals that fit your budget. Order by the meal or save with weekly packages.",
  },
  singlePlan: {
    type: Object as () => {
      title: string;
      price: string;
      priceNote: string;
      subtitle: string;
      features: string[];
      buttonText: string;
    },
    default: () => ({
      title: "Single Meal",
      price: "$129",
      priceNote: "MXN per meal",
      subtitle: "Perfect for trying us out",
      features: [
        "Choose any meal from our menu",
        "Vacuum-sealed and labeled",
        "Local delivery available",
        "Dietary information included",
      ],
      buttonText: "Order Single Meals",
    }),
  },
  weeklyPlan: {
    type: Object as () => {
      ribbonText: string;
      title: string;
      pricePerMeal: string;
      perMealNote: string;
      totalPrice: string;
      totalNote: string;
      subtitle: string;
      features: string[];
      buttonText: string;
      note: string;
    },
    default: () => ({
      ribbonText: "Best Value - Save $50",
      title: "Weekly Package (5 Meals)",
      pricePerMeal: "$119",
      perMealNote: "MXN per meal",
      totalPrice: "$595",
      totalNote: "MXN total",
      subtitle: "Save $50 on weekly orders",
      features: [
        "<strong>All Single Meal benefits</strong>",
        "<strong>5 meals of your choice</strong>",
        "<strong>$10 savings per meal</strong>",
        "<strong>Priority delivery</strong>",
        "<strong>Mix and match any meals</strong>",
        "<strong>No commitment</strong> - order when you need",
      ],
      buttonText: "Order Weekly Package",
      note: "Most popular choice among our customers",
    }),
  },
  footerHighlight: {
    type: String,
    default: "Need more meals?",
  },
  footerText: {
    type: String,
    default: "Contact us for custom packages and additional savings!",
  },
});
</script>

<style></style>
