import usePocketBase from "@common/composables/usePocketbase";

export default defineNuxtRouteMiddleware((to) => {
  // Only protect the orders route (and its children, e.g. /orders/123).
  if (!to.path.startsWith("/orders") || to.path === "/labels") return;

  const pb = usePocketBase();

  if (!pb.authStore.isValid) {
    return navigateTo({ path: "/login", query: { source: to.fullPath } });
  }
});
