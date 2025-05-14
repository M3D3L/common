<template>
    <containers-video video="https://videos.pexels.com/video-files/4665104/4665104-uhd_2560_1440_30fps.mp4" :hideDescription="true" :h1="true" class="min-h-[90vh] md:min-h-screen" :title>
        <template #video-container-content>
            <main class="relative z-10 flex items-center w-full h-full">

                <div class="flex flex-col-reverse items-center w-full gap-8 md:flex-row">
                    <!-- Left Column - Content -->
                    <motion.div class="w-full" :variants="{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.3
                            }
                        }
                    }">
                        <Card
                            class="pt-4 transition-all duration-300 lg:pt-8 lg:pb-4 hover:border-primary/30 hover:shadow-lg"
                            role="article">
                            <CardContent class="grid gap-4">
                                <motion.p
                                    class="text-base leading-relaxed text-muted-foreground lg:text-xl md:leading-relaxed"
                                    :variants="{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.8,
                                                ease: [0.16, 1, 0.3, 1],
                                                delay: 0.4
                                            }
                                        }
                                    }">
                                    {{ description }}
                                </motion.p>

                                <motion.div class="flex flex-row gap-3" :variants="{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.8,
                                            ease: [0.16, 1, 0.3, 1],
                                            delay: 0.5
                                        }
                                    }
                                }">
                                    <Button v-for="(button, buttonIndex) in buttons" :key="buttonIndex"
                                        @click="toggleNav(button.link)" variant="default"
                                        :aria-label="button.title + ' button'">
                                        <span class="relative z-10">
                                            {{ button.title }}
                                        </span>
                                        <!-- <span
                                            class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary to-primary/50 group-hover:opacity-100"
                                            aria-hidden="true" /> -->
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <!-- Right Column - Cards -->
                    <motion.div class="w-full" :variants="{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.6
                            }
                        }
                    }">

                        <motion.img 
                            :src="BlockMe" 
                            alt="BlockMe" 
                            class="w-full max-w-sm mx-auto lg:max-w-md 3xl:max-w-xl" 
                            loading="lazy"
                            :initial="{ y: 0 }"
                            :animate="{ 
                                y: [-5, 5, -5],
                                transition: { 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    ease: 'easeInOut' 
                                } 
                            }"
                        />
                    </motion.div>
                </div>
            </main>
        </template>
    </containers-video>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Button } from '@/components/ui/button'

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import BlockMe from '/images/block-me.png'

// Props
const props = defineProps({
    video: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: 'Guillermo Medel | Full Stack Developer | Digital Experiences'
    },
    description: {
        type: String,
        default: "Hey, I'm a full-stack developer who builds complete web experiences—from slick frontends to solid backends. Based in San Carlos, Sonora, I’ve worked on big platforms like Law.com and also help local businesses stand out with drone photography and custom digital solutions."
    },
    buttons: {
        type: Array,
        default: () => [
            { title: 'Get Started', link: '/docs' },
            { title: 'Components', link: '/components' }
        ]
    },
    cards: {
        type: Array,
        default: () => [
            {
                title: 'Components',
                description: 'Beautifully designed components built with Radix Vue and Tailwind CSS.',
                footer: true,
                button: 'Explore'
            },
            {
                title: 'Customizable',
                description: 'Easily customize colors, spacing, shadows, and more with Tailwind.',
                footer: true,
                button: 'Learn'
            },
            {
                title: 'Accessible',
                description: 'All components are built with accessibility in mind.',
                footer: false
            },
            {
                title: 'Dark Mode',
                description: 'Automatic dark mode support with a beautiful design system.',
                footer: false
            }
        ]
    },
})

// Methods
const toggleNav = (link) => {
    const router = useRouter()
    router.push(link)
}

// SEO Meta
useSeoMeta({
    title: () => props.title,
    description: () => props.description,
    ogTitle: () => props.title,
    ogDescription: () => props.description,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: () => props.title,
    twitterDescription: () => props.description
})
</script>