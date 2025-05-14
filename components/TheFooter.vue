<template>
  <footer
    class="w-full content-center h-[calc(100vh_-_66px)] md:h-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex flex-col gap-8 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Brand Column -->
        <div class="flex flex-col items-center gap-4 lg:items-start">
          <div class="flex items-center gap-2">
            <MiscLogo />
          </div>
          <p class="text-sm text-muted-foreground">
            Building the future with innovative solutions.
          </p>
          <div class="flex gap-4">
            <a v-for="(item, index) in footerData.socialLinks" :key="index" :href="item.href"
              class="transition-colors text-muted-foreground hover:text-foreground" :aria-label="item.label">
              <component :is="item.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Loop over footerColumns -->
        <div v-for="(column, colIndex) in localFooterColumns" :key="colIndex"
          class="flex flex-wrap items-center gap-2 lg:gap-3 lg:flex-col lg:items-start">
          <h3 class="text-sm font-semibold">{{ column.title }}</h3>
          <a v-for="(link, linkIndex) in column.links" :key="linkIndex" :href="link.href"
            class="px-2 py-1 text-sm transition-colors rounded-md text-clip text-muted-foreground hover:text-foreground lg:rounded-none lg:px-0 lg:py-1">
            {{ link.label }}
          </a>
        </div>
      </div>

      <!-- Divider -->
      <div class="w-full h-px bg-border" />

      <!-- Copyright -->
      <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p class="text-sm text-muted-foreground">
          © {{ new Date().getFullYear() }} Guillermo Medel. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <nuxt-link v-for="(link, index) in footerData.bottomLinks" :key="index" :to="link.href"
            class="text-sm transition-colors text-muted-foreground hover:text-foreground">
            {{ link.label }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import usePocketBaseCore from '@/composables/usePocketBaseCore';

const props = defineProps({
  footerData: {
    type: Object,
    required: true,
  },
})

const pbUtils = usePocketBaseCore();
const posts = ref([]);

const localFooterColumns = ref([...props.footerData.footerColumns]);

onMounted(async () => {
  const result = await pbUtils.fetchCollection('posts', 1, 6, '', '-created', '', ['content']);
  posts.value = result;

  if (result?.items?.length) {
    const firstThree = result.items.slice(0, 3);
    const lastTwo = result.items.slice(3);

    // Insert first 3 into "Recent Posts" column at index 1
    localFooterColumns.value.splice(1, 0, {
      title: 'Recent Posts',
      links: firstThree.map((post) => ({
        label: post.title,
        href: `/blog/${post.slug}`,
      })),
    });

    // If there are more posts, add them in a new column with no title
    if (lastTwo.length) {
      localFooterColumns.value.push({
        title: 'More',
        links: lastTwo.map((post) => ({
          label: post.title,
          href: `/blog/${post.slug}`,
        })),
      });
    }
  }
});

</script>