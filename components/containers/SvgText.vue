<template>
  <Card
    class="relative group overflow-hidden w-[250px] h-[370px] bg-white shadow-xl rounded-2xl"
  >
    <!-- Link on top -->
    <NuxtLink :to="link" class="absolute inset-0 z-10" />

    <!-- Image with hover zoom -->
    <div
      class="absolute inset-0 transition-transform duration-300 ease-in-out bg-center bg-cover group-hover:scale-125"
      :style="{ backgroundImage: `url(${image})` }"
    />

    <!-- Caption -->
    <div class="absolute z-20 text-black top-4 left-4">
      <h3 class="text-xl tracking-widest font-montserrat">{{ title }}</h3>
    </div>

    <!-- Card body -->
    <CardContent class="absolute bottom-0 z-20 w-full p-4 bg-white">
      <p class="text-sm text-neutral-800">
        {{ description }}
      </p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";

defineProps<{
  title: string;
  description: string;
  image: string;
  link: string;
}>();
</script>
