import usePocketBaseCore from './usePocketBaseCore'
import usePocketBase from './usePocketbase'
import { useCacheUtils } from './cacheUtils'

export default function usePosts() {
  const { fetchCollection, fetchRecord, uploadFile } = usePocketBaseCore()
  const pb = usePocketBase()
  const { getCacheKey, get, set, del, clearAll } = useCacheUtils({
    ttl: 60 * 60 * 1000, // 1 hour
    namespace: 'posts',
  })

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function fetchPosts(options: {
    page?: number
    perPage?: number
    filter?: string
    sort?: string
    expand?: string
    author?: string
    tag?: string
  } = {}): Promise<ListResult<RecordModel>> {
    const defaults = {
      page: 1,
      perPage: 10,
      filter: '',
      sort: '-created',
      expand: 'author'
    }

    const { page, perPage, filter, sort, expand, author, tag } = { ...defaults, ...options }

    let finalFilter = filter
    if (author) {
      finalFilter += (finalFilter ? ' && ' : '') + `author = "${author}"`
    }
    if (tag) {
      finalFilter += (finalFilter ? ' && ' : '') + `tags ?~ "${tag}"`
    }

    const cacheKey = getCacheKey('fetchPosts', { page, perPage, filter: finalFilter, sort, expand })

    const cached = get<ListResult<RecordModel>>(cacheKey)
    if (cached) return cached

    const result = await fetchCollection('posts', page, perPage, finalFilter, sort, expand)
    set(cacheKey, result)
    return result
  }

  async function fetchPostBySlug(slug: string, useCache = true): Promise<RecordModel> {
    const cacheKey = getCacheKey('fetchPostBySlug', { slug })

    const cached = get<RecordModel>(cacheKey)
    if (cached && useCache) return cached

    try {
      const post = await pb.collection('posts').getFirstListItem(`slug = "${slug}"`, {
        expand: 'author,comments_via_post.author'
      })
      set(cacheKey, post)
      return post
    } catch (error) {
      console.error('Error fetching post:', error)
      throw error
    }
  }

  async function createPost(postData: {
    title: string
    content: string
    description?: string
    video?: string
    tags?: string[]
    cover_image?: File
  }): Promise<RecordModel> {
    if (!pb.authStore.model) throw new Error('Authentication required')

    try {
      const post = await pb.collection('posts').create({
        ...postData,
        author: pb.authStore.model.id,
        slug: generateSlug(postData.title),
        tags: postData.tags || []
      })

      // Invalidate
      del(getCacheKey('fetchAllTags'))
      clearAll()

      if (postData.cover_image) {
        return await uploadFile(postData.cover_image, 'posts', post.id, 'cover_image')
      }

      return post
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  async function updatePost(
    postId: string,
    postData: {
      title?: string
      content?: string
      description?: string
      video?: string
      tags?: string[]
      cover_image?: File
    }
  ): Promise<RecordModel> {
    if (!pb.authStore.model) throw new Error('Authentication required')

    try {
      let updateData = { ...postData }
      if (updateData.title) {
        updateData.slug = generateSlug(updateData.title)
      }

      const post = await pb.collection('posts').update(postId, updateData)

      del(getCacheKey('fetchAllTags'))
      del(getCacheKey('fetchPostBySlug', { slug: post.slug }))
      clearAll()

      if (postData.cover_image) {
        return await uploadFile(postData.cover_image, 'posts', postId, 'cover_image')
      }

      return post
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  async function deletePost(postId: string): Promise<boolean> {
    if (!pb.authStore.model) throw new Error('Authentication required')

    try {
      const post = await pb.collection('posts').getOne(postId)
      await pb.collection('posts').delete(postId)

      del(getCacheKey('fetchAllTags'))
      del(getCacheKey('fetchPostBySlug', { slug: post.slug }))
      clearAll()

      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  async function fetchAllTags(): Promise<string[]> {
    const cacheKey = getCacheKey('fetchAllTags')
    const cached = get<string[]>(cacheKey)
    if (cached) return cached

    try {
      const result = await pb.collection('posts').getList(1, 500, {
        fields: 'tags'
      })

      const allTags = new Set<string>()
      result.items.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => allTags.add(tag))
        }
      })

      const tagsArray = Array.from(allTags)
      set(cacheKey, tagsArray)
      return tagsArray
    } catch (error) {
      console.error('Error fetching tags:', error)
      throw error
    }
  }

  return {
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost,
    fetchAllTags,
    generateSlug
  }
}
