<template>
  <div class="min-h-screen bg-background text-foreground font-body">
    <Head>
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <Link
        href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </Head>

    <SeoMeta :follow="false" />

    <!-- Cargando -->
    <div v-if="pending" class="mx-auto max-w-lg px-5 pt-9 pb-40">
      <div class="flex flex-col items-center gap-3 text-center">
        <Skeleton class="h-24 w-24 rounded-full" />
        <div class="space-y-2 mt-2 flex flex-col items-center">
          <Skeleton class="h-3 w-24" />
          <Skeleton class="h-8 w-48" />
          <Skeleton class="h-4 w-32" />
        </div>
      </div>
      <div class="mt-12 space-y-3">
        <Skeleton class="h-3 w-24" />
        <Skeleton v-for="i in 4" :key="i" class="h-20 w-full rounded-xl" />
      </div>
      <div class="mt-8 space-y-3">
        <Skeleton class="h-3 w-24" />
        <Skeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-xl" />
      </div>
    </div>

    <!-- Error / sin menú publicado -->
    <div
      v-else-if="!record"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div class="max-w-sm">
        <p class="mb-4 text-5xl">🍽️</p>
        <h1 class="text-xl font-bold font-heading">
          {{
            loadError
              ? "No pudimos cargar el menú"
              : "El menú aún no está listo"
          }}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{
            loadError
              ? "Revisa tu conexión y vuelve a intentarlo."
              : "El restaurante publica el menú al abrir. Vuelve en un momento."
          }}
        </p>
        <Button variant="outline" size="sm" class="mt-4" @click="load">
          <ClientOnly><RotateCw :size="15" class="mr-2" /></ClientOnly>
          Reintentar
        </Button>
      </div>
    </div>

    <template v-else>
      <!-- Hero -->
      <header
        class="relative overflow-hidden border-b border-border bg-card shadow-sm"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none"
        ></div>

        <div
          class="relative mx-auto flex max-w-7xl items-center gap-5 px-5 py-4"
        >
          <div
            class="shrink-0 overflow-hidden rounded-full border-2 border-background bg-muted shadow-sm"
          >
            <img
              :src="logoSrc"
              alt="Logo del restaurante"
              class="h-16 w-16 object-cover sm:h-20 sm:w-20"
            />
          </div>

          <div class="flex flex-col justify-center">
            <p
              class="mb-0.5 text-xs font-bold uppercase tracking-widest text-primary"
            >
              Comida corrida
            </p>

            <h1
              class="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
            >
              Breezy Meals
            </h1>

            <p class="text-sm font-medium text-muted-foreground">
              Menú de hoy / Today's Menu
            </p>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-lg space-y-8 px-5 pb-44 pt-6">
        <!-- Instrucciones -->
        <section class="rounded-lg bg-primary/5 border border-primary/10 p-4">
          <h3 class="font-bold text-sm mb-2 flex items-center gap-2">
            <span>💡</span> How to order / Cómo pedir
          </h3>
          <ol
            class="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside"
          >
            <li>Select your dishes / Selecciona tus platillos.</li>
            <li>Choose delivery/pickup / Elige entrega o recoger.</li>
            <li>
              Fill in your name / <b>Ingresa tu nombre (required/requerido)</b>.
            </li>
            <li>Tap "Send" / Presiona "Enviar".</li>
          </ol>
        </section>

        <section
          v-for="group in groups"
          v-show="(active[group.key] || []).length"
          :key="group.key"
        >
          <div class="mb-3 flex items-baseline gap-3">
            <h2
              class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              {{ group.label }}
              <span
                class="ml-1 font-semibold tabular-nums text-foreground/50"
                >{{ (active[group.key] || []).length }}</span
              >
            </h2>
            <Separator class="shrink flex-1" />
          </div>

          <div class="space-y-2">
            <Card
              v-for="name in active[group.key]"
              :key="name"
              class="flex items-center gap-3 p-3 transition-colors"
              :class="[
                isOut(name) && 'opacity-60',
                cart[name] > 0 && 'bg-primary/5 ring-1 ring-primary/40',
              ]"
            >
              <div class="flex-1">
                <p
                  class="font-semibold leading-tight"
                  :class="isOut(name) && 'text-muted-foreground line-through'"
                >
                  {{ name }}
                </p>
                <Badge
                  v-if="isOut(name)"
                  variant="outline"
                  class="mt-1 border-destructive/30 bg-destructive/10 text-[10px] uppercase text-destructive"
                >
                  Agotado
                </Badge>
              </div>

              <div v-if="!isOut(name)" class="flex shrink-0 items-center gap-1">
                <template v-if="cart[name]">
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8"
                    :aria-label="`Quitar uno de ${name}`"
                    @click="setQty(name, -1)"
                  >
                    <ClientOnly><Minus :size="15" /></ClientOnly>
                  </Button>
                  <span
                    class="w-6 text-center font-bold tabular-nums"
                    aria-live="polite"
                    >{{ cart[name] }}</span
                  >
                </template>
                <Button
                  variant="outline"
                  size="icon"
                  class="h-8 w-8"
                  :aria-label="`Agregar ${name}`"
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
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            ¿Cómo lo quieres? / How do you want it?
          </h2>
          <Tabs v-model="mode">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger
                v-for="m in MODES"
                :key="m"
                :value="m"
                class="gap-1.5"
              >
                <ClientOnly>
                  <component
                    class="mx-auto"
                    :is="MODE_ICON[m] ?? Utensils"
                    :size="14"
                  />
                </ClientOnly>
                {{ MODE_SHORT[m] }}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <section>
          <h2
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Tus datos / Your Info
          </h2>
          <Card class="space-y-4 p-4">
            <div class="space-y-1.5">
              <Label for="c-name" class="flex items-center gap-1">
                Tu nombre / Your name <span class="text-destructive">*</span>
              </Label>
              <Input
                id="c-name"
                v-model="customer.name"
                placeholder="Ej. Juan Pérez / e.g. John Doe"
                :class="{
                  'border-destructive focus-visible:ring-destructive':
                    itemCount > 0 && !customer.name.trim(),
                }"
              />
              <p
                v-if="itemCount > 0 && !customer.name.trim()"
                class="text-[11px] text-destructive"
              >
                Required to complete your order / Requerido para completar tu
                pedido.
              </p>
            </div>

            <template v-if="mode === 'domicilio'">
              <div class="space-y-1.5">
                <Label for="c-phone">WhatsApp / Phone</Label>
                <Input
                  id="c-phone"
                  v-model="customer.phone"
                  type="tel"
                  placeholder="10 dígitos"
                />
              </div>

              <div class="space-y-1.5">
                <Label for="c-address" class="flex items-center gap-1">
                  Dirección / Address <span class="text-destructive">*</span>
                </Label>
                <Input
                  id="c-address"
                  v-model="customer.address"
                  placeholder="Calle, número, referencias"
                  :class="{
                    'border-destructive focus-visible:ring-destructive':
                      itemCount > 0 && needsAddress,
                  }"
                />
                <p
                  v-if="itemCount > 0 && needsAddress"
                  class="text-[11px] text-destructive"
                >
                  Required for delivery / Requerida para envíos a domicilio.
                </p>
              </div>
            </template>

            <div class="space-y-1.5">
              <Label for="c-time">{{ timeLabel }} (opcional/optional)</Label>
              <Input id="c-time" v-model="pickupTime" type="time" />
            </div>

            <div class="space-y-1.5">
              <Label for="c-note">Nota / Note (opcional/optional)</Label>
              <Textarea
                id="c-note"
                v-model="note"
                rows="2"
                placeholder="Sin cebolla, casa roja / No onions, red house…"
              />
            </div>
          </Card>
        </section>
      </main>

      <!-- Barra fija -->
      <div
        class="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-5 py-3 backdrop-blur"
      >
        <div class="mx-auto max-w-lg space-y-2">
          <div
            class="flex items-center justify-between text-xs text-muted-foreground"
          >
            <span class="tabular-nums">
              <template v-if="totalQty">
                {{ totalQty }} platillo{{ totalQty === 1 ? "" : "s" }} ·
                {{ MODE_LABEL[mode] }}
              </template>
              <template v-else>
                Tu pedido / Your order · {{ MODE_LABEL[mode] }}
              </template>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <Button
              v-if="totalQty"
              variant="outline"
              size="lg"
              class="shrink-0"
              @click="clearCart"
            >
              <ClientOnly><Trash2 :size="16" class="mr-2" /></ClientOnly>
              Vaciar
            </Button>
            <Button
              size="lg"
              class="flex-1"
              :disabled="!canSend"
              @click="sendOrder"
            >
              <ClientOnly><Send :size="17" class="mr-2" /></ClientOnly>
              Enviar / Send
            </Button>
          </div>

          <p
            v-if="itemCount && !canSend"
            class="text-[11px] text-muted-foreground text-center"
          >
            {{ hint }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.font-body {
  font-family: "Roboto", sans-serif;
}
.font-heading {
  font-family: "Alfa Slab One", cursive !important;
  font-weight: 300 !important;
  color: var(--primary) !important;
}
</style>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Badge } from "@common/components/ui/badge";
import { Separator } from "@common/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import { Textarea } from "@common/components/ui/textarea";
import { Skeleton } from "@common/components/ui/skeleton";
import {
  Plus,
  Minus,
  Send,
  Trash2,
  ShoppingBag,
  Bike,
  Utensils,
  RotateCw,
} from "lucide-vue-next";
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
const { openWhatsApp } = useWhatsappOrder();

const EMPTY_DISHES: DayDishes = { guisos: [], sides: [], bebidas: [] };
const RESTAURANT_WHATSAPP = "6221523259";

const MODE_ICON: Record<string, any> = {
  llevar: ShoppingBag,
  domicilio: Bike,
  comer: Utensils,
  aqui: Utensils,
  local: Utensils,
};

const record = ref<MenuRecord | null>(null);
const pending = ref(true);
const loadError = ref(false);

async function load() {
  pending.value = true;
  loadError.value = false;
  try {
    const res = await fetchCollection(
      "menu",
      1,
      1,
      "",
      "-created",
      null,
      null,
      true,
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

const logoSrc =
  "https://cdn.shopify.com/oxygen-v2/57245/154448/316060/3919871/assets/breezy-BBRcmAK6.png";

const cart = reactive<Record<string, number>>({});
const mode = ref<OrderMode>("llevar");
const note = ref("");
const pickupTime = ref("");
const customer = reactive({ name: "", phone: "", address: "" });

const timeLabel = computed(() =>
  mode.value === "domicilio" ? "Hora de entrega" : "Hora de recolección",
);

const cartItems = computed(() =>
  Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([name, qty]) => ({ name, qty })),
);

const itemCount = computed(() => cartItems.value.length);
const totalQty = computed(() =>
  cartItems.value.reduce((sum, it) => sum + it.qty, 0),
);

const needsAddress = computed(
  () => mode.value === "domicilio" && !customer.address.trim(),
);

const canSend = computed(
  () => itemCount.value > 0 && !!customer.name.trim() && !needsAddress.value,
);

const hint = computed(() =>
  !customer.name.trim()
    ? "Please enter your name to proceed / Ingresa tu nombre para continuar."
    : needsAddress.value
      ? "Address is required for delivery / Se requiere dirección para el envío."
      : "",
);

function setQty(n: string, d: number) {
  const q = (cart[n] || 0) + d;
  cart[n] = q <= 0 ? 0 : q;
}

function clearCart() {
  for (const k of Object.keys(cart)) cart[k] = 0;
}

function buildNote() {
  const pieces: string[] = [];
  if (pickupTime.value) {
    const verb = mode.value === "domicilio" ? "Entregar" : "Recoger";
    pieces.push(`${verb} a las ${pickupTime.value}`);
  }
  if (note.value.trim()) pieces.push(note.value.trim());
  return pieces.join(" · ");
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
    note: buildNote(),
    phone: customer.phone,
    address: customer.address,
  });
  openWhatsApp(text, RESTAURANT_WHATSAPP);
}
</script>
