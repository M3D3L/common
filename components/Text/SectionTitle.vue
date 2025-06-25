<template>
  <div class="z-20 flex flex-col w-full">
    <div class="flex items-center w-full gap-8 mb-8">
      <h1 v-if="h1" class="text-4xl font-black leading-tight tracking-tighter md:text-6xl lg:text-7xl">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/60">{{
          title }}</span>
      </h1>

      <template v-else>
        <h2 v-if="title" class="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-5xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
            {{ title }}
          </span>
        </h2>
      </template>

      <img v-if="imgSrc" :src="imgSrc" lazy :alt="`${title} image`" class="w-[84px] border-white -border-4 md:w-28" />
    </div>


    <p v-if="description" class="max-w-3xl text-lg text-foreground/70">
      {{ description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  imgSrc: {
    type: String,
    default: ''
  },
  h1: {
    type: Boolean,
    default: false
  }
})
</script>
