<template>
  <section>
    <SeoMeta :follow="false" />
    <div class="no-print text-center mb-5">
      <h1 class="font-black text-lg tracking-[0.2em] uppercase mb-0.5 mt-8">
        Breezy Meals
      </h1>
      <p class="text-neutral-500 text-[8px] tracking-widest uppercase">
        Nutritional Labels
      </p>
    </div>

    <BreezyLabels :labelData="labelData" />
  </section>
</template>

<script lang="ts" setup>
import BreezyLabels from "~/components/atoms/BreezyLabels.vue";
import { useNutritionalLabels } from "~/composables/useNutritionalLabels";

definePageMeta({
  layout: "none",
});

const { fetchCollection } = usePocketBaseCore();
const { transformRecord } = useNutritionalLabels();

const labelData = ref<any[]>([]);

const fetchLabels = async () => {
  try {
    const result = await fetchCollection(
      "labels",
      1,
      200,
      "",
      "-created",
      "",
      null,
      true,
    );

    labelData.value = (result?.items ?? []).map(transformRecord);
  } catch (error) {
    console.error("Error fetching labels:", error);
    labelData.value = [];
  }
};

onMounted(() => {
  fetchLabels();
});
</script>
