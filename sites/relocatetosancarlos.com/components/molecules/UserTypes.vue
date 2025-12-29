<template>
  <ul class="grid gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3">
    <li
      v-for="(item, index) in userData"
      :key="item.type || index"
      class="h-full"
    >
      <NuxtLink
        v-if="item?.type"
        :to="`/onboarding/${item.type.toLowerCase().replace(/\s+/g, '-')}`"
        class="block h-full group"
      >
        <Card
          class="relative h-full transition-all duration-300 hover:-translate-y-1"
        >
          <CardContent
            class="flex flex-col items-center justify-center h-full p-8 relative"
          >
            <i-tetakawi
              class="text-[20rem] h-auto absolute opacity-10 group-hover:opacity-20 transition-all duration-300"
              :class="getThemeClass(index)"
            />
            <div class="p-6 rounded-lg relative z-10 flex flex-col h-full">
              <div class="flex flex-col flex-1">
                <div class="flex flex-row gap-6 w-full justify-between">
                  <CardTitle
                    class="mb-3 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary"
                  >
                    {{ item.type }}
                  </CardTitle>

                  <ArrowUpRight
                    class="w-5 h-5 opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>

                <p class="text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {{ item.description }}
                </p>
              </div>

              <div class="pt-6 mt-auto">
                <div
                  class="flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-colors text-slate-400 group-hover:text-primary"
                >
                  Get Started
                  <ChevronRight
                    class="w-4 h-4 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ArrowUpRight, ChevronRight } from "lucide-vue-next";
import { Card, CardContent, CardTitle } from "@common/components/ui/card";
import userData from "../../data/user-data.json";

interface ServiceItem {
  type?: string;
  description?: string;
}

interface Props {
  userData: ServiceItem[];
}

// 2. Pure function to determine theme based on index.
// This is deterministic, so it won't cause hydration errors.
const getThemeClass = (index: number) => {
  const themes = [
    "text-blue-600",
    "text-purple-600",
    "text-emerald-600",
    "text-orange-600",
    "text-rose-600",
    "text-indigo-600",
  ];

  return themes[index % themes.length];
};
</script>

<style scoped>
/* Ensure the SVG scales smoothly without layout shifts */
.logo-icon {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
