<template>
  <Card v-if="content"
    class="h-full overflow-hidden transition-all duration-300 border group border-muted hover:border-primary/30 hover:shadow-lg">

    <CardHeader class="p-0 border-b border-muted">
      <nuxt-link v-if="content && content?.slug && content?.cover_image" :to="baseUrl + content?.slug" class="w-full">
        <div class="relative w-full h-auto aspect-video">
          <img :src="image || createImgUrl(content)" :alt="content.title" class="absolute top-0 bottom-0 left-0 right-0 object-cover w-full h-full" />
          <div
            class="absolute inset-0 z-10 flex items-end p-4 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-primary/10 to-transparent group-hover:opacity-100">
            <div class="flex flex-wrap gap-2">
              <Badge v-for="tag in content.tags" :key="tag" variant="secondary" class="text-xs font-medium">
                {{ tag }}
              </Badge>
            </div>
          </div>
        </div>
      </nuxt-link>
    </CardHeader>
    <CardContent :class="!removeSpacing ? 'lg:p-8' : 'lg:p-6'" class="p-6">
      <div class="flex flex-col h-full">
        <div :class="{ 'h-40': !removeSpacing }">
          <nuxt-link v-if="content?.slug" :external="true" :to="baseUrl + content?.slug" class="w-full transition-colors hover:text-primary">
            <h3 class="text-xl font-bold">{{ content.title }}</h3>
          </nuxt-link>
          <p v-if="content?.sub_title" class="mt-2 text-sm text-muted-foreground">{{ content.sub_title }}</p>
          <p :class="{ 'h-20': !removeSpacing }" class="mt-3 text-sm">{{ content.description }}</p>
        </div>

        <div v-if="content?.tech" class="flex flex-wrap gap-2 mt-6">
          <Badge v-for="tech in content.tech.slice(0, 3)" :key="tech" variant="outline" class="text-xs">
            {{ tech }}
          </Badge>
          <Badge v-if="content.tech.length > 3" variant="outline" class="text-xs">
            +{{ content.tech.length - 3 }} more
          </Badge>
        </div>

        <div :class="!removeSpacing ? 'mt-8' : 'mt-6'" class="flex flex-col w-full gap-3 md:flex-row">
          <nuxt-link v-if="content?.slug" :external="true" :to="baseUrl + content?.slug" class="w-full">
            <Button class="w-full text-xs">{{ buttonText || 'Visit Site' }}</Button>
          </nuxt-link>
          <slot class="w-full" name="extraButton"></slot>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()

defineProps<{
  content: {
    id: number;
    title: string;
    sub_title: string;
    description: string;
    cover_image?: string;
    slug?: string;
    caseStudy?: string;
    tags?: string[];
    tech?: string[];
    collectionId?: string;
  } | null;
  removeSpacing?: boolean;
  buttonText?: string;
  baseUrl?: string;
  image: string;
}>()

const createImgUrl = (content: any) => {
  if (!content?.cover_image || !content?.collectionId || !content?.id) return '';
  return `${config.public.pocketbaseUrl}api/files/${content.collectionId}/${content.id}/${content.cover_image}`;
}
</script>
