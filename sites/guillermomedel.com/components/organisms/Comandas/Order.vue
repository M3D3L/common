<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-bold tracking-tight">Tomar orden</h2>

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
        <Badge
          v-else-if="menuSource === 'custom'"
          variant="outline"
          class="gap-1.5 font-medium"
        >
          <ClientOnly><Pencil :size="13" /></ClientOnly>
          Menú personalizado
        </Badge>
      </div>

      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <ClientOnly><ShoppingBag :size="15" /></ClientOnly>
        <span class="tabular-nums">{{ itemCount }} en la orden</span>
      </div>
    </header>

    <section class="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- ==================== MENÚ ==================== -->
      <div class="space-y-6 lg:col-span-2">
        <div
          v-for="group in groups"
          v-show="today[group.key].length"
          :key="group.key"
        >
          <div class="flex items-center gap-3 mb-3">
            <h3
              class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
            >
              {{ group.label }}
            </h3>
            <Separator class="flex-1 shrink" />
            <Badge variant="secondary" class="rounded-full tabular-nums">
              {{ today[group.key].length }}
            </Badge>
          </div>

          <div
            v-if="taquizaGroup && group.key === taquizaGroup.key"
            class="space-y-3"
          >
            <div class="space-y-2">
              <div
                class="flex items-center justify-between rounded-md border p-2"
              >
                <div>
                  <p class="text-xs font-bold uppercase">Tacos</p>
                  <p class="text-[11px] text-muted-foreground">
                    {{ taquizaRules.tacos }} pieza(s) por orden
                  </p>
                </div>
                <div class="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-7 w-7"
                    :disabled="taquizaOrders.tacos <= 0"
                    @click="setTaquizaOrderQty('tacos', -1)"
                  >
                    <ClientOnly><Minus :size="14" /></ClientOnly>
                  </Button>
                  <span class="w-5 text-center text-sm font-bold tabular-nums">
                    {{ taquizaOrders.tacos }}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-7 w-7"
                    @click="setTaquizaOrderQty('tacos', 1)"
                  >
                    <ClientOnly><Plus :size="14" /></ClientOnly>
                  </Button>
                </div>
              </div>

              <div
                class="flex items-center justify-between rounded-md border p-2"
              >
                <div>
                  <p class="text-xs font-bold uppercase">Quesadillas</p>
                  <p class="text-[11px] text-muted-foreground">
                    {{ taquizaRules.quesadillas }} pieza(s) por orden
                  </p>
                </div>
                <div class="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-7 w-7"
                    :disabled="taquizaOrders.quesadillas <= 0"
                    @click="setTaquizaOrderQty('quesadillas', -1)"
                  >
                    <ClientOnly><Minus :size="14" /></ClientOnly>
                  </Button>
                  <span class="w-5 text-center text-sm font-bold tabular-nums">
                    {{ taquizaOrders.quesadillas }}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-7 w-7"
                    @click="setTaquizaOrderQty('quesadillas', 1)"
                  >
                    <ClientOnly><Plus :size="14" /></ClientOnly>
                  </Button>
                </div>
              </div>
            </div>

            <template v-for="kind in taquizaKinds" :key="kind">
              <section
                v-if="taquizaOrders[kind] > 0"
                class="rounded-md border p-2"
              >
                <div class="mb-2 flex items-center justify-between gap-2">
                  <p class="text-xs font-bold uppercase">
                    {{
                      kind === "tacos"
                        ? "Elige tus guisos de tacos"
                        : "Elige tus guisos de quesadillas"
                    }}
                  </p>
                  <span
                    class="rounded-full border border-muted bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground"
                  >
                    {{ taquizaOrders[kind] }} orden(es)
                  </span>
                </div>
                <p class="mb-2 text-[11px] text-muted-foreground">
                  {{ taquizaQtyByKind[kind] }}/{{ taquizaTargetByKind[kind] }}
                  pieza(s) seleccionadas.
                </p>
                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Card
                    v-for="name in today[group.key]"
                    :key="`${kind}-${name}`"
                    class="flex items-center gap-3 p-3"
                    :class="[
                      isOut(name) && 'opacity-60 border-dashed',
                      taquizaItemQtyByKind(kind, name) > 0 &&
                        'bg-primary/5 ring-1 ring-primary/40',
                    ]"
                  >
                    <div class="flex-1">
                      <p
                        class="font-semibold leading-tight"
                        :class="
                          isOut(name) && 'line-through text-muted-foreground'
                        "
                      >
                        {{ name }}
                      </p>
                    </div>

                    <div v-if="!isOut(name)" class="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        class="h-8 w-8"
                        :disabled="taquizaItemQtyByKind(kind, name) <= 0"
                        @click="setTaquizaFillQty(kind, name, -1)"
                      >
                        <ClientOnly><Minus :size="14" /></ClientOnly>
                      </Button>
                      <span class="w-6 text-center font-bold tabular-nums">
                        {{ taquizaItemQtyByKind(kind, name) }}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        class="h-8 w-8"
                        :disabled="!canAddTaquizaFill(kind)"
                        @click="setTaquizaFillQty(kind, name, 1)"
                      >
                        <ClientOnly><Plus :size="14" /></ClientOnly>
                      </Button>
                    </div>
                  </Card>
                </div>
              </section>
            </template>

            <p
              v-if="!hasTaquizaOrder"
              class="text-[11px] text-muted-foreground"
            >
              Agrega ordenes de tacos o quesadillas para elegir tus guisos.
            </p>
          </div>

          <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div
              v-for="name in today[group.key]"
              :key="name"
              role="button"
              :tabindex="isOut(name) ? -1 : 0"
              class="relative flex flex-col justify-between gap-4 p-4 transition-all border rounded-xl min-h-[96px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
              :class="
                isOut(name)
                  ? 'border-dashed border-border bg-muted/30 opacity-60'
                  : cart[name]
                    ? 'border-green-600/60 bg-green-600/5 cursor-pointer hover:border-green-600'
                    : 'border-border bg-card cursor-pointer hover:border-primary hover:shadow-sm'
              "
              @click="!isOut(name) && onTile(name)"
              @keydown.enter.prevent="!isOut(name) && onTile(name)"
            >
              <span
                v-if="cart[name] && !isOut(name)"
                class="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full shadow -top-2 -right-2 bg-green-600 tabular-nums"
              >
                {{ cart[name] }}
              </span>

              <span
                class="font-semibold leading-tight"
                :class="isOut(name) && 'line-through text-muted-foreground'"
              >
                {{ name }}
              </span>

              <div class="flex items-center justify-between gap-2">
                <span
                  class="text-sm font-bold"
                  :class="
                    isOut(name)
                      ? 'text-destructive'
                      : cart[name]
                        ? 'text-green-700'
                        : 'text-primary'
                  "
                >
                  <template v-if="isOut(name)">Agotado</template>
                  <template v-else-if="cart[name]">En la orden</template>
                  <template v-else>+ Agregar</template>
                </span>

                <button
                  type="button"
                  class="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide transition-colors"
                  :class="
                    isOut(name)
                      ? 'text-destructive hover:bg-destructive/10'
                      : 'text-green-700 hover:bg-green-600/10'
                  "
                  @click.stop="toggleOut(name)"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="isOut(name) ? 'bg-destructive' : 'bg-green-600'"
                  />
                  {{ isOut(name) ? "Agotado" : "Disp." }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin platillos -->
        <div
          v-if="!groups.some((g) => today[g.key] && today[g.key].length)"
          class="py-16 text-sm text-center text-muted-foreground"
        >
          No hay platillos para este turno.
        </div>
      </div>

      <!-- ==================== ORDEN ==================== -->
      <Card
        class="flex flex-col lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]"
      >
        <!-- Cabecera -->
        <div class="flex items-center justify-between p-5 pb-3">
          <h3
            class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
          >
            Orden actual
          </h3>
          <Badge v-if="itemCount" class="rounded-full tabular-nums">
            {{ itemCount }}
          </Badge>
        </div>

        <!-- Cuerpo desplazable -->
        <div class="flex-1 px-5 space-y-4 overflow-y-auto">
          <!-- Vacío -->
          <div
            v-if="!itemCount"
            class="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground"
          >
            <ClientOnly
              ><UtensilsCrossed :size="26" class="opacity-40"
            /></ClientOnly>
            <p class="text-sm">Toca un platillo para empezar.</p>
          </div>

          <!-- Artículos -->
          <div v-else class="space-y-4">
            <template v-for="group in groups" :key="group.key">
              <div v-if="cartGroup(group.key).length">
                <p
                  class="mb-2 text-[11px] font-bold tracking-wider uppercase text-muted-foreground"
                >
                  {{ group.label }}
                </p>
                <div class="space-y-1.5">
                  <div
                    v-for="name in cartGroup(group.key)"
                    :key="name"
                    class="flex items-center gap-2"
                  >
                    <span class="flex-1 text-sm font-medium leading-tight">{{
                      name
                    }}</span>
                    <div class="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        class="w-7 h-7"
                        @click="setQty(name, -1)"
                      >
                        <ClientOnly><Minus :size="14" /></ClientOnly>
                      </Button>
                      <span
                        class="w-6 text-sm font-bold text-center tabular-nums"
                        >{{ cart[name] }}</span
                      >
                      <Button
                        variant="outline"
                        size="icon"
                        class="w-7 h-7"
                        @click="setQty(name, 1)"
                      >
                        <ClientOnly><Plus :size="14" /></ClientOnly>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <Separator />

          <!-- Modo -->
          <Tabs v-model="mode">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger v-for="m in MODES" :key="m" :value="m">
                {{ MODE_SHORT[m] }}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <!-- Domicilio -->
          <div v-if="mode === 'domicilio'" class="space-y-2">
            <Input v-model="customer.name" placeholder="Nombre del cliente" />
            <Input
              v-model="customer.phone"
              type="tel"
              placeholder="WhatsApp (10 dígitos)"
            />
            <Input v-model="customer.address" placeholder="Dirección" />
          </div>

          <!-- Hora de entrega -->
          <div class="space-y-1.5">
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

          <!-- Código de socio -->
          <div class="space-y-1.5">
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
              class="tracking-widest uppercase"
              @blur="memberCode = memberCode.replace(/\s+/g, '').toUpperCase()"
            />
            <p class="text-[11px] text-muted-foreground">
              Si el cliente es socio, se descuenta una comida al enviar.
            </p>
          </div>

          <!-- Nota -->
          <Input
            v-model="note"
            placeholder="Nota (opcional): sin cebolla, mesa 4…"
          />
        </div>

        <!-- Acciones -->
        <div class="p-5 pt-3 border-t bg-card">
          <Button size="lg" class="w-full" :disabled="!itemCount" @click="send">
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
        </div>
      </Card>
    </section>
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@common/components/ui/select";
import {
  Plus,
  Minus,
  Send,
  Sparkles,
  Pencil,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-vue-next";
import { MODES, MODE_SHORT } from "~/utils/comandas";

const {
  menuGroups: groups,
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
  taquizaGroup,
  taquizaKinds,
  taquizaRules,
  taquizaOrders,
  taquizaTargetByKind,
  taquizaQtyByKind,
  hasTaquizaOrder,
  canAddTaquizaFill,
  taquizaItemQtyByKind,
  setTaquizaFillQty,
  setTaquizaOrderQty,
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
