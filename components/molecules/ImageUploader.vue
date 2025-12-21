<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <Label v-if="label" class="text-base font-semibold block">{{
        label
      }}</Label>

      <Button
        v-if="localPreviewUrl || isUnsavedFile"
        variant="ghost"
        size="sm"
        class="h-8 text-xs gap-1"
        @click="resetLocalPreview"
      >
        <RotateCcw class="h-3 w-3" />
        Discard Changes
      </Button>
    </div>

    <Card class="overflow-hidden border-dashed border-muted/60 relative">
      <div
        class="relative h-64 w-full cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors flex items-center justify-center group"
        @click="openFileDialog"
      >
        <input
          type="file"
          accept="image/*"
          ref="fileInput"
          class="hidden"
          @change="handleFileChange"
        />

        <template v-if="displaySource">
          <img
            :src="displaySource"
            alt="Upload preview"
            class="absolute inset-0 h-full w-full object-cover"
          />

          <div
            v-if="localPreviewUrl || isUnsavedFile"
            class="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase z-20 shadow-sm"
          >
            Unsaved
          </div>

          <div
            class="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              size="icon"
              variant="secondary"
              type="button"
              @click.stop="openFileDialog"
            >
              <Edit class="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              type="button"
              @click.stop="showDeleteDialog = true"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </template>

        <template v-else>
          <div class="flex flex-col items-center text-muted-foreground">
            <Plus class="mb-2 h-8 w-8" />
            <span class="text-sm">Upload Image</span>
          </div>
        </template>

        <div
          v-if="loading || processing"
          class="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10"
        >
          <div class="flex flex-col items-center gap-2 text-white">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"
            ></div>
            <span class="text-xs font-medium">
              {{ processing ? "Optimizing..." : "Uploading..." }}
            </span>
          </div>
        </div>
      </div>
    </Card>

    <AlertDialog
      :open="showDeleteDialog"
      @update:open="showDeleteDialog = $event"
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Image?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the current image. You will need to upload a new
            one to replace it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false"
            >Cancel</AlertDialogCancel
          >
          <AlertDialogAction
            @click="onConfirmDelete"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Edit, Trash2, RotateCcw } from "lucide-vue-next";
import imageCompression from "browser-image-compression";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

const config = useRuntimeConfig();

const props = withDefaults(
  defineProps<{
    image?: string | File | any | null;
    collectionId: string;
    id: string;
    name: string;
    label?: string;
    loading?: boolean;
    format?: "webp" | "jpeg" | "png" | "heic";
    width?: number;
    height?: number;
    quality?: number;
  }>(),
  {
    format: "webp",
    quality: 80,
  }
);

const emit = defineEmits<{
  upload: [file: File];
  remove: [];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const showDeleteDialog = ref(false);
const localPreviewUrl = ref<string | null>(null);
const processing = ref(false);

const isUnsavedFile = computed(
  () => props.image instanceof File || props.image instanceof Blob
);

const resolvedImagePropUrl = computed(() => {
  if (!props.image) return null;

  if (typeof props.image === "string") {
    if (!props.id || !props.collectionId) return null;
    return `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.id}/${props.image}`;
  }

  if (isUnsavedFile.value) {
    return URL.createObjectURL(props.image as Blob);
  }

  return null;
});

const displaySource = computed(() => {
  return localPreviewUrl.value || resolvedImagePropUrl.value;
});

const openFileDialog = () => {
  fileInput.value?.click();
};

const compressImage = async (file: File): Promise<File> => {
  processing.value = true;
  const targetType = `image/${props.format === "jpeg" ? "jpeg" : props.format}`;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: props.width || props.height || 1920,
    useWebWorker: true,
    initialQuality: props.quality / 100,
    fileType: targetType,
  };

  try {
    const compressedBlob = await imageCompression(file, options);

    // 1. Clean the name prop: lowercase, replace spaces/specials with hyphens
    const cleanName = props.name
      ? props.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
      : file.name.split(".")[0];

    // 2. Append the target format extension
    const fileName = `${cleanName}.${props.format}`;

    return new File([compressedBlob], fileName, { type: targetType });
  } catch (error) {
    console.error("Image compression failed:", error);
    return file;
  } finally {
    processing.value = false;
  }
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
    localPreviewUrl.value = URL.createObjectURL(file);

    const processedFile = await compressImage(file);
    emit("upload", processedFile);
  }
  target.value = "";
};

const resetLocalPreview = () => {
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value);
    localPreviewUrl.value = null;
  }
};

const onConfirmDelete = () => {
  resetLocalPreview();
  emit("remove");
  showDeleteDialog.value = false;
};

watch(
  () => props.image,
  (newVal, oldVal) => {
    if (typeof newVal === "string" && typeof oldVal !== "string") {
      resetLocalPreview();
    }
  }
);

onBeforeUnmount(() => {
  resetLocalPreview();
});
</script>
