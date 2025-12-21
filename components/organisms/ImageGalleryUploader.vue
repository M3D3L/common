<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <Label v-if="label" class="text-lg font-bold">{{ label }}</Label>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(img, index) in images" :key="index" class="relative">
        <ImageUploader
          :image="typeof img === 'string' ? img : null"
          :id="recordId"
          :collection-id="collectionId"
          :format="format"
          :quality="quality"
          :width="width"
          :height="height"
          @remove="removeImage(index)"
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
        @upload="setImages"
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

const tempImage = ref<File | null>(null);

const emit = defineEmits<{
  "update:images": [(string | File)[]];
}>();

const setImages = (file: File) => {
  tempImage.value = file;
  saveImage();
};

const saveImage = () => {
  if (tempImage.value) {
    // Append the new file to the existing array
    const updatedImages = [...props.images, tempImage.value];
    emit("update:images", updatedImages);
    // Clear the temp state so the button disappears and uploader resets
    tempImage.value = null;
  }
};

const removeImage = (index: number) => {
  const updatedImages = [...props.images];
  updatedImages.splice(index, 1);
  emit("update:images", updatedImages);
};
</script>
