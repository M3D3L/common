<template>
  <div class="grid content-center relative group">
    <slot />

    <div
      class="absolute top-1/2 gap-1 -right-4 -translate-y-1/2 flex flex-col items-center p-1 rounded-xl bg-neutral-950/95 backdrop-blur-md border border-neutral-800/60 shadow-xl opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-10 whitespace-nowrap min-w-[76px]"
    >
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button
            variant="ghost"
            size="sm"
            class="h-5.5 w-full px-2 rounded-md text-[8px] font-bold tracking-wider uppercase text-neutral-400 hover:text-red-400 hover:bg-neutral-800/60 transition-colors"
            :disabled="deleting"
            @click.stop
          >
            <span class="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full">
              <Loader2
                v-if="deleting"
                class="w-2 h-2 animate-spin justify-self-center"
              />
              <Trash2 v-else class="w-2 h-2 justify-self-center" />
              <span class="text-left font-sans text-[7.5px]">{{
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
        class="h-5.5 w-full px-2 rounded-md text-[8px] font-bold tracking-wider uppercase text-neutral-400 hover:text-sky-400 hover:bg-neutral-800/60 transition-colors"
        @click.stop="$emit('edit', props.id)"
      >
        <span class="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full">
          <Pencil class="w-2 h-2 justify-self-center" />
          <span class="text-left font-sans text-[7.5px]">Editar</span>
        </span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        class="h-5.5 w-full px-2 rounded-md text-[8px] font-bold tracking-wider uppercase text-neutral-400 hover:text-amber-400 hover:bg-neutral-800/60 transition-colors"
        @click.stop="$emit('print')"
      >
        <span class="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full">
          <Printer class="w-2 h-2 justify-self-center" />
          <span class="text-left font-sans text-[7.5px]">Imprimir</span>
        </span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        class="h-5.5 w-full px-2 rounded-md text-[8px] font-bold tracking-wider uppercase text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800/60 transition-colors"
        @click.stop="$emit('download')"
      >
        <span class="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full">
          <ImageDown class="w-2 h-2 justify-self-center" />
          <span class="text-left font-sans text-[7.5px]">PNG</span>
        </span>
      </Button>
    </div>
  </div>
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
import { Printer, ImageDown, Trash2, Loader2, Pencil } from "lucide-vue-next";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";

const props = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  print: [];
  download: [];
  edit: [string];
  deleted: [];
}>();

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
