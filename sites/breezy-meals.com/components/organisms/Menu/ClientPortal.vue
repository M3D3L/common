<template>
  <section
    :class="
      compact
        ? 'mt-3 border-t border-border pt-4 text-foreground'
        : 'js-reveal-item overflow-hidden rounded-lg border border-sky-800/20 bg-sky-50 text-sky-950 shadow-sm'
    "
    aria-labelledby="client-portal-title"
  >
    <div :class="compact ? '' : 'p-4 sm:p-5'">
      <div class="flex items-start" :class="compact ? 'gap-2' : 'gap-3'">
        <span
          class="flex shrink-0 items-center justify-center rounded-md bg-sky-900 text-white"
          :class="compact ? 'size-8' : 'size-10'"
          aria-hidden="true"
        >
          <TicketCheck :size="compact ? 17 : 20" />
        </span>
        <div class="min-w-0">
          <p v-if="!compact" class="text-xs font-bold uppercase text-sky-800">
            Socios Breezy
          </p>
          <h2
            id="client-portal-title"
            class="font-heading font-extrabold"
            :class="compact ? 'text-base' : 'text-lg'"
          >
            {{ compact ? "Mis comidas" : "Consulta tus comidas" }}
          </h2>
          <p
            v-if="!compact || !result?.verified"
            class="mt-0.5"
            :class="
              compact
                ? 'text-xs text-muted-foreground'
                : 'text-sm text-sky-900/75'
            "
          >
            Usa tu código y los últimos 4 dígitos de tu teléfono.
          </p>
        </div>
      </div>

      <form
        v-if="!compact || !result?.verified"
        :class="
          compact
            ? 'mt-3 space-y-2'
            : 'mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]'
        "
        @submit.prevent="submit"
      >
        <div :class="compact ? 'space-y-1' : 'space-y-1.5'">
          <Label for="portal-member-code">Código de socio</Label>
          <Input
            id="portal-member-code"
            v-model="memberCode"
            autocomplete="off"
            maxlength="6"
            placeholder="GM1234"
            class="bg-white uppercase tracking-widest"
            :class="{ 'h-9': compact }"
            @input="normalizeCode"
          />
        </div>
        <div :class="compact ? 'space-y-1' : 'space-y-1.5'">
          <Label for="portal-phone">Últimos 4 del teléfono</Label>
          <Input
            id="portal-phone"
            v-model="phoneLast4"
            autocomplete="tel-national"
            inputmode="numeric"
            maxlength="4"
            placeholder="5678"
            class="bg-white tabular-nums"
            :class="{ 'h-9': compact }"
            @input="normalizePhone"
          />
        </div>
        <Button
          type="submit"
          class="self-end"
          :class="{ 'h-9 w-full': compact }"
          :disabled="loading"
        >
          <LoaderCircle v-if="loading" class="animate-spin" :size="17" />
          <Search v-else :size="17" />
          Consultar
        </Button>
      </form>

      <Alert
        v-if="message"
        variant="destructive"
        class="bg-white/70"
        :class="compact ? 'mt-2 py-2 text-xs' : 'mt-4'"
      >
        <AlertCircle :size="17" />
        <AlertDescription>{{ message }}</AlertDescription>
      </Alert>

      <div
        v-if="result?.verified"
        class="flex flex-wrap items-center justify-between border-t border-sky-900/15"
        :class="compact ? 'mt-3 gap-2 pt-3' : 'mt-4 gap-3 pt-4'"
        aria-live="polite"
      >
        <div>
          <p class="text-sm font-semibold text-sky-900/70">
            Comidas disponibles
          </p>
          <p class="font-heading text-3xl font-black tabular-nums">
            {{ result.balance.remaining }}
          </p>
        </div>
        <Sheet>
          <SheetTrigger as-child>
            <Button
              type="button"
              variant="outline"
              class="border-sky-900/25 bg-white"
            >
              <History :size="17" />
              Ver historial
            </Button>
          </SheetTrigger>
          <SheetContent class="w-full overflow-y-auto sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Tu historial Breezy</SheetTitle>
              <SheetDescription>
                Movimientos de comidas y pedidos vinculados a tu código.
              </SheetDescription>
            </SheetHeader>

            <Tabs default-value="activity" class="mt-6">
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="activity">Movimientos</TabsTrigger>
                <TabsTrigger value="orders">Pedidos</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" class="mt-4 space-y-2">
                <p
                  v-if="!result.activity.length"
                  class="py-10 text-center text-sm text-muted-foreground"
                >
                  Aún no hay movimientos registrados.
                </p>
                <div
                  v-for="(entry, index) in result.activity"
                  v-else
                  :key="`${entry.date}-${entry.kind}-${index}`"
                  class="flex items-center justify-between gap-3 border-b py-3"
                >
                  <div>
                    <p class="font-semibold">{{ activityLabel(entry.kind) }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ formatDate(entry.date) }}
                    </p>
                  </div>
                  <Badge :variant="entry.amount < 0 ? 'secondary' : 'default'">
                    {{ formatAmount(entry.amount) }}
                  </Badge>
                </div>
              </TabsContent>

              <TabsContent value="orders" class="mt-4 space-y-3">
                <p
                  v-if="!result.orders.length"
                  class="py-10 text-center text-sm text-muted-foreground"
                >
                  Aún no hay pedidos terminados vinculados a tu código.
                </p>
                <article
                  v-for="order in result.orders"
                  v-else
                  :key="`${order.number}-${order.placedAt}`"
                  class="rounded-md border p-3"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="font-bold">Pedido #{{ order.number }}</h3>
                      <p class="text-xs text-muted-foreground">
                        {{ formatDate(order.completedAt || order.placedAt) }}
                      </p>
                    </div>
                    <span class="font-bold tabular-nums">{{
                      money(order.total)
                    }}</span>
                  </div>
                  <ul class="mt-3 space-y-1 text-sm">
                    <li
                      v-for="item in order.items"
                      :key="`${item.name}-${item.quantity}`"
                      class="flex justify-between gap-3"
                    >
                      <span>{{ item.name }}</span>
                      <span class="text-muted-foreground"
                        >× {{ item.quantity }}</span
                      >
                    </li>
                  </ul>
                </article>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
        <Button
          v-if="compact"
          type="button"
          variant="ghost"
          size="icon"
          title="Consultar otro socio"
          aria-label="Consultar otro socio"
          @click="reset"
        >
          <RotateCcw :size="17" />
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  AlertCircle,
  History,
  LoaderCircle,
  RotateCcw,
  Search,
  TicketCheck,
} from "lucide-vue-next";
import { Alert, AlertDescription } from "@common/components/ui/alert";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@common/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@common/components/ui/tabs";
import type { ClientPortalResponse, RedemptionKind } from "~/types/membership";

const emit = defineEmits<{ verified: [memberCode: string] }>();
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });
const { lookup } = useClientPortal();
const memberCode = ref("");
const phoneLast4 = ref("");
const loading = ref(false);
const message = ref("");
const result = ref<ClientPortalResponse | null>(null);

function normalizeCode() {
  memberCode.value = memberCode.value.replace(/[^a-z0-9]/gi, "").toUpperCase();
  result.value = null;
}

function normalizePhone() {
  phoneLast4.value = phoneLast4.value.replace(/\D/g, "").slice(0, 4);
  result.value = null;
}

function reset() {
  memberCode.value = "";
  phoneLast4.value = "";
  message.value = "";
  result.value = null;
}

async function submit() {
  message.value = "";
  result.value = null;
  if (
    !/^[A-Z]{2}\d{4}$/.test(memberCode.value) ||
    !/^\d{4}$/.test(phoneLast4.value)
  ) {
    message.value = "Revisa el código y los 4 dígitos de tu teléfono.";
    return;
  }

  loading.value = true;
  try {
    const response = await lookup(memberCode.value, phoneLast4.value);
    result.value = response;
    if (!response.verified) {
      message.value =
        response.reason === "rate_limited"
          ? "Demasiados intentos. Espera un minuto y vuelve a intentar."
          : "No pudimos verificar esos datos.";
      return;
    }
    emit("verified", memberCode.value);
  } catch (error: any) {
    message.value =
      error?.status === 429
        ? "Demasiados intentos. Espera un minuto y vuelve a intentar."
        : "No pudimos consultar tu saldo en este momento.";
  } finally {
    loading.value = false;
  }
}

function activityLabel(kind: RedemptionKind) {
  if (kind === "meal") return "Comida utilizada";
  if (kind === "adjustment") return "Ajuste de saldo";
  return "Recarga registrada";
}

function formatAmount(amount: number) {
  if (!amount) return "Registro";
  return amount > 0 ? `+${amount}` : String(amount);
}

function formatDate(value: string) {
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function money(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
</script>
