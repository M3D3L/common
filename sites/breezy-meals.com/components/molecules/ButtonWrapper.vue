<template>
  <Dialog v-model:open="open">
    <div class="grid content-center relative group">
      <!-- Inline preview: clicking it opens the zoom view -->
      <div class="cursor-zoom-in" @click="open = true">
        <slot />
      </div>

      <div
        class="absolute top-1/2 gap-1 -right-4 -translate-y-1/2 flex flex-col items-center p-1 rounded-xl bg-neutral-950/95 backdrop-blur-md border border-neutral-800/60 shadow-xl opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-10 whitespace-nowrap min-w-[96px]"
      >
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-full px-2.5 rounded-md text-[10px] font-bold tracking-wider uppercase text-neutral-400 hover:text-red-400 hover:bg-neutral-800/60 transition-colors"
              :disabled="deleting"
              @click.stop
            >
              <span
                class="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full"
              >
                <Loader2
                  v-if="deleting"
                  class="w-3 h-3 animate-spin justify-self-center"
                />
                <Trash2 v-else class="w-3 h-3 justify-self-center" />
                <span class="text-left font-sans text-[10px]">{{
                  deleting ? "…" : "Borrar"
                }}</span>
              </span>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent
            class="max-w-md bg-neutral-950 border border-neutral-800 text-neutral-200"
          >
            <AlertDialogHeader>
              <AlertDialogTitle class="text-lg font-semibold text-neutral-100"
                >¿Confirmar eliminación?</AlertDialogTitle
              >
              <AlertDialogDescription class="text-sm text-neutral-400">
                Esta acción no se puede deshacer. Esto eliminará permanentemente
                la etiqueta.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter class="gap-2 sm:gap-0">
              <AlertDialogCancel
                class="border-neutral-800 bg-transparent text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                class="bg-red-600 text-white hover:bg-red-700"
                @click="deleteLabel"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          size="sm"
          class="h-7 w-full px-2.5 rounded-md text-[10px] font-bold tracking-wider uppercase text-neutral-400 hover:text-sky-400 hover:bg-neutral-800/60 transition-colors"
          @click.stop="$emit('edit', props.id)"
        >
          <span class="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full">
            <Pencil class="w-3 h-3 justify-self-center" />
            <span class="text-left font-sans text-[10px]">Editar</span>
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          class="h-7 w-full px-2.5 rounded-md text-[10px] font-bold tracking-wider uppercase text-neutral-400 hover:text-amber-400 hover:bg-neutral-800/60 transition-colors"
          @click.stop="$emit('print')"
        >
          <span class="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full">
            <Printer class="w-3 h-3 justify-self-center" />
            <span class="text-left font-sans text-[10px]">Imprimir</span>
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          class="h-7 w-full px-2.5 rounded-md text-[10px] font-bold tracking-wider uppercase text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800/60 transition-colors"
          @click.stop="$emit('download')"
        >
          <span class="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full">
            <ImageDown class="w-3 h-3 justify-self-center" />
            <span class="text-left font-sans text-[10px]">PNG</span>
          </span>
        </Button>
      </div>
    </div>

    <DialogContent
      class="max-w-[95vw] w-auto sm:max-w-[95vw] p-0 gap-0 bg-neutral-950 border border-neutral-800 text-neutral-200 overflow-hidden"
    >
      <DialogHeader
        class="flex-row items-center justify-between gap-4 px-4 py-3 border-b border-neutral-800"
      >
        <DialogTitle
          class="flex items-center gap-2 text-sm font-semibold text-neutral-100"
        >
          Vista ampliada
        </DialogTitle>

        <!-- Zoom controls -->
        <div
          class="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/60 p-0.5 mr-6"
        >
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
            :disabled="scale <= MIN_SCALE"
            @click="zoomOut"
          >
            <ZoomOut class="w-3.5 h-3.5" />
          </Button>
          <button
            type="button"
            class="min-w-[3rem] px-1 text-center text-[11px] font-medium tabular-nums text-neutral-300 hover:text-neutral-100 transition-colors"
            title="Restablecer"
            @click="resetZoom"
          >
            {{ Math.round(scale * 100) }}%
          </button>
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
            :disabled="scale >= MAX_SCALE"
            @click="zoomIn"
          >
            <ZoomIn class="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
            title="Restablecer"
            @click="resetZoom"
          >
            <RotateCcw class="w-3.5 h-3.5" />
          </Button>
        </div>
      </DialogHeader>

      <!-- Scrollable stage -->
      <div
        ref="stage"
        class="relative bg-neutral-900/40 overflow-auto max-h-[80vh] max-w-[95vw]"
        @wheel="onWheel"
      >
        <div
          class="min-w-full min-h-full flex items-center justify-center p-10"
        >
          <div :style="sizerStyle">
            <div
              ref="frame"
              class="inline-block origin-top-left"
              :style="frameStyle"
            >
              <slot />
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@common/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import {
  Printer,
  ImageDown,
  Trash2,
  Loader2,
  Pencil,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-vue-next";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import { useLabelZoom } from "~/composables/useLabelZoom";

const props = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  print: [];
  download: [];
  edit: [string];
  deleted: [];
}>();

const {
  MIN_SCALE,
  MAX_SCALE,
  open,
  scale,
  stage,
  frame,
  sizerStyle,
  frameStyle,
  zoomIn,
  zoomOut,
  resetZoom,
  onWheel,
} = useLabelZoom();

const { deleteItem } = usePocketBaseCore();
const deleting = ref(false);

async function deleteLabel() {
  deleting.value = true;
  try {
    await deleteItem("labels", props.id);
    emit("deleted");
    location.reload();
  } catch (e) {
    console.error("Delete error:", e);
  } finally {
    deleting.value = false;
  }
}
</script>
