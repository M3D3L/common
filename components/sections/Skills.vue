<template>
  <div id="skills" class="container flex flex-col w-full gap-8 mx-auto md:flex-row">
    <motion.div
      class="w-full"
      :variants="{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2,
          },
        },
      }"
    >
      <Card styles="card-styles" class="h-full px-0 py-8 mx-auto lg:py-16">
        <CardContent>
          <div class="grid w-full gap-4 mt-8 space-y-2 md:grid-cols-2 md:mt-0">
            <motion.div
              v-for="(skill, index) in skills"
              :key="'visual-' + index"
              class="flex flex-row items-center gap-4 transition-all rounded-lg md:p-4 group"
              :initial="{ opacity: 0, x: 0 }"
              :whileInView="{ opacity: 1, x: 0 }"
              :transition="{
                duration: 0.3,
                delay: 0.05 * index,
                ease: 'easeOut',
              }"
            >
              <div>
                <img
                  :src="skill.icon"
                  lazy
                  :alt="skill.title"
                  class="w-8 h-8"
                />
              </div>
              <div class="w-full">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-muted-foreground">{{
                    skill.title
                  }}</span>
                  <span class="text-sm text-primary/80">{{
                    skill.proficiency || "Advanced"
                  }}</span>
                </div>
                <motion.div
                  class="h-2 overflow-hidden rounded-full bg-muted"
                  :initial="{ width: 0 }"
                  :whileInView="{ width: '100%' }"
                  :viewport="{ once: true }"
                  :transition="{
                    duration: 0.25,
                    delay: 0.1 + index * 0.05,
                    ease: 'easeInOut',
                  }"
                >
                  <motion.div
                    class="h-full bg-gradient-to-r from-[var(--accent)] to-primary/60"
                    :initial="{ width: 0 }"
                    :whileInView="{
                      width: getProficiencyWidth(skill.proficiency),
                    }"
                    :viewport="{ once: true }"
                    :transition="{
                      duration: 0.25,
                      delay: 0.15 + index * 0.05,
                      ease: 'easeInOut',
                    }"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { Card, CardContent } from "@/components/ui/card";

// Props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  skills: {
    type: Array,
    required: true,
  }
});

// Convert proficiency text to percentage width
const getProficiencyWidth = (proficiency: string) => {
  switch (proficiency?.toLowerCase()) {
    case "beginner":
      return "30%";
    case "intermediate":
      return "60%";
    case "advanced":
      return "85%";
    case "expert":
      return "95%";
    default:
      return "75%";
  }
};
</script>
