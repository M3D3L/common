<template>
  <section
    class="container relative z-10 min-h-screen px-4 pt-20 pb-24 mx-auto"
  >
    <div class="w-full">
      <h1 class="mb-8 text-4xl font-bold">Content Preview & Editor</h1>

      <div class="mb-8 max-w-lg">
        <label for="post-select" class="block mb-2 text-lg font-medium"
          >Select Blog Post:</label
        >
        <Select v-model="selectedPostId" id="post-select">
          <SelectTrigger>
            <SelectValue placeholder="Select a post to edit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="item in postList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div v-if="loading" class="text-center py-12">
        Loading post content...
      </div>

      <div
        v-else-if="!selectedPostId"
        class="text-center py-12 text-muted-foreground"
      >
        Please select a blog post from the dropdown above to view and edit its
        content.
      </div>

      <div
        v-else-if="post && post.id"
        class="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        <div>
          <h2 class="text-2xl font-semibold mb-4 border-b pb-2">
            Live Preview
          </h2>
          <Card class="overflow-hidden">
            <CardContent class="p-0">
              <div class="items-center p-6 lg:p-12">
                <div
                  class="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40"
                >
                  <h3 class="mb-0 text-3xl w-full block font-bold md:text-4xl">
                    {{ post.title }}
                  </h3>
                  <div
                    v-if="post.description"
                    class="text-lg leading-relaxed text-muted-foreground italic"
                  >
                    {{ post.description }}
                  </div>
                </div>

                <article
                  class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40"
                >
                  <ContainersHtml :content="editableContent" />
                </article>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 class="text-2xl font-semibold mb-4 border-b pb-2">
            HTML Content Editor ({{ post.id }})
          </h2>
          <div class="space-y-4">
            <Textarea
              v-model="editableContent"
              class="min-h-[600px] font-mono text-sm"
              placeholder="Post content HTML goes here..."
            />
            <Button
              @click="updatePostContent"
              :disabled="!hasChanges || isSaving"
            >
              {{ isSaving ? "Saving..." : "Save Changes" }}
            </Button>
            <p
              v-if="saveMessage"
              :class="{
                'text-green-500': saveSuccess,
                'text-red-500': !saveSuccess,
              }"
            >
              {{ saveMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RecordModel } from "pocketbase";

// Import UI components (assuming you have these)
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ContainersHtml from "@/components/containers/Html.vue";

// Import your custom PocketBase composable
import usePocketBaseCore from "@/composables/usePocketBaseCore";

// --- State ---
const { fetchCollection, fetchRecord, updateItem } = usePocketBaseCore();

// State for the list of posts (ID and Title)
const postList = ref<{ id: string; title: string }[]>([]);
// State for the currently selected post ID from the dropdown
const selectedPostId = ref<string | null>(null);
// State for the full post record
const post = ref<RecordModel | null>(null);
// State for the content in the textarea (what the user is editing)
const editableContent = ref<string>("");
const loading = ref(false);
const isSaving = ref(false);
const saveMessage = ref<string>("");
const saveSuccess = ref(false);

// --- Constants ---
const COLLECTION_NAME = "posts";

// --- Computed Properties ---

// Check if the content in the editor is different from the original post content
const hasChanges = computed(() => {
  return post.value && post.value.content !== editableContent.value;
});

// --- Functions ---

/**
 * Fetches the list of all posts (ID and Title only) for the dropdown.
 */
const fetchPostList = async () => {
  try {
    const response = await fetchCollection(
      COLLECTION_NAME,
      1,
      50,
      "",
      "-created",
      null,
      ["id", "title"]
    );
    postList.value = response.items as { id: string; title: string }[];
  } catch (error) {
    console.error("Error fetching post list:", error);
  }
};

/**
 * Fetches the full content of a selected post.
 */
const fetchSelectedPost = async (id: string) => {
  if (!id) {
    post.value = null;
    editableContent.value = "";
    return;
  }

  loading.value = true;
  post.value = null; // Clear previous post
  saveMessage.value = ""; // Clear previous message

  try {
    const record = await fetchRecord(COLLECTION_NAME, id);
    post.value = record;
    // Initialize the editable content with the actual post content
    editableContent.value = record.content || "";
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    // You might want to handle an error state here
  } finally {
    loading.value = false;
  }
};

/**
 * Updates the 'content' field of the selected post in PocketBase.
 */
const updatePostContent = async () => {
  if (!post.value || !hasChanges.value) {
    saveMessage.value = "No changes to save.";
    saveSuccess.value = false;
    return;
  }

  isSaving.value = true;
  saveMessage.value = "";

  try {
    const updatedRecord = await updateItem(COLLECTION_NAME, post.value.id, {
      content: editableContent.value,
    });

    // Update the local post value to reflect the saved state and new content
    post.value = updatedRecord;

    saveSuccess.value = true;
    saveMessage.value = "Post content updated successfully!";

    // Automatically clear the message after a few seconds
    setTimeout(() => (saveMessage.value = ""), 3000);
  } catch (error) {
    console.error("Error saving post content:", error);
    saveSuccess.value = false;
    saveMessage.value = "Failed to save changes. Check console for details.";
  } finally {
    isSaving.value = false;
  }
};

// --- Watchers ---

// Watch the selectedPostId and fetch the post when it changes
watch(selectedPostId, (newId) => {
  if (newId) {
    fetchSelectedPost(newId);
  }
});

// --- Lifecycle ---

onMounted(() => {
  fetchPostList();
});
</script>

<style scoped>
/* Scoped styles for this editor */
.prose :deep(img) {
  /* Keep images centered in the preview pane */
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Ensure the preview area has enough height */
.grid > div {
  min-height: 700px;
}
</style>
