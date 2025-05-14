import PocketBase from 'pocketbase';

export default function usePocketBase() {
    // Use environment variable for the PocketBase URL
    const config = useRuntimeConfig();
    const pb = new PocketBase('http://127.0.0.1:8090');

    // Optional: Add auto-refresh for expired auth tokens
    // pb.autoCancellation(false);

    return pb;
}