<template>
    <div class="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <span class="text-sm text-muted-foreground">•</span>
        <span class="text-sm text-muted-foreground">
          {{ readingTime }}
        </span>
      </div>
      <div class="flex gap-2">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" @click="toggleBookmark"
              :aria-label="isBookmarked ? 'Remove bookmark' : 'Bookmark this post'">
              <Icon :name="isBookmarked ? 'ph:bookmark-simple-fill' : 'ph:bookmark-simple'" class="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm" aria-label="Share options">
              <Icon name="ph:share-network" class="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="$emit('share', 'twitter')">
              <Icon name="ph:twitter-logo" class="w-4 h-4 mr-2" />
              Twitter
            </DropdownMenuItem>
            <DropdownMenuItem @click="$emit('share', 'linkedin')">
              <Icon name="ph:linkedin-logo" class="w-4 h-4 mr-2" />
              LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem @click="$emit('copyLink')">
              <Icon name="ph:link" class="w-4 h-4 mr-2" />
              Copy link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    readingTime: {
      type: String,
      required: true
    },
    isBookmarked: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['share', 'copyLink', 'toggleBookmark'])
  
  const toggleBookmark = () => {
    emit('toggleBookmark')
  }
  </script>