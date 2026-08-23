<template>
  <div class="mx-auto max-w-2xl px-4 pb-44 pt-8 sm:px-6">
    <div class="mt-12 space-y-3">
      <Skeleton class="h-3 w-24" />
      <Skeleton v-for="i in 4" :key="i" class="h-20 w-full rounded-xl" />
    </div>
    <div class="mt-8 space-y-3">
      <Skeleton class="h-3 w-24" />
      <Skeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-xl" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Skeleton } from "@common/components/ui/skeleton";
</script>
