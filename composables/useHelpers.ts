export default function useHelpers() {
    /**
     * Generate a slug from title
     */
    function generateSlug(title: string): string {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  
    return {
      generateSlug
    };
  }