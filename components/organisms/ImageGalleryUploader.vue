<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <Label v-if="label" class="text-lg font-bold">{{ label }}</Label>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative"
      :class="{
        'ring-2 ring-primary ring-offset-4 rounded-lg': isGalleryDragging,
      }"
      @dragover.prevent="onGalleryDragOver"
      @dragleave.prevent="onGalleryDragLeave"
      @drop.prevent="onGalleryDrop"
    >
      <!-- Drag overlay for multi-file drop -->
      <div
        v-if="isGalleryDragging"
        class="absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center z-50 pointer-events-none"
      >
        <div
          class="bg-background border-2 border-primary rounded-lg p-6 shadow-lg"
        >
          <div class="flex flex-col items-center text-primary">
            <Plus class="h-12 w-12 mb-2" />
            <span class="text-lg font-semibold">Drop images here</span>
            <span class="text-sm opacity-70">Add multiple images at once</span>
          </div>
        </div>
      </div>

      <div v-for="(img, index) in images" :key="index" class="relative">
        <ImageUploader
          :image="img"
          :id="recordId"
          :collection-id="collectionId"
          :format="format"
          :quality="quality"
          :width="width"
          :height="height"
          :name="`${cleanName(name)}-gallery-${index + 1}`"
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
        :name="`${cleanName(name)}-gallery-${images.length + 1}`"
        @upload="addNewImage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Plus } from "lucide-vue-next";
import { Label } from "~/components/ui/label";
import ImageUploader from "~/components/molecules/ImageUploader.vue";

interface Props {
  images?: (string | File)[];
  collectionId: string | null;
  recordId: string | null;
  label?: string;
  name: string;
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

const isGalleryDragging = ref(false);

const cleanName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const addNewImage = (file: File) => {
  const updatedImages = [...props.images, file];
  emit("update:images", updatedImages);
};

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

const onGalleryDragOver = (event: DragEvent) => {
  isGalleryDragging.value = true;
};

const onGalleryDragLeave = (event: DragEvent) => {
  // Only set to false if we're leaving the gallery container itself
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;

  if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
    isGalleryDragging.value = false;
  }
};

const onGalleryDrop = async (event: DragEvent) => {
  isGalleryDragging.value = false;

  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return;

  // Filter only image files
  const imageFiles = Array.from(files).filter((file) =>
    file.type.startsWith("image/")
  );

  if (imageFiles.length === 0) {
    console.error("No valid image files found");
    return;
  }

  // Add all images to the gallery - each ImageUploader will process them
  const updatedImages = [...props.images, ...imageFiles];
  emit("update:images", updatedImages);
};
</script>
