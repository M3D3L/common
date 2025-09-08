<template>
    <div class="flex flex-col w-full min-h-screen gap-8 pb-16 lg:pb-24 lg:flex-row" id="main-content">
        <!-- Main content section -->
        <motion.section :variants="fadeUp" aria-labelledby="main-content-heading"
            class="w-full gap-4 lg:w-2/3">
            <h2 id="main-content-heading" class="sr-only">Main content</h2>
            <slot name="main"></slot>
        </motion.section>

        <!-- Complementary sidebar -->
        <aside id="right-rail" aria-labelledby="sidebar-heading" class="w-full lg:w-1/3">
            <div class="lg:z-10 lg:sticky top-24">
                <h2 id="sidebar-heading" class="sr-only">Additional content</h2>
                <slot name="right"></slot>
            </div>
        </aside>
    </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};
</script>
