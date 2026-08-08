<template>
  <div class="min-h-screen bg-background text-foreground font-body">
    <SeoMeta :follow="false" />

    <main class="mx-auto max-w-3xl px-5 py-6 space-y-6">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold font-heading">Crear tienda</h1>
          <p class="text-sm text-muted-foreground">
            Administra categorias y productos de la coleccion store.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            :disabled="loading || saving"
            @click="loadStore"
          >
            <ClientOnly><RotateCw :size="15" class="mr-2" /></ClientOnly>
            Recargar
          </Button>
          <Button :disabled="loading || saving" @click="saveStore">
            <ClientOnly><Save :size="15" class="mr-2" /></ClientOnly>
            {{ saving ? "Guardando..." : "Guardar" }}
          </Button>
        </div>
      </header>

      <Card class="p-4 border-primary/20 bg-primary/5">
        <p class="text-xs text-muted-foreground">
          Formato guardado: <b>{ categoria: [ { name, price } ] }</b>
        </p>
      </Card>

      <Card v-if="loading" class="p-4">
        <div class="space-y-3">
          <Skeleton class="h-4 w-40" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-20 w-full" />
        </div>
      </Card>

      <div v-else class="space-y-4">
        <Card
          v-for="(category, cIndex) in categories"
          :key="category.id"
          class="p-4 space-y-4"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="grid flex-1 min-w-[220px] gap-1.5">
              <Label :for="`cat-key-${category.id}`">Clave de categoria</Label>
              <Input
                :id="`cat-key-${category.id}`"
                v-model="category.key"
                placeholder="ej. guisos, bebidas, tortas_burgers_burritos"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-destructive"
              :aria-label="`Eliminar categoria ${category.key || cIndex + 1}`"
              @click="removeCategory(cIndex)"
            >
              <ClientOnly><Trash2 :size="16" /></ClientOnly>
            </Button>
          </div>

          <Separator />

          <div class="space-y-3">
            <div
              v-for="(item, iIndex) in category.items"
              :key="`${category.id}-item-${iIndex}`"
              class="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto] gap-2 items-end"
            >
              <div class="space-y-1.5">
                <Label :for="`item-name-${category.id}-${iIndex}`"
                  >Producto</Label
                >
                <Input
                  :id="`item-name-${category.id}-${iIndex}`"
                  v-model="item.name"
                  placeholder="Nombre del producto"
                />
              </div>

              <div class="space-y-1.5">
                <Label :for="`item-price-${category.id}-${iIndex}`"
                  >Precio</Label
                >
                <Input
                  :id="`item-price-${category.id}-${iIndex}`"
                  v-model.number="item.price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                class="mb-0.5"
                :aria-label="`Eliminar producto ${item.name || iIndex + 1}`"
                @click="removeItem(cIndex, iIndex)"
              >
                <ClientOnly><Trash2 :size="14" /></ClientOnly>
              </Button>
            </div>

            <Button variant="outline" size="sm" @click="addItem(cIndex)">
              <ClientOnly><Plus :size="14" class="mr-2" /></ClientOnly>
              Agregar producto
            </Button>
          </div>
        </Card>

        <Button variant="secondary" @click="addCategory">
          <ClientOnly><Plus :size="15" class="mr-2" /></ClientOnly>
          Agregar categoria
        </Button>
      </div>

      <Card
        v-if="saveError"
        class="p-3 border-destructive/30 bg-destructive/10"
      >
        <p class="text-sm text-destructive">{{ saveError }}</p>
      </Card>
      <Card v-if="successMsg" class="p-3 border-primary/20 bg-primary/5">
        <p class="text-sm text-primary">{{ successMsg }}</p>
      </Card>

      <Card class="p-4">
        <p
          class="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
        >
          Preview JSON
        </p>
        <pre
          class="text-xs whitespace-pre-wrap break-all text-muted-foreground"
          >{{ previewJson }}</pre
        >
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Separator } from "@common/components/ui/separator";
import { Skeleton } from "@common/components/ui/skeleton";
import { Plus, RotateCw, Save, Trash2 } from "lucide-vue-next";

definePageMeta({ layout: "breezy" });

type StoreItemForm = {
  name: string;
  price: number;
};

type StoreCategoryForm = {
  id: string;
  key: string;
  items: StoreItemForm[];
};

const STORE_COLLECTION = "store";

const { fetchCollection, createItem, updateItem } = usePocketBaseCore();

const loading = ref(true);
const saving = ref(false);
const saveError = ref("");
const successMsg = ref("");
const recordId = ref<string | null>(null);
const categories = ref<StoreCategoryForm[]>([]);
const writeMode = ref<"root" | "data" | "store" | "items" | "unknown">(
  "unknown",
);

const META_KEYS = new Set([
  "id",
  "collectionId",
  "collectionName",
  "created",
  "updated",
  "expand",
  "data",
  "store",
  "items",
]);

let rowSeq = 0;
function nextId() {
  rowSeq += 1;
  return `cat_${Date.now().toString(36)}_${rowSeq}`;
}

function normalizeCategoryKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/^_+|_+$/g, "");
}

function normalizePrice(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function toRecordPayload(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
    return null;
  }

  if (typeof raw === "object") {
    return raw as Record<string, unknown>;
  }

  return null;
}

function parseStorePayload(raw: unknown): StoreCategoryForm[] {
  const payload = toRecordPayload(raw);
  if (!payload) return [];

  const out: StoreCategoryForm[] = [];

  Object.entries(payload).forEach(([key, value]) => {
    if (!Array.isArray(value)) return;

    const items: StoreItemForm[] = value
      .map((entry) => {
        if (typeof entry === "string") {
          return { name: entry.trim(), price: 0 };
        }

        if (
          entry &&
          typeof entry === "object" &&
          "name" in entry &&
          typeof (entry as { name?: unknown }).name === "string"
        ) {
          const source = entry as { name: string; price?: unknown };
          return {
            name: source.name.trim(),
            price: normalizePrice(source.price),
          };
        }

        return null;
      })
      .filter((entry): entry is StoreItemForm => !!entry && !!entry.name);

    out.push({ id: nextId(), key, items });
  });

  return out;
}

function parseRootPayload(rec: Record<string, unknown>) {
  const root = Object.fromEntries(
    Object.entries(rec).filter(
      ([key, value]) => !META_KEYS.has(key) && Array.isArray(value),
    ),
  );
  return parseStorePayload(root);
}

function buildStorePayload() {
  const out: Record<string, Array<{ name: string; price: number }>> = {};

  categories.value.forEach((category) => {
    const key = normalizeCategoryKey(category.key);
    if (!key) return;

    const items = category.items
      .map((item) => ({
        name: item.name.trim(),
        price: normalizePrice(item.price),
      }))
      .filter((item) => item.name.length > 0);

    out[key] = items;
  });

  return out;
}

const previewJson = computed(() =>
  JSON.stringify(buildStorePayload(), null, 2),
);

function addCategory() {
  categories.value.push({
    id: nextId(),
    key: "",
    items: [{ name: "", price: 0 }],
  });
}

function removeCategory(index: number) {
  categories.value.splice(index, 1);
}

function addItem(categoryIndex: number) {
  categories.value[categoryIndex]?.items.push({ name: "", price: 0 });
}

function removeItem(categoryIndex: number, itemIndex: number) {
  categories.value[categoryIndex]?.items.splice(itemIndex, 1);
}

async function loadStore() {
  loading.value = true;
  saveError.value = "";
  successMsg.value = "";

  try {
    const res = await fetchCollection(
      STORE_COLLECTION,
      1,
      1,
      "",
      "-created",
      null,
      null,
      true,
    );

    const rec = res.items[0] as Record<string, unknown> | undefined;
    if (!rec) {
      recordId.value = null;
      categories.value = [];
      return;
    }

    recordId.value = String(rec.id ?? "") || null;

    if (Object.prototype.hasOwnProperty.call(rec, "data")) {
      writeMode.value = "data";
      categories.value = parseStorePayload(rec.data);
      return;
    }

    if (Object.prototype.hasOwnProperty.call(rec, "store")) {
      writeMode.value = "store";
      categories.value = parseStorePayload(rec.store);
      return;
    }

    if (Object.prototype.hasOwnProperty.call(rec, "items")) {
      writeMode.value = "items";
      categories.value = parseStorePayload(rec.items);
      return;
    }

    const parsedRoot = parseRootPayload(rec);
    if (parsedRoot.length) {
      writeMode.value = "root";
      categories.value = parsedRoot;
      return;
    }

    writeMode.value = "unknown";
    categories.value = [];
  } catch (error) {
    console.error("Load store failed", error);
    saveError.value = "No se pudo cargar la coleccion store.";
  } finally {
    loading.value = false;
  }
}

async function persistPayload(payload: Record<string, unknown>) {
  const payloadJson = JSON.stringify(payload);
  const attemptsByMode: Record<
    typeof writeMode.value,
    Array<Record<string, unknown>>
  > = {
    data: [
      { data: payload },
      { data: payloadJson },
      { store: payload },
      { store: payloadJson },
      payload,
    ],
    store: [
      { store: payload },
      { store: payloadJson },
      { data: payload },
      { data: payloadJson },
      payload,
    ],
    items: [
      { items: payload },
      { items: payloadJson },
      { store: payload },
      { data: payload },
      payload,
    ],
    root: [
      payload,
      { store: payload },
      { data: payload },
      { data: payloadJson },
    ],
    unknown: [
      { store: payload },
      { data: payload },
      { data: payloadJson },
      payload,
    ],
  };
  const attempts = attemptsByMode[writeMode.value];

  if (recordId.value) {
    for (const body of attempts) {
      try {
        return await updateItem(STORE_COLLECTION, recordId.value, body);
      } catch {
        // try next shape
      }
    }
  } else {
    for (const body of attempts) {
      try {
        return await createItem(STORE_COLLECTION, body);
      } catch {
        // try next shape
      }
    }
  }

  throw new Error("Could not persist store payload with known field names");
}

async function saveStore() {
  saving.value = true;
  saveError.value = "";
  successMsg.value = "";

  try {
    const payload = buildStorePayload();
    const saved = (await persistPayload(payload)) as Record<string, unknown>;

    if (!recordId.value && saved?.id) {
      recordId.value = String(saved.id);
    }

    successMsg.value = "Tienda guardada correctamente.";
  } catch (error) {
    console.error("Save store failed", error);
    saveError.value =
      "No se pudo guardar. Verifica permisos y el esquema real de la coleccion store (root, data, store o items).";
  } finally {
    saving.value = false;
  }
}

onMounted(loadStore);
</script>
