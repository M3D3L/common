<template>
  <section class="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Platillos del turno -->
    <div class="space-y-8 lg:col-span-2">
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

      <div class="mt-3 space-y-1">
        <Label
          for="fulfill-date"
          class="text-[11px] font-bold tracking-wider uppercase text-muted-foreground"
        >
          Fecha de entrega
        </Label>
        <Input
          id="fulfill-date"
          v-model="fulfillDate"
          type="date"
          :min="minDate"
        />
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
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Separator } from "@common/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import { Plus, Minus, Send } from "lucide-vue-next";
import { MODES, MODE_SHORT, groups } from "~/utils/comandas";

const {
  today,
  cart,
  mode,
  note,
  fulfillDate,
  customer,
  minDate,
  itemCount,
  orderText,
  isOut,
  cartGroup,
  onTile,
  toggleOut,
  setQty,
  clearCart,
  send,
} = useComandas();
</script>
