<template>
  <section class="min-h-screen">
    <SeoMeta :follow="false" />

    <header
      class="no-print sticky top-0 z-20 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm"
    >
      <div
        class="max-w-6xl mx-auto px-4 min-h-14 py-3 md:py-0 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4"
      >
        <div
          class="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0"
            >
              <UtensilsCrossed
                class="w-4 h-4 text-white dark:text-neutral-900"
              />
            </div>
            <div class="leading-none">
              <p
                class="text-[11px] text-neutral-400 tracking-widest uppercase font-medium"
              >
                Breezy Meals
              </p>
              <h1
                class="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight"
              >
                Nutritional Labels
              </h1>
            </div>
          </div>

          <Tabs
            :default-value="labelType"
            @update:model-value="labelType = $event as any"
            class="no-print md:hidden"
          >
            <TabsList>
              <TabsTrigger value="round" class="gap-1.5 px-2.5 h-8">
                <CircleDot class="w-3.5 h-3.5" />
              </TabsTrigger>
              <TabsTrigger value="standard" class="gap-1.5 px-2.5 h-8">
                <RectangleVertical class="w-3.5 h-3.5" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div
          class="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end"
        >
          <Badge variant="secondary" class="hidden sm:inline-flex shrink-0">
            {{ filteredLabels.length }}
            {{ filteredLabels.length === 1 ? "label" : "labels" }}
          </Badge>

          <div class="relative w-full md:w-44">
            <Search
              class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search labels…"
              class="pl-8 h-8 w-full text-sm"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <X class="w-3 h-3" />
            </button>
          </div>

          <Tabs
            :default-value="labelType"
            @update:model-value="labelType = $event as any"
            class="no-print hidden md:block"
          >
            <TabsList>
              <TabsTrigger value="round" class="gap-1.5">
                <CircleDot class="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="standard" class="gap-1.5">
                <RectangleVertical class="w-3 h-3" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6 md:py-8">
      <div
        v-if="!loading && labelData.length === 0"
        class="flex flex-col items-center justify-center text-center py-16 md:py-24 gap-4"
      >
        <div
          class="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
        >
          <UtensilsCrossed class="w-6 h-6 text-neutral-400" />
        </div>
        <div>
          <p class="font-semibold text-neutral-800 dark:text-neutral-200">
            No labels yet
          </p>
          <p class="text-sm text-neutral-400 mt-1">
            Create your first nutritional label to get started.
          </p>
        </div>
        <Button @click="toggle('create')" size="sm">
          <Plus class="w-4 h-4 mr-1.5" /> New label
        </Button>
      </div>

      <div
        v-else-if="!loading && filteredLabels.length === 0"
        class="flex flex-col items-center justify-center text-center py-16 md:py-24 gap-4"
      >
        <div
          class="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
        >
          <Search class="w-6 h-6 text-neutral-400" />
        </div>
        <div>
          <p class="font-semibold text-neutral-800 dark:text-neutral-200">
            No results for "{{ searchQuery }}"
          </p>
          <p class="text-sm text-neutral-400 mt-1">
            Try a different name or clear the search.
          </p>
        </div>
        <Button variant="outline" size="sm" @click="searchQuery = ''">
          Clear search
        </Button>
      </div>

      <div
        v-else-if="loading"
        class="flex flex-wrap justify-center sm:justify-start gap-4 md:gap-5"
      >
        <BaseSkeleton
          v-for="n in 4"
          :key="n"
          class="rounded-xl w-[160px] h-[220px]"
        />
      </div>

      <div
        v-else-if="labelType === 'round'"
        class="flex flex-wrap justify-center sm:justify-start gap-4 md:gap-6"
      >
        <div v-for="(label, index) in filteredLabels" :key="label.id || index">
          <OrganismsRoundGrid
            @edit="toggle('edit', label.id)"
            :labelData="[label]"
          />
        </div>
      </div>

      <div
        v-else
        class="flex flex-wrap justify-center sm:justify-start gap-4 md:gap-5"
      >
        <div v-for="(label, index) in filteredLabels" :key="label.id || index">
          <OrganismsLabelGrid
            @edit="toggle('edit', label.id)"
            :labelData="[label]"
          />
        </div>
      </div>
    </main>

    <Button
      class="no-print fixed bottom-6 right-6 shadow-lg gap-2 z-10 md:bottom-8 md:right-8"
      @click="toggle('create')"
    >
      <Plus class="w-5 h-5" />
      <span class="inline">New label</span>
    </Button>

    <OrganismsModalLabels
      ref="createModalRef"
      :selectedLabel
      :type
      @created="labelData.unshift($event)"
    />
  </section>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Input } from "@common/components/ui/input";
import BaseSkeleton from "@common/components/atoms/BaseSkeleton.vue";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import {
  UtensilsCrossed,
  Plus,
  CircleDot,
  RectangleVertical,
  Search,
  X,
} from "lucide-vue-next";
import { useNutritionalLabels } from "~/composables/useNutritionalLabels";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";

definePageMeta({ layout: "none" });

const { fetchCollection } = usePocketBaseCore();
const { transformRecord } = useNutritionalLabels();

// ─── State ────────────────────────────────────────────────────────────────────
const labelData = ref<any[]>([]);
const loading = ref(true);
const labelType = ref<"round" | "standard">("round");
const searchQuery = ref("");
const createModalRef = ref<any>(null);
const selectedLabel = ref<any | null>(null);
const type = ref<"create" | "edit">("create");

// ─── Computed ─────────────────────────────────────────────────────────────────
const filteredLabels = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return labelData.value;
  return labelData.value.filter((l) => l.name?.toLowerCase().includes(q));
});

// ─── Data fetching ────────────────────────────────────────────────────────────
const fetchLabels = async () => {
  loading.value = true;
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
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLabels();
});

// ─── Actions ──────────────────────────────────────────────────────────────────
const toggle = async (action: "create" | "edit", id: any = null) => {
  if (id && action === "edit") {
    selectedLabel.value = labelData.value.find((l) => l.id === id) || null;
  } else {
    selectedLabel.value = null;
  }

  type.value = action;
  await nextTick();

  if (createModalRef.value) {
    createModalRef.value.open(selectedLabel.value);
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");
</style>
