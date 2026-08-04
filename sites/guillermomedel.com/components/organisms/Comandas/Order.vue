<template>
  <section class="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Platillos del turno -->
    <div class="space-y-8 lg:col-span-2">
      <!-- Indicador de origen del menú del día -->
      <div v-if="menuSource !== 'none'" class="-mt-1">
        <Badge
          v-if="menuSource === 'auto'"
          variant="secondary"
          class="gap-1.5 font-medium"
        >
          <ClientOnly><Sparkles :size="13" /></ClientOnly>
          Menú automático<template v-if="activeBlockName">
            · {{ activeBlockName }}</template
          >
        </Badge>
        <Badge v-else variant="outline" class="gap-1.5 font-medium">
          <ClientOnly><Pencil :size="13" /></ClientOnly>
          Menú personalizado
        </Badge>
      </div>

      <div
        v-for="group in groups"
        v-show="today[group.key].length"
        :key="group.key"
      >
        <div class="flex items-baseline gap-3 mb-3">
          <h3
            class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
          >
            {{ group.label }}
          </h3>
          <Separator class="flex-1 shrink" />
          <span class="text-sm text-muted-foreground tabular-nums">{{
            today[group.key].length
          }}</span>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div
            v-for="name in today[group.key]"
            :key="name"
            class="relative flex flex-col justify-between gap-3 p-4 transition-colors border rounded-xl min-h-[84px]"
            :class="
              isOut(name)
                ? 'border-dashed border-border bg-muted/30 opacity-70'
                : 'border-border bg-card hover:border-primary cursor-pointer'
            "
            @click="onTile(name)"
          >
            <button
              type="button"
              class="absolute px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase border rounded-full top-2 right-2"
              :class="
                isOut(name)
                  ? 'text-destructive border-destructive/30 bg-destructive/10'
                  : 'text-green-700 border-green-600/30 bg-green-600/10'
              "
              @click.stop="toggleOut(name)"
            >
              {{ isOut(name) ? "Agotado" : "Disponible" }}
            </button>

            <span
              class="pr-16 font-semibold leading-tight"
              :class="isOut(name) && 'line-through text-muted-foreground'"
            >
              {{ name }}
            </span>

            <span
              class="text-sm font-bold"
              :class="cart[name] ? 'text-green-700' : 'text-primary'"
            >
              <template v-if="isOut(name)">No disponible</template>
              <template v-else-if="cart[name]"
                >{{ cart[name] }} en la orden</template
              >
              <template v-else>+ Agregar</template>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Orden actual -->
    <Card class="p-5 lg:sticky lg:top-6">
      <h3
        class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
      >
        Orden actual
      </h3>

      <div
        v-if="!itemCount"
        class="py-8 text-sm text-center text-muted-foreground"
      >
        Toca un platillo para empezar.
      </div>

      <div v-else class="mt-3">
        <template v-for="group in groups" :key="group.key">
          <template v-if="cartGroup(group.key).length">
            <p
              class="mt-3 mb-1 text-[11px] font-bold tracking-wider uppercase text-muted-foreground"
            >
              {{ group.label }}
            </p>
            <div
              v-for="name in cartGroup(group.key)"
              :key="name"
              class="flex items-center gap-2 py-2 border-b border-dashed border-border"
            >
              <span class="flex-1 text-sm font-semibold">{{ name }}</span>
              <div class="flex items-center gap-1">
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
                <Button
                  variant="outline"
                  size="icon"
                  class="h-8 w-8"
                  @click="setQty(name, 1)"
                >
                  <ClientOnly><Plus :size="15" /></ClientOnly>
                </Button>
              </div>
            </div>
          </template>
        </template>
      </div>

      <Tabs v-model="mode" class="mt-4">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger v-for="m in MODES" :key="m" :value="m">
            {{ MODE_SHORT[m] }}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div v-if="mode === 'domicilio'" class="mt-3 space-y-2">
        <Input v-model="customer.name" placeholder="Nombre del cliente" />
        <Input
          v-model="customer.phone"
          type="tel"
          placeholder="WhatsApp (10 dígitos)"
        />
        <Input v-model="customer.address" placeholder="Dirección" />
      </div>

      <!-- Código de socio (opcional). Al enviar, descuenta una comida del mes. -->
      <div class="mt-3 space-y-1">
        <Label
          for="socio-code"
          class="text-[11px] font-bold tracking-wider uppercase text-muted-foreground"
        >
          Código de socio (opcional)
        </Label>
        <Input
          id="socio-code"
          v-model="memberCode"
          autocomplete="off"
          placeholder="Ej. GM1234"
          class="uppercase tracking-widest"
          @blur="memberCode = memberCode.replace(/\s+/g, '').toUpperCase()"
        />
        <p class="text-[11px] text-muted-foreground">
          Si el cliente es socio, se descuenta una comida al enviar.
        </p>
      </div>

      <!-- Hora de entrega -->
      <div class="mt-3 space-y-1">
        <Label
          class="text-[11px] font-bold tracking-wider uppercase text-muted-foreground"
        >
          Hora de entrega
        </Label>
        <div class="flex items-center gap-1.5">
          <Select :model-value="parts.h12" @update:model-value="setHour">
            <SelectTrigger class="flex-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="h in hours12" :key="h" :value="h">
                {{ h }}
              </SelectItem>
            </SelectContent>
          </Select>

          <span class="font-bold text-muted-foreground">:</span>

          <Select :model-value="parts.m" @update:model-value="setMinute">
            <SelectTrigger class="flex-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="m in minutes" :key="m" :value="m">
                {{ m }}
              </SelectItem>
            </SelectContent>
          </Select>

          <div class="flex overflow-hidden border rounded-md">
            <button
              type="button"
              class="px-2.5 py-2 text-xs font-bold uppercase transition-colors"
              :class="
                parts.period === 'am'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              "
              @click="setPeriod('am')"
            >
              am
            </button>
            <button
              type="button"
              class="px-2.5 py-2 text-xs font-bold uppercase transition-colors border-l"
              :class="
                parts.period === 'pm'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              "
              @click="setPeriod('pm')"
            >
              pm
            </button>
          </div>
        </div>
        <button
          v-if="fulfillTime"
          type="button"
          class="text-[11px] font-bold underline text-muted-foreground hover:text-primary"
          @click="clearTime"
        >
          Lo antes posible
        </button>
      </div>

      <Input
        v-model="note"
        class="mt-3"
        placeholder="Nota (opcional): sin cebolla, mesa 4…"
      />

      <Button
        size="lg"
        class="w-full mt-4"
        :disabled="!itemCount"
        @click="send"
      >
        <ClientOnly><Send :size="17" class="mr-2" /></ClientOnly>
        Enviar orden
      </Button>
      <button
        v-if="itemCount"
        class="block w-full mt-2 text-xs font-bold text-center underline text-muted-foreground hover:text-destructive"
        @click="clearCart"
      >
        Vaciar orden
      </button>
    </Card>
  </section>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Badge } from "@common/components/ui/badge";
import { Separator } from "@common/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@common/components/ui/select";
import { Plus, Minus, Send, Sparkles, Pencil } from "lucide-vue-next";
import { MODES, MODE_SHORT, groups } from "~/utils/comandas";

const {
  today,
  cart,
  mode,
  note,
  fulfillTime,
  customer,
  itemCount,
  orderText,
  isOut,
  cartGroup,
  onTile,
  toggleOut,
  setQty,
  clearCart,
  send,
  menuSource,
  activeBlockName,
  memberCode,
} = useComandas();

/* ===== Selector de hora (opera sobre fulfillTime "HH:mm" 24h) ===== */
const hours12 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const minutes = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

// Base para los selectores cuando aún no hay hora (default 2:00 p.m.).
const base = computed(() => fulfillTime.value || "14:00");

function split12(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { h12: String(h12), m: String(m).padStart(2, "0"), period };
}

function join24(h12: number, m: number, period: "am" | "pm") {
  let h = h12 % 12;
  if (period === "pm") h += 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const parts = computed(() => split12(base.value));

function setHour(h: unknown) {
  const p = parts.value;
  fulfillTime.value = join24(Number(h), Number(p.m), p.period as "am" | "pm");
}
function setMinute(m: unknown) {
  const p = parts.value;
  fulfillTime.value = join24(Number(p.h12), Number(m), p.period as "am" | "pm");
}
function setPeriod(pr: "am" | "pm") {
  const p = parts.value;
  fulfillTime.value = join24(Number(p.h12), Number(p.m), pr);
}
function clearTime() {
  fulfillTime.value = "";
}
</script>
