<template>
  <section class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10">
    <header class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Staff
        </p>
        <h1
          class="font-heading text-3xl font-extrabold text-primary md:text-4xl"
        >
          Redenciones
        </h1>
        <p class="mt-1 max-w-2xl text-sm text-muted-foreground">
          Consulta y corrige el historial de comidas sin perder el rastro de
          auditoria.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="loading" @click="loadData">
          <RefreshCw
            :size="16"
            class="mr-1.5"
            :class="loading ? 'animate-spin' : ''"
          />
          Actualizar
        </Button>
        <Button @click="openCreate">
          <Plus :size="16" class="mr-1.5" />
          Nueva redencion
        </Button>
      </div>
    </header>

    <Alert v-if="errorMessage" class="mb-5" variant="destructive">
      <AlertTitle>No se pudo completar la accion</AlertTitle>
      <AlertDescription>{{ errorMessage }}</AlertDescription>
    </Alert>

    <div class="mb-5 grid gap-3 sm:grid-cols-3">
      <Card>
        <CardContent class="p-4">
          <p class="text-xs font-semibold uppercase text-muted-foreground">
            Resultados
          </p>
          <p class="mt-1 text-2xl font-bold tabular-nums">
            {{ filteredRedemptions.length }}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <p class="text-xs font-semibold uppercase text-muted-foreground">
            Comidas activas
          </p>
          <p class="mt-1 text-2xl font-bold tabular-nums text-primary">
            {{ activeMealCount }}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <p class="text-xs font-semibold uppercase text-muted-foreground">
            Anuladas
          </p>
          <p class="mt-1 text-2xl font-bold tabular-nums">{{ voidedCount }}</p>
        </CardContent>
      </Card>
    </div>

    <Card class="mb-5">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-base">
          <SlidersHorizontal :size="17" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent class="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <div class="space-y-1.5 xl:col-span-2">
          <Label for="redemption-search">Buscar</Label>
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              :size="16"
            />
            <Input
              id="redemption-search"
              v-model="filters.search"
              class="pl-9"
              placeholder="Socio, codigo o motivo"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <Label>Socio</Label>
          <Select v-model="filters.memberId">
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem
                v-for="person in memberList"
                :key="person.id"
                :value="person.id"
              >
                {{ person.name }} · {{ person.member_code }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label>Tipo</Label>
          <Select v-model="filters.kind">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="meal">Comida</SelectItem>
              <SelectItem value="adjustment">Ajuste</SelectItem>
              <SelectItem value="topup_note">Renovacion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label>Estado</Label>
          <Select v-model="filters.status">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="voided">Anuladas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-end">
          <Button
            class="w-full"
            variant="ghost"
            :disabled="!hasFilters"
            @click="clearFilters"
          >
            <X :size="16" class="mr-1.5" />
            Limpiar
          </Button>
        </div>

        <div class="space-y-1.5">
          <Label for="date-from">Desde</Label>
          <Input id="date-from" v-model="filters.from" type="date" />
        </div>
        <div class="space-y-1.5">
          <Label for="date-to">Hasta</Label>
          <Input id="date-to" v-model="filters.to" type="date" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-base">
          <ReceiptText :size="17" />
          Historial
        </CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Socio</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cambio</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead class="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="loading">
                <TableCell
                  colspan="7"
                  class="py-10 text-center text-muted-foreground"
                >
                  Cargando redenciones...
                </TableCell>
              </TableRow>
              <TableRow v-else-if="!filteredRedemptions.length">
                <TableCell
                  colspan="7"
                  class="py-10 text-center text-muted-foreground"
                >
                  No hay movimientos que coincidan con los filtros.
                </TableCell>
              </TableRow>
              <TableRow
                v-for="entry in filteredRedemptions"
                :key="entry.id"
                :class="entry.voided ? 'opacity-60' : ''"
              >
                <TableCell class="whitespace-nowrap text-sm">{{
                  formatDateTime(entry.redeemed_at)
                }}</TableCell>
                <TableCell>
                  <div class="min-w-44">
                    <p class="font-semibold">{{ memberName(entry.member) }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ memberCode(entry.member) }}
                    </p>
                  </div>
                </TableCell>
                <TableCell
                  ><Badge variant="outline">{{
                    kindLabel(entry.kind)
                  }}</Badge></TableCell
                >
                <TableCell class="font-semibold tabular-nums">{{
                  amountLabel(entry)
                }}</TableCell>
                <TableCell class="max-w-64">
                  <p class="truncate text-sm" :title="reasonLabel(entry)">
                    {{ reasonLabel(entry) }}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge :variant="entry.voided ? 'secondary' : 'default'">
                    {{ entry.voided ? "Anulada" : "Activa" }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      :disabled="entry.voided"
                      title="Editar"
                      @click="openEdit(entry)"
                    >
                      <Pencil :size="15" />
                      <span class="sr-only">Editar</span>
                    </Button>
                    <Button
                      v-if="entry.voided"
                      size="icon"
                      variant="ghost"
                      title="Restaurar"
                      @click="restoreEntry(entry)"
                    >
                      <RotateCcw :size="15" />
                      <span class="sr-only">Restaurar</span>
                    </Button>
                    <Button
                      v-else
                      size="icon"
                      variant="ghost"
                      class="text-destructive hover:text-destructive"
                      title="Anular"
                      @click="openVoid(entry)"
                    >
                      <Trash2 :size="15" />
                      <span class="sr-only">Anular</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Dialog v-model:open="editorOpen">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{{
            editingEntry ? "Editar redencion" : "Nueva redencion"
          }}</DialogTitle>
          <DialogDescription>
            Los cambios actualizan automaticamente el saldo de las membresias
            afectadas.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-2 sm:grid-cols-2">
          <div class="space-y-1.5 sm:col-span-2">
            <Label>Socio</Label>
            <Select v-model="form.memberId">
              <SelectTrigger
                ><SelectValue placeholder="Selecciona un socio"
              /></SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="person in memberList"
                  :key="person.id"
                  :value="person.id"
                >
                  {{ person.name }} · {{ person.member_code }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label>Tipo</Label>
            <Select v-model="form.kind">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="meal">Comida</SelectItem>
                <SelectItem value="adjustment">Ajuste</SelectItem>
                <SelectItem value="topup_note">Renovacion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label for="entry-amount">Cantidad</Label>
            <Input
              id="entry-amount"
              v-model.number="form.amount"
              type="number"
              :disabled="form.kind !== 'adjustment'"
            />
          </div>
          <div class="space-y-1.5 sm:col-span-2">
            <Label for="entry-date">Fecha y hora</Label>
            <Input
              id="entry-date"
              v-model="form.redeemedAt"
              type="datetime-local"
            />
          </div>
          <div class="space-y-1.5 sm:col-span-2">
            <Label for="entry-reason">Motivo o nota</Label>
            <Textarea
              id="entry-reason"
              v-model="form.reason"
              rows="3"
              placeholder="Ej. Correccion de comanda, captura atrasada..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="editorOpen = false"
            >Cancelar</Button
          >
          <Button :disabled="saving" @click="saveEntry">
            {{ saving ? "Guardando..." : "Guardar" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog v-model:open="voidOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anular redencion</AlertDialogTitle>
          <AlertDialogDescription>
            El movimiento permanecera visible para auditoria y su efecto se
            revertira del saldo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div class="space-y-1.5">
          <Label for="void-reason">Motivo obligatorio</Label>
          <Textarea
            id="void-reason"
            v-model="voidReason"
            rows="3"
            placeholder="Describe por que se anula"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            :disabled="!voidReason.trim() || saving"
            @click="voidEntry"
          >
            Anular y corregir saldo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>
</template>

<script lang="ts" setup>
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@common/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@common/components/ui/table";
import { Textarea } from "@common/components/ui/textarea";
import {
  Pencil,
  Plus,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-vue-next";
import useMembers from "~/composables/useMembers";
import useMemberships from "~/composables/useMemberships";
import useRedemptions, {
  type AdminRedemptionInput,
} from "~/composables/useRedemptions";
import type { Member, Redemption } from "~/types/membership";

const redemptionsApi = useRedemptions();
const membersApi = useMembers();
const membershipsApi = useMemberships();
const { user, subscribe, unsubscribe } = usePocketBaseCore();
const route = useRoute();

const loading = ref(true);
const saving = ref(false);
const errorMessage = ref("");
const redemptions = ref<Redemption[]>([]);
const memberList = ref<Member[]>([]);
const editorOpen = ref(false);
const voidOpen = ref(false);
const editingEntry = ref<Redemption | null>(null);
const voidTarget = ref<Redemption | null>(null);
const voidReason = ref("");

const filters = reactive({
  search: "",
  memberId: "all",
  kind: "all",
  status: "all",
  from: "",
  to: "",
});

const form = reactive<{
  memberId: string;
  kind: Redemption["kind"];
  amount: number;
  redeemedAt: string;
  reason: string;
}>({
  memberId: "",
  kind: "meal",
  amount: 1,
  redeemedAt: "",
  reason: "",
});

const membersById = computed(
  () => new Map(memberList.value.map((person) => [person.id, person])),
);

const hasFilters = computed(() =>
  Object.entries(filters).some(([key, value]) =>
    key === "memberId" || key === "kind" || key === "status"
      ? value !== "all"
      : Boolean(value),
  ),
);

const filteredRedemptions = computed(() => {
  const query = filters.search.trim().toLocaleLowerCase("es-MX");
  const until = filters.to ? `${filters.to}T23:59:59.999` : "";
  return redemptions.value.filter((entry) => {
    const person = membersById.value.get(entry.member);
    const haystack = [
      person?.name,
      person?.member_code,
      person?.phone,
      entry.reason,
      entry.void_reason,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("es-MX");
    return (
      (!query || haystack.includes(query)) &&
      (filters.memberId === "all" || entry.member === filters.memberId) &&
      (filters.kind === "all" || entry.kind === filters.kind) &&
      (filters.status === "all" ||
        (filters.status === "voided" ? entry.voided : !entry.voided)) &&
      (!filters.from || entry.redeemed_at >= `${filters.from}T00:00:00`) &&
      (!until || entry.redeemed_at <= until)
    );
  });
});

const activeMealCount = computed(
  () =>
    filteredRedemptions.value.filter(
      (entry) => entry.kind === "meal" && !entry.voided,
    ).length,
);
const voidedCount = computed(
  () => filteredRedemptions.value.filter((entry) => entry.voided).length,
);

function memberName(id: string) {
  return membersById.value.get(id)?.name ?? "Socio no disponible";
}
function memberCode(id: string) {
  return membersById.value.get(id)?.member_code ?? id;
}
function kindLabel(kind: Redemption["kind"]) {
  if (kind === "meal") return "Comida";
  if (kind === "adjustment") return "Ajuste";
  return "Renovacion";
}
function amountLabel(entry: Redemption) {
  if (entry.kind === "meal") return "-1 comida";
  if (entry.kind === "adjustment")
    return `${entry.amount >= 0 ? "+" : ""}${entry.amount}`;
  return "Nota";
}
function reasonLabel(entry: Redemption) {
  if (entry.reason) return entry.reason;
  if (entry.void_reason) return entry.void_reason;
  if (entry.kind === "meal")
    return "Comanda sin referencia (registro historico)";
  if (entry.kind === "adjustment") return "Ajuste historico sin nota";
  return "Renovacion historica sin nota";
}
function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
function localDateTime(value = new Date().toISOString()) {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

async function loadMembers() {
  const first = await membersApi.listMembers(1, 100);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, index) =>
      membersApi.listMembers(index + 2, 100),
    ),
  );
  memberList.value = [
    ...(first.items as Member[]),
    ...rest.flatMap((page) => page.items as Member[]),
  ];
}

async function loadData() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const [, ledger] = await Promise.all([
      memberList.value.length ? Promise.resolve() : loadMembers(),
      redemptionsApi.listAdministrative(),
    ]);
    redemptions.value = ledger.items as Redemption[];
  } catch (error: any) {
    errorMessage.value = error?.message ?? "No se pudo cargar el historial";
  } finally {
    loading.value = false;
  }
}

function clearFilters() {
  filters.search = "";
  filters.memberId = "all";
  filters.kind = "all";
  filters.status = "all";
  filters.from = "";
  filters.to = "";
}

function openCreate() {
  editingEntry.value = null;
  form.memberId =
    filters.memberId !== "all"
      ? filters.memberId
      : (memberList.value[0]?.id ?? "");
  form.kind = "meal";
  form.amount = 1;
  form.redeemedAt = localDateTime();
  form.reason = "";
  editorOpen.value = true;
}

function openEdit(entry: Redemption) {
  editingEntry.value = entry;
  form.memberId = entry.member;
  form.kind = entry.kind;
  form.amount = entry.amount;
  form.redeemedAt = localDateTime(entry.redeemed_at);
  form.reason = entry.reason ?? "";
  editorOpen.value = true;
}

async function saveEntry() {
  if (!form.memberId || !form.redeemedAt) {
    errorMessage.value = "Selecciona un socio y una fecha";
    return;
  }
  if (form.kind === "adjustment" && !form.amount) {
    errorMessage.value = "El ajuste debe tener una cantidad distinta de cero";
    return;
  }

  saving.value = true;
  errorMessage.value = "";
  try {
    const membership = await membershipsApi.getActiveMembership(form.memberId);
    if (!membership)
      throw new Error("El socio seleccionado no tiene membresia activa");
    const input: AdminRedemptionInput = {
      memberId: form.memberId,
      membershipId: membership.id,
      kind: form.kind,
      amount: form.amount,
      redeemedAt: new Date(form.redeemedAt).toISOString(),
      reason: form.reason,
      staffId: user?.id,
    };
    if (editingEntry.value) {
      await redemptionsApi.updateAdministrative(editingEntry.value, input);
    } else {
      await redemptionsApi.createAdministrative(input);
    }
    editorOpen.value = false;
    await loadData();
  } catch (error: any) {
    errorMessage.value = error?.message ?? "No se pudo guardar la redencion";
  } finally {
    saving.value = false;
  }
}

function openVoid(entry: Redemption) {
  voidTarget.value = entry;
  voidReason.value = "";
  voidOpen.value = true;
}

async function voidEntry() {
  if (!voidTarget.value || !voidReason.value.trim()) return;
  saving.value = true;
  errorMessage.value = "";
  try {
    await redemptionsApi.voidAdministrative(voidTarget.value, voidReason.value);
    voidOpen.value = false;
    await loadData();
  } catch (error: any) {
    errorMessage.value = error?.message ?? "No se pudo anular la redencion";
  } finally {
    saving.value = false;
  }
}

async function restoreEntry(entry: Redemption) {
  saving.value = true;
  errorMessage.value = "";
  try {
    await redemptionsApi.restoreAdministrative(entry);
    await loadData();
  } catch (error: any) {
    errorMessage.value = error?.message ?? "No se pudo restaurar la redencion";
  } finally {
    saving.value = false;
  }
}

let stopLive: (() => void) | null = null;
onMounted(async () => {
  const memberQuery =
    typeof route.query.member === "string" ? route.query.member : "";
  if (memberQuery) filters.memberId = memberQuery;
  await loadData();
  try {
    stopLive = await subscribe("redemptions", () => void loadData(), "*");
  } catch (error) {
    console.error("Could not subscribe to redemptions:", error);
  }
});

onBeforeUnmount(async () => {
  try {
    if (stopLive) stopLive();
    else await unsubscribe("redemptions");
  } catch {
    /* noop */
  }
});

definePageMeta({ layout: "staff" });
</script>
