import usePocketBase from "../../../composables/usePocketbase";
export default defineNuxtRouteMiddleware((to) => {
  // Only guard staff routes. Adjust this list to match your staff pages.
  const staffPaths = [
    "/inicio",
    "/checklists",
    "/socios",
    "/orders",
    "/promos-dashboard",
    "/labels",
    "/menu-items",
    "/store-items",
    "/semana/menu",
    "/semana/calendario",
  ];
  const isStaff = staffPaths.some(
    (p) => to.path === p || to.path.startsWith(p + "/"),
  );
  if (!isStaff) return;

  // authStore lives in localStorage — invisible to the server. Gate on client
  // only, or SSR bounces even logged-in staff.
  if (import.meta.server) return;

  const pb = usePocketBase();
  if (!pb.authStore.isValid) {
    return navigateTo(`/login?source=${encodeURIComponent(to.fullPath)}`);
  }
});
