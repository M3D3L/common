<template>
  <div
    class="max-w-5xl min-h-screen p-6 mx-auto font-body bg-background text-foreground md:p-10"
  >
    <header
      class="flex flex-col items-center justify-between gap-6 mb-12 sm:flex-row"
      v-motion-slide-visible-once-bottom
    >
      <h1
        class="text-6xl leading-none text-center sm:text-7xl font-heading text-primary drop-shadow-md sm:text-left"
      >
        {{ isSpanish ? "Menú de El Tamalón" : "El Tamalón Menu" }}
      </h1>
      <Button
        @click="isSpanish = !isSpanish"
        class="px-6 py-3 text-lg font-semibold transition-all duration-300 ease-in-out transform rounded-full bg-secondary text-secondary-foreground shadow-custom-medium hover:bg-secondary/80 hover:-translate-y-1"
      >
        {{ isSpanish ? "Switch to English" : "Cambiar a Español" }}
      </Button>
    </header>

    <div class="space-y-6">
      <Accordion type="single" class="w-full" collapsible>
        <AccordionItem
          v-for="(category, index) in menuCategories"
          :key="category.titleKey"
          :value="category.titleKey"
        >
          <AccordionTrigger
            class="group"
            v-motion-slide-visible-once-bottom
            :delay="100 * index"
          >
            <div
              class="flex items-center justify-between w-full p-4 transition-colors duration-200 rounded-lg group-hover:bg-muted/50"
            >
              <h2 class="text-accent">
                {{ isSpanish ? category.titleEs : category.titleEn }}
              </h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul
              class="grid grid-cols-1 gap-4 p-4 mt-2 sm:grid-cols-2 lg:grid-cols-2"
            >
              <li
                v-for="(item, itemIndex) in category.items"
                :key="item.nameEn"
                class="flex items-start p-4 transition-all duration-300 transform rounded-lg shadow-sm bg-card hover:shadow-lg hover:scale-[1.02]"
                v-motion-slide-visible-once-bottom
                :delay="100 * (index + 1) + 50 * itemIndex"
              >
                <img
                  :src="item.image"
                  :alt="isSpanish ? item.nameEs : item.nameEn"
                  class="object-cover w-32 h-32 mr-4 rounded-md"
                />
                <div class="flex-grow">
                  <div class="flex items-start justify-between w-full mb-1">
                    <span
                      class="text-lg font-bold text-card-foreground sm:text-xl"
                    >
                      {{ isSpanish ? item.nameEs : item.nameEn }}
                    </span>
                    <span
                      class="ml-4 text-lg font-bold text-primary sm:text-xl"
                      >{{ item.price ? `$${item.price.toFixed(2)}` : '' }}</span
                    >
                  </div>
                  <p class="text-sm text-muted-foreground">
                    {{ isSpanish ? item.descriptionEs : item.descriptionEn }}
                  </p>
                </div>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    <footer class="mt-20 text-lg text-center text-muted-foreground">
      <p>&copy; 2025 El Tamalón. Sabor Auténtico.</p>
    </footer>
  </div>
</template>

<script setup>
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ref } from "vue";

const isSpanish = ref(false);

const menuCategories = ref([
  {
    titleKey: "classicTamales",
    titleEn: "Classic Tamales",
    titleEs: "Tamales Clásicos",
    items: [
      {
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        nameEn: "Pork Crackling in Green Sauce",
        nameEs: "Chicharrón en Salsa Verde",
        descriptionEn:
          "A savory tamal filled with crispy pork crackling simmered in a zesty green tomatillo sauce.",
        descriptionEs:
          "Un tamal salado relleno de chicharrón crujiente cocido a fuego lento en una salsa verde de tomatillo.",
        price: 3.5,
      },
      {
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        nameEn: "Chicken with Mole",
        nameEs: "Pollo con Mole",
        descriptionEn:
          "Tender chicken pieces coated in a rich, complex mole sauce, wrapped in masa.",
        descriptionEs:
          "Tiernos trozos de pollo cubiertos con una rica y compleja salsa de mole, envueltos en masa.",
        price: 3.75,
      },
      {
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        nameEn: "Red Beef Tamal",
        nameEs: "Carne Roja de Res",
        descriptionEn:
          "Shredded beef slow-cooked in a spicy red chili sauce, a classic favorite.",
        descriptionEs:
          "Carne de res deshebrada cocida a fuego lento en una picante salsa de chile rojo, un clásico favorito.",
        price: 3.75,
      },
      {
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        nameEn: "Peppers & Cheese (Veg)",
        nameEs: "Rajas con Queso",
        descriptionEn:
          "Roasted poblano peppers and melted cheese stuffed inside a delicious, savory tamal.",
        descriptionEs:
          "Pimientos poblanos asados y queso derretido rellenos dentro de un delicioso tamal salado.",
        price: 3.25,
      },
      {
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        nameEn: "Sweet Corn (optional cream)",
        nameEs: "Elote Dulce (con crema opcional)",
        descriptionEn:
          "A sweet and delicate tamal made from fresh corn masa, perfect as a dessert or side.",
        descriptionEs:
          "Un tamal dulce y delicado hecho de masa de maíz fresco, perfecto como postre o acompañamiento.",
        price: 3.0,
      },
      {
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        nameEn: "Zucchini & Epazote (Vegan)",
        nameEs: "Vegano de Calabacitas",
        descriptionEn:
          "A delicious vegan tamal with fresh zucchini and aromatic epazote herb.",
        descriptionEs:
          "Un delicioso tamal vegano con calabacitas frescas y la aromática hierba epazote.",
        price: 3.5,
      },
    ],
  },
  {
    titleKey: "combos",
    titleEn: "Combos",
    titleEs: "Combos",
    items: [
      {
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        nameEn: "Combo #1",
        nameEs: "Combo #1",
        descriptionEn:
          "Choose any 2 tamales, served with a side of beans and an agua fresca.",
        descriptionEs:
          "Elige 2 tamales, servidos con una porción de frijoles y una agua fresca.",
        price: 10.99,
      },
      {
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        nameEn: "Combo #2",
        nameEs: "Combo #2",
        descriptionEn:
          "Choose any 3 tamales, served with sides of rice and beans, plus an agua fresca.",
        descriptionEs:
          "Elige 3 tamales, servidos con porciones de arroz y frijoles, más una agua fresca.",
        price: 14.5,
      },
      {
        image:
          "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
        nameEn: "Breakfast Combo",
        nameEs: "Combo Desayuno",
        descriptionEn:
          "1 tamal of your choice, a cup of traditional Mexican coffee, and a sweet bread.",
        descriptionEs:
          "1 tamal a tu elección, una taza de café de olla tradicional y un pan dulce.",
        price: 8.99,
      },
    ],
  },
]);
</script>
