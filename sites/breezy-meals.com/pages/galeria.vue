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

    <div class="mb-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
      <div class="relative">
        <Search
          :size="16"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          v-model="searchTerm"
          type="search"
          class="pl-9 pr-10"
          placeholder="Buscar titulo, archivo o URL"
          aria-label="Buscar imagen por titulo, archivo o URL"
        />
        <Button
          v-if="searchTerm"
          size="icon"
          variant="ghost"
          class="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          title="Limpiar busqueda"
          aria-label="Limpiar busqueda"
          @click="searchTerm = ''"
        >
          <X :size="14" />
        </Button>
      </div>
      <Select v-model="sourceFilter">
        <SelectTrigger aria-label="Filtrar por origen">
          <SelectValue placeholder="Todos los origenes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="option in sourceOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Cargando imagenes"
    >
      <Card v-for="index in 6" :key="index" class="overflow-hidden">
        <Skeleton class="aspect-square w-full rounded-none" />
        <CardContent class="space-y-3 p-4">
          <Skeleton class="h-4 w-2/3" />
          <Skeleton class="h-9 w-full" />
          <Skeleton class="h-9 w-full" />
        </CardContent>
      </Card>
    </div>

    <Alert v-else-if="loadError" variant="destructive">
      <CircleAlert :size="18" />
      <AlertTitle>No se pudo cargar la galeria</AlertTitle>
      <AlertDescription>
        <Button class="mt-3" variant="outline" @click="loadImages">
          Reintentar
        </Button>
      </AlertDescription>
    </Alert>

    <Card v-else-if="!images.length" styles="border border-dashed bg-card">
      <CardContent class="p-12 text-center">
        <ImageOff :size="32" class="mx-auto text-muted-foreground" />
        <p class="mt-3 text-sm text-muted-foreground">
          {{
            hasActiveFilters
              ? "No hay imagenes que coincidan con los filtros."
              : "No hay imagenes en la coleccion."
          }}
        </p>
        <Button
          v-if="hasActiveFilters"
          class="mt-4"
          variant="outline"
          @click="clearFilters"
        >
          <X :size="16" class="mr-2" />
          Limpiar filtros
        </Button>
        <Button
          v-else
          class="mt-4"
          variant="outline"
          @click="addInput?.click()"
        >
          <Upload :size="16" class="mr-2" />
          Subir la primera
        </Button>
      </CardContent>
    </Card>

    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="image in images"
        :key="image.id"
        styles="overflow-hidden border border-border bg-card"
        class="min-w-0"
      >
        <a
          :href="fullImageUrl(image)"
          target="_blank"
          rel="noopener noreferrer"
          class="block aspect-square overflow-hidden bg-muted"
        >
          <img
            :src="fullImageUrl(image)"
            :alt="image.title || image.field || 'Imagen de la galeria'"
            class="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </a>

        <CardContent class="space-y-3 p-4">
          <div class="min-w-0 space-y-1">
            <div class="flex min-w-0 items-center justify-between gap-2">
              <p
                class="truncate text-sm font-semibold"
                :title="image.title || image.field"
              >
                {{ image.title || image.field }}
              </p>
              <Badge variant="secondary" class="shrink-0">
                {{ sourceLabel(image.source) }}
              </Badge>
            </div>
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
              @click="requestDelete(image)"
            >
              <Trash2 :size="16" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Pagination :total-pages="totalPages" :show-pagination="true" />

    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar imagen</AlertDialogTitle>
          <AlertDialogDescription class="min-w-0 break-words">
            Se eliminara
            <strong class="break-all font-semibold text-foreground">
              {{ pendingDelete?.title || pendingDelete?.field }}
            </strong>
            permanentemente. Esta accion no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            @click="removeImage"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Alert
      v-if="statusMessage"
      :variant="statusIsError ? 'destructive' : 'default'"
      class="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 bg-background shadow-lg"
      role="status"
    >
      <AlertDescription>{{ statusMessage }}</AlertDescription>
    </Alert>
  </section>
</template>

<script setup lang="ts">
import Pagination from "@common/components/Pagination.vue";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@common/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@common/components/ui/alert-dialog";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Card, CardContent } from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import { Skeleton } from "@common/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import {
  CircleAlert,
  Copy,
  ExternalLink,
  ImageOff,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-vue-next";
import type { RecordModel } from "pocketbase";

const PAGE_SIZE = 12;

const route = useRoute();
const router = useRouter();
const { deleteItem, fetchCollection } = usePocketBaseCore();
const {
  collection: COLLECTION,
  fileField: FILE_FIELD,
  imageUrl: fullImageUrl,
  replaceImage: replaceStoredImage,
  uploadImage,
  validateImage,
} = useImages();

const images = ref<RecordModel[]>([]);
const searchTerm = ref(
  typeof route.query.search === "string" ? route.query.search : "",
);
const sourceFilter = ref(
  typeof route.query.source === "string" ? route.query.source : "all",
);
const totalPages = ref(1);
const loading = ref(true);
const loadError = ref(false);
const uploading = ref(false);
const busyId = ref("");
const statusMessage = ref("");
const statusIsError = ref(false);
const addInput = ref<HTMLInputElement | null>(null);
const replaceInput = ref<HTMLInputElement | null>(null);
const replacementRecord = ref<RecordModel | null>(null);
const deleteDialogOpen = ref(false);
const pendingDelete = ref<RecordModel | null>(null);

let statusTimer: ReturnType<typeof setTimeout> | undefined;
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const activeSearch = computed(() =>
  typeof route.query.search === "string" ? route.query.search.trim() : "",
);
const activeSource = computed(() =>
  typeof route.query.source === "string" ? route.query.source : "all",
);
const hasActiveFilters = computed(
  () => Boolean(activeSearch.value) || activeSource.value !== "all",
);
const sourceOptions = [
  { value: "all", label: "Todos los origenes" },
  { value: "platillos", label: "Platillos" },
  { value: "productos", label: "Productos" },
  { value: "catering", label: "Catering" },
  { value: "recetas", label: "Recetas" },
  { value: "galeria", label: "Galeria" },
  { value: "unclassified", label: "Sin clasificar" },
];

function showStatus(message: string, isError = false) {
  statusMessage.value = message;
  statusIsError.value = isError;
  if (statusTimer) clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusMessage.value = "";
  }, 2600);
}

function requestedPage() {
  const page = Number(route.query.page);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function escapeFilterValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function imageFilter() {
  const filters = [`field != ''`];

  if (activeSearch.value) {
    let filename = activeSearch.value;
    let recordId = "";

    try {
      const url = new URL(activeSearch.value);
      const segments = url.pathname
        .split("/")
        .filter(Boolean)
        .map(decodeURIComponent);
      filename = segments.at(-1) || activeSearch.value;
      recordId = segments.at(-2) || "";
    } catch {
      // A normal search term is matched against all identifying metadata.
    }

    const value = escapeFilterValue(filename);
    const matches = [
      `field ~ "${value}"`,
      `title ~ "${value}"`,
      `source ~ "${value}"`,
      `source_key ~ "${value}"`,
    ];
    if (recordId) matches.push(`id = "${escapeFilterValue(recordId)}"`);
    filters.push(`(${matches.join(" || ")})`);
  }

  if (activeSource.value === "unclassified") {
    filters.push(`source = ""`);
  } else if (activeSource.value !== "all") {
    filters.push(`source = "${escapeFilterValue(activeSource.value)}"`);
  }

  return filters.join(" && ");
}

function sourceLabel(source: string) {
  return (
    sourceOptions.find((option) => option.value === source)?.label ||
    source ||
    "Sin clasificar"
  );
}

function clearFilters() {
  searchTerm.value = "";
  sourceFilter.value = "all";
}

async function loadImages() {
  loading.value = true;
  loadError.value = false;

  try {
    const result = await fetchCollection(
      COLLECTION,
      requestedPage(),
      PAGE_SIZE,
      imageFilter(),
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

function validateFile(file: File) {
  try {
    validateImage(file);
    return true;
  } catch (error) {
    showStatus(
      error instanceof Error ? error.message : "Imagen no valida",
      true,
    );
    return false;
  }
}

async function addImages(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []).filter(validateFile);
  input.value = "";
  if (!files.length) return;

  uploading.value = true;
  try {
    for (const file of files) {
      await uploadImage(file, {
        title: file.name.replace(/\.[^.]+$/, ""),
        source: "galeria",
      });
    }
    if (requestedPage() !== 1) {
      await router.push({ query: { ...route.query, page: 1 } });
    } else {
      await loadImages();
    }
    showStatus(files.length === 1 ? "Imagen agregada" : "Imagenes agregadas");
  } catch {
    showStatus("No se pudieron agregar las imagenes", true);
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
    await replaceStoredImage(record, file);
    await loadImages();
    showStatus("Imagen reemplazada; se conservo el registro y su URL");
  } catch {
    showStatus("No se pudo reemplazar la imagen", true);
  } finally {
    busyId.value = "";
  }
}

function requestDelete(record: RecordModel) {
  pendingDelete.value = record;
  deleteDialogOpen.value = true;
}

async function removeImage() {
  const record = pendingDelete.value;
  if (!record) return;

  busyId.value = record.id;
  try {
    await deleteItem(COLLECTION, record.id);
    await loadImages();
    showStatus("Imagen eliminada");
  } catch {
    showStatus("No se pudo eliminar la imagen", true);
  } finally {
    busyId.value = "";
    pendingDelete.value = null;
  }
}

async function copyUrl(record: RecordModel) {
  try {
    await navigator.clipboard.writeText(fullImageUrl(record));
    showStatus("URL copiada");
  } catch {
    showStatus("No se pudo copiar la URL", true);
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

watch(searchTerm, (value) => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const search = value.trim() || undefined;
    if (search === (activeSearch.value || undefined)) return;
    router.replace({ query: { ...route.query, page: undefined, search } });
  }, 300);
});

watch(sourceFilter, (value) => {
  const source = value === "all" ? undefined : value;
  if (
    source === (activeSource.value === "all" ? undefined : activeSource.value)
  ) {
    return;
  }
  router.replace({ query: { ...route.query, page: undefined, source } });
});

watch(
  () => [route.query.page, route.query.search, route.query.source],
  () => {
    const routeSearch =
      typeof route.query.search === "string" ? route.query.search : "";
    if (routeSearch !== searchTerm.value.trim()) searchTerm.value = routeSearch;
    const routeSource =
      typeof route.query.source === "string" ? route.query.source : "all";
    if (routeSource !== sourceFilter.value) sourceFilter.value = routeSource;
    loadImages();
  },
);
onMounted(loadImages);
onBeforeUnmount(() => {
  if (statusTimer) clearTimeout(statusTimer);
  if (searchTimer) clearTimeout(searchTimer);
});

definePageMeta({
  layout: "staff",
});
</script>
