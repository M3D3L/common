<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <Label v-if="label" class="text-lg font-bold">{{ label }}</Label>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(img, index) in images" :key="index" class="relative">
        <ImageUploader
          :image="img"
          :id="recordId"
          :collection-id="collectionId"
          :format="format"
          :quality="quality"
          :width="width"
          :height="height"
          @remove="removeImage(index)"
          @upload="(file) => updateExistingImage(index, file)"
        />
      </div>

      <ImageUploader
        :key="images.length"
        :collection-id="collectionId"
        :id="recordId"
        :format="format"
        :quality="quality"
        :width="width"
        :height="height"
        @upload="addNewImage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  "update:images": [(string | File)[]];
}>();

/**
 * Adds a new file to the array.
 * Because we pass the File object back down, the Child
 * will use its internal localPreviewUrl to show it instantly.
 */
const addNewImage = (file: File) => {
  const updatedImages = [...props.images, file];
  emit("update:images", updatedImages);
  // reset file input in child component
};

/**
 * Updates an existing slot if the user edits an image
 * that was already in the list.
 */
const updateExistingImage = (index: number, file: File) => {
  const updatedImages = [...props.images];
  updatedImages[index] = file;
  emit("update:images", updatedImages);
};

const removeImage = (index: number) => {
  const updatedImages = [...props.images];
  updatedImages.splice(index, 1);
  emit("update:images", updatedImages);
};
</script>
