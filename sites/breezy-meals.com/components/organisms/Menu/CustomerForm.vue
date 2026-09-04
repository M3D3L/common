<template>
  <section>
    <h2
      class="mb-2 inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/80"
    >
      Tus datos / Your Info
    </h2>
    <Card
      class="space-y-4 rounded-2xl border-border/70 bg-card/85 p-4 shadow-sm"
    >
      <div class="space-y-1.5">
        <Label for="c-name" class="flex items-center gap-1">
          Tu nombre / Your name
          <span v-if="nameRequired" class="text-destructive">*</span>
          <span v-else class="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="c-name"
          v-model="customer.name"
          placeholder="Ej. Juan Pérez / e.g. John Doe"
          :class="{
            'border-destructive focus-visible:ring-destructive':
              itemCount > 0 && nameRequired && !customer.name.trim(),
          }"
        />
        <p
          v-if="itemCount > 0 && nameRequired && !customer.name.trim()"
          class="text-[11px] text-destructive"
        >
          Required to complete your order / Requerido para completar tu pedido.
        </p>
      </div>

      <!-- Código de socio (opcional). Texto plano: se estampa en el
          mensaje de WhatsApp; el staff valida y redime al servir. -->
      <div v-if="showMemberCode" class="space-y-1.5">
        <Label for="c-code">Código de socio / Member code (opcional)</Label>
        <Input
          id="c-code"
          v-model="memberCode"
          autocomplete="off"
          placeholder="Ej. GM1234"
          class="uppercase tracking-widest"
          @blur="
            memberCode = (memberCode ?? '').replace(/\s+/g, '').toUpperCase()
          "
        />
        <p class="text-[11px] text-muted-foreground">
          Si eres socio, ingresa tu código para usar una de tus comidas.
        </p>
      </div>

      <template v-if="staffMode || mode === 'domicilio'">
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
            Dirección / Address
            <span v-if="mode === 'domicilio'" class="text-destructive">*</span>
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

        <div v-if="mode === 'domicilio'" class="space-y-1.5">
          <Label for="c-delivery-fee">Costo de envío / Delivery fee</Label>
          <div v-if="staffMode" class="relative">
            <span
              class="pointer-events-none absolute inset-y-0 left-3 flex items-center font-semibold text-muted-foreground"
            >
              $
            </span>
            <Input
              id="c-delivery-fee"
              v-model.number="deliveryFee"
              type="number"
              min="0"
              step="10"
              inputmode="decimal"
              class="pl-7 tabular-nums"
            />
          </div>
          <div
            v-else
            class="flex h-10 items-center justify-between rounded-md border border-border bg-muted/40 px-3"
          >
            <span class="text-sm text-muted-foreground">Envío desde</span>
            <span class="font-bold tabular-nums">$60 MXN</span>
          </div>
          <p v-if="staffMode" class="text-[11px] text-muted-foreground">
            Desde $60 MXN; ajústalo según la ubicación.
          </p>
        </div>
      </template>

      <!-- Hora: para "aquí" y "para llevar" (no domicilio). Opcional, sin default -->
      <div v-if="mode !== 'domicilio'" class="space-y-1.5">
        <Label>{{ timeLabel }} (opcional/optional)</Label>
        <div class="flex items-center gap-1.5">
          <Select v-model="selHour">
            <SelectTrigger class="flex-1">
              <SelectValue placeholder="Hora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="h in hours12" :key="h" :value="h">
                {{ h }}
              </SelectItem>
            </SelectContent>
          </Select>

          <span class="font-bold text-muted-foreground">:</span>

          <Select v-model="selMin">
            <SelectTrigger class="flex-1">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
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
                selPeriod === 'am'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              "
              @click="selPeriod = 'am'"
            >
              am
            </button>
            <button
              type="button"
              class="px-2.5 py-2 text-xs font-bold uppercase transition-colors border-l"
              :class="
                selPeriod === 'pm'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              "
              @click="selPeriod = 'pm'"
            >
              pm
            </button>
          </div>
        </div>
        <button
          v-if="selHour || selMin || selPeriod"
          type="button"
          class="text-[11px] font-bold underline text-muted-foreground hover:text-primary"
          @click="$emit('clear-time')"
        >
          Lo antes posible / ASAP
        </button>
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
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Textarea } from "@common/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@common/components/ui/select";
import type { OrderMode } from "~/composables/useWhatsappOrder";

defineProps<{
  customer: { name: string; phone: string; address: string };
  itemCount: number;
  nameRequired: boolean;
  needsAddress: boolean;
  showMemberCode: boolean;
  staffMode: boolean;
  mode: OrderMode;
  timeLabel: string;
  hours12: string[];
  minutes: string[];
}>();
defineEmits<{ "clear-time": [] }>();

const memberCode = defineModel<string>("memberCode", { required: true });
const note = defineModel<string>("note", { required: true });
const deliveryFee = defineModel<number>("deliveryFee", { required: true });
const selHour = defineModel<string | undefined>("selHour");
const selMin = defineModel<string | undefined>("selMin");
const selPeriod = defineModel<"am" | "pm" | undefined>("selPeriod");
</script>
