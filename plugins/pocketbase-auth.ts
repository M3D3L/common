import usePocketBase from "@common/composables/usePocketbase";

export default defineNuxtPlugin(() => {
  const pb = usePocketBase();

  const cookie = import.meta.server
    ? useRequestHeaders(["cookie"]).cookie || ""
    : document.cookie;

  pb.authStore.loadFromCookie(cookie);
});
