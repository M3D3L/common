<template>
  <div class="min-w-0 space-y-1.5">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      :disabled="disabled || uploading || missingTitle"
      @change="handleUpload"
    />
    <div class="flex min-w-0 gap-2">
      <Input
        :id="id"
        :model-value="modelValue"
        type="url"
        class="min-w-0"
        :placeholder="placeholder"
        :disabled="disabled || uploading"
        @update:model-value="emit('update:modelValue', String($event))"
      />
      <Button
        type="button"
        variant="outline"
        class="shrink-0"
        :disabled="disabled || uploading || missingTitle"
        :title="
          missingTitle ? 'Escribe el nombre antes de subir' : 'Subir imagen'
        "
        :aria-label="
          missingTitle
            ? 'Escribe el nombre antes de subir la imagen'
            : uploading
              ? 'Subiendo imagen'
              : 'Subir imagen'
        "
        @click="fileInput?.click()"
      >
        <LoaderCircle v-if="uploading" :size="16" class="mr-2 animate-spin" />
        <Upload v-else :size="16" class="mr-2" />
        {{ uploading ? "Subiendo..." : "Subir" }}
      </Button>
      <Button
        v-if="modelValue"
        type="button"
        size="icon"
        variant="outline"
        class="shrink-0 text-destructive hover:text-destructive"
        :disabled="disabled || uploading"
        title="Quitar imagen del item"
        aria-label="Quitar imagen del item"
        @click="removeImage"
      >
        <ImageMinus :size="16" />
      </Button>
    </div>
    <p v-if="errorMessage" class="text-xs text-destructive" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { ImageMinus, LoaderCircle, Upload } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    id?: string;
    placeholder?: string;
    disabled?: boolean;
    imageTitle?: string | null;
    source?: string | null;
    sourceKey?: string | null;
  }>(),
  {
    modelValue: "",
    placeholder: "https://...",
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  uploaded: [url: string];
  removed: [];
}>();

const { uploadImage } = useImages();
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const errorMessage = ref("");
const missingTitle = computed(
  () => Boolean(props.source) && !props.imageTitle?.trim(),
);

function removeImage() {
  errorMessage.value = "";
  emit("update:modelValue", "");
  emit("removed");
}

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  uploading.value = true;
  errorMessage.value = "";
  try {
    const url = await uploadImage(file, {
      title: props.imageTitle,
      source: props.source,
      sourceKey: props.sourceKey,
    });
    emit("update:modelValue", url);
    emit("uploaded", url);
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "No se pudo subir la imagen";
  } finally {
    uploading.value = false;
  }
}
</script>
