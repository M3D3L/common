<template>
    <div>
        <!-- <SectionsNewsletterHero /> -->
        <SectionsPost />
    </div>
</template>

<script setup>
import { InfoCircledIcon } from '@radix-icons/vue';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Button } from '@/components/ui/button';

</script>

<style lang="postcss" scoped>
.active {
    @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>