<template>
  <Card :class="['flex flex-col h-full', modeBorderClass(order.mode)]">
    <CardHeader
      class="flex flex-row items-center justify-between pb-2 space-y-0"
    >
      <div class="flex items-center gap-2">
        <Badge variant="secondary"> #{{ order.number }} </Badge>
        <Badge variant="outline" :class="modeBadgeClass(order.mode)">
          {{ MODE_LABEL[order.mode] || order.mode }}
        </Badge>
      </div>
      <CardDescription class="text-xs">
        {{ orderTime(order) }}
      </CardDescription>
    </CardHeader>

    <CardContent class="flex-1 pb-2 space-y-4">
      <div class="space-y-3">
        <div
          v-for="g in groups"
          v-show="hasGroupItems(order, g.key)"
          :key="g.key"
        >
          <h4
            class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
          >
            {{ g.label }}
          </h4>
          <ul class="space-y-1">
            <li
              v-for="line in getGroupLines(order, g.key)"
              :key="line.name"
              class="flex items-start gap-2 text-sm"
            >
              <span class="font-bold text-primary shrink-0"
                >{{ line.qty }}×</span
              >
              <span class="font-medium">{{ line.name }}</span>
            </li>
          </ul>
        </div>
      </div>

      <Separator />

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">Entrega programada:</span>
        <span
          class="font-medium"
          :class="order.fulfillDate !== todayISO() ? 'text-destructive' : ''"
        >
          {{
            order.fulfillDate === todayISO() ? "Hoy mismo" : order.fulfillDate
          }}
        </span>
      </div>

      <Alert
        v-if="order.mode === 'domicilio' && order.customer?.address"
        class="py-2 px-3"
      >
        <MapPin class="h-4 w-4" />
        <AlertDescription class="ml-2 flex flex-col gap-0.5 text-xs">
          <span>{{ order.customer.address }}</span>
          <span v-if="order.customer.name" class="font-semibold">
            Cliente: {{ order.customer.name }}
          </span>
        </AlertDescription>
      </Alert>

      <Alert v-if="order.note" class="bg-muted/50 py-2 px-3">
        <AlertDescription class="text-xs italic text-muted-foreground">
          Nota: {{ order.note }}
        </AlertDescription>
      </Alert>
    </CardContent>

    <CardFooter class="pt-2 gap-2">
      <Button class="flex-1" size="sm" @click="completeOrder(order)">
        <ClientOnly><Check class="w-4 h-4 mr-2" /></ClientOnly>
        Marcar lista
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="shrink-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        title="Descartar sin avisar"
        @click="discardOrder(order)"
      >
        <ClientOnly><Trash2 class="w-4 h-4" /></ClientOnly>
      </Button>
    </CardFooter>
  </Card>
</template>

<script lang="ts" setup>
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Separator } from "@common/components/ui/separator";
import { Alert, AlertDescription } from "@common/components/ui/alert";
import { Check, Trash2, MapPin } from "lucide-vue-next";
import {
  groups,
  todayISO,
  orderTime,
  modeBorderClass,
  modeBadgeClass,
  hasGroupItems,
  getGroupLines,
  type PlacedOrder,
} from "~/utils/comandas";

defineProps<{ order: PlacedOrder }>();

const { completeOrder, discardOrder } = useComandas();
</script>
