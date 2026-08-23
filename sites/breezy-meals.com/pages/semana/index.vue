<template>
  <section class="lg:max-w-3xl px-4 pt-16 pb-28 mx-auto">
    <SeoMeta :follow="false" />

    <div class="mb-8">
      <h2 class="text-2xl font-bold tracking-tight">Preorden semanal</h2>
      <p class="text-sm text-muted-foreground">
        Arma tu pedido para los próximos días. Elige de lo disponible en cada
        fecha.
      </p>
    </div>

    <!-- Cargando -->
    <div v-if="loading" class="py-16 text-center">
      <p class="text-sm text-muted-foreground animate-pulse">
        Cargando menú de la semana…
      </p>
    </div>

    <!-- Sin menú semanal publicado -->
    <div
      v-else-if="!days.length"
      class="p-8 text-center border border-dashed rounded-xl border-border bg-card"
    >
      <p class="font-semibold">Aún no hay menú semanal publicado.</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Pídele al equipo que configure la semana en <code>Menú semanal</code>.
      </p>
    </div>

    <template v-else>
      <!-- Datos del cliente con Card Components -->
      <div
        class="p-5 mb-8 border rounded-xl border-border bg-card shadow-sm space-y-4"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <Input
            v-model="customer.name"
            placeholder="Tu nombre"
            class="bg-background"
          />
          <Input
            v-model="customer.phone"
            placeholder="Teléfono (opcional)"
            class="bg-background"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            v-for="m in modes"
            :key="m.value"
            type="button"
            :variant="mode === m.value ? 'default' : 'outline'"
            size="sm"
            @click="mode = m.value"
          >
            {{ m.label }}
          </Button>
        </div>

        <Input
          v-if="mode === 'domicilio'"
          v-model="customer.address"
          placeholder="Dirección de entrega"
          class="w-full bg-background"
        />
      </div>

      <!-- Bloques por día mejorados con Cards -->
      <div class="space-y-6">
        <div
          v-for="day in days"
          :key="day.date"
          class="border rounded-2xl bg-card border-border shadow-xs overflow-hidden transition-all duration-200"
          :class="{
            'ring-2 ring-primary/20 border-primary/40': dayUnits(day) > 0,
          }"
        >
          <!-- Cabecera del Día -->
          <div
            class="flex items-center justify-between px-5 py-3.5 bg-muted/40 border-b border-border"
          >
            <div class="flex items-center gap-3">
              <h3 class="font-bold capitalize text-base">{{ day.label }}</h3>
              <Badge
                v-if="dayUnits(day) > 0"
                variant="default"
                class="text-xs px-2 py-0.5"
              >
                {{ dayUnits(day) }} art.
              </Badge>
            </div>
            <span
              v-if="dayUnits(day) === 0"
              class="text-xs text-muted-foreground font-medium"
            >
              Sin selección
            </span>
          </div>

          <!-- Contenido del Menú por Día -->
          <div class="p-5 space-y-5">
            <div v-for="g in groups" :key="g.key">
              <template v-if="day.menu[g.key].length">
                <h4
                  class="mb-3 text-xs font-semibold tracking-wider uppercase text-muted-foreground"
                >
                  {{ g.label }}
                </h4>
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div
                    v-for="name in day.menu[g.key]"
                    :key="name"
                    class="flex flex-col justify-between p-3.5 border rounded-xl transition-all duration-150 select-none bg-card"
                    :class="[
                      isOut(name)
                        ? 'opacity-40 bg-muted/20 border-border'
                        : 'cursor-pointer hover:border-primary/50 hover:shadow-xs',
                      day.cart[name] > 0
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border',
                    ]"
                    @click="!isOut(name) && onTile(day.date, name)"
                  >
                    <span class="text-sm font-medium leading-snug">{{
                      name
                    }}</span>

                    <div
                      v-if="day.cart[name] > 0"
                      class="flex items-center justify-between mt-3 pt-2 border-t border-primary/10"
                      @click.stop
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        class="w-7 h-7 bg-background shadow-2xs hover:bg-muted"
                        @click="setQty(day.date, name, -1)"
                      >
                        <Minus :size="13" />
                      </Button>
                      <span class="text-sm font-bold tabular-nums px-2">
                        {{ day.cart[name] }}
                      </span>
                      <Button
                        type="button"
                        variant="default"
                        size="icon"
                        class="w-7 h-7 shadow-2xs"
                        @click="setQty(day.date, name, 1)"
                      >
                        <Plus :size="13" />
                      </Button>
                    </div>
                    <span
                      v-else-if="isOut(name)"
                      class="mt-3 text-xs font-medium text-muted-foreground"
                    >
                      Agotado
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Nota general con Textarea de Shadcn -->
      <div class="mt-8">
        <Textarea
          v-model="note"
          rows="2"
          placeholder="Notas para toda la semana (opcional)"
          class="w-full bg-card"
        />
      </div>
    </template>

    <!-- Footer fijo -->
    <div
      v-if="days.length"
      class="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur border-border z-40"
    >
      <div
        class="flex items-center justify-between px-4 py-3 mx-auto max-w-3xl"
      >
        <div class="text-sm">
          <span class="font-bold tabular-nums text-base">{{ totalUnits }}</span>
          <span class="text-muted-foreground">
            artículos · {{ daysWithItems.length }} día(s)</span
          >
        </div>
        <Button size="lg" :disabled="!itemCount || sending" @click="submit">
          {{ sending ? "Enviando…" : "Enviar preorden" }}
        </Button>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toastMsg"
      class="fixed z-50 px-4 py-2.5 text-sm font-medium -translate-x-1/2 rounded-xl bottom-20 left-1/2 bg-foreground text-background shadow-lg animate-in fade-in slide-in-from-bottom-2"
    >
      {{ toastMsg }}
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Textarea } from "@common/components/ui/textarea";
import { Badge } from "@common/components/ui/badge";
import { Minus, Plus } from "lucide-vue-next";
import { groups } from "~/utils/comandas";
import type { PreorderDay } from "~/composables/useWeeklyPreorder";

const {
  loading,
  sending,
  days,
  mode,
  customer,
  note,
  toastMsg,
  itemCount,
  totalUnits,
  daysWithItems,
  isOut,
  onTile,
  setQty,
  submit,
} = useWeeklyPreorder();

const modes = [
  { value: "aqui", label: "Aquí" },
  { value: "llevar", label: "Para llevar" },
  { value: "domicilio", label: "Domicilio" },
] as const;

const dayUnits = (day: PreorderDay) =>
  Object.values(day.cart).reduce((a, b) => a + b, 0);

definePageMeta({ layout: "breezy" });
</script>
