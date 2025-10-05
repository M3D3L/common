<template>
  <div class="container flex flex-col w-full mx-auto">
    <TextSectionTitle v-if="title || description" class="pb-16" :title="title" :description="description" :h1="h1" />
    <SectionsBlog
      v-if="posts?.items?.length"
      class="flex w-full mt-6"
      :content="posts.items"
      :baseUrl
    />

    <div class="flex justify-start w-full mr-auto -mt-12 lg:-mt-20">
      <nuxt-link
        v-if="showMore"
        to="/blog/"
        class="z-50 flex flex-row justify-end w-full cursor-pointer lg:pr-16 lg:w-2/3"
      >
        View All Posts
      </nuxt-link>
      <Pagination v-if="showPagination" :total-pages="posts?.totalPages" />
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    default: "Blog Articles & Tutorials",
  },
  description: {
    type: String,
    default: "Explore my latest articles and insights on web development, design, and technology. Learn from practical tutorials and stay updated with industry trends.",
  },
  perPage: {
    type: Number,
    default: 6,
  },
  content: {
    type: Object as () => {
      items: any[];
      totalPages?: number;
      totalItems?: number;
      page?: number;
      perPage?: number;
    },
  },
  showMore: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  baseUrl: {
    type: String,
    default: "",
  },
  h1: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "posts",
  },
});

const { fetchCollection } = usePocketBaseCore();

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
const route = useRoute();

const fetchPosts = async (page: number, perPage: number): Promise<ListResult<RecordModel>> => {
  try {
    const result = await fetchCollection(
      props.type,
      page,
      perPage,
      "",
      "-created",
      ""
    );
    return result;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      items: [],
      page: 1,
      perPage: perPage,
      totalItems: 0,
      totalPages: 0,
    };
  }
};

watch(
  () => route.query.page,
  async (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (!isNaN(pageNumber)) {
      posts.value = await fetchPosts(pageNumber, props.perPage);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  const initialPage = route.query.page ? parseInt(route.query.page as string, 10) : 1;
  posts.value = await fetchPosts(isNaN(initialPage) ? 1 : initialPage, props.perPage);
});
</script>

<style scoped>
.sticky-position {
  position: sticky !important;
  z-index: 32;
}
</style>