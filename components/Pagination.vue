<template>
  <nav
    v-if="showPagination && totalPages > 1"
    class="flex items-center justify-center my-6"
    aria-label="Pagination"
  >
    <ul class="flex items-center gap-2">
      <!-- Previous Button -->
      <li>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          class="transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Previous page"
        >
          <ChevronLeft class="w-4 h-4" />
        </Button>
      </li>

      <!-- First Page -->
      <li v-if="showFirstPage">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          :aria-current="currentPage === 1 ? 'page' : undefined"
          :class="pageButtonClass(1)"
          @click="goToPage(1)"
        >
          1
        </Button>
      </li>

      <li v-if="showLeftEllipsis" class="px-2 text-muted-foreground">…</li>

      <!-- Visible Pages -->
      <template v-for="page in visiblePages" :key="page">
        <li>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === page"
            :aria-current="currentPage === page ? 'page' : undefined"
            :class="pageButtonClass(page)"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>
        </li>
      </template>

      <li v-if="showRightEllipsis" class="px-2 text-muted-foreground">…</li>

      <!-- Last Page -->
      <li v-if="showLastPage">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          :aria-current="currentPage === totalPages ? 'page' : undefined"
          :class="pageButtonClass(totalPages)"
          @click="goToPage(totalPages)"
        >
          {{ totalPages }}
        </Button>
      </li>

      <!-- Next Button -->
      <li>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          class="transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Next page"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const props = defineProps({
  totalPages: { type: Number, required: true },
  maxVisiblePages: { type: Number, default: 5 },
  showPagination: { type: Boolean, default: false },
});

const route = useRoute();
const router = useRouter();

const currentPage = computed(() => Number(route.query.page) || 1);

/* ---------- Pagination Logic ---------- */

const visiblePages = computed(() => {
  const pages = [];
  let start = 1;
  let end = props.totalPages;

  if (props.totalPages > props.maxVisiblePages) {
    const half = Math.floor(props.maxVisiblePages / 2);

    if (currentPage.value <= half + 1) {
      end = props.maxVisiblePages;
    } else if (currentPage.value >= props.totalPages - half) {
      start = props.totalPages - props.maxVisiblePages + 1;
    } else {
      start = currentPage.value - half;
      end = currentPage.value + half;
    }
  }

  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const showFirstPage = computed(
  () =>
    props.totalPages > props.maxVisiblePages && !visiblePages.value.includes(1)
);

const showLastPage = computed(
  () =>
    props.totalPages > props.maxVisiblePages &&
    !visiblePages.value.includes(props.totalPages)
);

const showLeftEllipsis = computed(() => showFirstPage.value);

const showRightEllipsis = computed(() => showLastPage.value);

/* ---------- Helpers ---------- */

const pageButtonClass = (page) => [
  "font-medium transition-all duration-200",
  currentPage.value === page
    ? "bg-primary text-primary-foreground border-primary shadow-md cursor-default pointer-events-none"
    : "hover:bg-accent hover:border-accent-foreground/20 hover:shadow-sm hover:scale-105",
];

const goToPage = (page) => {
  if (page < 1 || page > props.totalPages || page === currentPage.value) return;

  router.push({
    query: {
      ...route.query,
      page,
    },
  });
};
</script>
