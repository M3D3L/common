import PocketBase from 'pocketbase';

export default function usePocketBase() {
    // Get runtime configuration
    const config = useRuntimeConfig();
    
    // Create PocketBase instance using the URL from runtime config
    const pb = new PocketBase(config.public.pocketbaseUrl);

    // Optional: Add auto-refresh for expired auth tokens
    // pb.autoCancellation(false);

    return pb;
}