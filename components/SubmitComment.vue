<template>
  <div id="comments" class="mt-8">
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
        <CardDescription>
          {{ post?.length }} comment{{ post?.length !== 1 ? 's' : '' }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <div v-for="comment in commentsWithReplies" :key="comment.id" class="space-y-4" :class="{'ml-6': comment.parentCommentId}">
            <div class="flex gap-4">
              <Avatar>
                <AvatarImage
                  v-if="comment.expand?.author?.avatar"
                  :src="`http://127.0.0.1:8090/api/files/${comment.expand?.author?.collectionId}/${comment.expand?.author?.id}/${comment.expand?.author?.avatar}?token=`"
                  :alt="comment.expand?.author?.username || 'Anonymous'"
                  :width="comment.parentCommentId ? 30 : 40"
                  :height="comment.parentCommentId ? 30 : 40"
                />
                <AvatarFallback>
                  {{ getInitials(comment.expand?.author?.username || 'Anon') }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium" :class="{'text-sm': comment.parentCommentId}">
                    {{ comment.expand?.author?.username || 'Anonymous' }}
                  </h4>
                  <div class="flex items-center gap-2">
                    <time :datetime="comment.created" class="text-sm text-muted-foreground">
                      {{ formatDate(comment.created) }}
                    </time>
                    <template v-if="isAuthenticated && user?.id === comment.author">
                      <Button
                        variant="ghost"
                        size="xs"
                        class="w-6 h-6 p-0 text-muted-foreground hover:text-primary"
                        @click="startEdit(comment)"
                      >
                        <Pencil class="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        class="w-6 h-6 p-0 text-muted-foreground hover:text-destructive"
                        @click="deleteComment(comment.id)"
                      >
                        <Trash2 class="w-3 h-3" />
                      </Button>
                    </template>
                  </div>
                </div>

                <!-- Edit mode -->
                <div v-if="editingComment?.id === comment.id" class="mt-2">
                  <Textarea
                    v-model="editedContent"
                    class="min-h-[80px]"
                    required
                  />
                  <div class="flex justify-end gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      @click="cancelEdit"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      @click="updateComment"
                    >
                      Update
                    </Button>
                  </div>
                </div>
                <!-- View mode -->
                <div v-else>
                  <p class="mt-1" :class="{'text-xs': comment.parentCommentId}">{{ comment.content }}</p>
                </div>

                <Button
                  v-if="comment.expand?.author && editingComment?.id !== comment.id"
                  variant="ghost"
                  :size="comment.parentCommentId ? 'xs' : 'sm'"
                  :class="{
                    'h-6 px-2 mt-1 text-xs': comment.parentCommentId, 
                    'h-8 px-2 text-sm': !comment.parentCommentId, 
                    'text-muted-foreground': true
                  }"
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
              {{ replyingToComment ? `Replying to @${replyingToComment.expand?.author?.username}` : 'Leave a comment' }}
            </h3>
            <div v-if="replyingToComment" class="p-2 mb-2 text-sm bg-gray-100 border rounded text-muted-foreground dark:bg-gray-800">
              <div class="font-medium">{{ replyingToComment.expand?.author?.username }} wrote:</div>
              <div class="italic">{{ replyingToComment.content }}</div>
            </div>
            <form @submit.prevent="submitComment">
              <Textarea
                v-model="newComment"
                :placeholder="replyingToComment ? `Reply to @${replyingToComment.expand?.author?.username}...` : 'Share your thoughts...'"
                class="min-h-[80px]"
                required
              />
              <div class="flex items-center justify-end mt-3">
                <Button type="button" size="sm" variant="outline" @click="cancelReply" v-if="replyingToComment" class="mr-2">
                  Cancel
                </Button>
                <Button type="submit" size="sm" :disabled="!isAuthenticated">
                  {{ replyingToComment ? 'Post Reply' : 'Post Comment' }}
                </Button>
                <span v-if="!isAuthenticated" class="ml-2 text-xs text-muted-foreground">
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
import { ref, defineProps, defineEmits, computed } from 'vue';
import { formatDate } from '@/composables/blogHelpers';
import useComments from '@/composables/useComments';
import useAuth from '@/composables/useAuth';
import { Pencil, Trash2 } from 'lucide-vue-next';

// Radix UI components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

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
  replies?: Comment[];
}

const props = defineProps({
  post: {
    type: Array as () => Comment[],
    default: () => [],
  },
  id: {
    type: String,
  },
});

const newComment = ref('');
const replyingToComment = ref<Comment | null>(null);
const editingComment = ref<Comment | null>(null);
const editedContent = ref('');

const { user, isAuthenticated } = useAuth();
const { createComment, updateItem, deleteItem } = useComments();

const emit = defineEmits(['comment-created']);
const emitCommentCreated = () => {
  emit('comment-created');
};

const getInitials = (name: string) => {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit' 
  };
  return date.toLocaleDateString(undefined, options);
};

const startReply = (comment: Comment) => {
  if (!comment.expand?.author) return;
  replyingToComment.value = comment;
  newComment.value = `@${comment.expand.author.username} `;
  cancelEdit(); // Cancel any pending edit if replying
};

const cancelReply = () => {
  replyingToComment.value = null;
  newComment.value = '';
};

const startEdit = (comment: Comment) => {
  editingComment.value = comment;
  editedContent.value = comment.content;
  cancelReply(); // Cancel any pending reply if editing
};

const cancelEdit = () => {
  editingComment.value = null;
  editedContent.value = '';
};

const updateComment = async () => {
  if (!editingComment.value) return;
  try {
    await updateItem('comments', editingComment.value.id, { 
      content: editedContent.value 
    });
    editingComment.value = null;
    editedContent.value = '';
    emitCommentCreated();
  } catch (error) {
    console.error('Error updating comment:', error);
  }
};

const deleteComment = async (commentId: string) => {
  if (!confirm('Are you sure you want to delete this comment?')) return;
  try {
    await deleteItem('comments', commentId);
    emitCommentCreated();
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};

const submitComment = async () => {
  if (!user.value?.id) {
    console.error('User is not logged in.');
    return;
  }
  try {
    const parentId = replyingToComment?.value?.id || null;
    await createComment(props.id, newComment.value, user.value.id, parentId);
    newComment.value = '';
    replyingToComment.value = null;
    emitCommentCreated();
  } catch (error) {
    console.error('Error submitting comment:', error);
  }
};

const commentsWithReplies = computed(() => {
  const comments = props.post.map(c => ({ ...c, replies: [] }));
  const lookup = comments.reduce((acc, comment) => {
    acc[comment.id] = comment;
    return acc;
  }, {} as Record<string, Comment & { replies: Comment[] }>);

  comments.forEach(comment => {
    if (comment.parentCommentId && lookup[comment.parentCommentId]) {
      lookup[comment.parentCommentId].replies.push(comment);
    }
  });

  return comments;
});
</script>