<template>
  <Card class="w-full overflow-hidden">
    <!-- Image -->
    <div class="relative w-full aspect-square bg-muted">
      <img :src="imageUrl" alt="post image" class="object-cover w-full h-full" />
      <div
        class="absolute bottom-3 right-3 flex items-center space-x-1.5 rounded-full bg-black/50 px-2 py-1 text-[11px] text-white">
        <span>1/3</span>
        <StackIcon class="w-3.5 h-3.5" />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between px-3 pt-3">
      <div class="flex items-center space-x-3">
        <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:text-red-500">
          <HeartIcon class="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground">
          <ChatBubbleIcon class="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground">
          <PaperPlaneIcon class="w-5 h-5" />
        </Button>
      </div>
      <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground">
        <BookmarkIcon class="w-5 h-5" />
      </Button>
    </div>

    <!-- Post Body -->
    <div class="px-3 pb-3 space-y-1 text-sm">
      <p class="font-semibold">{{ likes }} likes</p>
      <p>
        <span class="font-semibold">{{ title }}</span>
        <br />
        <span class="text-card-foreground/90">{{ description }}</span>
      </p>
      <p class="text-xs text-muted-foreground">View all comments</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DotsHorizontalIcon,
  HeartIcon,
  ChatBubbleIcon,
  PaperPlaneIcon,
  BookmarkIcon,
  StackIcon,
} from '@radix-icons/vue';

interface SocialsCardProps {
  title?: string;
  description?: string;
  likes?: number;
  imageUrl?: string;
}

const props = defineProps<SocialsCardProps>();

const title = props.title ?? 'RelocateToSanCarlos.com';
const description = props.description ?? 'Living the good life in San Carlos 🌊☀️';
const likes = props.likes ?? 1245;
const imageUrl = props.imageUrl ?? 'https://picsum.photos/400/400';
</script>
