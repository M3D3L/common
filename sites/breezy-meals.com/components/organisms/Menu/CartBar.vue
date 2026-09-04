<template>
  <div
    class="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/80 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-6"
  >
    <div class="mx-auto max-w-2xl space-y-2">
      <div
        v-if="promoStatusBanner"
        class="rounded-xl border px-3 py-2"
        :class="
          promoStatusBanner.met
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-amber-300 bg-amber-50'
        "
      >
        <p
          class="text-xs font-semibold"
          :class="promoStatusBanner.met ? 'text-emerald-800' : 'text-amber-800'"
        >
          {{ promoStatusBanner.title }}
        </p>
        <p
          class="text-[11px]"
          :class="promoStatusBanner.met ? 'text-emerald-700' : 'text-amber-700'"
        >
          {{ promoStatusBanner.message }}
        </p>
      </div>

      <div
        class="flex items-center justify-between text-xs text-muted-foreground"
      >
        <span class="tabular-nums">
          <template v-if="totalQty">
            {{ totalQty }} {{ totalQty === 1 ? "artículo" : "artículos" }} ·
            {{ modeLabel }}
          </template>
          <template v-else> Tu pedido / Your order · {{ modeLabel }} </template>
        </span>
        <span v-if="showTotal" class="font-semibold tabular-nums">
          {{ money(total) }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <Button
          v-if="totalQty"
          variant="outline"
          size="lg"
          class="shrink-0 rounded-xl"
          @click="$emit('clear-cart')"
        >
          <ClientOnly><Trash2 :size="16" class="mr-2" /></ClientOnly>
          Vaciar
        </Button>
        <Button
          size="lg"
          class="flex-1 rounded-xl bg-[#25D366] font-bold text-white shadow-sm hover:bg-[#20bd5a]"
          :disabled="!canTrySend || sendingOrder"
          @click="$emit('send-order')"
        >
          <img
            src="/icons/whatsapp.svg"
            alt=""
            aria-hidden="true"
            class="mr-2 h-5 w-5"
          />
          {{ sendingOrder ? "Enviando..." : "Pedir por WhatsApp" }}
        </Button>
      </div>

      <p
        v-if="itemCount && !canTrySend"
        class="text-[11px] text-muted-foreground text-center"
      >
        {{ hint }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Trash2 } from "lucide-vue-next";

defineProps<{
  promoStatusBanner: { met: boolean; title: string; message: string } | null;
  totalQty: number;
  itemCount: number;
  modeLabel: string;
  total: number;
  showTotal: boolean;
  money: (value: number) => string;
  sendingOrder: boolean;
  canTrySend: boolean;
  hint: string;
}>();
defineEmits<{ "clear-cart": []; "send-order": [] }>();
</script>
