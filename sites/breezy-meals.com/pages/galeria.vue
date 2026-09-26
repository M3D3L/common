<template>
  <section class="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6">
    <input
      ref="addInput"
      class="hidden"
      type="file"
      accept="image/*"
      multiple
      @change="addImages"
    />
    <input
      ref="replaceInput"
      class="hidden"
      type="file"
      accept="image/*"
      @change="replaceImage"
    />

    <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Galeria</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Consulta y administra las imagenes guardadas en PocketBase.
        </p>
      </div>
      <Button :disabled="uploading" @click="addInput?.click()">
        <Upload :size="16" class="mr-2" />
        {{ uploading ? "Subiendo..." : "Agregar imagenes" }}
      </Button>
    </div>

    <div
      v-if="loading"
      class="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground"
    >
      Cargando imagenes...
    </div>

    <div
      v-else-if="loadError"
      class="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <p class="font-semibold">No se pudo cargar la galeria.</p>
      <Button class="mt-4" variant="outline" @click="loadImages">
        Reintentar
      </Button>
    </div>

    <div
      v-else-if="!images.length"
      class="rounded-lg border border-dashed border-border p-12 text-center"
    >
      <ImageOff :size="32" class="mx-auto text-muted-foreground" />
      <p class="mt-3 text-sm text-muted-foreground">
        No hay imagenes en la coleccion.
      </p>
      <Button class="mt-4" variant="outline" @click="addInput?.click()">
        <Upload :size="16" class="mr-2" />
        Subir la primera
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="image in images"
        :key="image.id"
        class="min-w-0 overflow-hidden rounded-lg border border-border bg-card"
      >
        <a
          :href="fullImageUrl(image)"
          target="_blank"
          rel="noopener noreferrer"
          class="block aspect-square overflow-hidden bg-muted"
        >
          <img
            :src="fullImageUrl(image)"
            :alt="image.field || 'Imagen de la galeria'"
            class="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </a>

        <div class="space-y-3 p-4">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold" :title="image.field">
              {{ image.field }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ formatDate(image.created) }}
            </p>
          </div>

          <div class="flex min-w-0 items-center gap-2">
            <Input
              :model-value="fullImageUrl(image)"
              readonly
              class="min-w-0 font-mono text-xs"
              :aria-label="`URL completa de ${image.field}`"
              @focus="selectUrl"
            />
            <Button
              size="icon"
              variant="outline"
              class="shrink-0"
              title="Copiar URL"
              :aria-label="`Copiar URL de ${image.field}`"
              @click="copyUrl(image)"
            >
              <Copy :size="16" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              class="shrink-0"
              title="Abrir imagen"
              :aria-label="`Abrir ${image.field}`"
              as-child
            >
              <a
                :href="fullImageUrl(image)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink :size="16" />
              </a>
            </Button>
          </div>

          <div class="flex gap-2">
            <Button
              class="flex-1"
              variant="outline"
              :disabled="busyId === image.id"
              @click="chooseReplacement(image)"
            >
              <RefreshCw :size="15" class="mr-2" />
              {{ busyId === image.id ? "Reemplazando..." : "Reemplazar" }}
            </Button>
            <Button
              size="icon"
              variant="destructive"
              :disabled="busyId === image.id"
              title="Eliminar imagen"
              :aria-label="`Eliminar ${image.field}`"
              @click="removeImage(image)"
            >
              <Trash2 :size="16" />
            </Button>
          </div>
        </div>
      </article>
    </div>

    <Pagination :total-pages="totalPages" :show-pagination="true" />

    <div
      v-if="statusMessage"
      class="fixed bottom-6 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-lg"
      role="status"
    >
      {{ statusMessage }}
    </div>
  </section>
</template>

<script setup lang="ts">
import Pagination from "@common/components/Pagination.vue";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import {
  Copy,
  ExternalLink,
  ImageOff,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-vue-next";
import type { RecordModel } from "pocketbase";

const COLLECTION = "Images";
const FILE_FIELD = "field";
const PAGE_SIZE = 12;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const route = useRoute();
const router = useRouter();
const { createItem, deleteItem, fetchCollection, getFileUrl, updateItem } =
  usePocketBaseCore();

const images = ref<RecordModel[]>([]);
const totalPages = ref(1);
const loading = ref(true);
const loadError = ref(false);
const uploading = ref(false);
const busyId = ref("");
const statusMessage = ref("");
const addInput = ref<HTMLInputElement | null>(null);
const replaceInput = ref<HTMLInputElement | null>(null);
const replacementRecord = ref<RecordModel | null>(null);

let statusTimer: ReturnType<typeof setTimeout> | undefined;

function showStatus(message: string) {
  statusMessage.value = message;
  if (statusTimer) clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusMessage.value = "";
  }, 2600);
}

function requestedPage() {
  const page = Number(route.query.page);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

async function loadImages() {
  loading.value = true;
  loadError.value = false;

  try {
    const result = await fetchCollection(
      COLLECTION,
      requestedPage(),
      PAGE_SIZE,
      "field != ''",
      "-created",
      null,
      null,
      true,
    );
    images.value = result.items;
    totalPages.value = Math.max(result.totalPages, 1);

    if (requestedPage() > totalPages.value) {
      await router.replace({
        query: { ...route.query, page: totalPages.value },
      });
    }
  } catch (error: any) {
    if (!error?.isAbort) loadError.value = true;
  } finally {
    loading.value = false;
  }
}

function fullImageUrl(record: RecordModel) {
  const url = getFileUrl(record, record[FILE_FIELD]);
  if (/^https?:\/\//i.test(url) || !import.meta.client) return url;
  return new URL(url, window.location.origin).href;
}

function validateFile(file: File) {
  if (!file.type.startsWith("image/")) {
    showStatus(`${file.name} no es una imagen valida`);
    return false;
  }
  if (file.size > MAX_FILE_SIZE) {
    showStatus(`${file.name} supera el limite de 5 MB`);
    return false;
  }
  return true;
}

async function addImages(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []).filter(validateFile);
  input.value = "";
  if (!files.length) return;

  uploading.value = true;
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append(FILE_FIELD, file);
      await createItem(COLLECTION, formData as any);
    }
    if (requestedPage() !== 1) {
      await router.push({ query: { ...route.query, page: 1 } });
    } else {
      await loadImages();
    }
    showStatus(files.length === 1 ? "Imagen agregada" : "Imagenes agregadas");
  } catch {
    showStatus("No se pudieron agregar las imagenes");
  } finally {
    uploading.value = false;
  }
}

function chooseReplacement(record: RecordModel) {
  replacementRecord.value = record;
  replaceInput.value?.click();
}

async function replaceImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  const record = replacementRecord.value;
  replacementRecord.value = null;
  if (!file || !record || !validateFile(file)) return;

  busyId.value = record.id;
  try {
    const formData = new FormData();
    formData.append(FILE_FIELD, file, record[FILE_FIELD]);
    await updateItem(COLLECTION, record.id, formData as any);
    await loadImages();
    showStatus("Imagen reemplazada; se conservo el registro y su URL");
  } catch {
    showStatus("No se pudo reemplazar la imagen");
  } finally {
    busyId.value = "";
  }
}

async function removeImage(record: RecordModel) {
  if (!window.confirm(`Eliminar ${record[FILE_FIELD]} permanentemente?`)) {
    return;
  }

  busyId.value = record.id;
  try {
    await deleteItem(COLLECTION, record.id);
    await loadImages();
    showStatus("Imagen eliminada");
  } catch {
    showStatus("No se pudo eliminar la imagen");
  } finally {
    busyId.value = "";
  }
}

async function copyUrl(record: RecordModel) {
  try {
    await navigator.clipboard.writeText(fullImageUrl(record));
    showStatus("URL copiada");
  } catch {
    showStatus("No se pudo copiar la URL");
  }
}

function selectUrl(event: FocusEvent) {
  (event.target as HTMLInputElement).select();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(new Date(value));
}

watch(() => route.query.page, loadImages);
onMounted(loadImages);
onBeforeUnmount(() => {
  if (statusTimer) clearTimeout(statusTimer);
});

definePageMeta({
  layout: "staff",
});
</script>
