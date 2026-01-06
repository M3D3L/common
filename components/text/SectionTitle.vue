<template>
  <div class="z-20 flex flex-col w-full">
    <div class="flex items-center w-full gap-8 mb-4">
      <h1
        v-if="h1"
        class="text-4xl transition-default font-black leading-tight tracking-tighter text-primary md:text-6xl"
      >
        {{ title }}
      </h1>

      <template v-else>
        <h2
          v-if="title"
          class="max-w-4xl transition-default text-4xl font-bold leading-tight tracking-tighter text-foreground md:text-5xl lg:text-4xl"
        >
          {{ title }}
        </h2>
      </template>

      <img
        v-if="imgSrc"
        :src="imgSrc"
        lazy
        :alt="`${title} image`"
        class="w-[84px] border-white -border-4 md:w-28"
      />
    </div>

    <p
      v-if="description"
      v-html="description"
      class="max-w-3xl text-lg text-foreground/70"
    ></p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  imgSrc: {
    type: String,
    default: "",
  },
  h1: {
    type: Boolean,
    default: false,
  },
});
</script>
