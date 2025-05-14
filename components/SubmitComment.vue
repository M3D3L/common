<template>
    <!-- Comments Section -->
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
                    <div v-for="comment in post" :key="comment.id" class="flex gap-4">
                        <Avatar>
                            <AvatarImage 
                                v-if="comment.expand?.author?.avatar" 
                                :src="comment.expand.author.avatar" 
                                :alt="comment.expand.author.username || 'Anonymous'"
                                width="40" 
                                height="40" 
                            />
                            <AvatarFallback>
                                {{ getInitials(comment.expand?.author?.username || 'Anon') }}
                            </AvatarFallback>
                        </Avatar>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h4 class="font-medium">
                                    {{ comment.expand?.author?.username || 'Anonymous' }}
                                </h4>
                                <time :datetime="comment.created" class="text-sm text-muted-foreground">
                                    {{ formatRelativeDate(comment.created)?.[1] }}
                                </time>
                            </div>
                            <p class="mt-1 text-sm">{{ comment.content }}</p>
                            <Button 
                                v-if="comment.expand?.author"
                                variant="ghost" 
                                size="sm" 
                                class="h-8 px-2 mt-2 text-muted-foreground"
                                @click="replyToComment(comment)"
                            >
                                Reply
                            </Button>
                        </div>
                    </div>

                    <Separator class="my-4" />

                    <div class="space-y-4">
                        <h3 class="text-lg font-medium">Leave a comment</h3>
                        <form @submit.prevent="submitComment">
                            <Textarea v-model="newComment" placeholder="Share your thoughts..." class="min-h-[120px]"
                                required />
                            <div class="flex justify-end mt-3">
                                <Button type="submit" size="sm">
                                    Post Comment
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/composables/blogHelpers'

interface Author {
  id: string
  username: string
  avatar: string
  bio?: string
  social?: {
    name: string
    url: string
    icon: string
  }[]
}

interface Comment {
  id: string
  content: string
  created: string
  updated: string
  post: string
  author: string
  expand: {
    author?: Author
  }
}

const props = defineProps({
    post: {
        type: Array as () => Comment[],
        required: true,
        default: () => []
    },
    id: {
        type: String,
        required: true
    }
});

const newComment = ref('')
const replyingTo = ref<Author | null>(null)

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(dateString)
}

const replyToComment = (comment: Comment) => {
  if (!comment.expand?.author) return;
  
  replyingTo.value = comment.expand.author
  newComment.value = `@${comment.expand.author.username} `
  scrollToComments()
}

const scrollToComments = () => {
  const commentsSection = document.getElementById('comments')
  if (commentsSection) {
    commentsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const { createComment } = useComments();

const emit = defineEmits(['comment-created'])
const emitCommentCreated = () => {
    emit('comment-created')
}

const submitComment = async () => {
    try {
        await createComment(props.id, newComment.value)
        newComment.value = ''
        replyingTo.value = null
        emitCommentCreated()
    } catch (error) {
        console.error('Error submitting comment:', error)
    }
}
</script>