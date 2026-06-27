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
        <Button variant="outline" size="sm" @click="toggle('create')">
          <UtensilsCrossed class="w-4 h-4 mr-2" />
          Generar nueva etiqueta
        </Button>

        <Button variant="secondary" size="sm" @click="toggleLabelType">
          <Layers class="w-4 h-4 mr-2" />
          {{ labelType === "round" ? "Ver Estándar" : "Ver Redonda" }}
        </Button>
      </div>
    </div>

    <!-- Labels Grid -->
    <div
      v-if="labelType === 'round'"
      class="flex flex-wrap gap-6 container mx-auto"
    >
      <div
        v-for="(label, index) in labelData"
        :key="label.id || index"
        class="mb-4"
      >
        <OrganismsRoundGrid
          @edit="toggle('edit', label.id)"
          :labelData="[label]"
        />
      </div>
    </div>
    <div v-else class="flex flex-wrap gap-4 container mx-auto">
      <div
        v-for="(label, index) in labelData"
        :key="label.id || index"
        class="mb-4"
      >
        <OrganismsLabelGrid
          @edit="toggle('edit', label.id)"
          :labelData="[label]"
        />
      </div>
    </div>

    <!-- Label Modal -->
    <OrganismsLabelModal
      ref="createModalRef"
      :selectedLabel
      :type
      @created="labelData.unshift($event)"
    />
  </section>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { UtensilsCrossed, Layers } from "lucide-vue-next";
import { useNutritionalLabels } from "~/composables/useNutritionalLabels";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";

definePageMeta({ layout: "none" });

const { fetchCollection } = usePocketBaseCore();
const { transformRecord } = useNutritionalLabels();

// ─── State ────────────────────────────────────────────────────────────────────
const labelData = ref<any[]>([]);
const labelType = ref<"round" | "standard">("round");
const createModalRef = ref<any>(null);
const selectedLabel = ref<any | null>(null);
const type = ref<"create" | "edit">("create");

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toggleLabelType = () => {
  labelType.value = labelType.value === "round" ? "standard" : "round";
};

// ─── Data fetching ────────────────────────────────────────────────────────────
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

const toggle = async (action: "create" | "edit", id: any = null) => {
  if (id && action === "edit") {
    selectedLabel.value = labelData.value.find((l) => l.id === id) || null;
  } else {
    selectedLabel.value = null;
  }

  type.value = action;

  // Wait for Vue to flush the state change down to the modal component's props
  await nextTick();

  if (createModalRef.value) {
    createModalRef.value.open(selectedLabel.value);
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");
</style>
