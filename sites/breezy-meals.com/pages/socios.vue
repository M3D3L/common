<template>
  <section class="lg:max-w-3xl px-4 pt-8 pb-28 mx-auto">
    <!-- Encabezado -->
    <div class="flex items-baseline justify-between mb-2">
      <div class="flex items-baseline gap-3">
        <h2 class="text-xl font-bold">Socios</h2>
      </div>
      <Button size="sm" @click="openAdd()">
        <ClientOnly><UserPlus :size="15" class="mr-1.5" /></ClientOnly>
        Nuevo socio
      </Button>
    </div>
    <p class="mb-6 text-muted-foreground">
      Busca por código o nombre para registrar una comida, dar de alta socios o
      ajustar sus créditos.
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

    <!-- Lista completa de socios -->
    <div class="mb-6 border rounded-lg border-border bg-card overflow-hidden">
      <div class="flex items-center justify-between gap-3 p-3">
        <button
          class="flex items-center min-w-0 gap-2 text-left font-semibold"
          :aria-expanded="membersDrawerOpen"
          @click="membersDrawerOpen = !membersDrawerOpen"
        >
          <Users :size="16" class="shrink-0" />
          <span>Todos los socios</span>
          <Badge variant="secondary" class="tabular-nums">
            {{ filteredMembers.length }}
          </Badge>
        </button>
        <div class="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            :disabled="listLoading"
            title="Actualizar lista"
            @click="loadMembers"
          >
            <RefreshCw :size="16" :class="listLoading && 'animate-spin'" />
            <span class="sr-only">Actualizar lista</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            :aria-label="membersDrawerOpen ? 'Ocultar socios' : 'Ver socios'"
            @click="membersDrawerOpen = !membersDrawerOpen"
          >
            <ChevronDown
              :size="18"
              class="transition-transform"
              :class="membersDrawerOpen && 'rotate-180'"
            />
          </Button>
        </div>
      </div>

      <div
        v-show="membersDrawerOpen"
        class="px-3 pb-3 space-y-3 border-t border-border"
      >
        <div v-if="adding" class="pt-3 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg">Nuevo socio</h3>
            <Button
              variant="ghost"
              size="icon"
              title="Cancelar"
              @click="adding = false"
            >
              <X :size="18" />
              <span class="sr-only">Cancelar</span>
            </Button>
          </div>
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
          <div class="flex items-center space-x-2 pt-1">
            <Checkbox id="issue-now" v-model:checked="form.issueNow" />
            <Label for="issue-now" class="text-sm font-normal cursor-pointer">
              Dar 5 comidas al crear
            </Label>
          </div>
          <Button
            class="w-full"
            :disabled="busy || !form.name.trim() || !form.phone.trim()"
            @click="doCreate"
          >
            {{ busy ? "Creando…" : "Crear socio" }}
          </Button>
          <p v-if="createError" class="text-xs text-destructive">
            {{ createError }}
          </p>
        </div>
        <template v-else>
          <Button class="w-full mt-3" @click="openAdd()">
            <UserPlus :size="15" class="mr-1.5" />
            Nuevo socio
          </Button>
          <p v-if="listLoading" class="text-sm text-muted-foreground">
            Cargando socios...
          </p>
          <p
            v-else-if="!allMembers.length"
            class="text-sm text-muted-foreground"
          >
            No hay socios registrados.
          </p>
          <p
            v-else-if="!filteredMembers.length"
            class="text-sm text-muted-foreground"
          >
            No hay coincidencias para "{{ term.trim() }}".
          </p>
          <div v-else class="max-h-[28rem] space-y-1.5 overflow-y-auto">
            <div
              v-for="c in filteredMembers"
              :key="c.id"
              class="flex items-center gap-2 p-2.5 border rounded-lg border-border bg-card"
            >
              <button
                class="flex items-center min-w-0 flex-1 gap-3 text-left hover:text-primary transition-colors"
                @click="pick(c)"
              >
                <span class="font-semibold truncate">{{ c.name }}</span>
                <span
                  class="text-xs text-muted-foreground tabular-nums truncate"
                  >{{ c.phone }}</span
                >
                <Badge variant="outline" class="ml-auto tabular-nums shrink-0">
                  {{ c.member_code }}
                </Badge>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Ficha del socio -->
    <Card v-if="member" class="overflow-hidden mb-6">
      <!-- Cabecera de la ficha -->
      <div class="p-5 border-b border-border bg-muted/30 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <div v-if="!editingIdentity" class="space-y-1">
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold leading-tight">
                  {{ member.name }}
                </h3>
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
              <button
                class="text-xs font-semibold text-muted-foreground hover:text-foreground"
                @click="startEditIdentity"
              >
                Editar nombre y teléfono
              </button>
              <div>
                <Badge
                  class="tabular-nums bg-primary/10 text-primary hover:bg-primary/10"
                >
                  {{ member.member_code }}
                </Badge>
              </div>
            </div>
            <div v-else class="space-y-2">
              <Input
                v-model="nameDraft"
                :disabled="busy"
                placeholder="Nombre completo"
              />
              <Input
                v-model="phoneDraft"
                :disabled="busy"
                type="tel"
                placeholder="10 dígitos"
              />
              <div class="flex gap-2">
                <Button
                  size="sm"
                  :disabled="busy || !nameDraft.trim() || !phoneDraft.trim()"
                  @click="saveIdentity"
                >
                  Guardar datos
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  :disabled="busy"
                  @click="editingIdentity = false"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>

          <div class="shrink-0">
            <MoleculesButtonWrapper
              :id="member.id"
              :deletable="false"
              :editable="false"
              @print="printMemberCard"
              @download="downloadMemberCard"
            >
              <div ref="memberCardRef">
                <AtomsMemberCard :member="member" />
              </div>
            </MoleculesButtonWrapper>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          :disabled="!member.phone"
          @click="sendSummary"
        >
          <ClientOnly><MessageCircle :size="15" class="mr-1.5" /></ClientOnly>
          Enviar resumen por WhatsApp
        </Button>

        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button
              variant="ghost"
              size="sm"
              class="text-destructive hover:text-destructive"
              :disabled="deleting || busy"
            >
              <Trash2 :size="15" class="mr-1.5" />
              Archivar socio
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle
                >¿Archivar a {{ member.name }}?</AlertDialogTitle
              >
              <AlertDialogDescription>
                El socio dejará de aparecer en la lista activa. Sus créditos e
                historial se conservarán y podrás recuperarlo desde PocketBase.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                @click="archiveSelected"
              >
                Archivar socio
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
        <!-- Con saldo de comidas -->
        <template v-if="membership">
          <div
            class="flex items-end justify-between bg-muted/20 p-4 rounded-xl border border-border/50"
          >
            <div class="space-y-0.5">
              <p
                class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Comidas disponibles
              </p>
              <p class="text-3xl font-black tabular-nums">
                {{ remaining
                }}<span class="text-lg text-muted-foreground"
                  >/{{ membership.credits_total }}</span
                >
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
            Ya usó sus {{ membership.credits_total }} comidas disponibles.
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

        <!-- Sin saldo de comidas -->
        <template v-else>
          <div class="py-2 text-center space-y-4">
            <div class="space-y-1">
              <p class="font-semibold">Sin comidas disponibles</p>
              <p class="text-sm text-muted-foreground">
                Este socio todavía no tiene un saldo de comidas.
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
  Search,
  Plus,
  UserPlus,
  ClipboardList,
  MessageCircle,
  X,
  Users,
  RefreshCw,
  Trash2,
  ChevronDown,
} from "lucide-vue-next";
import usePocketBase from "@common/composables/usePocketbase";
import useCheckIn from "~/composables/useCheckIn";
import useMembers from "~/composables/useMembers";
import useMemberships from "~/composables/useMemberships";
import useRedemptions from "~/composables/useRedemptions";
import { useLabelExport } from "~/composables/useLabelExport";
import type { Member, Redemption } from "~/types/membership";

// --- composables (todas autenticadas; sin hooks ni lecturas públicas) ---
const checkIn = useCheckIn();
const members = useMembers();
const memberships = useMemberships();
const redemptions = useRedemptions();
const { openWhatsApp } = useWhatsappOrder();

// spine reactivo del check-in
const { member, membership, candidates, status, loading, working, remaining } =
  checkIn;

// --- estado local de la pantalla ---
const term = ref("");
const searched = ref(false);
const busy = ref(false);
const listLoading = ref(false);
const toastMsg = ref("");
const allMembers = ref<Member[]>([]);
const membersDrawerOpen = ref(true);
const deleting = ref(false);
const lastSearchTerm = ref("");

const listFilterTerm = computed(() => {
  const live = term.value.trim();
  if (live) return live;
  return searched.value ? lastSearchTerm.value.trim() : "";
});

const filteredMembers = computed(() => {
  const q = listFilterTerm.value.toLocaleLowerCase("es-MX");
  if (!q) return allMembers.value;

  return allMembers.value.filter((m) => {
    const name = (m.name ?? "").toLocaleLowerCase("es-MX");
    const code = (m.member_code ?? "").toLocaleLowerCase("es-MX");
    const phone = (m.phone ?? "").toLocaleLowerCase("es-MX");
    return name.includes(q) || code.includes(q) || phone.includes(q);
  });
});

const history = ref<Redemption[]>([]);

const editingIdentity = ref(false);
const nameDraft = ref("");
const phoneDraft = ref("");

const editingAddress = ref(false);
const addressDraft = ref("");

const adding = ref(false);
const createError = ref("");
const form = reactive({ name: "", phone: "", address: "", issueNow: true });

const memberCardRef = ref<HTMLElement | null>(null);

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
  const q = term.value.trim();
  if (!q) return;
  searched.value = true;
  lastSearchTerm.value = q;
  adding.value = false;
  await checkIn.lookup(q);
}
async function pick(c: Member) {
  await checkIn.select(c);
  membersDrawerOpen.value = false;
}
async function loadMembers() {
  listLoading.value = true;
  try {
    const firstPage = await members.listMembers();
    const pages: Array<{ items: unknown[] }> = await Promise.all(
      Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, i) =>
        members.listMembers(i + 2),
      ),
    );
    allMembers.value = [
      ...(firstPage.items as Member[]),
      ...pages.flatMap((page) => page.items as Member[]),
    ];
  } catch (e) {
    console.error("Could not load members:", e);
    allMembers.value = [];
  } finally {
    listLoading.value = false;
  }
}
async function archiveSelected() {
  if (!member.value) return;
  deleting.value = true;
  try {
    const archivedId = member.value.id;
    await members.archiveMember(archivedId);
    allMembers.value = allMembers.value.filter((m) => m.id !== archivedId);
    checkIn.reset();
    history.value = [];
    membersDrawerOpen.value = true;
    toast("Socio archivado");
  } catch (e: any) {
    console.error("archive failed:", e);
    toast(e?.message ?? "No se pudo archivar el socio");
  } finally {
    deleting.value = false;
  }
}

// --- acciones de crédito ---
// Nota: registrar comida y ajustes (regalar/reembolsar/renovar) se quitaron
// por ahora. El registro de comidas se hará al capturar la orden; los ajustes
// se hacen directo en el admin de PocketBase mientras tanto.

async function doIssue() {
  try {
    await checkIn.issueCredits(5);
    toast("Membresía creada ✅");
    await refresh();
  } catch (e: any) {
    console.error("issue failed:", e);
    toast(e?.message ?? "No se pudo crear la membresía");
  }
}

/**
 * Agrega comidas al saldo (pago / renovación). Usa topUp, que escribe
 * SOLO en `memberships` (updateItem/createItem) — no toca `redemptions`, por
 * eso funciona aunque registrar comida aún no. Si no hay membresía,
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

// --- resumen por WhatsApp ---
// El mensaje se arma aquí (no en el composable): esta pantalla es la única
// dueña de qué datos del socio mostrar; el composable solo sabe mandar texto.
function sendSummary() {
  if (!member.value?.phone) return;

  const total = membership.value?.credits_total ?? 0;
  const left = membership.value ? memberships.remaining(membership.value) : 0;
  // "de 5" solo tiene sentido si el saldo cabe en el plan base; con un
  // saldo mayor (top-up) se muestra solo el número.
  const balanceLine =
    left > 5
      ? `🍽️ Tienes *${left}* comidas disponibles.`
      : `🍽️ Te quedan *${left} de ${total}* comidas disponibles.`;

  const recentMeals = history.value
    .filter((h) => h.kind === "meal" && !h.voided)
    .slice(0, 5)
    .map((h) => fmtDateTime(h.redeemed_at));

  const lines = [`Hola ${member.value.name} 👋`, "", balanceLine];
  lines.push("", `🎫 Tu código: *${member.value.member_code}*`);
  if (recentMeals.length) {
    lines.push("", "📋 *Tus últimas comidas:*");
    recentMeals.forEach((d, i) => lines.push(`${i + 1}. ${d}`));
  }
  lines.push("", "¡Gracias por ser parte de Breezy! 🌊");

  openWhatsApp(lines.join("\n"), member.value.phone);
}

// --- credencial imprimible (etiqueta redonda con nombre + código de barras) ---
const { injectFonts, ensureFontsLoaded, getFontEmbedCSS } = useLabelExport(
  "https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600;800&display=swap",
);

function printMemberCard() {
  const el = memberCardRef.value;
  if (!el) return;
  const html = el.innerHTML;

  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;width:2in;height:2in;border:0;opacity:0;top:0;left:0;pointer-events:none;z-index:-9999;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <script src="https://cdn.tailwindcss.com"><\/script>
        <style>
          html, body { margin: 0 !important; padding: 0 !important; background: transparent; overflow: hidden; width: 2in; height: 2in; }
          @page { margin: 0; size: 2in 2in; }
          .print-clip { width: 2in; height: 2in; border-radius: 50%; overflow: hidden; clip-path: circle(50% at 50% 50%); position: relative; }
          .member-card { font-family: 'Barlow', Arial, sans-serif; width: 2in !important; height: 2in !important; border-radius: 50% !important; overflow: hidden !important; box-shadow: none !important; border: 3px solid black !important; }
          .member-card .font-black { font-family: 'Oswald', Impact, sans-serif; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        </style>
      </head>
      <body><div class="print-clip">${html}</div></body>
    </html>
  `);
  injectFonts(doc);
  doc.close();

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 800);
  };
}

async function downloadMemberCard() {
  const el = memberCardRef.value;
  if (!el) return;
  const html = el.innerHTML;

  const [, fontEmbedCSS] = await Promise.all([
    ensureFontsLoaded(),
    getFontEmbedCSS(),
  ]);

  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;width:2in;height:2in;border:0;opacity:0;top:0;left:0;pointer-events:none;z-index:-9999;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <script src="https://cdn.tailwindcss.com"><\/script>
        <style>
          html, body { margin: 0 !important; padding: 0 !important; background: transparent; overflow: hidden; width: 2in; height: 2in; }
          .member-card { font-family: 'Barlow', Arial, sans-serif; width: 2in !important; height: 2in !important; border-radius: 50% !important; overflow: hidden !important; box-shadow: none !important; border: 3px solid black !important; }
          .member-card .font-black { font-family: 'Oswald', Impact, sans-serif; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
  injectFonts(doc);
  doc.close();

  await new Promise<void>((resolve) => {
    iframe.onload = () => setTimeout(resolve, 1200);
  });
  await iframe.contentDocument?.fonts.ready;

  const { toPng } = await import("html-to-image");
  const targetEl = iframe.contentDocument!.querySelector(
    ".member-card",
  ) as HTMLElement;

  if (!targetEl) {
    console.error("Could not find .member-card inside iframe");
    document.body.removeChild(iframe);
    return;
  }

  try {
    const size = targetEl.offsetWidth;
    const dataUrl = await toPng(targetEl, {
      pixelRatio: 3,
      width: size,
      height: size,
      backgroundColor: "#ffffff",
      fontEmbedCSS,
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    const outputSize = size * 3;
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d")!;

    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, outputSize, outputSize);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${member.value?.name ?? member.value?.id}-credencial.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (err) {
    console.error("Failed to generate PNG:", err);
  } finally {
    document.body.removeChild(iframe);
  }
}

function startEditIdentity() {
  nameDraft.value = member.value?.name ?? "";
  phoneDraft.value = member.value?.phone ?? "";
  editingIdentity.value = true;
}
async function saveIdentity() {
  if (!member.value) return;

  const name = nameDraft.value.trim();
  const phone = phoneDraft.value.trim();
  if (!name || !phone) {
    toast("Nombre y teléfono son obligatorios");
    return;
  }

  busy.value = true;
  try {
    member.value = await members.updateMember(member.value.id, {
      name,
      phone,
    });
    editingIdentity.value = false;
    toast("Datos actualizados ✅");
    await loadMembers();
  } catch (e: any) {
    console.error("identity save failed:", e);
    toast(e?.message ?? "No se pudieron actualizar los datos");
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
  membersDrawerOpen.value = true;
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
});

onMounted(loadMembers);
</script>
