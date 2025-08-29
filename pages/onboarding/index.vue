<template>
  <div :class="cardHover?.color" class="container relative content-center h-screen py-10 duration-150 ease-in-out transition-color">

    <TitleBlock class="mb-6"
      title="Tell Us About Yourself"
      description="Share your interests and preferences to help us tailor your experience."/>

    <ul class="grid grid-cols-2 gap-4 mx-auto md:gap-6 lg:grid-cols-4">
      <li
        v-for="(item, index) in types"
        :key="index"
      >
        <nuxt-link
          :to="`/onboarding/${item.type.toLowerCase().replace(/\s+/g, '-')}`"
          class="block transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-2xl"
        >
          <Card
            class="grid content-center h-full text-center transition-all cursor-pointer hover:shadow-lg"
            @mouseenter="() => { cardHover = item }"
            @mouseleave="() => { cardHover = null }"
          >
            <CardContent>
              <img
                :src="`/images/${item.image}.png`"
                :alt="item.type"
                width="100"
                height="100"
                loading="lazy"
                class="object-contain w-4/5 h-auto mx-auto mt-6 mb-2 rounded-full md:w-24 lg:w-32 md:mb-4 md:mt-12"
              />

              <CardTitle class="text-lg font-semibold md:mb-2">
                {{ item.type }}
              </CardTitle>
              <p class="hidden text-sm text-muted-foreground md:block">
                {{ item.description }}
              </p>
            </CardContent>
          </Card>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { onboardingQuestions } from "~/assets/configs/onboarding";
import TitleBlock from "~/components/TitleBlock.vue";
const cardHover = ref<string | null>(null);

const types = onboardingQuestions.map(item => ({
  image: item.image,
  type: item.type,
  description: item.description,
  color: item.color
}));
</script>

<style scoped>
.bg-blue-100,
.bg-yellow-100,
.bg-red-100,
.bg-pink-100,
.bg-green-100 {
  @apply bg-opacity-70;
}
</style>
