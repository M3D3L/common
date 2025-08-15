<template>
  <div class="relative w-full p-6 mx-auto lg:max-w-5xl font-body bg-background text-foreground md:p-10">
    <SectionsNavigator
      :title='menuItems.expand?.business?.name || "Menu"'
      :description="isSpanish ? menuItems.descriptionEs : menuItems.descriptionEn"
      :sections="menuItems.items.map(c => ({ id: c.nameEn, title: isSpanish ? c.nameEs : c.nameEn }))"
      ref="navRef"
    >
      <section
        v-for="(category, index) in menuItems.items"
        :id="category.nameEn"
        class="pb-8 scroll-mt-40"
      >
        <h2 class="mb-6 text-3xl font-bold sm:text-4xl font-heading text-primary">
          {{ isSpanish ? category.nameEs : category.nameEn }}
        </h2>

        <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <li v-for="(item, itemIndex) in category.items" :key="itemIndex">
            <Card class="relative flex flex-col h-full p-4 sm:flex-row sm:p-5">
              <img v-if="isPremiumUser"
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
                <CardDescription class="h-full text-sm leading-relaxed">
                  {{ isSpanish ? item.descriptionEs : item.descriptionEn }}
                  <Checkout class="float-right mt-1" :phone="menuItems?.expand?.business?.contact?.phone" :item="item" :key="itemIndex" :index="itemIndex"/>
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
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import usePocketBaseCore from '@/composables/usePocketBaseCore';
import { useCheckoutStore } from "@/store/checkoutStore";

const props = defineProps({
  isPremiumUser: {
    type: Boolean,
    default: true
  }
});

// Composables
const { fetchCollection } = usePocketBaseCore()
const checkoutStore = useCheckoutStore()

// Routes
const route = useRoute()
const isSpanish = ref(false)
const menuItems = ref(null)

// fetch the menu with a title
const filter = `slug = "${route.params.slug}"`
const menu = await fetchCollection(
    'menus',
    1,
    1,
    filter,
    '-created',
    'business'
)

// The fetchCollection returns an object, so we need to access the first item in the items array.
if (menu.items && menu.items.length > 0) {
  menuItems.value = menu.items[0];
  checkoutStore.phone = menuItems.value.expand?.business?.contact?.phone;
} else {
  // Handle the case where no menu is found, maybe set a default or show an error
  menuItems.value = null;
  checkoutStore.phone = null;
}
</script>