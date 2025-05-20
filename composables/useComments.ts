// useComments.ts
import type { RecordModel } from 'pocketbase';
import usePocketBase from './usePocketbase';

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

export default function useComments() {
  const pb = usePocketBase();

  async function createItem(collection: string, data: any): Promise<RecordModel> {
    try {
      return await pb.collection(collection).create(data);
    } catch (error) {
      console.error(`Error creating item in ${collection}:`, error);
      throw error;
    }
  }

  async function updateItem(collection: string, id: string, data: any): Promise<RecordModel> {
    try {
      return await pb.collection(collection).update(id, data);
    } catch (error) {
      console.error(`Error updating item in ${collection} (${id}):`, error);
      throw error;
    }
  }

  async function deleteItem(collection: string, id: string): Promise<void> {
    try {
      await pb.collection(collection).delete(id);
    } catch (error) {
      console.error(`Error deleting item in ${collection} (${id}):`, error);
      throw error;
    }
  }

  async function fetchList(
    collection: string,
    page = 1,
    perPage = 30,
    filter = '',
    sort = ''
  ): Promise<{ items: RecordModel[]; totalItems: number; totalPages: number }> {
    try {
      const result = await pb.collection(collection).getList(page, perPage, { filter, sort });
      return {
        items: result.items,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      };
    } catch (error) {
      console.error(`Error fetching list from ${collection}:`, error);
      throw error;
    }
  }

  async function fetchSingle(collection: string, id: string, expand = ''): Promise<RecordModel> {
    try {
      return await pb.collection(collection).getOne(id, { expand });
    } catch (error) {
      console.error(`Error fetching single item from ${collection} (${id}):`, error);
      throw error;
    }
  }

  async function fetchPostComments(postId: string): Promise<Comment[]> {
  try {
    const records = await pb.collection('comments').getFullList({
      filter: `post = "${postId}"`,
      sort: '-created',
      expand: 'author',
    }) as Comment[];

    // Function to recursively fetch parent comments and their authors
    async function expandParent(comment: Comment): Promise<Comment> {
      if (comment.parentCommentId) {
        try {
          const parent = await pb.collection('comments').getOne(comment.parentCommentId, {
            expand: 'author',
          }) as Comment & { expand?: { author?: Author } };
          comment.expand = { ...comment.expand, parentComment: parent };
          if (parent.parentCommentId && parent.expand) {
            parent.expand.parentComment = await expandParent(parent);
          }
        } catch (error) {
          console.error('Error fetching parent comment:', error);
        }
      }
      return comment;
    }

    // Expand parent comments for all records
    const expandedRecords = await Promise.all(records.map(expandParent));

    // Structure the comments with their replies
    const commentsWithReplies = expandedRecords.map(comment => ({
      ...comment,
      replies: expandedRecords.filter(reply => reply.parentCommentId === comment.id)
    }));

    return commentsWithReplies.filter(comment => !comment.parentCommentId);
  } catch (error) {
    console.error('Error fetching post comments:', error);
    return [];
  }
}

  async function createComment(
    postId: string,
    content: string,
    authorId: string,
    parentCommentId: string | null = null
  ): Promise<RecordModel> {
    const data: {
      content: string;
      post: string;
      author: string;
      parentCommentId?: string | null;
    } = {
      content,
      post: postId,
      author: authorId,
    };

    if (parentCommentId) {
      data.parentCommentId = parentCommentId;
    }

    try {
      const comment = await createItem('comments', data);
      return comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async function fetchUser(userId: string) {
    try {
      return await fetchSingle('users', userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  return {
    pb,
    createItem,
    updateItem,
    deleteItem,
    fetchList,
    fetchSingle,
    fetchPostComments,
    createComment,
    fetchUser,
  };
}