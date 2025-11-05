<template>
  <section id="testimonials" class="w-full py-24 md:py-36">
    <div class="container">
      <div class="mb-16 text-center">
        <Badge variant="outline" class="mb-4">Customer Reviews</Badge>
        <h2 class="mb-4 text-4xl font-bold md:text-5xl">
          What San Carlos Loves
        </h2>
        <p class="text-lg text-muted-foreground">
          Hear from our happy customers enjoying Breezy Meals
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-3">
        <Card v-for="(review, reviewIndex) in reviewsArray" :key="reviewIndex">
          <CardContent>
            <div class="flex items-center gap-3 pt-4 justify-center">
              <div
                class="flex items-center justify-center w-10 h-10 font-bold rounded-full bg-primary/50 text-primary"
              >
                {{ review.name.charAt(0) }}
              </div>
              <div>
                <p class="font-semibold">{{ review.name }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ review.role }}
                </p>
              </div>
            </div>
            <div class="flex gap-1 mb-4 justify-center w-full">
              <Star
                class="w-5 h-5 text-yellow-400 fill-yellow-400"
                v-for="n in review.rating"
                :key="n"
              />
            </div>
            <p class="text-muted-foreground">"{{ review.review }}"</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section
</template>

<script lang="ts" setup>
import { Card, CardContent } from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { Star } from "lucide-vue-next";

const props = defineProps({
  reviewsArray: {
    type: Array as () => {
      name: string;
      role: string;
      rating: number;
      review: string;
    }[],
    default: () => [
  {
    name: "Barbara & Tom",
    role: "San Carlos Retirees",
    rating: 5,
    review: `"The pot roast tastes just like my grandmother used to make! Perfect portions and so convenient. We order the weekly package every time."`,
  },
  {
    name: "Roberto M.",
    role: "Long-time Customer",
    rating: 5,
    review: `"As a diabetic, I love that the meals are clearly labeled with nutritional info. The birria is absolutely delicious and fits my diet perfectly!"`,
  },
  {
    name: "Susan & Mike",
    role: "Winter Visitors",
    rating: 5,
    review: `"Finally! Gluten-free options that actually taste amazing. More time on the beach, less time cooking. Breezy Meals is a game-changer."`,
  },
],
  },
});
</script>

<style></style>
