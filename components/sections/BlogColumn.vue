<template>
  <div class="container flex flex-col w-full mx-auto h-auto">
    <TextSectionTitle
      v-if="title || description"
      class="pb-16"
      :title="title"
      :description="description"
      :h1="h1"
    />

    <div v-if="error" class="py-20 text-center">
      <p class="text-red-500 font-semibold">Failed to load articles.</p>
      <button
        @click="loadInitialPosts"
        class="mt-4 text-sm underline hover:text-primary"
      >
        Try again
      </button>
    </div>

    <div v-else-if="pending" class="flex w-full mt-6 flex-col gap-8">
      <AtomsBaseSkeleton
        v-for="n in 3"
        :key="n"
        class="animate-pulse flex flex-col md:flex-row gap-6"
      />
    </div>

    <template v-else>
      <SectionsBlog
        v-if="posts?.items?.length"
        class="flex w-full mt-6"
        :content="posts.items"
        :baseUrl
        :newsLetterModule
      />

      <div v-else class="py-20 text-center text-gray-500">
        No articles found in this category.
      </div>

      <div class="flex justify-center w-full mr-auto -mt-12 lg:-mt-20 lg:w-2/3">
        <div
          v-if="showMore && !showPagination"
          class="w-full flex justify-center mt-6"
        >
          <AtomsBaseLink to="/blog/" :text="viewMoreText" />
        </div>
        <Pagination
          v-else-if="showMore && showPagination"
          :total-pages="posts?.totalPages"
          :show-pagination="true"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: "Blog Articles & Tutorials" },
  description: { type: String, default: "Explore my latest articles..." },
  perPage: { type: Number, default: 5 },
  content: { type: Object },
  newsLetterModule: { type: Object, default: () => ({}) },
  showMore: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },
  baseUrl: { type: String, default: "" },
  h1: { type: Boolean, default: false },
  type: { type: String, default: "posts" },
  viewMoreText: { type: String, default: "View All Posts" },
});

const { fetchCollection } = usePocketBaseCore();
const route = useRoute();

// Loading and Error States
const pending = ref(false);
const error = ref<any>(null);

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

const posts = ref<ListResult<RecordModel>>({
  items: [],
  page: 1,
  perPage: props.perPage,
  totalItems: 0,
  totalPages: 0,
});

const fetchPosts = async (
  page: number,
  perPage: number
): Promise<ListResult<RecordModel>> => {
  pending.value = true;
  error.value = null;
  try {
    const result = await fetchCollection(
      props.type,
      page,
      5, // Maintaining your explicit perPage = 5 from the original snippet
      "",
      "-created",
      ""
    );
    return (
      result || { items: [], page: 1, perPage, totalItems: 0, totalPages: 0 }
    );
  } catch (err) {
    console.error("Error fetching posts:", err);
    error.value = err;
    return { items: [], page: 1, perPage, totalItems: 0, totalPages: 0 };
  } finally {
    pending.value = false;
  }
};

const loadInitialPosts = async () => {
  const pageNumber = route.query.page
    ? parseInt(route.query.page as string, 10)
    : 1;
  posts.value = await fetchPosts(
    isNaN(pageNumber) ? 1 : pageNumber,
    props.perPage
  );
};

// Watch for page changes
watch(
  () => route.query.page,
  async (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (!isNaN(pageNumber)) {
      posts.value = await fetchPosts(pageNumber, props.perPage);
    }
  }
);

onMounted(() => {
  loadInitialPosts();
});
</script>
