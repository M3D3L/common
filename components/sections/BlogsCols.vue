<template>

    <div id="blogs" class="relative z-10 flex flex-col px-8 pb-16 xl:px-56 lg:pb-24">

        <motion.div class="w-full pt-16 mb-8 md:mb-12 lg:pt-24" :variants="{
            hidden: { opacity: 0, y: 20 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1
                }
            }
        }">
            <TextSectionTitle :title :description :imgSrc="BlockMe5" :h1="false" />
        </motion.div>

        <div
            class="relative flex flex-col w-full min-h-screen gap-8 pb-16 lg:pb-24 lg:flex-row">


            <motion.div :variants="fadeUp" class="flex flex-col gap*:-8 w-full lg:w-2/3 lg:flex-row">
                <div class="grid w-full grid-cols-1 gap-4 lg:grid-cols-1 md:grid-cols-2 lg:w-full">
                    <template v-for="(post, index) in props.content.items" :key="post.id">
                        <Card :class="index <= 2 ? 'flex' : 'hidden md:flex'"
                            class="flex flex-col h-full overflow-hidden md:flex-row-reverse group">
                            <CardContent class="flex flex-col-reverse items-start w-full h-full p-6 lg:flex-row">
                                <div class="w-full mt-6 lg:mt-0 md:pr-8 md:w-3/4">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="text-xs text-muted-foreground">
                                            {{ formatDate(post.created)?.[0] }}
                                        </span>
                                    </div>
                                    <h3 class="text-lg font-bold">
                                        <NuxtLink :to="`${baseUrl}/blog${post.slug}`"
                                            class="transition-colors hover:text-primary">
                                            {{ post.title }}
                                        </NuxtLink>
                                    </h3>
                                    <p class="mt-2 text-sm text-muted-foreground line-clamp-3">
                                        {{ post.description }}
                                    </p>
                                </div>

                                <div
                                    class="relative w-full h-full p-0 overflow-hidden border-b rounded-t-lg border-muted md:rounded-lg aspect-video lg:w-1/3">
                                    <NuxtLink :to="`/blog${post.slug}`" class="w-full h-full">
                                        <img :src="`${config.public.pocketbaseUrl}api/files/${props.content.items?.[index].collectionId}/${props.content.items?.[index].id}/${props.content.items?.[index].cover_image}?token=`"
                                            :alt="post.title" width="600" loading="lazy"
                                            class="object-cover w-full h-full transition-transform duration-500" />
                                    </NuxtLink>
                                </div>

                            </CardContent>
                        </Card>

                    </template>
                </div>


            </motion.div>

            <div class="w-full lg:w-1/3">
                <SectionsSubscribe class="z-10 sticky-position top-24" />
            </div>
        </div>

        <div class="container flex justify-start w-full mr-auto -mt-12 lg:-mt-20">
            <nuxt-link v-if="showMore" to="/blog/"
                class="z-50 flex flex-row justify-end w-full cursor-pointer lg:pr-16 lg:w-2/3">
                <div class="mt-4 ml-auto">
                    <nuxt-link to="/blog">
                        View All Posts
                    </nuxt-link>
                </div>
            </nuxt-link>

            <Pagination v-if="showPagination" :total-pages="Math.ceil(content?.totalPages > 1)" />
        </div>
    </div>

</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/composables/blogHelpers'
import BlockMe5 from '/images/block-me-5.webp'

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
    },
    showMore: {
        type: Boolean,
        default: true
    },
    showPagination: {
        type: Boolean,
        default: true
    },
    baseUrl: {
        type: String,
        default: ''
    }
})

// Calculate reading time
const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const wordCount = text?.split(/\s+/)?.length || 0
    return Math.ceil(wordCount / wordsPerMinute) || 1
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

<style scoped>
.sticky-position {
    position: sticky !important;
    z-index: 32;
}
</style>
