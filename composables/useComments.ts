
import type { ListResult, RecordModel } from 'pocketbase';

export default function useComments() {
  const { 
    fetchCollection, 
    createItem,
    getCacheKey,
  } = usePocketBaseCore();

  /**
   * Fetch comments for a specific post with caching
   */
  async function fetchPostComments(
    postId: string,
    page = 1,
    perPage = 20,
    sort = '-created'
  ): Promise<ListResult<RecordModel>> {
    return fetchCollection(
      'comments', 
      page, 
      perPage, 
      `post = "${postId}"`, 
      sort, 
      'author'
    );
  }

  /**
   * Create a new comment with cache invalidation
   */
  async function createComment(
    postId: string,
    content: string,
    authorId: string
  ): Promise<RecordModel> {
    const comment = await createItem('comments', {
      content,
      post: postId,
      author: authorId
    });

    // Invalidate cache for this post's comments
    const cacheKeyPattern = getCacheKey('fetchCollection', {
      collection: 'comments',
      filter: `post = "${postId}"`
    });

    return comment;
  }

  return {
    fetchPostComments,
    createComment
  };
}