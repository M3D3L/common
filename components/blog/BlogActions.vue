<template>
    <div class="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="sm" @click="$emit('scrollToComments')" aria-label="Jump to comments section">
            <Icon name="ph:chat-circle" class="w-4 h-4 mr-2" />
            Comments
            <span v-if="commentsCount" class="ml-1">
              ({{ commentsCount }})
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Jump to comments section</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="sm" @click="$emit('likePost')"
            :aria-label="isLiked ? 'Unlike this post' : 'Like this post'">
            <Icon :name="isLiked ? 'ph:heart-fill' : 'ph:heart'" class="w-4 h-4 mr-2 text-red-500" />
            <span>{{ likes }}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ isLiked ? 'Unlike this post' : 'Like this post' }}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    isLiked: {
      type: Boolean,
      default: false
    },
    likes: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    }
  })
  
  defineEmits(['scrollToComments', 'likePost'])
  </script>