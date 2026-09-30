<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute();
const { loadReferralPartner } = useReferralPartner();

onMounted(() => loadReferralPartner());

watch(
  () => route.query.ref,
  () => loadReferralPartner(),
);

// Check if the code is running in a browser environment
if (process.client) {
  watch(
    () => route.fullPath,
    () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  );
}
</script>
