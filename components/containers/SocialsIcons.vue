<template>
  <ContainersSocials
    v-if="socialLinks.length"
    :socialLinks="socialLinks"
    :columnOnMobile="columnOnMobile"
    :title="title"
  />
</template>

<script setup lang="ts">
interface SocialLink {
  platform: string;
  url: string;
}

const props = defineProps<{
  socials?: SocialLink[];
  columnOnMobile?: boolean;
  title?: string;
}>();

const iconMap: Record<string, any> = {
  facebook: (await import("lucide-vue-next")).Facebook,
  instagram: (await import("lucide-vue-next")).Instagram,
  twitter: (await import("lucide-vue-next")).Twitter,
  linkedin: (await import("lucide-vue-next")).Linkedin,
};

const socialLinks = computed(() =>
  (props.socials || []).map((s) => ({
    icon: iconMap[s.platform.toLowerCase()] || iconMap.facebook,
    href: s.url,
  }))
);
</script>
