import usePocketBaseCore from './usePocketBaseCore'
import usePocketBase from './usePocketbase'
import type { ListResult, RecordModel } from 'pocketbase'

export default function usePosts() {
  const { fetchCollection, createItem, updateItem, deleteItem, uploadFile } = usePocketBaseCore()
  const pb = usePocketBase()

  const generateSlug = (title: string): string =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const fetchPosts = async ({
    page = 1,
    perPage = 10,
    filter = '',
    sort = '-created',
    expand = 'author',
    author,
    tag,
  }: {
    page?: number
    perPage?: number
    filter?: string
    sort?: string
    expand?: string
    author?: string
    tag?: string
  } = {}): Promise<ListResult<RecordModel>> => {
    let finalFilter = filter
    if (author) finalFilter += (finalFilter ? ' && ' : '') + `author="${author}"`
    if (tag) finalFilter += (finalFilter ? ' && ' : '') + `tags ?~ "${tag}"`

    return fetchCollection('posts', page, perPage, finalFilter, sort, expand)
  }

  const fetchPostBySlug = async (slug: string, type: string): Promise<RecordModel> =>
    pb.collection(type).getFirstListItem(`slug="${slug}"`, {
      expand: 'author,comments_via_post.author',
    })

  const createPost = async ({
    title,
    content,
    description,
    video,
    tags = [],
    cover_image,
  }: {
    title: string
    content: string
    description?: string
    video?: string
    tags?: string[]
    cover_image?: File
  }): Promise<RecordModel> => {
    if (!pb.authStore.model) throw new Error('Authentication required')

    const post = await createItem('posts', {
      title,
      content,
      description,
      video,
      tags,
      author: pb.authStore.model.id,
      slug: generateSlug(title),
    })

    return cover_image
      ? uploadFile(cover_image, 'posts', post.id, 'cover_image')
      : post
  }

  const updatePost = async (
    id: string,
    {
      title,
      content,
      description,
      video,
      tags,
      cover_image,
    }: {
      title?: string
      content?: string
      description?: string
      video?: string
      tags?: string[]
      cover_image?: File
    },
  ): Promise<RecordModel> => {
    if (!pb.authStore.model) throw new Error('Authentication required')

    const payload: Record<string, any> = {
      ...(title && { title, slug: generateSlug(title) }),
      ...(content && { content }),
      ...(description && { description }),
      ...(video && { video }),
      ...(tags && { tags }),
    }

    const post = await updateItem('posts', id, payload)

    return cover_image
      ? uploadFile(cover_image, 'posts', id, 'cover_image')
      : post
  }

  const removePost = async (id: string): Promise<boolean> => {
    if (!pb.authStore.model) throw new Error('Authentication required')
    return deleteItem('posts', id)
  }

  return {
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost: removePost,
    generateSlug,
  }
}
