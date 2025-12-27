<template>
  <ul class="grid gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3">
    <li v-for="(item, index) in userData" :key="index" class="h-full">
      <nuxt-link
        v-if="item?.type"
        :to="`/onboarding/${item.type.toLowerCase().replace(/\s+/g, '-')}`"
        class="block h-full group"
      >
        <Card
          class="relative h-full transition-all duration-300 hover:-translate-y-1"
        >
          <!-- top accent bar -->

          <CardContent class="flex flex-col h-full p-8">
            <div class="flex items-start justify-between">
              <!-- icon wrapper -->
              <div
                :class="[
                  ' group-hover:scale-110 group-hover:rotate-3 -mt-8',
                  getColorTheme(index).softBg,
                ]"
              >
                <!-- SVG COMPONENT (NOT <img>) -->
                <i-tetakawi
                  class="text-8xl h-auto transition-colors duration-300"
                  :class="getColorTheme(index).text"
                />
              </div>

              <ArrowUpRight
                class="w-5 h-5 opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>

            <div class="flex flex-col flex-1">
              <CardTitle
                class="mb-3 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary"
              >
                {{ item.type }}
              </CardTitle>

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
          </CardContent>
        </Card>
      </nuxt-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ArrowUpRight, ChevronRight } from "lucide-vue-next";
import userData from "../../data/user-data.json";
import { Card, CardContent, CardTitle } from "@common/components/ui/card";

interface ServiceItem {
  type?: string;
  description?: string;
}

interface Props {
  userData: ServiceItem[];
}

defineProps<Props>();

const getColorTheme = (index: number) => {
  const themes = [
    { text: "text-blue-600" },
    { text: "text-purple-600" },
    { text: "text-emerald-600" },
    { text: "text-orange-600" },
    { text: "text-rose-600" },
    { text: "text-indigo-600" },
  ];

  return themes[index % themes.length];
};
</script>
