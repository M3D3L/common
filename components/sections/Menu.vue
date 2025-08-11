<template>
  <div class="relative w-full p-6 mx-auto lg:max-w-6xl font-body bg-background text-foreground md:p-10">
    <!-- Shared Navigation -->
    <SectionsNavigator
      :title='isSpanish ? "Menú de El Tamalón" : "El Tamalón Menu"'
      :description="isSpanish ? 'Un menú delicioso de El Tamalón' : 'A delicious menu from El Tamalón'"
      :sections="menuCategories.map(c => ({ id: c.titleKey, title: isSpanish ? c.titleEs : c.titleEn }))"
      ref="navRef"
    >
      <!-- <template #button>
        <Button @click="isSpanish = !isSpanish" variant="secondary" size="lg" class="gap-2">
          <span v-if="isSpanish">🇲🇽 Cambiar a Inglés</span>
          <span v-else>🇺🇸 Switch to Spanish</span>
        </Button>
      </template> -->

      <!-- Sections (no ref needed; SectionNavigator auto-discovers them) -->
      <section
        v-for="(category, index) in menuCategories"
        :id="category.titleKey"
        class="pb-8 scroll-mt-40"
      >
        <h2 class="mb-6 text-3xl font-bold sm:text-4xl font-heading text-primary">
          {{ isSpanish ? category.titleEs : category.titleEn }}
        </h2>

        <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <li v-for="(item, itemIndex) in category.items" :key="item.nameEn">
            <Card class="flex flex-col p-4 sm:flex-row sm:p-5">
              <img
                :src="item.image"
                :alt="isSpanish ? item.nameEs : item.nameEn"
                class="object-cover w-full h-40 mb-4 rounded-lg sm:w-32 sm:h-32 sm:mr-4 sm:mb-0"
              />
              <div class="flex flex-col flex-grow">
                <div class="flex flex-col mb-2 sm:flex-row sm:items-start sm:justify-between">
                  <CardTitle class="text-lg font-bold sm:text-xl">
                    {{ isSpanish ? item.nameEs : item.nameEn }}
                  </CardTitle>
                  <span class="mt-1 text-lg font-bold text-primary sm:mt-0 sm:ml-4 sm:text-xl">
                    {{ item.price ? `$${item.price.toFixed(2)}` : "" }}
                  </span>
                </div>
                <CardDescription class="text-sm leading-relaxed">
                  {{ isSpanish ? item.descriptionEs : item.descriptionEn }}
                </CardDescription>
              </div>
            </Card>
          </li>
        </ul>
      </section>
    </SectionsNavigator>
  </div>
</template>

<script setup>
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { menuCategories } from "@/assets/configs/mock";

const isSpanish = ref(false);
const navRef = ref(null);
</script>
