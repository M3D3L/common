export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/orders" || to.path.startsWith("/orders/")) {
    return navigateTo(
      { path: "/menu", query: to.query },
      { redirectCode: 301 },
    );
  }
});
