<template>
  <div class="container relative content-center h-screen py-10">

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
          >
            <CardContent>
              <img
                :src="`/images/${item.image}.png`"
                :alt="item.type"
                width="100"
                height="100"
                loading="lazy"
                class="object-contain w-full h-auto mx-auto mt-6 mb-2 rounded-full md:mb-4 md:mt-12 md:w-24"
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
import TitleBlock from "~/components/TitleBlock.vue";

const types = [
  {
    image: "retirees",
    type: "Retirees",
    description: "A user who migrates from one region to another based on the seasons."
  },
  {
    image: "snow-birds",
    type: "SnowBirds",
    description: "A user who migrates from one region to another based on the seasons."
  },
  {
    image: "digital-nomad",
    type: "Digital Nomads",
    description: "A user who works remotely while traveling to different locations."
  },
  {
    image: "family",
    type: "Family Adventurers",
    description: "A user who frequently travels with family and seeks out family activities."
  }
]

const video = "https://www.pexels.com/download/video/10994870/"
</script>
