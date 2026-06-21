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

      <div class="mt-4 flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          @click="router.push('/label-generator')"
        >
          <UtensilsCrossed class="w-4 h-4 mr-2" />
          Generar nueva etiqueta
        </Button>

        <Button variant="secondary" size="sm" @click="toggleLabelType">
          <Layers class="w-4 h-4 mr-2" />
          {{ labelType === "round" ? "Ver Estándar" : "Ver Redonda" }}
        </Button>
      </div>
    </div>

    <RoundLabel
      v-if="labelType === 'round'"
      :labelData="labelData"
      class="mb-4"
    />
    <BreezyLabels v-else :labelData="labelData" />
  </section>
</template>

<script lang="ts" setup>
import BreezyLabels from "~/components/atoms/BreezyLabels.vue";
import RoundLabel from "~/components/atoms/RoundLabel.vue";
import { useNutritionalLabels } from "~/composables/useNutritionalLabels";
import { Button } from "@common/components/ui/button";
import { UtensilsCrossed, Layers } from "lucide-vue-next"; // Added Layers icon

definePageMeta({
  layout: "none",
});

const router = useRouter();
const { fetchCollection } = usePocketBaseCore();
const { transformRecord } = useNutritionalLabels();

const labelData = ref<any[]>([]);
const labelType = ref<"round" | "standard">("round");

// Simple function to toggle between types
const toggleLabelType = () => {
  labelType.value = labelType.value === "round" ? "standard" : "round";
};

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
