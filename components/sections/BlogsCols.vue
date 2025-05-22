<template>
    <containers-video id="blogs" :img-src="BlockMe5"
        video="https://videos.pexels.com/video-files/7606423/7606423-hd_1080_1920_30fps.mp4" :title="title"
        :description="description" class="min-h-[90vh] md:min-h-screen">
        <template #video-container-content>

            <div class="relative flex flex-col w-full gap-8 lg:flex-row">
                <motion.div :variants="fadeUp" class="grid w-full grid-cols-1 gap-6 mt-12 mb-8 lg:w-3/4">
                    <template v-for="(post, index) in props.content.items" :key="post.id">
                        <Card :class="index <= 2 ? 'flex' : 'hidden md:flex'"
                            class="flex flex-col h-full overflow-hidden md:flex-row-reverse group">
                            <CardContent class="flex flex-col-reverse items-start w-full h-full p-6 md:flex-row">
                                <div class="w-full mt-6 md:mt-0 md:pr-8 md:w-3/4">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="text-xs text-muted-foreground">
                                            {{ formatDate(post.created)?.[0] }}
                                        </span>
                                    </div>
                                    <h3 class="text-lg font-bold">
                                        <NuxtLink :to="`/blog${post.slug}`" class="transition-colors hover:text-primary">
                                            {{ post.title }}
                                        </NuxtLink>
                                    </h3>
                                    <p class="mt-2 text-sm text-muted-foreground line-clamp-3">
                                        {{ post.description }}
                                    </p>
                                </div>

                                <div
                                    class="relative w-full h-full p-0 overflow-hidden border-b rounded-t-lg border-muted md:rounded-lg aspect-video md:w-1/3">
                                    <NuxtLink :to="`/blog${post.slug}`" class="w-full h-full bg-blue-500">
                                        <img :src="`${config.public.pocketbaseUrl}api/files/${props.content.items?.[index].collectionId}/${props.content.items?.[index].id}/${props.content.items?.[index].cover_image}?token=`"
                                            :alt="post.title" width="600" loading="lazy"
                                            class="object-cover w-full h-full transition-transform duration-500" />
                                    </NuxtLink>
                                </div>

                            </CardContent>
                        </Card>
                    </template>
                    <!-- View All Card-->
                    <!-- <Card class="relative h-full overflow-hidden group">
                        <CardHeader class="p-0 border-b border-muted">
                            <NuxtLink to="/blog">
                                <div class="absolute w-full h-full overflow-hidden aspect-video">
                                    <img :src="placeholderImage" alt="View All Blogs" width="600" height="338"
                                        loading="lazy"
                                        class="object-cover w-full h-full transition-transform duration-500" />
                                    <div class="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <h2 class="text-xl font-semibold text-white md:text-2xl">Explore All Blogs</h2>
                                    </div>
                                </div>
                            </NuxtLink>
                        </CardHeader>

                        <CardContent class="flex flex-col justify-end h-full p-6">
                            <NuxtLink to="/blog"
                                class="inline-flex items-center self-start px-4 py-2 mt-4 text-sm font-medium text-white transition md:rounded-lg bg-primary hover:bg-primary-600">
                                View All Posts
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </NuxtLink>
                        </CardContent>
                    </Card> -->
                </motion.div>

                <div class="w-full mt-12 overflow-hidden lg:w-1/3">
                    <SectionsSubscribe />
                </div>
            </div>
        </template>
    </containers-video>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/composables/blogHelpers'
import BlockMe5 from '/images/block-me-5.png'

const config = useRuntimeConfig()

const placeholderImage = 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1280'


const props = defineProps({
    title: {
        type: String,
        default: 'Blog Articles & Tutorials'
    },
    description: {
        type: String,
        default: 'Explore my latest articles and insights on web development, design, and technology. Learn from practical tutorials and stay updated with industry trends.'
    },
    content: {
        type: Object as () => ({}),
        default: () => []
    }
})

// Utility to slugify title
const slugify = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD') // handle special characters like é, ñ, ü
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .replace(/[^\w\s-]/g, '') // remove non-word characters
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/--+/g, '-') // remove multiple dashes
        .replace(/^-+|-+$/g, ''); // trim dashes from start/end
}

// Calculate reading time
const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const wordCount = text?.split(/\s+/)?.length || 0
    return Math.ceil(wordCount / wordsPerMinute) || 1
}

// Generate post link dynamically from created date + title slug
const getPostLink = (post: any) => {
    if (!post) return '/blog';
    const datePath = formatDate(post.created)?.[1];
    const slug = slugify(post.title || 'untitled-post');
    return `/blog/${datePath}/${slug}`;
}

// Method to generate blog URL (same idea)
const getBlogUrl = (created: string, title: string) => {
    const datePath = formatDate(created)?.[1];
    const slug = slugify(title || 'untitled-post');
    return `/blog/${datePath}/${slug}`;
}

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
        }
    }
}

</script>
