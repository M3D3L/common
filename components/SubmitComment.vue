<template>
  <div id="comments" class="mt-8">
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
        <CardDescription>
          {{ totalCommentCount }} comment{{
            totalCommentCount !== 1 ? "s" : ""
          }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <div
            v-for="comment in commentsWithReplies"
            :key="comment.id"
            class="space-y-4"
            :class="{ 'ml-6': comment.parentCommentId }"
          >
            <div class="flex gap-4">
              <Avatar>
                <AvatarImage
                  v-if="comment.expand?.author?.avatar"
                  :src="`${config.public.pocketbaseUrl}api/files/${comment.expand?.author?.collectionId}/${comment.expand?.author?.id}/${comment.expand?.author?.avatar}?thumb=30x30`"
                  :alt="comment.expand?.author?.username || 'Anonymous'"
                  :width="comment.parentCommentId ? 30 : 40"
                  :height="comment.parentCommentId ? 30 : 40"
                />
                <AvatarFallback>
                  {{ getInitials(comment.expand?.author?.username || "Anon") }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4
                    class="font-medium"
                    :class="{ 'text-sm': comment.parentCommentId }"
                  >
                    {{ comment.expand?.author?.username || "Anonymous" }}
                  </h4>
                  <div class="flex items-center gap-2">
                    <time
                      :datetime="comment.created"
                      class="text-sm text-muted-foreground"
                    >
                      {{ formatDate(comment.created) }}
                    </time>
                    <template
                      v-if="isAuthenticated && user?.id === comment.author"
                    >
                      <Button size="xs" @click="startEdit(comment)">
                        <Pencil class="w-3 h-3" />
                      </Button>
                      <Button size="xs" @click="deleteComment(comment.id)">
                        <Trash2 class="w-3 h-3" />
                      </Button>
                    </template>
                  </div>
                </div>

                <div v-if="editingComment?.id === comment.id" class="mt-2">
                  <Textarea
                    v-model="editedContent"
                    class="min-h-[80px]"
                    required
                  />
                  <div class="flex justify-end gap-2 mt-2">
                    <Button size="sm" @click="cancelEdit"> Cancel </Button>
                    <Button
                      size="sm"
                      @click="updateComment"
                      :disabled="!editedContent.trim()"
                    >
                      Update
                    </Button>
                  </div>
                </div>
                <div v-else>
                  <p
                    class="mt-1 whitespace-pre-wrap"
                    :class="{ 'text-xs': comment.parentCommentId }"
                  >
                    {{ comment.content }}
                  </p>
                </div>

                <Button
                  v-if="
                    comment.expand?.author &&
                    editingComment?.id !== comment.id &&
                    comment?.parentCommentId === ''
                  "
                  variant="ghost"
                  class="mt-2"
                  :size="comment.parentCommentId ? 'xs' : 'sm'"
                  @click="startReply(comment)"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>

          <Separator class="my-4" />

          <div class="space-y-4">
            <h3 class="text-lg font-medium">
              {{
                replyingToComment
                  ? `Replying to @${replyingToComment.expand?.author?.username}`
                  : "Leave a comment"
              }}
            </h3>
            <div
              v-if="replyingToComment"
              class="p-2 mb-2 text-sm bg-gray-100 border rounded text-muted-foreground dark:bg-gray-800"
            >
              <div class="font-medium">
                {{ replyingToComment.expand?.author?.username }} wrote:
              </div>
              <div class="italic truncate">{{ replyingToComment.content }}</div>
            </div>
            <form @submit.prevent="submitComment">
              <Textarea
                v-model="newComment"
                :placeholder="
                  replyingToComment
                    ? `Reply to @${replyingToComment.expand?.author?.username}...`
                    : 'Share your thoughts...'
                "
                class="min-h-[80px]"
                required
              />
              <div class="flex items-center justify-end mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  @click="cancelReply"
                  v-if="replyingToComment"
                  class="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  :disabled="!isAuthenticated || !newComment.trim()"
                >
                  {{ replyingToComment ? "Post Reply" : "Post Comment" }}
                </Button>
                <span
                  v-if="!isAuthenticated"
                  class="ml-2 text-xs text-muted-foreground"
                >
                  You must be logged in to comment.
                </span>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import useComments from "@/composables/useComments";
import useAuth from "@/composables/useAuth";
import { Pencil, Trash2 } from "lucide-vue-next";

// Radix UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const config = useRuntimeConfig();

interface Author {
  id: string;
  username: string;
  avatar: string;
  collectionId: string;
}

interface Comment {
  id: string;
  content: string;
  created: string;
  updated: string;
  post: string;
  author: string;
  parentCommentId?: string;
  expand?: {
    author?: Author;
    parentComment?: Comment & { expand?: { author?: Author } };
    replies?: Comment[];
  };
  // Add a mutable replies array for internal nesting logic
  replies?: Comment[];
}

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const rawComments = ref<Comment[]>([]);
const newComment = ref("");
const replyingToComment = ref<Comment | null>(null);
const editingComment = ref<Comment | null>(null);
const editedContent = ref("");

const { user, isAuthenticated } = useAuth();
const { createComment, updateItem, deleteItem, fetchComments } = useComments();

// Function to refresh the comments list
const refreshComments = async () => {
  if (!props.id) return;
  try {
    // Note: The backend should ideally fetch comments in an order that
    // places replies as expanded fields under their parents.
    // If you control the PocketBase query, you can add a `sort` parameter
    // to the `fetchComments` call to sort by `created` ascending:
    // const fetchedComments = await fetchComments(props.id, { sort: 'created' });
    const fetchedComments = await fetchComments(props.id);
    rawComments.value = fetchedComments;
  } catch (error) {
    console.error("Failed to refresh comments:", error);
  }
};

// Call refreshComments initially on component mount
onMounted(() => {
  refreshComments();
});

// Replaces emitCommentCreated to directly refresh
const handleCommentActionSuccess = () => {
  refreshComments();
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return date.toLocaleDateString(undefined, options);
};

const startReply = (comment: Comment) => {
  if (!comment.expand?.author) return;
  editingComment.value = null;
  replyingToComment.value = comment;
  newComment.value = `@${comment.expand.author.username} `;
};

const cancelReply = () => {
  replyingToComment.value = null;
  newComment.value = "";
};

const startEdit = (comment: Comment) => {
  replyingToComment.value = null;
  editingComment.value = comment;
  editedContent.value = comment.content;
};

const cancelEdit = () => {
  editingComment.value = null;
  editedContent.value = "";
};

const updateComment = async () => {
  if (!editingComment.value || !editedContent.value.trim()) return;
  try {
    await updateItem("comments", editingComment.value.id, {
      content: editedContent.value.trim(),
    });
    editingComment.value = null;
    editedContent.value = "";
    handleCommentActionSuccess();
  } catch (error) {
    console.error("Error updating comment:", error);
  }
};

const deleteComment = async (commentId: string) => {
  if (!confirm("Are you sure you want to delete this comment?")) return;
  try {
    await deleteItem("comments", commentId);
    handleCommentActionSuccess();
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

const submitComment = async () => {
  if (!user.value?.id || !newComment.value.trim()) {
    console.error("User not logged in or comment is empty.");
    return;
  }
  try {
    const parentId = replyingToComment.value?.id || null;

    await createComment(props.id, newComment.value, user.value.id, parentId);

    newComment.value = "";
    replyingToComment.value = null;
    handleCommentActionSuccess();
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
};

/**
 * **UPDATED LOGIC**
 * Transforms the raw, potentially unsorted comments list into a correctly nested
 * and ordered flat list for display (top-level comment, then its replies, etc.).
 */
const commentsWithReplies = computed(() => {
  // 1. Group all comments into a map for quick parent/child access
  const commentMap = new Map<string, Comment>();
  const topLevelComments: Comment[] = [];

  // Sort raw comments by created date ASCENDING (oldest first) for correct main comment order
  const sortedRawComments = [...rawComments.value].sort((a, b) => {
    return new Date(a.created).getTime() - new Date(b.created).getTime();
  });

  // Create map, ensure mutable replies array, and identify top-level comments
  sortedRawComments.forEach((comment) => {
    // Clone and ensure an empty replies array for building the tree
    const commentWithReplies: Comment = {
      ...comment,
      replies: [], // We will populate this manually
    };

    commentMap.set(commentWithReplies.id, commentWithReplies);

    if (!commentWithReplies.parentCommentId) {
      topLevelComments.push(commentWithReplies);
    }
  });

  // 2. Nest replies into their parent comments
  // Iterate over a copy of the values to avoid mutation during iteration
  [...commentMap.values()].forEach((comment) => {
    if (comment.parentCommentId) {
      const parent = commentMap.get(comment.parentCommentId);
      if (parent) {
        // Add to parent's replies array
        parent.replies?.push(comment);
      }
    }
  });

  // 3. Flatten the tree recursively
  const recursiveFlatten = (
    comments: Comment[],
    parentId: string | null = null
  ): Comment[] => {
    let flattened: Comment[] = [];
    comments.forEach((comment) => {
      // 3a. Add the current comment to the flat list
      const flatComment: Comment = {
        ...comment,
        // Explicitly set parentCommentId for replies to enable `ml-6` styling
        parentCommentId: parentId || comment.parentCommentId,
      };

      flattened.push(flatComment);

      // 3b. Recursively flatten and append replies
      if (flatComment.replies && flatComment.replies.length > 0) {
        // Sort replies by creation date ascending (oldest first) before flattening
        flatComment.replies.sort(
          (a, b) =>
            new Date(a.created).getTime() - new Date(b.created).getTime()
        );

        const childReplies = recursiveFlatten(
          flatComment.replies,
          flatComment.id // The current comment's ID is the parentId for the next level
        );
        flattened.push(...childReplies);
      }
    });
    return flattened;
  };

  // Start the recursion with the processed top-level comments
  return recursiveFlatten(topLevelComments);
});

// Count of all comments, including nested replies
const totalCommentCount = computed(() => {
  return commentsWithReplies.value.length;
});
</script>
