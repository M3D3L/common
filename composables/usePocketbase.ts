import PocketBase from "pocketbase";
import { useRuntimeConfig, useState } from "#app";

export default function usePocketBase() {
  // Get runtime configuration
  const config = useRuntimeConfig();

  // Share ONE PocketBase instance across the app: per-request on the server
  // (so one user's auth never leaks into another's), per-tab on the client.
  // Without this, every caller gets its own authStore, so login events never
  // reach other consumers like the header.
  const pb = useState<PocketBase>("pocketbase_instance", () => {
    const instance = new PocketBase(config.public.pocketbaseUrl);

    // Optional: Add auto-refresh for expired auth tokens
    // instance.autoCancellation(false);

    return instance;
  });

  return pb.value;
}
