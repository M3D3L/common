<template>
  <main class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10">
    <header class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase text-muted-foreground">
          Staff
        </p>
        <h1
          class="font-heading text-3xl font-extrabold text-primary md:text-4xl"
        >
          Pagos de membresía
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Verifica el pago antes de emitir {{ offer.credits }} créditos.
        </p>
      </div>
      <Button variant="outline" :disabled="loading" @click="loadData">
        <RefreshCw
          :size="16"
          class="mr-2"
          :class="loading ? 'animate-spin' : ''"
        />
        Actualizar
      </Button>
    </header>

    <Alert v-if="errorMessage" variant="destructive" class="mb-5">
      <CircleAlert :size="18" />
      <AlertTitle>No se pudo completar la acción</AlertTitle>
      <AlertDescription>{{ errorMessage }}</AlertDescription>
    </Alert>

    <div class="mb-5 grid grid-cols-3 gap-2 rounded-lg border p-1">
      <button
        v-for="option in statusOptions"
        :key="option.value"
        class="min-h-10 rounded-md px-2 text-sm font-semibold transition-colors"
        :class="
          statusFilter === option.value
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted'
        "
        @click="statusFilter = option.value"
      >
        {{ option.label }}
        <span class="ml-1 tabular-nums">{{ option.count }}</span>
      </button>
    </div>

    <div v-if="loading" class="space-y-3">
      <Skeleton v-for="index in 3" :key="index" class="h-44 w-full" />
    </div>
    <div
      v-else-if="!filteredRequests.length"
      class="border-y border-border py-16 text-center text-muted-foreground"
    >
      No hay solicitudes en este estado.
    </div>
    <div v-else class="grid gap-4 lg:grid-cols-2">
      <Card
        v-for="request in filteredRequests"
        :key="request.id"
        class="overflow-hidden"
      >
        <CardHeader class="border-b border-border pb-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <CardTitle class="text-lg">{{ request.name }}</CardTitle>
              <CardDescription class="mt-1">
                {{ request.phone }} · {{ formatDate(request.created) }}
              </CardDescription>
            </div>
            <Badge :variant="statusVariant(request.status)">
              {{ statusLabel(request.status) }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-4 pt-5">
          <dl class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt class="text-muted-foreground">Pago</dt>
              <dd class="font-semibold">
                {{
                  request.payment_method === "transfer"
                    ? "Transferencia"
                    : "En tienda"
                }}
              </dd>
            </div>
            <div>
              <dt class="text-muted-foreground">Paquete</dt>
              <dd class="font-semibold">
                ${{ offer.price }} · {{ offer.credits }} comidas
              </dd>
            </div>
            <div v-if="request.existing_member_code">
              <dt class="text-muted-foreground">Código indicado</dt>
              <dd class="font-mono font-semibold">
                {{ request.existing_member_code }}
              </dd>
            </div>
            <div v-if="request.address" class="col-span-2">
              <dt class="text-muted-foreground">Dirección</dt>
              <dd class="font-semibold">{{ request.address }}</dd>
            </div>
          </dl>

          <Button
            v-if="request.payment_proof"
            class="w-full"
            variant="outline"
            @click="openReceipt(request)"
          >
            <Image :size="16" class="mr-2" />
            Ver comprobante protegido
          </Button>

          <template v-if="request.status === 'submitted'">
            <div class="space-y-1.5">
              <Label>Aplicar a</Label>
              <Select v-model="memberSelections[request.id]">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un socio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__new__">Crear socio nuevo</SelectItem>
                  <SelectItem
                    v-for="member in members"
                    :key="member.id"
                    :value="member.id"
                  >
                    {{ member.name }} · {{ member.member_code }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">
                {{ selectionHint(request) }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <Button
                :disabled="busyId === request.id"
                @click="openApprove(request)"
              >
                <BadgeCheck :size="16" class="mr-2" />
                Aprobar
              </Button>
              <Button
                variant="outline"
                :disabled="busyId === request.id"
                @click="openReject(request)"
              >
                <X :size="16" class="mr-2" />
                Rechazar
              </Button>
            </div>
          </template>
          <div v-else-if="request.review_note" class="bg-muted p-3 text-sm">
            <p class="text-xs font-bold uppercase text-muted-foreground">
              Nota
            </p>
            <p class="mt-1">{{ request.review_note }}</p>
          </div>

          <Button
            v-if="isMegaStaff && request.status !== 'approved'"
            size="sm"
            variant="ghost"
            class="text-destructive hover:text-destructive"
            :disabled="busyId === request.id"
            @click="deleteRequest(request)"
          >
            <Trash2 :size="15" class="mr-2" />
            Eliminar solicitud
          </Button>
        </CardContent>
      </Card>
    </div>

    <AlertDialog v-model:open="approveOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar pago y emitir créditos</AlertDialogTitle>
          <AlertDialogDescription>
            Se aplicarán {{ offer.credits }} créditos a
            {{ approvalMemberLabel }}. Esta acción queda registrada en el
            historial.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="approveRequest">
            Confirmar ${{ offer.price }} y aprobar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Dialog v-model:open="rejectOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rechazar solicitud</DialogTitle>
          <DialogDescription>
            La solicitud permanecerá visible para seguimiento.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-1.5">
          <Label for="review-note">Motivo</Label>
          <Textarea
            id="review-note"
            v-model="reviewNote"
            rows="3"
            placeholder="Ej. No se encontró el depósito"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="rejectOpen = false"
            >Cancelar</Button
          >
          <Button variant="destructive" @click="rejectRequest">Rechazar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
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
  CardDescription,
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
import { Label } from "@common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import { Skeleton } from "@common/components/ui/skeleton";
import { Textarea } from "@common/components/ui/textarea";
import {
  BadgeCheck,
  CircleAlert,
  Image,
  RefreshCw,
  Trash2,
  X,
} from "lucide-vue-next";
import type {
  Member,
  MembershipPaymentRequest,
  MembershipPaymentStatus,
} from "~/types/membership";

definePageMeta({ layout: "breezy", staffOnly: true });

const api = useMembershipPaymentRequests();
const membersApi = useMembers();
const { isUserVerified } = usePocketBaseCore();
const offer = api.offer;
const requests = ref<MembershipPaymentRequest[]>([]);
const members = ref<Member[]>([]);
const memberSelections = reactive<Record<string, string>>({});
const loading = ref(true);
const busyId = ref("");
const errorMessage = ref("");
const statusFilter = ref<"submitted" | "approved" | "rejected">("submitted");
const approveOpen = ref(false);
const rejectOpen = ref(false);
const selectedRequest = ref<MembershipPaymentRequest>();
const reviewNote = ref("");
const isMegaStaff = ref(false);

const filteredRequests = computed(() =>
  requests.value.filter((request) => request.status === statusFilter.value),
);
const statusOptions = computed(() =>
  (
    [
      ["submitted", "Pendientes"],
      ["approved", "Aprobados"],
      ["rejected", "Rechazados"],
    ] as const
  ).map(([value, label]) => ({
    value,
    label,
    count: requests.value.filter((request) => request.status === value).length,
  })),
);
const selectedMember = computed(() => {
  const request = selectedRequest.value;
  if (!request) return undefined;
  const memberId = memberSelections[request.id];
  return members.value.find((member) => member.id === memberId);
});
const approvalMemberLabel = computed(
  () =>
    selectedMember.value?.name ??
    `un socio nuevo para ${selectedRequest.value?.name ?? ""}`,
);

function initialMember(request: MembershipPaymentRequest) {
  const code = request.existing_member_code?.trim().toUpperCase();
  return members.value.find(
    (member) =>
      (code && member.member_code.toUpperCase() === code) ||
      member.phone.replace(/\D/g, "") === request.phone.replace(/\D/g, ""),
  );
}

async function loadData() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const [paymentRequests, memberPage] = await Promise.all([
      api.list(),
      membersApi.listMembers(1, 500),
    ]);
    requests.value = paymentRequests;
    members.value = memberPage.items as Member[];
    for (const request of paymentRequests) {
      memberSelections[request.id] = initialMember(request)?.id ?? "__new__";
    }
  } catch (error: any) {
    errorMessage.value = error?.message ?? "No se pudieron cargar los pagos";
  } finally {
    loading.value = false;
  }
}

function openApprove(request: MembershipPaymentRequest) {
  selectedRequest.value = request;
  approveOpen.value = true;
}

async function approveRequest() {
  const request = selectedRequest.value;
  if (!request) return;
  approveOpen.value = false;
  busyId.value = request.id;
  errorMessage.value = "";
  try {
    await api.approve(request, selectedMember.value);
    await loadData();
  } catch (error: any) {
    errorMessage.value = error?.message ?? "No se pudo aprobar el pago";
  } finally {
    busyId.value = "";
  }
}

function openReject(request: MembershipPaymentRequest) {
  selectedRequest.value = request;
  reviewNote.value = "";
  rejectOpen.value = true;
}

async function rejectRequest() {
  const request = selectedRequest.value;
  if (!request) return;
  rejectOpen.value = false;
  busyId.value = request.id;
  errorMessage.value = "";
  try {
    await api.reject(request, reviewNote.value);
    await loadData();
  } catch (error: any) {
    errorMessage.value = error?.message ?? "No se pudo rechazar la solicitud";
  } finally {
    busyId.value = "";
  }
}

async function openReceipt(request: MembershipPaymentRequest) {
  try {
    const url = await api.getReceiptUrl(request);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  } catch (error: any) {
    errorMessage.value = error?.message ?? "No se pudo abrir el comprobante";
  }
}

async function deleteRequest(request: MembershipPaymentRequest) {
  if (!window.confirm("¿Eliminar esta solicitud inválida?")) return;
  busyId.value = request.id;
  try {
    await api.remove(request);
    await loadData();
  } catch (error: any) {
    errorMessage.value = error?.message ?? "No se pudo eliminar la solicitud";
  } finally {
    busyId.value = "";
  }
}

function selectionHint(request: MembershipPaymentRequest) {
  const selected = members.value.find(
    (member) => member.id === memberSelections[request.id],
  );
  return selected
    ? `Se sumarán al saldo de ${selected.member_code}.`
    : "Se creará un código nuevo con los datos de la solicitud.";
}

function statusLabel(status: MembershipPaymentStatus) {
  return status === "approved"
    ? "Aprobado"
    : status === "rejected"
      ? "Rechazado"
      : status === "cancelled"
        ? "Cancelado"
        : "Pendiente";
}

function statusVariant(status: MembershipPaymentStatus) {
  return status === "approved"
    ? "default"
    : status === "submitted"
      ? "secondary"
      : "outline";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

onMounted(() => {
  isMegaStaff.value = isUserVerified();
  loadData();
});
</script>
