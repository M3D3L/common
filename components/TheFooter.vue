<template>
  <footer
    class="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex flex-col gap-12 px-4 py-16 mx-auto lg:px-6">
      <!-- Main Footer Content -->
      <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Brand Column -->
        <div class="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
          <div class="flex flex-col gap-3">
            <h3 class="text-lg font-bold text-foreground">
              {{ contactInfo?.siteName }}
            </h3>
            <p class="text-sm leading-relaxed text-muted-foreground">
              {{ contactInfo?.slogan }}
            </p>
          </div>

          <!-- Social Links -->
          <div class="flex flex-col gap-3">
            <p
              class="text-xs font-semibold tracking-wide uppercase text-foreground/60"
            >
              Connect With Us
            </p>
            <ContainersSocials :socialLinks="socials" />
          </div>
        </div>

        <!-- Loop over footerColumns -->
        <div
          v-for="(column, colIndex) in localFooterColumns"
          :key="colIndex"
          class="flex flex-col gap-4"
        >
          <h3
            class="text-sm font-semibold tracking-wide uppercase text-foreground/80"
          >
            {{ column.title }}
          </h3>
          <div class="flex flex-col gap-2.5">
            <AtomsStyledLink
              v-for="(link, linkIndex) in column.links"
              :key="linkIndex"
              :to="link.href"
              :title="link.label"
            />
          </div>
        </div>
      </div>

      <!-- Divider with gradient -->
      <div class="relative w-full h-px overflow-hidden bg-border/40">
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />
      </div>

      <!-- Bottom Bar -->
      <div
        class="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left"
      >
        <p class="text-sm text-muted-foreground">
          © {{ new Date().getFullYear() }}
          <span class="font-medium text-foreground">{{
            contactInfo?.siteName
          }}</span>
          . All rights reserved.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-6">
          <AtomsStyledLink
            v-for="(link, index) in links || []"
            :key="index"
            :to="link.href"
            :title="link.label"
          />
        </div>
      </div>

      <!-- Back to Top Button (Optional) -->
      <div class="flex justify-center pt-6">
        <button
          @click="scrollToTop"
          class="p-3 transition-all rounded-full bg-accent/50 hover:bg-accent hover:scale-110 active:scale-95 group"
          aria-label="Back to top"
        >
          <svg
            class="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import usePocketBaseCore from "@/composables/usePocketBaseCore";

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
import type { ListResult, RecordModel } from "pocketbase";

const posts = ref<ListResult<RecordModel> | null>(null);

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const localFooterColumns = ref<FooterColumn[]>([]);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(async () => {
  const result = await fetchCollection(props.type, 1, 5, "", "-created", "");
  posts.value = result;

  if (result?.items?.length) {
    const firstThree = result.items.slice(0, 3);
    const lastTwo = result.items.slice(3);

    // Insert first 3 into "Recent Posts" column at index 1
    localFooterColumns.value.splice(1, 0, {
      title: "Recent Posts",
      links: firstThree.map((post) => ({
        label: post.title,
        href: `/blog${post.slug}`,
      })),
    });

    // If there are more posts, add them in a new column with no title
    if (lastTwo.length) {
      localFooterColumns.value.push({
        title: "More",
        links: lastTwo.map((post) => ({
          label: post.title,
          href: `/blog${post.slug}`,
        })),
      });
    }
  }
});
</script>
