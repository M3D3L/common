<template>
  <containers-video
    :video
    :hideDescription="true"
    class="min-h-[85vh] hero-section py-16"
  >
    <template #video-container-content>
      <SectionTitle :title :h1="true" />
      <main class="relative z-10 flex items-center w-full h-full md:mt-8 lg:-mt-16">  
        <div
          class="flex flex-col-reverse items-center w-full gap-12 md:gap-4 md:flex-row md:justify-between"
        >
          <!-- Left Column -->

          <motion.div
            class="w-full max-w-xl space-y-6"
            :variants="{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              },
            }"
          >
            <Card class="pt-6 mt-4" role="article">
              <CardContent class="grid gap-6">
                <h2
                  class="text-2xl font-bold tracking-tight text-primary-800 md:text-3xl"
                >
                  {{ subTitle }}
                </h2>

                <motion.p
                  class="text-base leading-relaxed text-muted-foreground lg:text-xl md:leading-relaxed"
                  :variants="{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }"
                  v-html="description"
                >
                </motion.p>

                <motion.div
                  class="flex flex-row gap-3"
                  :variants="{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }"
                >
                  <Button
                    v-for="(button, index) in buttons"
                    :key="index"
                    @click="toggleNav(button.link)"
                    variant="default"
                    class="w-1/2 text-center md:w-1/3"
                    :aria-label="button.title + ' button'"
                  >
                    <span class="relative z-10">{{ button.title }}</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <!-- Right Column -->
          <motion.div
            class="flex justify-center w-full md:justify-end"
            :variants="{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.3,
                },
              },
            }"
          >
            <motion.img
              :src="image"
              :alt="imageAlt"
              class="w-full max-w-xs lg:relative lg:top-24 xl:top-32 mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg 3xl:max-w-xl"
              :initial="{ y: 0 }"
              :animate="{
                y: [-5, 5, -5],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }"
            />
          </motion.div>
        </div>
      </main>
    </template>
  </containers-video>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { Button } from "@/components/ui/button";
import SectionTitle from "../text/SectionTitle.vue";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Props
const props = defineProps({
  video: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  subTitle: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default:
      "Hey, I'm a full-stack developer who builds complete web experiences—from slick frontends to solid backends. Based in San Carlos, Sonora, I’ve worked on big platforms like Law.com and also help local businesses stand out with drone photography and custom digital solutions.",
  },
  buttons: {
    type: Array,
    default: () => [
      { title: "See My Work", link: "/#projects" },
      { title: "Contact Me", link: "/#contact" },
    ],
  },
  image: {
    type: String,
  },
  imageAlt: {
    type: String,
    default: "Hero Image",
  },
});

// Methods
const toggleNav = (link) => {
  const router = useRouter();
  router.push(link);
};

// SEO Meta
useSeoMeta({
  title: () => props.title,
  description: () => props.description,
  ogTitle: () => props.title,
  ogDescription: () => props.description,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: () => props.title,
  twitterDescription: () => props.description,
});
</script>
