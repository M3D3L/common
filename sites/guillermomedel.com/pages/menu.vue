<template>
  <div class="min-h-screen bg-background text-foreground font-body">
    <SeoMeta :follow="false" />

    <!-- Cargando -->
    <div
      v-if="pending"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div class="animate-pulse">
        <p class="mb-4 text-5xl">🍽️</p>
        <p class="text-sm text-muted-foreground">Cargando el menú de hoy…</p>
      </div>
    </div>

    <!-- Error / sin menú publicado -->
    <div
      v-else-if="!record"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div class="max-w-sm">
        <p class="mb-4 text-5xl">🍽️</p>
        <h1 class="text-xl font-bold">
          {{
            loadError
              ? "No pudimos cargar el menú"
              : "El menú aún no está listo"
          }}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{
            loadError
              ? "Revisa tu conexión e inténtalo de nuevo."
              : "El restaurante todavía no publica el menú de hoy."
          }}
        </p>
        <Button variant="outline" size="sm" class="mt-4" @click="load">
          Reintentar
        </Button>
      </div>
    </div>

    <template v-else>
      <header class="px-5 pt-8 pb-4 border-b border-border">
        <div class="mx-auto max-w-lg">
          <p
            class="text-xs font-semibold tracking-wider uppercase text-muted-foreground"
          >
            Comida corrida
          </p>
          <h1
            class="text-2xl font-extrabold tracking-tight text-primary font-heading"
          >
            Menú de hoy
          </h1>
          <p v-if="record.label" class="text-sm text-muted-foreground">
            {{ record.label }}
          </p>
        </div>
      </header>

      <main class="px-5 pt-4 pb-40 mx-auto max-w-lg space-y-8">
        <section
          v-for="group in groups"
          v-show="active[group.key].length"
          :key="group.key"
        >
          <div class="flex items-baseline gap-3 mb-3">
            <h2
              class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
            >
              {{ group.label }}
            </h2>
            <Separator class="flex-1 shrink" />
          </div>

          <div class="space-y-2">
            <Card
              v-for="name in active[group.key]"
              :key="name"
              class="flex items-center gap-3 p-3"
              :class="isOut(name) && 'opacity-60'"
            >
              <div class="flex-1">
                <p
                  class="font-semibold leading-tight"
                  :class="isOut(name) && 'line-through text-muted-foreground'"
                >
                  {{ name }}
                </p>
                <Badge
                  v-if="isOut(name)"
                  variant="outline"
                  class="mt-1 text-[10px] uppercase text-destructive border-destructive/30 bg-destructive/10"
                >
                  Agotado
                </Badge>
              </div>

              <div v-if="!isOut(name)" class="flex items-center gap-1 shrink-0">
                <template v-if="cart[name]">
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8"
                    @click="setQty(name, -1)"
                  >
                    <ClientOnly><Minus :size="15" /></ClientOnly>
                  </Button>
                  <span class="w-6 font-bold text-center tabular-nums">{{
                    cart[name]
                  }}</span>
                </template>
                <Button
                  variant="outline"
                  size="icon"
                  class="h-8 w-8"
                  @click="setQty(name, 1)"
                >
                  <ClientOnly><Plus :size="15" /></ClientOnly>
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2
            class="mb-2 text-xs font-bold tracking-widest uppercase text-muted-foreground"
          >
            ¿Cómo lo quieres?
          </h2>
          <Tabs v-model="mode">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger v-for="m in MODES" :key="m" :value="m">
                {{ MODE_SHORT[m] }}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <section class="space-y-2">
          <div class="space-y-1">
            <Label for="c-name">Tu nombre</Label>
            <Input
              id="c-name"
              v-model="customer.name"
              placeholder="¿A nombre de quién?"
            />
          </div>

          <template v-if="mode === 'domicilio'">
            <div class="space-y-1">
              <Label for="c-phone">WhatsApp</Label>
              <Input
                id="c-phone"
                v-model="customer.phone"
                type="tel"
                placeholder="10 dígitos"
              />
            </div>
            <div class="space-y-1">
              <Label for="c-address">Dirección de entrega</Label>
              <Input
                id="c-address"
                v-model="customer.address"
                placeholder="Calle, número, referencias"
              />
            </div>
          </template>

          <div class="space-y-1">
            <Label for="c-note">Nota (opcional)</Label>
            <Input
              id="c-note"
              v-model="note"
              placeholder="Sin cebolla, extra salsa…"
            />
          </div>
        </section>
      </main>

      <!-- Barra fija de envío -->
      <div
        class="fixed inset-x-0 bottom-0 px-5 py-3 border-t border-border bg-background/95 backdrop-blur"
      >
        <div class="flex items-center gap-3 mx-auto max-w-lg">
          <div class="text-sm">
            <p class="font-bold tabular-nums">
              {{ itemCount }} platillo{{ itemCount === 1 ? "" : "s" }}
            </p>
            <p class="text-xs text-muted-foreground">{{ MODE_LABEL[mode] }}</p>
          </div>
          <Button
            size="lg"
            class="flex-1"
            :disabled="!canSend"
            @click="sendOrder"
          >
            <ClientOnly><Send :size="17" class="mr-2" /></ClientOnly>
            Enviar por WhatsApp
          </Button>
        </div>
        <p
          v-if="itemCount && !canSend"
          class="mx-auto max-w-lg mt-1.5 text-[11px] text-muted-foreground"
        >
          {{ hint }}
        </p>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Badge } from "@common/components/ui/badge";
import { Separator } from "@common/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import { Plus, Minus, Send } from "lucide-vue-next";
import {
  groups,
  MODES,
  MODE_SHORT,
  type DayDishes,
  type MenuRecord,
} from "~/utils/comandas";
import { MODE_LABEL, type OrderMode } from "~/composables/useWhatsappOrder";

definePageMeta({ layout: "none" });

const { fetchCollection } = usePocketBaseCore();
const { formatCustomerOrder } = useMenuLink();
const { waLink } = useWhatsappOrder();

const EMPTY_DISHES: DayDishes = { guisos: [], sides: [], bebidas: [] };

/* ===== Menú (solo lectura desde PocketBase) ===== */
const record = ref<MenuRecord | null>(null);
const pending = ref(true);
const loadError = ref(false);

async function load() {
  pending.value = true;
  loadError.value = false;
  try {
    // Un solo registro en la colección. Solo se lee, nunca se escribe.
    const res = await fetchCollection(
      "menu",
      1,
      1,
      "",
      "-created",
      null,
      null,
      true, // ignoreCache: los agotados cambian durante el turno
    );
    record.value = (res.items[0] as unknown as MenuRecord) ?? null;
  } catch {
    loadError.value = true;
    record.value = null;
  } finally {
    pending.value = false;
  }
}

onMounted(load);

const active = computed<DayDishes>(() => record.value?.active ?? EMPTY_DISHES);
const soldOut = computed<string[]>(() => record.value?.sold_out ?? []);
const isOut = (n: string) => soldOut.value.includes(n);

/* ===== Pedido del cliente (estado local, no toca la BD) ===== */
const cart = reactive<Record<string, number>>({});
const mode = ref<OrderMode>("llevar");
const note = ref("");
const customer = reactive({ name: "", phone: "", address: "" });

const itemCount = computed(
  () => Object.values(cart).filter((q) => q > 0).length,
);

const needsAddress = computed(
  () => mode.value === "domicilio" && !customer.address.trim(),
);

const canSend = computed(
  () => itemCount.value > 0 && !!customer.name.trim() && !needsAddress.value,
);

const hint = computed(() =>
  !customer.name.trim()
    ? "Agrega tu nombre para enviar."
    : needsAddress.value
      ? "Agrega tu dirección para enviar."
      : "",
);

function setQty(n: string, d: number) {
  const q = (cart[n] || 0) + d;
  cart[n] = q <= 0 ? 0 : q;
}

function sendOrder() {
  if (!record.value || !canSend.value) return;
  const a = record.value.active;
  const text = formatCustomerOrder({
    name: customer.name,
    cart,
    mode: mode.value,
    guisos: a.guisos ?? [],
    sides: a.sides ?? [],
    bebidas: a.bebidas ?? [],
    note: note.value,
    phone: customer.phone,
    address: customer.address,
  });
  window.open(waLink(text, record.value.whatsapp || ""), "_blank");
}
</script>
