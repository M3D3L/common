<template>
  <nav
    v-if="showPagination && totalPages > 1"
    class="flex items-center justify-center my-6"
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
        >
          <ChevronLeft class="w-4 h-4" />
          <span class="sr-only">Previous page</span>
        </Button>
      </li>

      <!-- First Page (with ellipsis if needed) -->
      <li v-if="showFirstPage">
        <Button
          variant="outline"
          size="sm"
          :class="
            currentPage === 1
              ? 'bg-primary text-primary-foreground border-primary'
              : 'hover:bg-accent'
          "
          @click="goToPage(1)"
          class="transition-colors duration-200"
        >
          1
        </Button>
      </li>

      <li v-if="showLeftEllipsis" class="px-2 text-muted-foreground">...</li>

      <!-- Page Numbers -->
      <template v-for="page in visiblePages" :key="page">
        <li>
          <Button
            variant="outline"
            size="sm"
            :class="[
              'transition-all duration-200 font-medium',
              currentPage === page
                ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                : 'hover:bg-accent hover:border-accent-foreground/20 hover:shadow-sm',
            ]"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>
        </li>
      </template>

      <li v-if="showRightEllipsis" class="px-2 text-muted-foreground">...</li>

      <!-- Last Page (with ellipsis if needed) -->
      <li v-if="showLastPage">
        <Button
          variant="outline"
          size="sm"
          :class="
            currentPage === totalPages
              ? 'bg-primary text-primary-foreground border-primary'
              : 'hover:bg-accent'
          "
          @click="goToPage(totalPages)"
          class="transition-colors duration-200"
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
        >
          <ChevronRight class="w-4 h-4" />
          <span class="sr-only">Next page</span>
        </Button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const props = defineProps({
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
  showPagination: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const router = useRouter();
const currentPage = computed(() => parseInt(route.query.page) || 1);

const visiblePages = computed(() => {
  const pages = [];
  let startPage = 1;
  let endPage = props.totalPages;

  if (props.totalPages > props.maxVisiblePages) {
    const maxPagesBeforeCurrent = Math.floor(props.maxVisiblePages / 2);
    const maxPagesAfterCurrent = Math.ceil(props.maxVisiblePages / 2) - 1;

    if (currentPage.value <= maxPagesBeforeCurrent) {
      endPage = props.maxVisiblePages;
    } else if (currentPage.value + maxPagesAfterCurrent >= props.totalPages) {
      startPage = props.totalPages - props.maxVisiblePages + 1;
    } else {
      startPage = currentPage.value - maxPagesBeforeCurrent;
      endPage = currentPage.value + maxPagesAfterCurrent;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Computed properties for ellipsis logic
const showFirstPage = computed(() => {
  return (
    props.totalPages > props.maxVisiblePages &&
    currentPage.value > Math.floor(props.maxVisiblePages / 2) + 1
  );
});

const showLastPage = computed(() => {
  return (
    props.totalPages > props.maxVisiblePages &&
    currentPage.value < props.totalPages - Math.floor(props.maxVisiblePages / 2)
  );
});

const showLeftEllipsis = computed(() => {
  return (
    props.totalPages > props.maxVisiblePages &&
    currentPage.value > Math.floor(props.maxVisiblePages / 2) + 1
  );
});

const showRightEllipsis = computed(() => {
  return (
    props.totalPages > props.maxVisiblePages &&
    currentPage.value < props.totalPages - Math.floor(props.maxVisiblePages / 2)
  );
});

const goToPage = (page) => {
  if (page < 1 || page > props.totalPages) return;

  router.push({
    query: {
      ...route.query,
      page,
    },
  });
};
</script>
