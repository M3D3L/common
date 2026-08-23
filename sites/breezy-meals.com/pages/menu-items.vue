<template>
  <section class="mx-auto max-w-5xl px-4 pb-28 pt-8">
    <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Platillos del menu</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Administra los items disponibles en el catalogo del menu.
        </p>
      </div>
      <Button :disabled="loading || saving" @click="save">
        <Save :size="16" class="mr-2" />
        {{ saving ? "Guardando..." : "Guardar cambios" }}
      </Button>
    </div>

    <div
      v-if="loading"
      class="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground"
    >
      Cargando platillos...
    </div>

    <div
      v-else-if="loadError"
      class="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
    >
      <p class="font-semibold">No se pudo cargar el menu.</p>
      <Button class="mt-4" variant="outline" @click="load">Reintentar</Button>
    </div>

    <div v-else class="min-w-0 space-y-8">
      <section
        v-for="group in menuGroups"
        :key="group.key"
        class="min-w-0 space-y-4"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-3">
          <h2
            class="flex min-w-0 items-center gap-2 text-sm font-bold uppercase tracking-widest"
          >
            <span class="shrink-0">{{ group.emoji }}</span>
            <span class="min-w-0 break-words">{{ group.label }}</span>
            <Badge variant="secondary" class="shrink-0 tabular-nums">
              {{ catalog[group.key]?.length ?? 0 }}
            </Badge>
          </h2>
          <Separator class="hidden min-w-0 flex-1 sm:block" />
          <Button
            size="sm"
            variant="outline"
            class="shrink-0"
            @click="addItem(group.key)"
          >
            <Plus :size="15" class="mr-1.5" />
            Agregar
          </Button>
        </div>

        <div
          v-if="catalog[group.key]?.length"
          class="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2"
        >
          <div
            v-for="(item, index) in catalog[group.key]"
            :key="`${group.key}-${item.name}-${index}`"
            class="min-w-0 rounded-lg border border-border bg-card p-4"
          >
            <div class="flex items-start gap-3">
              <div
                class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-md bg-muted"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name || 'Imagen del platillo'"
                  class="h-full w-full object-cover"
                />
                <ImageOff v-else :size="22" class="text-muted-foreground" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold">
                  {{ item.name || "Nuevo platillo" }}
                </p>
                <p class="mt-1 text-xs text-muted-foreground">
                  {{ item.image ? "Imagen configurada" : "Sin imagen" }}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                class="shrink-0 text-destructive hover:text-destructive"
                :aria-label="`Eliminar ${item.name || 'platillo'}`"
                title="Eliminar platillo"
                @click="removeItem(group.key, index)"
              >
                <Trash2 :size="16" />
              </Button>
            </div>

            <Separator class="my-4" />

            <div class="grid min-w-0 gap-3 sm:grid-cols-2">
              <div class="min-w-0 space-y-1.5 sm:col-span-2">
                <Label :for="`name-${group.key}-${index}`">Nombre</Label>
                <Input
                  :id="`name-${group.key}-${index}`"
                  v-model="item.name"
                  placeholder="Nombre del platillo"
                />
              </div>
              <div class="min-w-0 space-y-1.5">
                <Label :for="`price-${group.key}-${index}`">Precio</Label>
                <Input
                  :id="`price-${group.key}-${index}`"
                  v-model.number="item.price"
                  type="number"
                  min="0"
                  step="1"
                />
              </div>
              <div class="min-w-0 space-y-1.5">
                <Label :for="`image-${group.key}-${index}`">Imagen</Label>
                <Input
                  :id="`image-${group.key}-${index}`"
                  v-model="item.image"
                  type="url"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="rounded-lg border border-dashed border-border p-6 text-center"
        >
          <p class="text-sm text-muted-foreground">
            No hay platillos en esta categoria.
          </p>
          <Button
            class="mt-3"
            size="sm"
            variant="outline"
            @click="addItem(group.key)"
          >
            <Plus :size="15" class="mr-1.5" />
            Agregar primer platillo
          </Button>
        </div>
      </section>

      <div
        v-if="!menuGroups.length"
        class="rounded-lg border border-dashed border-border p-8 text-center"
      >
        <p class="text-sm text-muted-foreground">
          No hay categorias configuradas.
        </p>
      </div>
    </div>

    <div
      v-if="toastMessage"
      class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-lg"
      role="status"
    >
      {{ toastMessage }}
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Separator } from "@common/components/ui/separator";
import { ImageOff, Plus, Save, Trash2 } from "lucide-vue-next";
import {
  emptyDayDishes,
  groupsFromData,
  normalizeMenuCatalog,
  type MenuCatalog,
  type MenuItem,
} from "~/utils/comandas";

const props = withDefaults(
  defineProps<{
    fetchedCollection?: string;
    dishes?: "dishes" | "store";
  }>(),
  {
    fetchedCollection: "menu",
    dishes: "dishes",
  },
);

interface MenuRecordForItems {
  id: string;
  dishes?: Record<string, unknown>;
  store?: Record<string, unknown>;
  active?: Record<string, unknown>;
  sold_out?: string[];
  week_blocks?: unknown[];
  rotation?: string[];
  rotation_anchor?: string;
  overrides?: Record<string, unknown>;
}

const { fetchCollection, updateItem, createItem } = usePocketBaseCore();

const loading = ref(true);
const saving = ref(false);
const loadError = ref(false);
const toastMessage = ref("");
const menuRecordId = ref<string | null>(null);
const catalog = ref<MenuCatalog>({});

const menuGroups = computed(() =>
  groupsFromData(catalog.value as Record<string, unknown>),
);

let toastTimer: ReturnType<typeof setTimeout> | undefined;

function toast(message: string) {
  toastMessage.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2200);
}

async function load() {
  loading.value = true;
  loadError.value = false;
  try {
    const result = await fetchCollection(
      props.fetchedCollection,
      1,
      1,
      "",
      "-created",
      null,
      null,
      true,
    );
    const record = result.items[0] as unknown as MenuRecordForItems | undefined;

    if (!record) {
      menuRecordId.value = null;
      catalog.value = {};
      return;
    }

    menuRecordId.value = record.id;
    catalog.value = normalizeMenuCatalog(record[props.dishes] ?? {});
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

function addItem(groupKey: string) {
  const items = catalog.value[groupKey] ?? [];
  items.push({ name: "", price: 0 });
  catalog.value[groupKey] = items;
}

function removeItem(groupKey: string, index: number) {
  const item = catalog.value[groupKey]?.[index];
  if (!item) return;

  const confirmed = window.confirm(
    `Eliminar "${item.name || "este platillo"}" del catalogo?`,
  );
  if (!confirmed) return;

  catalog.value[groupKey].splice(index, 1);
}

function cleanCatalog(source: MenuCatalog): MenuCatalog {
  const cleaned: MenuCatalog = {};

  Object.entries(source).forEach(([groupKey, items]) => {
    const seen = new Set<string>();
    cleaned[groupKey] = items
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        price: Number(item.price) || 0,
        image: item.image?.trim() || undefined,
      }))
      .filter((item) => {
        if (!item.name || seen.has(item.name)) return false;
        seen.add(item.name);
        return true;
      });
  });

  return cleaned;
}

async function save() {
  saving.value = true;
  try {
    const menuItems = cleanCatalog(catalog.value);
    const payload = { [props.dishes]: menuItems };

    if (menuRecordId.value) {
      await updateItem(props.fetchedCollection, menuRecordId.value, payload);
    } else {
      const created = await createItem("menu", {
        [props.dishes]: menuItems,
        active: emptyDayDishes(),
        sold_out: [],
        week_blocks: [],
        rotation: [],
        rotation_anchor: "",
        overrides: {},
      });
      menuRecordId.value = created.id;
    }

    catalog.value = normalizeMenuCatalog(menuItems);
    toast("Catalogo guardado");
  } catch {
    toast("No se pudo guardar el catalogo");
  } finally {
    saving.value = false;
  }
}

onMounted(load);

definePageMeta({
  layout: "staff",
});
</script>
