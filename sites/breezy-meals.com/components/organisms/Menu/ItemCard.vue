<template>
  <Card
    class="js-reveal-item flex items-center gap-3 rounded-xl border border-border/60 bg-background/90 p-3 transition-all hover:border-primary/20 hover:shadow-sm"
    :class="[
      isOut && 'opacity-60',
      qty > 0 && 'bg-primary/5 ring-1 ring-primary/40',
    ]"
  >
    <div class="flex flex-row w-full items-center gap-3">
      <div
        v-if="typeof item.image == 'string'"
        class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border/60"
      >
        <img
          :src="item.image"
          :alt="item.name"
          class="object-cover w-full h-full"
        />
      </div>

      <div class="min-w-0 flex-1">
        <p
          class="font-semibold leading-tight"
          :class="isOut && 'text-muted-foreground line-through'"
        >
          {{ item.name }}
        </p>
        <p
          v-if="item?.price !== 0"
          class="mt-0.5 text-[11px] font-semibold text-muted-foreground"
        >
          {{ money(item.price) }}
        </p>

        <Badge
          v-if="isOut"
          variant="outline"
          class="mt-1 border-destructive/30 bg-destructive/10 text-[10px] uppercase text-destructive"
        >
          Agotado
        </Badge>
      </div>

      <div v-if="!isOut" class="flex shrink-0 items-center gap-1">
        <template v-if="qty">
          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8"
            :aria-label="`Quitar uno de ${item.name}`"
            :disabled="isLocked"
            @click="$emit('remove')"
          >
            <ClientOnly><Minus :size="15" /></ClientOnly>
          </Button>
          <span
            class="w-6 text-center font-bold tabular-nums"
            aria-live="polite"
            >{{ qty }}</span
          >
        </template>
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8"
          :aria-label="`Agregar ${item.name}`"
          :disabled="!canAdd"
          @click="$emit('add')"
        >
          <ClientOnly><Plus :size="15" /></ClientOnly>
        </Button>
      </div>
      <Button
        v-if="staffMode && isLoggedIn"
        variant="ghost"
        size="sm"
        class="shrink-0 px-2 text-[10px]"
        :class="
          isOut
            ? 'text-destructive hover:text-destructive'
            : 'text-green-700 hover:text-green-800'
        "
        :title="isOut ? 'Marcar disponible' : 'Marcar agotado'"
        @click.stop="$emit('toggle-out')"
      >
        {{ isOut ? "Disponible" : "Agotado" }}
      </Button>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Plus, Minus } from "lucide-vue-next";
import type { GroupKey, MenuItem } from "~/utils/comandas";

defineProps<{
  item: MenuItem & { group: GroupKey };
  qty: number;
  isOut: boolean;
  isLocked: boolean;
  canAdd: boolean;
  staffMode: boolean;
  isLoggedIn: boolean;
  money: (value: number) => string;
}>();
defineEmits<{ add: []; remove: []; "toggle-out": [] }>();
</script>
