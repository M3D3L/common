<template>
  <nav v-if="showPagination && totalPages > 1" class="flex items-center justify-center">
    <ul class="flex items-center gap-1">
      <li>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft class="w-4 h-4" />
          <span class="sr-only">Previous page</span>
        </Button>
      </li>

      <template v-for="page in visiblePages" :key="page">
        <li>
          <Button
            variant="page"
            class="px-4"
            size="sm"
            :class="currentPage === page ? 'bg-primary text-primary-foreground' : ''"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>
        </li>
      </template>

      <li>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <ChevronRight class="w-4 h-4" />
          <span class="sr-only">Next page</span>
        </Button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const props = defineProps({
  totalPages: {
    type: Number,
    required: true
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  },
  showPagination: {
    type: Boolean,
    default: false
  }
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

const goToPage = (page) => {
  if (page < 1 || page > props.totalPages) return;
  
  router.push({
    query: {
      ...route.query,
      page
    }
  });
};
</script>