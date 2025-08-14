import usePocketBaseCore from './usePocketBaseCore';
import usePocketBase from './usePocketbase';
import { useCacheUtils } from './cacheUtils';
import { ListResult, RecordModel } from 'pocketbase'; // Assuming these types are available

// You might rename the file to useBusinesses.ts
export default function useBusinesses() {
  const { fetchCollection, fetchRecord, uploadFile } = usePocketBaseCore();
  const pb = usePocketBase();
  const { getCacheKey, get, set, del, clearAll } = useCacheUtils({
    ttl: 60 * 60 * 1000, // 1 hour
    namespace: 'businesses', // Changed namespace from 'posts' to 'businesses'
  });

  // This function can remain generic as slugs are generated similarly
  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Adapted to fetch multiple businesses
  async function fetchBusinesses(options: {
    page?: number;
    perPage?: number;
    filter?: string;
    sort?: string;
    expand?: string;
    // You might add specific business filters here, e.g., categoryId?: string;
  } = {}): Promise<ListResult<RecordModel>> {
    const defaults = {
      page: 1,
      perPage: 10,
      filter: '',
      sort: '-created',
      expand: 'category',
    };

    const { page, perPage, filter, sort, expand } = { ...defaults, ...options };
    // Add any specific business filters here if needed
    let finalFilter = filter;

    const cacheKey = getCacheKey('fetchBusinesses', { page, perPage, filter: finalFilter, sort, expand });

    const cached = get<ListResult<RecordModel>>(cacheKey);
    if (cached) return cached;

    // Changed collection name from 'posts' to 'businesses'
    const result = await fetchCollection('businesses', page, perPage, finalFilter, sort, expand);
    set(cacheKey, result);
    return result;
  }

  // This is the core function adapted for fetching a single business by slug
  async function fetchBusinessBySlug(slug: string, useCache = true): Promise<RecordModel> {
    const cacheKey = getCacheKey('fetchBusinessBySlug', { slug });

    const cached = get<RecordModel>(cacheKey);
    if (cached && useCache) return cached;

    try {
      // Changed collection name from 'posts' to 'businesses'
      // Changed expand from 'author,comments_via_post.author' to 'category'
      const business = await pb.collection('businesses').getFirstListItem(`slug = "${slug}"`, {
        expand: 'category',
      });
      set(cacheKey, business);
      return business;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  }

  // You would also need to adapt createPost, updatePost, deletePost, and fetchAllTags
  // to work with 'businesses' and their specific fields (e.g., no 'tags' field
  // directly on 'businesses' but a 'category' field)

  // Example adaptation for createBusiness (assuming you have a category ID to link)
  async function createBusiness(businessData: {
    name_en: string;
    name_es: string;
    description_en?: string;
    description_es?: string;
    category: string; // Assuming this is the ID of the category
    // Add other fields like location, address, contact_info, socials, etc.
    cover_image?: File; // If you have a primary image for the business itself
  }): Promise<RecordModel> {
    if (!pb.authStore.model) throw new Error('Authentication required');

    try {
      const business = await pb.collection('businesses').create({
        ...businessData,
        slug: generateSlug(businessData.name_en), // Or name_es, choose consistently
      });

      // Invalidate relevant caches
      clearAll(); // A broad invalidate for simplicity, refine as needed

      if (businessData.cover_image) {
        // Assuming 'cover_image' is a file field name in 'businesses'
        return await uploadFile(businessData.cover_image, 'businesses', business.id, 'cover_image');
      }

      return business;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }

  async function fetchAllCategories(): Promise<RecordModel[]> {
    const cacheKey = getCacheKey('fetchAllCategories');
    const cached = get<RecordModel[]>(cacheKey);
    if (cached) return cached;

    try {
      // Fetch all category records
      const result = await pb.collection('categories').getFullList({
        sort: 'name_en',
      });
      set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }


  return {
    fetchBusinesses,
    fetchBusinessBySlug,
    createBusiness,
    fetchAllCategories, 
    generateSlug,
  };
}