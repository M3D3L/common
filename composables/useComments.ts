import type { RecordModel } from "pocketbase";
import usePocketBase from "./usePocketbase";

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

  async function createItem(
    collection: string,
    data: any
  ): Promise<RecordModel> {
    try {
      return await pb.collection(collection).create(data);
    } catch (error) {
      console.error(`Error creating item in ${collection}:`, error);
      throw error;
    }
  }

  async function updateItem(
    collection: string,
    id: string,
    data: any
  ): Promise<RecordModel> {
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

  async function fetchComments(postId: string): Promise<Comment[]> {
    try {
      const comments = await pb
        .collection("comments")
        .getFullList<Comment>(200, {
          filter: `post="${postId}"`,
          expand: "author,parentComment.author,replies.author",
          sort: "-created",
        });
      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
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
      const comment = await createItem("comments", data);
      return comment;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  return {
    pb,
    createItem,
    updateItem,
    deleteItem,
    createComment,
    fetchComments,
  };
}
