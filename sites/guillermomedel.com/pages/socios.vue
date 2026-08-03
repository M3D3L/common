<template>
  <section class="lg:max-w-3xl px-4 pt-8 pb-28 mx-auto">
    <!-- Encabezado -->
    <div class="flex items-baseline justify-between mb-2">
      <div class="flex items-baseline gap-3">
        <h2 class="text-xl font-bold">Socios</h2>
        <span class="text-xs text-muted-foreground tabular-nums">
          {{ currentPeriod() }}
        </span>
      </div>
      <Button size="sm" @click="openAdd()">
        <ClientOnly><UserPlus :size="15" class="mr-1.5" /></ClientOnly>
        Nuevo socio
      </Button>
    </div>
    <p class="mb-6 text-muted-foreground">
      Busca por código o nombre para registrar una comida, dar de alta socios o
      ajustar sus créditos del mes.
    </p>

    <!-- Búsqueda -->
    <Card class="p-4 mb-6 space-y-4">
      <div class="space-y-1.5">
        <Label for="search">Código o nombre</Label>
        <div class="flex gap-2">
          <Input
            id="search"
            v-model="term"
            autocomplete="off"
            placeholder="Ej. GM1234 o Guillermo"
            class="uppercase-code"
            @keyup.enter="runSearch"
          />
          <Button :disabled="loading || !term.trim()" @click="runSearch">
            <ClientOnly><Search :size="16" /></ClientOnly>
          </Button>
        </div>
      </div>

      <!-- Varias coincidencias: elegir -->
      <div v-if="status === 'choose'" class="space-y-2 pt-2">
        <p
          class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
        >
          {{ candidates.length }} coincidencias
        </p>
        <div class="space-y-1.5">
          <button
            v-for="c in candidates"
            :key="c.id"
            class="flex items-center w-full gap-3 p-2.5 text-left border rounded-lg border-border hover:border-primary transition-colors bg-card hover:bg-muted/50"
            @click="pick(c)"
          >
            <span class="font-semibold">{{ c.name }}</span>
            <span class="text-xs text-muted-foreground tabular-nums">{{
              c.phone
            }}</span>
            <Badge variant="outline" class="ml-auto tabular-nums">{{
              c.member_code
            }}</Badge>
          </button>
        </div>
      </div>

      <p
        v-else-if="searched && !member && status !== 'searching'"
        class="text-sm text-muted-foreground pt-1"
      >
        Sin resultados. Revisa el código o
        <button
          class="font-semibold underline hover:text-foreground"
          @click="openAdd(term)"
        >
          da de alta un socio nuevo</button
        >.
      </p>
    </Card>

    <!-- Ficha del socio -->
    <Card v-if="member" class="overflow-hidden mb-6">
      <!-- Cabecera de la ficha -->
      <div class="p-5 border-b border-border bg-muted/30 space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold leading-tight">{{ member.name }}</h3>
              <Badge
                v-if="member.status !== 'active'"
                variant="outline"
                class="uppercase text-[10px]"
              >
                {{ statusLabel(member.status) }}
              </Badge>
            </div>
            <p class="text-sm text-muted-foreground tabular-nums">
              {{ member.phone }}
            </p>
          </div>
          <Badge
            class="tabular-nums bg-primary/10 text-primary hover:bg-primary/10"
          >
            {{ member.member_code }}
          </Badge>
        </div>

        <!-- Dirección editable -->
        <div class="pt-1">
          <div
            v-if="!editingAddress"
            class="flex items-start justify-between text-sm"
          >
            <div class="flex items-start gap-2 text-muted-foreground">
              <span>📍</span>
              <span class="text-foreground">
                {{ member.address || "Sin dirección en archivo" }}
              </span>
            </div>
            <button
              class="text-xs font-semibold text-muted-foreground hover:text-foreground shrink-0 ml-2"
              @click="startEditAddress"
            >
              Editar
            </button>
          </div>
          <div v-else class="space-y-2">
            <Input
              v-model="addressDraft"
              placeholder="Calle, número, referencias"
            />
            <div class="flex gap-2">
              <Button size="sm" :disabled="busy" @click="saveAddress">
                Guardar dirección
              </Button>
              <Button size="sm" variant="ghost" @click="editingAddress = false">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cuerpo de la ficha -->
      <div class="p-5 space-y-6">
        <!-- Con membresía activa este mes -->
        <template v-if="membership">
          <div
            class="flex items-end justify-between bg-muted/20 p-4 rounded-xl border border-border/50"
          >
            <div class="space-y-0.5">
              <p
                class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Comidas este mes
              </p>
              <p class="text-3xl font-black tabular-nums">
                {{ remaining
                }}<span class="text-lg text-muted-foreground"
                  >/{{ membership.credits_total }}</span
                >
              </p>
            </div>
            <div class="text-right text-xs text-muted-foreground">
              <p>Vence</p>
              <p class="font-semibold tabular-nums text-foreground">
                {{ fmtDate(membership.expires_date) }}
              </p>
            </div>
          </div>

          <!-- Colocar orden -->
          <Button as-child size="lg" class="w-full">
            <NuxtLink :to="`/orders?code=${member.member_code}`">
              <ClientOnly><ClipboardList :size="18" class="mr-2" /></ClientOnly>
              Colocar orden
            </NuxtLink>
          </Button>

          <!-- Estado (solo lectura) -->
          <div
            v-if="status === 'exhausted'"
            class="p-3 text-xs text-center border rounded-lg text-muted-foreground border-border bg-muted/30"
          >
            Ya usó sus {{ membership.credits_total }} comidas de este mes.
          </div>
          <div
            v-else-if="status === 'expired'"
            class="p-3 text-xs text-center border rounded-lg text-muted-foreground border-border bg-muted/30"
          >
            La membresía de este mes venció.
          </div>

          <!-- Agregar comidas -->
          <div class="grid grid-cols-2 gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              :disabled="busy"
              @click="addMeals(1)"
            >
              <ClientOnly><Plus :size="15" class="mr-1.5" /></ClientOnly>
              Agregar 1 comida
            </Button>
            <Button
              size="sm"
              variant="outline"
              :disabled="busy"
              @click="addMeals(5)"
            >
              <ClientOnly><Plus :size="15" class="mr-1.5" /></ClientOnly>
              Agregar 5 comidas
            </Button>
          </div>
        </template>

        <!-- Sin membresía este mes -->
        <template v-else>
          <div class="py-2 text-center space-y-4">
            <div class="space-y-1">
              <p class="font-semibold">Sin membresía este mes</p>
              <p class="text-sm text-muted-foreground">
                Este socio no tiene comidas para {{ currentPeriod() }}.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                :disabled="working || busy"
                @click="addMeals(1)"
              >
                <ClientOnly><Plus :size="16" class="mr-1.5" /></ClientOnly>
                Dar 1 comida
              </Button>
              <Button :disabled="working || busy" @click="doIssue">
                <ClientOnly><Plus :size="16" class="mr-1.5" /></ClientOnly>
                Dar 5 comidas
              </Button>
            </div>
            <Button as-child variant="outline" size="sm" class="w-full">
              <NuxtLink :to="`/orders?code=${member.member_code}`">
                <ClientOnly
                  ><ClipboardList :size="15" class="mr-1.5"
                /></ClientOnly>
                Colocar orden (sin crédito)
              </NuxtLink>
            </Button>
          </div>
        </template>

        <Separator />

        <!-- Historial -->
        <div class="space-y-3">
          <p
            class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
          >
            Historial
          </p>
          <div v-if="history.length" class="space-y-1">
            <div
              v-for="h in history"
              :key="h.id"
              class="flex items-center gap-2 py-2 text-sm border-b border-dashed border-border last:border-0"
              :class="h.voided && 'opacity-40 line-through'"
            >
              <span class="shrink-0">{{ kindIcon(h) }}</span>
              <span class="flex-1">
                {{ kindLabel(h) }}
                <span v-if="h.reason" class="text-muted-foreground"
                  >· {{ h.reason }}</span
                >
              </span>
              <span class="text-xs text-muted-foreground tabular-nums">
                {{ fmtDateTime(h.redeemed_at) }}
              </span>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">
            Sin movimientos aún.
          </p>
        </div>
      </div>
    </Card>

    <!-- Alta de socio -->
    <Card v-if="adding" class="p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-lg">Nuevo socio</h3>
        <button
          class="text-muted-foreground hover:text-foreground"
          @click="adding = false"
        >
          <ClientOnly><X :size="18" /></ClientOnly>
        </button>
      </div>
      <div class="space-y-4">
        <div class="space-y-1.5">
          <Label for="n-name"
            >Nombre <span class="text-destructive">*</span></Label
          >
          <Input
            id="n-name"
            v-model="form.name"
            placeholder="Nombre completo"
          />
        </div>
        <div class="space-y-1.5">
          <Label for="n-phone"
            >Teléfono <span class="text-destructive">*</span></Label
          >
          <Input
            id="n-phone"
            v-model="form.phone"
            type="tel"
            placeholder="10 dígitos"
          />
        </div>
        <div class="space-y-1.5">
          <Label for="n-address">Dirección (opcional)</Label>
          <Input
            id="n-address"
            v-model="form.address"
            placeholder="Para envíos a domicilio"
          />
        </div>

        <!-- Shadcn Checkbox Component integrated -->
        <div class="flex items-center space-x-2 pt-1">
          <Checkbox id="issue-now" v-model:checked="form.issueNow" />
          <Label for="issue-now" class="text-sm font-normal cursor-pointer">
            Dar 5 comidas de {{ currentPeriod() }} al crear
          </Label>
        </div>

        <Button
          class="w-full mt-2"
          :disabled="busy || !form.name.trim() || !form.phone.trim()"
          @click="doCreate"
        >
          {{ busy ? "Creando…" : "Crear socio" }}
        </Button>
        <p v-if="createError" class="text-xs text-destructive">
          {{ createError }}
        </p>
      </div>
    </Card>

    <!-- Toast -->
    <div
      v-if="toastMsg"
      class="fixed z-50 px-4 py-2 text-sm -translate-x-1/2 rounded-lg bottom-6 left-1/2 bg-foreground text-background shadow-lg"
    >
      {{ toastMsg }}
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Checkbox } from "@common/components/ui/checkbox";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Badge } from "@common/components/ui/badge";
import { Search, Plus, UserPlus, ClipboardList, X } from "lucide-vue-next";
import usePocketBase from "@common/composables/usePocketbase";
import type { Member, Redemption } from "~/types/membership";

// --- composables (todas autenticadas; sin hooks ni lecturas públicas) ---
const checkIn = useCheckIn();
const members = useMembers();
const memberships = useMemberships();
const redemptions = useRedemptions();

const { currentPeriod } = memberships;

// spine reactivo del check-in
const { member, membership, candidates, status, loading, working, remaining } =
  checkIn;

// --- estado local de la pantalla ---
const term = ref("");
const searched = ref(false);
const busy = ref(false);
const toastMsg = ref("");

const history = ref<Redemption[]>([]);

const editingAddress = ref(false);
const addressDraft = ref("");

const adding = ref(false);
const createError = ref("");
const form = reactive({ name: "", phone: "", address: "", issueNow: true });

// --- toast ---
let toastTimer: ReturnType<typeof setTimeout> | undefined;
function toast(m: string) {
  toastMsg.value = m;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastMsg.value = ""), 2200);
}

// --- helpers de formato ---
function statusLabel(s: Member["status"]) {
  return s === "dormant"
    ? "Inactivo"
    : s === "archived"
      ? "Archivado"
      : "Activo";
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function kindIcon(h: Redemption) {
  if (h.kind === "meal") return "🍽️";
  if (h.kind === "adjustment") return h.amount >= 0 ? "🎁" : "↩️";
  return "➕";
}
function kindLabel(h: Redemption) {
  if (h.kind === "meal") return "Comida";
  if (h.kind === "adjustment")
    return `${h.amount >= 0 ? "+" : ""}${h.amount} crédito${Math.abs(h.amount) === 1 ? "" : "s"}`;
  return "Renovación";
}

// --- carga de historial cuando cambia el socio ---
async function loadHistory() {
  if (!member.value) {
    history.value = [];
    return;
  }
  try {
    const r = await redemptions.memberHistory(member.value.id, 1, 30);
    history.value = r.items as Redemption[];
  } catch {
    history.value = [];
  }
}
watch(member, loadHistory);

/**
 * Refresca TODO: re-lee el socio (para ver cambios como la dirección), su
 * membresía y su historial. Clave: re-buscamos el socio por id en vez de
 * reusar el objeto viejo, para que la UI refleje los cambios guardados.
 */
async function refresh() {
  if (!member.value) return;
  const fresh = await members.getMember(member.value.id);
  await checkIn.select(fresh); // fija member, membership y status
  await loadHistory();
}

// --- búsqueda ---
async function runSearch() {
  if (!term.value.trim()) return;
  searched.value = true;
  adding.value = false;
  await checkIn.lookup(term.value.trim());
}
async function pick(c: Member) {
  await checkIn.select(c);
}

// --- acciones de crédito ---
// Nota: registrar comida y ajustes (regalar/reembolsar/renovar) se quitaron
// por ahora. El registro de comidas se hará al capturar la orden; los ajustes
// se hacen directo en el admin de PocketBase mientras tanto.

async function doIssue() {
  try {
    await checkIn.issueThisMonth(5);
    toast("Membresía creada ✅");
    await refresh();
  } catch (e: any) {
    console.error("issue failed:", e);
    toast(e?.message ?? "No se pudo crear la membresía");
  }
}

/**
 * Agrega comidas al mes en curso (pago / renovación). Usa topUp, que escribe
 * SOLO en `memberships` (updateItem/createItem) — no toca `redemptions`, por
 * eso funciona aunque registrar comida aún no. Si no hay membresía este mes,
 * topUp crea una nueva con esas comidas.
 */
async function addMeals(n: number) {
  if (!member.value) return;
  busy.value = true;
  try {
    await memberships.topUp(member.value.id, n);
    toast(`+${n} comida${n === 1 ? "" : "s"} ✅`);
    await refresh();
  } catch (e: any) {
    console.error("addMeals failed:", e);
    toast(e?.message ?? "No se pudo agregar comidas");
  } finally {
    busy.value = false;
  }
}

// --- dirección en archivo (confirmada a mano) ---
function startEditAddress() {
  addressDraft.value = member.value?.address ?? "";
  editingAddress.value = true;
}
async function saveAddress() {
  if (!member.value) return;
  busy.value = true;
  try {
    // Asigna directo el registro devuelto -> la UI se actualiza al instante.
    member.value = await members.updateMember(member.value.id, {
      address: addressDraft.value.trim(),
    });
    editingAddress.value = false;
    toast("Dirección actualizada ✅");
  } catch (e: any) {
    console.error("address save failed:", e);
    toast(e?.message ?? "No se pudo actualizar la dirección");
  } finally {
    busy.value = false;
  }
}

// --- alta de socio ---
function openAdd(prefill?: string) {
  adding.value = true;
  createError.value = "";
  form.name = typeof prefill === "string" ? prefill : "";
  form.phone = "";
  form.address = "";
  form.issueNow = true;
}
async function doCreate() {
  createError.value = "";
  busy.value = true;
  try {
    const created = (await members.createMember({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || undefined,
    })) as Member;
    if (form.issueNow) {
      await memberships.issueMembership(created.id, { credits: 5 });
    }
    adding.value = false;
    toast(`Socio creado — código ${created.member_code}`);
    await checkIn.select(created); // abre la ficha del nuevo socio
    term.value = created.member_code;
  } catch (e: any) {
    createError.value = e?.message ?? "No se pudo crear el socio";
  } finally {
    busy.value = false;
  }
}

definePageMeta({
  layout: "staff",
  middleware: defineNuxtRouteMiddleware(() => {
    const pb = usePocketBase();
    if (!pb.authStore.isValid || pb.authStore.model?.verified !== true)
      return navigateTo("/");
  }),
});
</script>
