<template>
  <ul class="grid gap-4 mx-auto md:grid-cols-2 md:gap-6 lg:grid-cols-4">
    <li v-for="(item, index) in userData" :key="index">
      <nuxt-link
        v-if="item?.type"
        :to="`/onboarding/${item?.type?.toLowerCase().replace(/\s+/g, '-')}`"
        class="block"
      >
        <Card
          class="grid content-center h-full text-center"
          @mouseenter="
            () => {
              cardHover = item;
            }
          "
          @mouseleave="
            () => {
              cardHover = null;
            }
          "
        >
          <CardContent>
            <div class="object-contain w-2/5 h-auto mx-auto mt-6 mb-2 rounded-full md:mb-4 md:mt-12">
              <img
                :src="`/images/${item?.image}.png`"
                :alt="item.type"
                loading="lazy"
                class="object-cover w-full h-full rounded-full"
              />
            </div>

            <CardTitle class="text-lg font-semibold md:mb-2">
              {{ item.type }}
            </CardTitle>
            <p class="h-full text-sm text-muted-foreground">
              {{ item.description }}
            </p>
          </CardContent>
        </Card>
      </nuxt-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import userData from "../../data/user-data.json";
import { Card, CardContent, CardTitle } from "@common/components/ui/card";

const cardHover = ref<string | null>(null);
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
