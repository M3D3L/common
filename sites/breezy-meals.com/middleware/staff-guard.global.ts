import usePocketBase from "../../../composables/usePocketbase";
export default defineNuxtRouteMiddleware((to) => {
  const isStaffRoute = to.meta.layout === "staff" || to.meta.staffOnly === true;
  if (!isStaffRoute) return;

  // authStore lives in localStorage — invisible to the server. Gate on client
  // only, or SSR bounces even logged-in staff.
  if (import.meta.server) return;

  const pb = usePocketBase();
  if (!pb.authStore.isValid) {
    pb.authStore.clear();
    return navigateTo(`/login?source=${encodeURIComponent(to.fullPath)}`);
  }
});
