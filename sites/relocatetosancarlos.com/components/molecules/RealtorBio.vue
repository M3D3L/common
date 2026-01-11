<template>
  <div class="min-h-[300px] w-full">
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :whileInView="{ opacity: 1, y: 0 }"
      :viewport="{ once: true, margin: '-50px' }"
      :transition="{ duration: 0.7 }"
    >
      <Card
        class="flex flex-col transition-all group bg-primary gap-6 md:flex-row md:gap-8 overflow-visible border-none shadow-sm"
      >
        <div class="w-full md:w-1/3">
          <div class="overflow-hidden h-full">
            <motion.img whileHover={{ scale: 1.05 }}
            :transition="{ duration: 0.4 }" :src="heroSection.imageSrc"
            :alt="heroSection.imageAlt" class="object-cover w-full h-full
            min-h-[300px] md:min-h-[400px]" />
          </div>
        </div>

        <div class="w-full md:w-2/3 px-6 pb-6 md:pb-0 md:h-[75vh] mt-auto">
          <div class="md:sticky md:top-20 py-10">
            <h3
              class="text-2xl lg:text-4xl font-bold mb-4 transition-colors duration-300 group-hover:text-primary"
            >
              {{ heroSection.titleHighlight }}
            </h3>

            <p class="text-lg leading-relaxed text-slate-700 max-w-2xl">
              {{ sellData.realtor.bio }}
            </p>

            <ContainersSocials
              :socialLinks
              :columnOnMobile="false"
              class="mt-8"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  </div>
</template>

<script setup>
import { motion } from "motion-v";
import { Card } from "@common/components/ui/card";
import ContainersSocials from "@common/components/containers/Socials.vue";

const props = defineProps({
  heroSection: { type: Object, required: true },
  sellData: { type: Object, required: true },
  socialLinks: { type: Array, required: true },
});
</script>
