<template>
   <article class="min-h-[90vh] md:min-h-screen relative z-10 flex items-center w-full h-full pb-24">
      <motion.div class="w-full max-w-4xl mx-auto" initial="hidden" whileInView="visible"
         viewport="{ once: true, amount: 0.2 }" :variants="{
            hidden: { opacity: 0 },
            visible: {
               opacity: 1,
               transition: { staggerChildren: 0.15 }
            }
         }">
         <!-- Breadcrumbs -->
         <nav class="mb-6 text-sm text-muted-foreground" v-if="post">
            <ul class="flex flex-wrap gap-2 list-none">
               <li>
                  <NuxtLink to="/" class="transition-colors hover:text-primary">Home</NuxtLink>
               </li>
               <li>/</li>
               <li>
                  <NuxtLink to="/blog" class="transition-colors hover:text-primary">Blog</NuxtLink>
               </li>
               <li>/</li>
               <li class="font-medium text-foreground">
                  {{ post.title }}
               </li>
            </ul>
         </nav>
         <TooltipProvider>
            <Card class="overflow-hidden" v-if="post">
               <CardContent class="pt-6 lg:pt-4">
                  <!-- Article Metadata -->
                  <div class="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                     <div class="flex items-center gap-3">
                        <ClientOnly>
                           <time :datetime="post.created" class="text-sm text-muted-foreground">
                              {{ formatDate(post.created)?.[0] }}
                           </time>
                        </ClientOnly>
                        <span class="text-sm text-muted-foreground">•</span>
                        <span class="text-sm text-muted-foreground">
                           {{ calculateReadingTime(post.content) }}
                        </span>
                     </div>
                     <div class="flex gap-2">
                        <Tooltip>
                           <TooltipTrigger as-child>
                              <Button variant="ghost" size="sm" @click="toggleBookmark"
                                 :aria-label="isBookmarked ? 'Remove bookmark' : 'Bookmark this post'">
                                 <!-- <Icon :name="isBookmarked ? 'ph:bookmark-simple-fill' : 'ph:bookmark-simple'"
                                   class="w-5 h-5" /> -->
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>{{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}</p>
                           </TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                           <DropdownMenuTrigger as-child>
                              <Button variant="ghost" size="sm" aria-label="Share options">
                                 <!-- <Icon name="ph:share-network" class="w-5 h-5" /> -->
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DropdownMenuItem @click="share('twitter')">
                                 <!-- <Icon name="ph:twitter-logo" class="w-4 h-4 mr-2" /> -->
                                 Twitter
                              </DropdownMenuItem>
                              <DropdownMenuItem @click="share('linkedin')">
                                 <!-- <Icon name="ph:linkedin-logo" class="w-4 h-4 mr-2" /> -->
                                 LinkedIn
                              </DropdownMenuItem>
                              <DropdownMenuItem @click="copyLink">
                                 <!-- <Icon name="ph:link" class="w-4 h-4 mr-2" /> -->
                                 Copy link
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </div>
                  <!-- Article Content -->
                  <article
                     class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:border prose-img:border-muted prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-pre:bg-muted prose-pre:rounded-lg">
                     <h1 class="text-3xl font-bold md:text-4xl lg:text-5xl">{{ post.title }}</h1>
                     <img v-if="post.cover_image"
                        :src="`${config.public.pocketbaseUrl}/api/files/${post.collectionId}/${post.id}/${post.cover_image}?token=`"
                        :alt="post.title" width="600" height="338" loading="lazy"
                        class="object-cover w-full h-full transition-transform duration-500 rounded-lg" />
                     <p v-html="post.description" class="text-xl text-muted-foreground"></p>
                     <ContainersHtml v-if="post.content" :content="post?.content" />
                  </article>
                  <!-- Tags - Only show if tags exist -->
                  <div v-if="post.tags && post.tags.length" class="mt-12">
                     <h2 class="sr-only">Tags</h2>
                     <div class="flex flex-wrap gap-2">
                        <Badge v-for="tag in post.tags" :key="tag" variant="outline"
                           class="text-sm font-medium cursor-pointer hover:bg-accent" @click="navigateToTag(tag)"
                           :aria-label="`View all posts tagged ${tag}`">
                           #{{ tag }}
                        </Badge>
                     </div>
                  </div>
               </CardContent>
               <!-- Author Bio -->
               <CardFooter class="border-t border-muted bg-muted/5" v-if="post.expand?.author">
                  <div class="flex flex-col w-full gap-6 pt-4 sm:flex-row sm:items-center sm:justify-between">
                     <div class="flex items-center gap-4">
                        <Avatar class="border border-muted">
                           <AvatarImage v-if="post.expand.author.avatar"
                              :src="`/api/files/${post.expand.author.collectionId}/${post.expand.author.id}/${post.expand.author.avatar}`"
                              :alt="post.expand.author.username" width="64" height="64" />
                           <AvatarFallback>{{ getInitials(post.expand.author.username) }}</AvatarFallback>
                        </Avatar>
                        <div class="flex items-center">
                           <div class="flex flex-col">
                              <h3 class="font-medium">{{ post.expand.author.username }}</h3>
                              <p v-if="post.expand.author.bio" class="text-sm text-muted-foreground">{{
                                 post.expand.author.bio }}</p>
                           </div>
                           <!-- Social links removed since social is null in the data -->
                        </div>
                     </div>
                     <div class="flex items-center gap-2">
                        <Tooltip>
                           <TooltipTrigger as-child>
                              <Button variant="outline" size="sm" @click="scrollToComments"
                                 aria-label="Jump to comments section">
                                 <!-- <Icon name="ph:chat-circle" class="w-4 h-4 mr-2" /> -->
                                 Comments
                                 <span class="ml-1">
                                    ({{ post.expand['comments_via_post']?.length || 0 }})
                                 </span>
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Jump to comments section</p>
                           </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                           <TooltipTrigger as-child>
                              <Button variant="outline" size="sm" @click="likePost"
                                 :aria-label="isLiked ? 'Unlike this post' : 'Like this post'">
                                 <span>{{ post.likes || 0 }}</span>
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>{{ isLiked ? 'Unlike this post' : 'Like this post' }}</p>
                           </TooltipContent>
                        </Tooltip>
                     </div>
                  </div>
               </CardFooter>
            </Card>
            <!-- Comments section - adjusted to handle potential undefined -->
            <SubmitComment v-if="post?.id" @comment-created="refresh()" :post="post.expand?.['comments_via_post'] || []"
               :id="post.id" />
            <!-- Related Posts - removed since not in the current data structure -->
         </TooltipProvider>
      </motion.div>
   </article>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import TooltipProvider from '@/components/ui/tooltip/TooltipProvider.vue'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/composables/blogHelpers'
import type { RecordModel } from 'pocketbase'

const config = useRuntimeConfig()

const { fetchPostBySlug, fetchPosts } = usePosts();
const route = useRoute()

const post = ref<RecordModel | null>(null)
const isBookmarked = ref(false)
const isLiked = ref(false)

onMounted(async () => {
   try {
      // Extract the slug from the route
      const fullSlug = route.path.replace('/blog', '')
      const fetchedPost = await fetchPostBySlug(fullSlug, false);
      post.value = fetchedPost
   } catch (error) {
      console.error('Error fetching post:', error)
   }
});

const toggleBookmark = () => {
   isBookmarked.value = !isBookmarked.value
}

const likePost = () => {
   isLiked.value = !isLiked.value
   if (post.value) {
      if (isLiked.value) {
         post.value.likes = (post.value.likes || 0) + 1
      } else {
         post.value.likes = Math.max(0, (post.value.likes || 1) - 1)
      }
   }
}

const share = (platform: string) => {
   const url = encodeURIComponent(window.location.href)
   const title = encodeURIComponent(post.value?.title || '')

   switch (platform) {
      case 'twitter':
         window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank')
         break
      case 'linkedin':
         window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
         break
   }
}

const copyLink = async () => {
   try {
      await navigator.clipboard.writeText(window.location.href)
      // Add toast notification here
      console.log('Link copied to clipboard')
   } catch (err) {
      console.error('Failed to copy link:', err)
   }
}

const navigateToTag = (tag: string) => {
   if (!tag) return
   navigateTo(`/blog/tags/${tag?.toLowerCase()?.replace(/\s+/g, '-')}`)
}

const scrollToComments = () => {
   const commentsSection = document.getElementById('comments')
   if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' })
   }
}

const calculateReadingTime = (html: string) => {
   if (!html) return '0 min read'
   const textContent = html?.replace(/<[^>]*>/g, ' ') || '';
   const wordCount = textContent.trim().split(/\s+/).length
   const readingTime = Math.ceil(wordCount / 200) // 200 words per minute
   return `${readingTime} min read`
}

const getInitials = (name: string) => {
   return name?.split(' ').map(n => n[0]).join('').toUpperCase() || ''
}

const refresh = async () => {
   try {
      if (post.value?.slug) {
         const fullSlug = route.path.replace('/blog', '')
         const fetchedPost = await fetchPostBySlug(fullSlug, false);
         post.value = fetchedPost
      }
   } catch (error) {
      console.error('Error fetching post:', error)
   }
}
</script>