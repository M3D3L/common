<template>
  <Card class="flex flex-col gap-6 md:flex-row md:gap-8 overflow-hidden">
    <div class="w-3/5 mx-auto md:w-1/3">
      <img
        :src="heroSection.imageSrc"
        :alt="heroSection.imageAlt"
        class="object-cover w-full h-full"
      />
    </div>
    <div class="grid w-full items-center md:w-2/3 lg:p-0 px-6 pb-6">
      <div class="p-6">
        <h3 class="text-2xl lg:text-3xl mb-1 font-bold text-primary">
          {{ heroSection.titleHighlight }}
        </h3>
        <p class="mt-3 leading-relaxed">
          {{ sellData.realtor.bio }}
        </p>
        <ContainersSocials :socialLinks :columnOnMobile="false" class="mt-6" />
      </div>
    </div>
  </Card>
</template>

<script setup>
import { Card } from "@common/components/ui/card";
import ContainersSocials from "@common/components/containers/Socials.vue";
const props = defineProps({
  heroSection: {
    type: Object,
    required: true,
  },
  sellData: {
    type: Object,
    required: true,
  },
  socialLinks: {
    type: Array,
    required: true,
  },
});
</script>
