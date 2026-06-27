<template>
  <div class="grid content-center relative group">
    <slot />

    <!-- Container is now narrower and has a fixed minimum width to enforce uniformity -->
    <div
      class="absolute top-1/2 -right-3 -translate-y-1/2 flex flex-col items-center gap-0.5 px-1 py-1 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-lg opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-10 whitespace-nowrap min-w-[70px]"
    >
      <!-- w-full and justify-start keeps layout uniform while aligning text/icons cleanly -->
      <Button
        variant="ghost"
        size="sm"
        class="h-5 w-full px-1.5 py-0.5 justify-start rounded-md text-[8px] font-semibold tracking-widest uppercase text-neutral-400 hover:text-red-400 hover:bg-neutral-700"
        :disabled="deleting"
        @click.stop="deleteLabel"
      >
        <Loader2 v-if="deleting" class="w-2 h-2 mr-1 animate-spin" />
        <Trash2 v-else class="w-2 h-2 mr-1" />
        {{ deleting ? "…" : "Borrar" }}
      </Button>

      <Separator
        orientation="horizontal"
        class="w-4 bg-neutral-800 opacity-50"
      />

      <Button
        variant="ghost"
        size="sm"
        class="h-5 w-full px-1.5 py-0.5 justify-start rounded-md text-[8px] font-semibold tracking-widest uppercase text-neutral-400 hover:text-sky-400 hover:bg-neutral-700"
        @click.stop="$emit('edit', props.id)"
      >
        <Pencil class="w-2 h-2 mr-1" />
        Editar
      </Button>

      <Separator
        orientation="horizontal"
        class="w-4 bg-neutral-800 opacity-50"
      />

      <Button
        variant="ghost"
        size="sm"
        class="h-5 w-full px-1.5 py-0.5 justify-start rounded-md text-[8px] font-semibold tracking-widest uppercase text-neutral-400 hover:text-amber-400 hover:bg-neutral-700"
        @click.stop="$emit('print')"
      >
        <Printer class="w-2 h-2 mr-1" />
        Imprimir
      </Button>

      <Separator
        orientation="horizontal"
        class="w-4 bg-neutral-800 opacity-50"
      />

      <Button
        variant="ghost"
        size="sm"
        class="h-5 w-full px-1.5 py-0.5 justify-start rounded-md text-[8px] font-semibold tracking-widest uppercase text-neutral-400 hover:text-emerald-400 hover:bg-neutral-700"
        @click.stop="$emit('download')"
      >
        <ImageDown class="w-2 h-2 mr-1" />
        PNG
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Printer, ImageDown, Trash2, Loader2, Pencil } from "lucide-vue-next";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import { ref } from "vue";

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
