import usePocketBaseCore from "./usePocketBaseCore";
import type { ListResult, RecordModel } from "pocketbase";

export default function usePosts() {
  const {
    fetchCollection,
    createItem,
    updateItem,
    deleteItem,
    uploadFile,
    user,
  } = usePocketBaseCore();

  const generateSlug = (title: string): string =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const fetchPosts = async ({
    page = 1,
    perPage = 10,
    filter = "",
    sort = "-created",
    expand = "author",
    author,
    tag,
  }: {
    page?: number;
    perPage?: number;
    filter?: string;
    sort?: string;
    expand?: string;
    author?: string;
    tag?: string;
  } = {}): Promise<ListResult<RecordModel>> => {
    let finalFilter = filter;
    if (author)
      finalFilter += (finalFilter ? " && " : "") + `author="${author}"`;
    if (tag) finalFilter += (finalFilter ? " && " : "") + `tags ?~ "${tag}"`;

    return fetchCollection("posts", page, perPage, finalFilter, sort, expand);
  };

  /**
   * Fetches a single post by slug with caching via fetchCollection
   */
  const fetchPostBySlug = async (
    slug: string,
    type: string
  ): Promise<RecordModel> => {
    const result = await fetchCollection(
      type,
      1,
      1,
      `slug="${slug}"`,
      "-created",
      "author,comments_via_post.author"
    );

    if (!result.items.length) {
      throw new Error(`Post not found: ${slug}`);
    }

    return result.items[0];
  };

  const createPost = async (data: {
    title: string;
    content: string;
    description?: string;
    video?: string;
    tags?: string[];
    cover_image?: File;
  }): Promise<RecordModel> => {
    if (!user) throw new Error("Authentication required");

    const post = await createItem("posts", {
      ...data,
      author: user.id,
      slug: generateSlug(data.title),
    });

    if (data.cover_image) {
      return uploadFile(data.cover_image, "posts", post.id, "cover_image");
    }

    return post;
  };

  const updatePost = async (
    id: string,
    data: {
      title?: string;
      content?: string;
      description?: string;
      video?: string;
      tags?: string[];
      cover_image?: File;
    }
  ): Promise<RecordModel> => {
    if (!user) throw new Error("Authentication required");

    const payload: Record<string, any> = {
      ...data,
      ...(data.title && { slug: generateSlug(data.title) }),
    };

    const post = await updateItem("posts", id, payload);

    if (data.cover_image) {
      return uploadFile(data.cover_image, "posts", id, "cover_image");
    }

    return post;
  };

  const removePost = async (id: string): Promise<boolean> => {
    if (!user) throw new Error("Authentication required");
    return deleteItem("posts", id);
  };

  return {
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost: removePost,
    generateSlug,
  };
}
