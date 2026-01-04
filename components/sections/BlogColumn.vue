<template>
  <div class="container flex flex-col w-full mx-auto">
    <TextSectionTitle
      v-if="title || description"
      class="pb-16"
      :title="title"
      :description="description"
      :h1="h1"
    />

    <!-- Loading State -->
    <div
      v-if="pending && !postsData?.items?.length"
      class="flex justify-center py-12"
    >
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600 mb-2">Error loading posts. Please try again.</p>
      <button
        @click="refresh()"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Retry
      </button>
    </div>

    <!-- Content -->
    <template v-else>
      <SectionsBlog
        v-if="postsData?.items?.length"
        class="flex w-full mt-6"
        :content="postsData.items"
        :baseUrl="baseUrl"
      />

      <!-- No Results -->
      <div v-else-if="!pending" class="text-center py-12 text-gray-600">
        <p>No posts found.</p>
      </div>

      <div
        v-if="postsData?.items?.length"
        class="flex justify-center w-full mr-auto -mt-12 lg:-mt-20 lg:w-2/3"
      >
        <div>
          <nuxt-link
            v-if="showMore"
            to="/blog/"
            class="font-bold w-full transition-all hover:opacity-90 text-primary hover:underline pb-2"
          >
            View All Posts
          </nuxt-link>
        </div>
        <Pagination
          v-if="postsData?.totalPages > 1 && showPagination"
          :total-pages="postsData?.totalPages"
          :show-pagination="true"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// Import composables
const { fetchCollection } = usePocketBaseCore();
const route = useRoute();

// Props
const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    perPage?: number;
    content?: {
      items: any[];
      totalPages?: number;
      totalItems?: number;
      page?: number;
      perPage?: number;
    };
    showMore?: boolean;
    showPagination?: boolean;
    baseUrl?: string;
    h1?: boolean;
    type?: string;
  }>(),
  {
    title: "Blog Articles & Tutorials",
    description:
      "Explore my latest articles and insights on web development, design, and technology. Learn from practical tutorials and stay updated with industry trends.",
    perPage: 5,
    content: () => ({ items: [] }),
    showMore: true,
    showPagination: true,
    baseUrl: "",
    h1: false,
    type: "posts",
  }
);

// Types
interface RecordModel {
  [key: string]: any;
}

interface ListResult<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

// Helper to parse page number safely
const parsePageNumber = (pageQuery: string | string[] | undefined): number => {
  if (!pageQuery) return 1;
  const pageStr = Array.isArray(pageQuery) ? pageQuery[0] : pageQuery;
  const pageNum = parseInt(pageStr, 10);
  return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
};

// Main data fetching function
const fetchPosts = async (page: number): Promise<ListResult<RecordModel>> => {
  try {
    const result = await fetchCollection(
      props.type,
      page,
      props.perPage,
      "",
      "-created",
      ""
    );

    // Ensure we always return a valid ListResult structure
    return {
      items: result?.items || [],
      page: result?.page || page,
      perPage: result?.perPage || props.perPage,
      totalItems: result?.totalItems || 0,
      totalPages: result?.totalPages || 0,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      items: [],
      page: page,
      perPage: props.perPage,
      totalItems: 0,
      totalPages: 0,
    };
  }
};

// SSR-compatible data fetching with useAsyncData
const {
  data: postsData,
  pending,
  error,
  refresh,
} = await useAsyncData<ListResult<RecordModel>>(
  // Create a unique key for caching
  () => `posts-${props.type}-${route.fullPath}-${props.perPage}`,

  // Fetch function
  async () => {
    const page = parsePageNumber(route.query.page);
    return await fetchPosts(page);
  },

  // Options
  {
    // Watch for route changes
    watch: [() => route.query.page],

    // Set default value
    default: () => ({
      items: [],
      page: 1,
      perPage: props.perPage,
      totalItems: 0,
      totalPages: 0,
    }),

    // Transform if needed
    transform: (data) => {
      // Ensure consistent structure
      if (!data) {
        return {
          items: [],
          page: 1,
          perPage: props.perPage,
          totalItems: 0,
          totalPages: 0,
        };
      }
      return data;
    },
  }
);

// Watch for prop changes (perPage or type) and refresh data
watch(
  () => [props.perPage, props.type],
  () => {
    refresh();
  },
  { deep: true }
);

// If you want to handle client-side navigation separately
const handleRouteChange = () => {
  // Optional: Add any client-side specific logic here
};

// Watch for route changes
watch(
  () => route.fullPath,
  () => {
    handleRouteChange();
  }
);

// Optional: Client-side mounted logic
onMounted(() => {
  // Client-side only logic if needed
});
</script>

<style scoped>
.sticky-position {
  position: sticky !important;
  z-index: 32;
}
</style>
