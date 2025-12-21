<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <Label v-if="label" class="text-lg font-bold">{{ label }}</Label>
      <div class="text-xs text-muted-foreground">
        {{ localImages.length }} Image{{ localImages.length !== 1 ? "s" : "" }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(img, index) in localImages" :key="index" class="relative">
        <ImageUploader
          :image="img"
          :id="recordId"
          :collection-id="collectionId"
          :format="format"
          :quality="quality"
          :width="width"
          :height="height"
          @upload="(file) => handleLocalUpload(index, file)"
          @remove="() => removeLocalSlot(index)"
        />
      </div>
    </div>

    <div class="flex gap-2">
      <button
        type="button"
        class="px-6 h-12 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md font-medium"
        @click="addNewSlot"
      >
        <PlusCircle class="w-5 h-5" />
        <span class="text-sm font-medium">Add Image Slot</span>
      </button>

      <button
        v-if="hasChanges"
        type="button"
        class="px-6 h-12 flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-colors rounded-md font-medium"
        @click="handleSave"
      >
        <Save class="w-4 h-4" />
        Save Gallery Changes
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { PlusCircle, Save } from "lucide-vue-next";
import { Label } from "~/components/ui/label";
import ImageUploader from "~/components/molecules/ImageUploader.vue";

interface Props {
  images?: (string | File)[];
  collectionId: string;
  recordId: string;
  label?: string;
  format?: "webp" | "jpeg" | "png";
  width?: number;
  height?: number;
  quality?: number;
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  format: "webp",
  quality: 80,
});

const emit = defineEmits<{
  "update:images": [files: (File | string)[]];
  save: [];
}>();

// Local copy of images - properly typed as array
const localImages = ref<(string | File)[]>([...props.images]);

// Track if there are unsaved changes
const hasChanges = computed(() => {
  if (localImages.value.length !== props.images.length) return true;
  return localImages.value.some((img, idx) => img !== props.images[idx]);
});

// Watch for external changes (when parent updates after save)
watch(
  () => props.images,
  (newVal) => {
    localImages.value = [...newVal];
  },
  { deep: true }
);

/**
 * Add empty slot to local state
 */
const addNewSlot = () => {
  localImages.value.push("");
};

/**
 * Update local slot with uploaded file
 */
const handleLocalUpload = (index: number, file: File) => {
  localImages.value[index] = file;
};

/**
 * Remove slot from local state
 */
const removeLocalSlot = (index: number) => {
  localImages.value.splice(index, 1);
};

/**
 * Emit all changes when Save is clicked
 */
const handleSave = () => {
  // Filter out empty strings before saving
  const validImages = localImages.value.filter((img) => img !== "");
  emit("update:images", validImages);
  emit("save");
};
</script>
