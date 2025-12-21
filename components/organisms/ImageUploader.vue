<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <Label v-if="label" class="text-base font-semibold block">{{
        label
      }}</Label>

      <Button
        v-if="localPreviewUrl"
        variant="ghost"
        size="sm"
        class="h-8 text-xs gap-1"
        @click="resetLocalPreview"
      >
        <RotateCcw class="h-3 w-3" />
        Reset Changes
      </Button>
    </div>

    <Card class="overflow-hidden border-muted/60">
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
          v-if="loading"
          class="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10"
        >
          <div class="flex flex-col items-center gap-2 text-white">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"
            ></div>
            <span class="text-xs font-medium">Uploading...</span>
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
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
// ... other imports

const config = useRuntimeConfig();

const props = defineProps<{
  image?: string | null;
  collectionId: string;
  id: string;
  label?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  upload: [file: File];
  remove: [];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const showDeleteDialog = ref(false);
const localPreviewUrl = ref<string | null>(null);

// 1. Construct the Server URL
const serverImageUrl = computed(() => {
  if (!props.image || !props.id || !props.collectionId) return null;
  return `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.id}/${props.image}`;
});

// 2. Prioritize Local Preview over Server Image
const displaySource = computed(
  () => localPreviewUrl.value || serverImageUrl.value
);

const openFileDialog = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    // Create instant local preview
    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
    localPreviewUrl.value = URL.createObjectURL(file);

    emit("upload", file);
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

// Clean up memory if the image prop changes (meaning save was successful)
// or when the component is destroyed
watch(
  () => props.image,
  () => {
    resetLocalPreview();
  }
);

onBeforeUnmount(() => {
  resetLocalPreview();
});
</script>
