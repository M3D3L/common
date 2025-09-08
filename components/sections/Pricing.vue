<template>
  <section id="pricing" class="py-24">
    <div class="container mx-auto text-center">
      <div class="container relative mx-auto mb-12 text-center">
        <h2 class="text-4xl font-bold text-primary">Pricing Plans</h2>
        <p class="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
          Flexible packages designed to fit your relocation and real estate
          needs in San Carlos.
        </p>
      </div>

      <div class="grid gap-8 mt-12 md:grid-cols-3">
        <Card
          v-for="plan in plans"
          :key="plan.id"
          class="relative flex flex-col transition-all duration-300 border group hover:border-primary/40 hover:shadow-xl"
        >
          <CardHeader class="p-6 border-b border-muted">
            <h3 class="text-xl font-bold">{{ plan.title }}</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ plan.description }}
            </p>
          </CardHeader>

          <CardContent class="flex flex-col flex-1 p-6">
            <div class="mb-6">
              <span class="text-4xl font-extrabold tracking-tight">{{
                plan.price
              }}</span>
              <span class="ml-1 text-sm text-muted-foreground"
                >/ {{ plan.duration }}</span
              >
            </div>

            <ul class="flex-1 space-y-3 text-left">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-center gap-2 text-sm"
              >
                <Check class="w-4 h-4 text-primary" />
                <span>{{ feature }}</span>
              </li>
            </ul>

            <div class="mt-8">
              <Button class="w-full">{{ plan.cta }}</Button>
            </div>
          </CardContent>

          <div
            v-if="plan.popular"
            class="absolute top-0 right-0 px-3 py-1 text-xs font-semibold tracking-wide text-white rounded-bl-lg bg-primary"
          >
            Most Popular
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-vue-next";

const plans = [
  {
    id: 1,
    title: "Starter",
    description: "Perfect for individuals or couples exploring San Carlos.",
    price: "$499",
    duration: "one-time",
    features: [
      "Initial consultation",
      "Neighborhood orientation",
      "Basic property search",
      "Local contacts & recommendations",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: 2,
    title: "Standard",
    description: "Ideal for families planning relocation with ongoing support.",
    price: "$1,299",
    duration: "per month",
    features: [
      "Everything in Starter",
      "Full property search & visits",
      "Legal paperwork guidance",
      "Relocation logistics support",
      "School & healthcare introductions",
    ],
    cta: "Choose Standard",
    popular: true,
  },
  {
    id: 3,
    title: "Premium",
    description: "Complete relocation concierge with tailored services.",
    price: "$2,499",
    duration: "per month",
    features: [
      "Everything in Standard",
      "Custom property scouting",
      "Dedicated relocation specialist",
      "Investment consultation",
      "Full settlement support",
    ],
    cta: "Go Premium",
    popular: false,
  },
];
</script>
