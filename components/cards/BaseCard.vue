<template>
  <Card v-if="content"
    class="h-full overflow-hidden transition-all duration-300 border group border-muted hover:border-primary/30 hover:shadow-lg">
    <CardHeader class="p-0 border-b border-muted">
      <nuxt-link v-if="content?.slug && content?.cover_image" :to="`${baseUrl + content.slug}`" class="w-full">
        <div class="relative overflow-hidden aspect-video">
          <img :src="content.cover_image" :alt="content.title"
            class="object-cover w-full h-full transition-all duration-500 aspect-video hover:scale-105" />
          <div
            class="absolute inset-0 flex items-end p-4 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100">
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
          <nuxt-link v-if="content?.slug" :external="true" :to="content.slug" class="w-full">
            <h3 class="text-xl font-bold">{{ content.title }}</h3>
          </nuxt-link>
          <p v-if="content?.sub_title" class="mt-2 text-sm text-muted-foreground">{{ content.sub_title }}</p>
          <p  :class="{ 'h-20': !removeSpacing }" class="mt-3 text-sm">{{ content.description }}</p>
        </div>

        <div v-if="content?.tech" class="flex flex-wrap gap-2 mt-6">
          <Badge v-for="tech in content.tech.slice(0, 3)" :key="tech" variant="outline" class="text-xs">
            {{ tech }}
          </Badge>
          <Badge v-if="content.tech.length > 3" variant="outline" class="text-xs">
            +{{ content.tech.length - 3 }} more
          </Badge>
        </div>

        <div :class="!removeSpacing ? 'mt-8' : 'mt-6'" class="flex w-full gap-3">
          <nuxt-link v-if="content?.slug" :external="true" :to="content.slug" class="w-full">
            <Button class="w-full">{{ buttonText || 'Visit Site' }}</Button>
          </nuxt-link>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
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
  } | null;
  removeSpacing?: boolean;
  buttonText?: string;
  baseUrl?: string;
}>()

</script>
