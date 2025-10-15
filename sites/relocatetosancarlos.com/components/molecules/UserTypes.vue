<template>
  <ul class="grid gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
    <li v-for="(item, index) in userData" :key="index">
      <nuxt-link
        v-if="item?.type"
        :to="`/onboarding/${item?.type?.toLowerCase().replace(/\s+/g, '-')}`"
        class="block group"
      >
        <Card class="relative h-full overflow-hidden transition-all duration-500 border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2">
          <!-- Gradient Background Overlay -->
          <div 
            :class="[
              'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500',
              getGradient(index)
            ]"
          />
          
          <CardContent class="relative flex flex-col items-center h-full p-8 text-center">
            <!-- Icon/Image Container -->
            <div class="relative mb-6">
              <!-- Decorative Ring -->
              <div 
                :class="[
                  'absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 scale-110',
                  getGradient(index)
                ]"
              />
              
              <!-- Image -->
              <div class="relative w-24 h-24 overflow-hidden transition-all duration-500 rounded-full shadow-xl ring-4 ring-white/50 group-hover:ring-8 group-hover:scale-110">
                <img
                  :src="item?.image"
                  :alt="item.type"
                  loading="lazy"
                  class="object-cover w-full h-full"
                />
              </div>
            </div>

            <!-- Content -->
            <div class="flex flex-col justify-center flex-1">
              <CardTitle class="mb-3 text-2xl font-bold transition-colors duration-300 group-hover:text-primary">
                {{ item.type }}
              </CardTitle>
              <p class="mb-6 text-sm leading-relaxed text-muted-foreground">
                {{ item.description }}
              </p>
              
              <!-- CTA Arrow -->
              <div class="flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 transform translate-y-2 opacity-0 text-primary group-hover:opacity-100 group-hover:translate-y-0">
                <span>Learn More</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </nuxt-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import userData from "../../data/user-data.json";
import { Card, CardContent, CardTitle } from '@common/components/ui/card';

interface ServiceItem {
  type?: string;
  description?: string;
  image?: string;
}

interface Props {
  userData: ServiceItem[];
}

defineProps<Props>();

// Gradient variations for different cards
const getGradient = (index: number) => {
  const gradients = [
    'bg-gradient-to-br from-blue-500 to-cyan-400',
    'bg-gradient-to-br from-purple-500 to-pink-400',
    'bg-gradient-to-br from-orange-500 to-red-400',
    'bg-gradient-to-br from-green-500 to-emerald-400',
    'bg-gradient-to-br from-indigo-500 to-blue-400',
    'bg-gradient-to-br from-rose-500 to-pink-400',
  ];
  return gradients[index % gradients.length];
};
</script>