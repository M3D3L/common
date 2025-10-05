<template>
  <footer
    class="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex flex-col gap-12 py-12">
      <!-- Main Footer Content -->
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Brand Column -->
        <div class="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
          <p class="text-base font-medium text-muted-foreground">
            {{ contactInfo?.slogan }}
          </p>
          <ContainersSocials :socialLinks="socials" />
        </div>

        <!-- Loop over footerColumns -->
        <div
          v-for="(column, colIndex) in localFooterColumns"
          :key="colIndex"
          class="flex flex-col gap-3"
        >
          <h3 class="text-sm font-semibold tracking-wide uppercase text-foreground/80">
            {{ column.title }}
          </h3>
          <div class="flex flex-col gap-2">
            <a
              v-for="(link, linkIndex) in column.links"
              :key="linkIndex"
              :href="link.href"
              class="text-sm transition-colors text-muted-foreground hover:text-primary"
            >
              {{ link.label }}
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="w-full h-px bg-border" />

      <!-- Bottom Bar -->
      <div
        class="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left"
      >
        <p class="text-sm text-muted-foreground">
          © {{ new Date().getFullYear() }} {{ contactInfo?.siteName }}. All rights reserved.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <NuxtLink
            v-for="(link, index) in links"
            :key="index"
            :to="link.href"
            class="text-sm transition-colors text-muted-foreground hover:text-primary"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import usePocketBaseCore from '@/composables/usePocketBaseCore';

interface FooterLink {
  label: string;
  href: string;
}

const props = defineProps<{
  socials: any[];
  type: string;
  contactInfo: Record<string, any>;
  links: FooterLink[];
}>();

const { fetchCollection } = usePocketBaseCore();
import type { ListResult, RecordModel } from 'pocketbase';

const posts = ref<ListResult<RecordModel> | null>(null);

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const localFooterColumns = ref<FooterColumn[]>([]);

onMounted(async () => {
  const result = await fetchCollection(props.type, 1, 6, '', '-created', '');
  posts.value = result;

  if (result?.items?.length) {
    const firstThree = result.items.slice(0, 3);
    const lastTwo = result.items.slice(3);

    // Insert first 3 into "Recent Posts" column at index 1
    localFooterColumns.value.splice(1, 0, {
      title: 'Recent Posts',
      links: firstThree.map((post) => ({
        label: post.title,
        href: `/blog${post.slug}`,
      })),
    });

    // If there are more posts, add them in a new column with no title
    if (lastTwo.length) {
      localFooterColumns.value.push({
        title: 'More',
        links: lastTwo.map((post) => ({
          label: post.title,
          href: `/blog${post.slug}`,
        })),
      });
    }
  }
});
</script>