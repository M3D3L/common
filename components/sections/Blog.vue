<template>
  <containers-fixed-rail>
    <template #main>
      <div class="grid w-full gap-4">
        <CardsBlogHorizontal
          v-for="(post, index) in content"
          :key="post.id"
          :title="post.title"
          :description="post.description"
          :created="post.created"
          :slug="post.slug"
          :collection-id="post.collectionId"
          :id="post.id"
          :cover-image="post.cover_image"
          :index="index"
          :base-url="baseUrl"
        />
      </div>
    </template>
    <template #right>
      <SectionsSubscribe class="z-10 sticky-position top-24" />
    </template>
  </containers-fixed-rail>
</template>

<script setup lang="ts">
const props = defineProps({
  content: {
    type: Array as () => Array<any>,
    required: true,
  },
  baseUrl: {
    type: String,
  },
  type: {
    type: String,
    default: "posts",
  },
});

const { fetchCollection } = usePocketBaseCore();
import type { ListResult, RecordModel } from "pocketbase";

const posts = ref<ListResult<RecordModel> | RecordModel[]>([]);

const fetchPosts = async () => {
  try {
    const result = await fetchCollection(props.type, 1, 5, "", "-created", "");
    return result;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

const loadPosts = async () => {
  posts.value = await fetchPosts();
};

onMounted(async () => {
  await loadPosts();
});
</script>
