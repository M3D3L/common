import usePocketBaseCore from './usePocketBaseCore';
// import { useCacheUtils } from './cacheUtils'; // <-- REMOVED
import type { ListResult, RecordModel } from 'pocketbase';

export default function useBusinesses() {
  // Only destructure the necessary PocketBase functions
  const { fetchCollection, uploadFile, createItem } = usePocketBaseCore();

  // --- Utility Function ---

  const generateSlug = (title: string): string =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // --- Fetch and Mutate Functions ---

  const fetchBusinesses = async (options: {
    page?: number;
    perPage?: number;
    filter?: string;
    sort?: string;
    expand?: string;
  } = {}): Promise<ListResult<RecordModel>> => {
    const defaults = {
      page: 1,
      perPage: 10,
      filter: '',
      sort: '-created',
      expand: 'category',
    };

    const { page, perPage, filter, sort, expand } = { ...defaults, ...options };
    const finalFilter = filter;

    // Direct call to fetchCollection (caching handled inside usePocketBaseCore)
    try {
      return await fetchCollection('businesses', page, perPage, finalFilter, sort, expand);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  };

  const fetchBusinessBySlug = async (slug: string): Promise<RecordModel> => {
    // This logic relies on fetchCollection which handles caching.
    try {
      // Use fetchCollection with slug filter to get the single item
      const listResult = await fetchCollection(
        'businesses', 
        1, // page
        1, // perPage
        `slug = "${slug}"`, // filter
        '', // sort
        'category' // expand
      );

      if (listResult.items.length === 0) {
        throw new Error('Business not found');
      }

      return listResult.items[0];
    } catch (error) {
      console.error('Error fetching business by slug:', error);
      throw error;
    }
  };

  const createBusiness = async (businessData: {
    name_en: string;
    name_es: string;
    description_en?: string;
    description_es?: string;
    category: string;
    cover_image?: File;
  }): Promise<RecordModel> => {
    try {
      const dataToCreate = {
        ...businessData,
        slug: generateSlug(businessData.name_en),
      };

      const business = await createItem('businesses', dataToCreate);

      if (businessData.cover_image) {
        const fileUrl = await uploadFile(businessData.cover_image, 'businesses', business.id, 'cover_image');
        // Optionally, fetch the updated business record after file upload
        const updatedBusiness = await fetchCollection(
          'businesses',
          1,
          1,
          `id = "${business.id}"`,
          '',
          'category'
        );
        return updatedBusiness.items[0];
      }

      return business;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  };

  const fetchAllCategories = async (): Promise<RecordModel[]> => {
    // This logic relies on fetchCollection which handles caching.
    try {
      const result = await fetchCollection(
        'categories', 
        1, // page
        500, // very high perPage to simulate getFullList
        '', // filter
        'name_en' // sort
      );

      return result.items;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  return {
    fetchBusinesses,
    fetchBusinessBySlug,
    createBusiness,
    fetchAllCategories,
    generateSlug,
  };
}