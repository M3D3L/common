<template>
  <Card
    class="group relative w-full aspect-[4/5] overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500"
  >
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0">
      <img
        :src="imageUrl"
        :alt="platform"
        class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
      />
      <div
        :class="`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-70 transition-opacity duration-500`"
      />
    </div>

    <!-- Content -->
    <div class="relative flex flex-col justify-between h-full p-6 text-white">
      <!-- Platform Icon & Name -->
      <div class="flex items-center space-x-3">
        <div :class="`p-2.5 rounded-full ${iconBg} backdrop-blur-sm`">
          <component :is="platformIcon" class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-xl font-bold">{{ platform }}</h3>
          <p class="text-sm text-white/90">{{ handle }}</p>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="space-y-4">
        <div class="space-y-2">
          <p class="text-2xl font-bold leading-tight drop-shadow-lg">
            {{ tagline }}
          </p>
          <p class="text-sm text-white/80 drop-shadow">
            {{ description }}
          </p>
        </div>

        <Button
          :class="`w-full ${buttonStyle} font-semibold py-6 text-base shadow-xl hover:scale-105 transition-transform duration-300`"
        >
          {{ ctaText }}
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  MusicIcon,
  TwitterIcon,
} from "lucide-vue-next";

interface SocialCardProps {
  platform?: "Instagram" | "Facebook" | "TikTok" | "Twitter";
  imageUrl?: string;
  handle?: string;
  tagline?: string;
  description?: string;
  ctaText?: string;
}

const props = withDefaults(defineProps<SocialCardProps>(), {
  platform: "Instagram",
  imageUrl:
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=1000&fit=crop",
  handle: "@RelocateToSanCarlos",
  tagline: "Follow Our Journey",
  description: "Daily updates from paradise 🌊☀️",
  ctaText: "Follow Us",
});

const platformConfig = {
  Instagram: {
    icon: InstagramIcon,
    gradient: "from-purple-600 via-pink-600 to-orange-500",
    iconBg: "bg-white/20",
    buttonStyle: "bg-white text-purple-600 hover:bg-white/90",
  },
  Facebook: {
    icon: FacebookIcon,
    gradient: "from-blue-600 via-blue-700 to-blue-800",
    iconBg: "bg-white/20",
    buttonStyle: "bg-white text-blue-600 hover:bg-white/90",
  },
  TikTok: {
    icon: MusicIcon,
    gradient: "from-black via-gray-900 to-pink-900",
    iconBg: "bg-white/20",
    buttonStyle: "bg-white text-black hover:bg-white/90",
  },
  YouTube: {
    icon: YoutubeIcon, // Assuming you have this imported
    gradient: "from-red-600 via-red-700 to-red-800",
    iconBg: "bg-white/20",
    buttonStyle: "bg-white text-red-600 hover:bg-white/90",
  },
};

const config = computed(() => platformConfig[props.platform]);
const platformIcon = computed(() => config.value.icon);
const gradient = computed(() => config.value.gradient);
const iconBg = computed(() => config.value.iconBg);
const buttonStyle = computed(() => config.value.buttonStyle);
</script>
