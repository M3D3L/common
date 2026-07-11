<template>
  <section class="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Platillos del turno -->
    <div class="space-y-8 lg:col-span-2">
      <div
        v-for="group in groups"
        v-show="today[group.key].length"
        :key="group.key"
      >
        <!-- Group Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="flex items-center gap-2 text-primary">
            <ClientOnly><Utensils :size="18" /></ClientOnly>
            <h3 class="text-sm font-bold tracking-widest uppercase">
              {{ group.label }}
            </h3>
          </div>
          <Separator class="flex-1 shrink" />
          <Badge variant="secondary" class="font-mono">
            {{ today[group.key].length }}
          </Badge>
        </div>

        <!-- Group Items Grid -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div
            v-for="name in today[group.key]"
            :key="name"
            class="relative flex flex-col justify-between gap-4 p-4 transition-all duration-200 border rounded-xl min-h-[100px] group"
            :class="[
              isOut(name)
                ? 'border-dashed border-border bg-muted/40 opacity-70'
                : 'border-border bg-card hover:shadow-md hover:border-primary/40 cursor-pointer',
              cart[name] && !isOut(name)
                ? 'ring-1 ring-primary border-primary bg-primary/5'
                : '',
            ]"
            @click="onTile(name)"
          >
            <!-- Tile Header -->
            <div class="flex items-start justify-between gap-2">
              <span
                class="font-semibold leading-tight"
                :class="
                  isOut(name)
                    ? 'line-through text-muted-foreground'
                    : 'text-card-foreground'
                "
              >
                {{ name }}
              </span>

              <!-- Status Badge (Clickable) -->
              <Badge
                :variant="isOut(name) ? 'destructive' : 'outline'"
                class="z-10 cursor-pointer shrink-0 text-[10px] tracking-wider uppercase transition-colors hover:opacity-80"
                :class="
                  !isOut(name) &&
                  'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                "
                @click.stop="toggleOut(name)"
              >
                {{ isOut(name) ? "Agotado" : "Disponible" }}
              </Badge>
            </div>

            <!-- Tile Footer -->
            <div class="flex items-center">
              <span
                class="flex items-center gap-1.5 text-sm font-bold"
                :class="
                  cart[name]
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-primary'
                "
              >
                <template v-if="isOut(name)">
                  <ClientOnly
                    ><Ban :size="14" class="text-destructive"
                  /></ClientOnly>
                  <span class="text-destructive">No disponible</span>
                </template>
                <template v-else-if="cart[name]">
                  <ClientOnly><CheckCircle2 :size="15" /></ClientOnly>
                  {{ cart[name] }} en orden
                </template>
                <template v-else>
                  <ClientOnly><Plus :size="15" /></ClientOnly>
                  Agregar
                </template>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orden actual -->
    <Card class="flex flex-col shadow-sm lg:sticky lg:top-6">
      <CardHeader class="pb-4 border-b border-border bg-muted/20">
        <CardTitle class="flex items-center justify-between text-lg">
          <div class="flex items-center gap-2">
            <ClientOnly
              ><ShoppingCart :size="20" class="text-primary"
            /></ClientOnly>
            <span>Orden Actual</span>
          </div>
          <Badge v-if="itemCount" variant="default" class="px-2.5 py-0.5">
            {{ itemCount }} items
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent class="p-0">
        <!-- Empty State -->
        <div
          v-if="!itemCount"
          class="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground"
        >
          <ClientOnly
            ><ShoppingCart :size="48" class="opacity-20"
          /></ClientOnly>
          <p class="text-sm font-medium">Toca un platillo para empezar</p>
        </div>

        <!-- Cart Items -->
        <div v-else class="p-5 space-y-6">
          <div v-for="group in groups" :key="group.key">
            <template v-if="cartGroup(group.key).length">
              <h4
                class="flex items-center gap-2 mb-3 text-[11px] font-bold tracking-wider uppercase text-muted-foreground"
              >
                <ClientOnly><Utensils :size="12" /></ClientOnly>
                {{ group.label }}
              </h4>
              <div class="space-y-3">
                <div
                  v-for="name in cartGroup(group.key)"
                  :key="name"
                  class="flex items-center justify-between gap-3 p-2 border rounded-lg bg-card"
                >
                  <span class="flex-1 text-sm font-semibold leading-tight">{{
                    name
                  }}</span>
                  <div
                    class="flex items-center gap-1.5 p-1 border rounded-md bg-muted/30 border-border/50"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      @click="setQty(name, -1)"
                    >
                      <ClientOnly><Minus :size="14" /></ClientOnly>
                    </Button>
                    <span class="w-6 font-bold text-center tabular-nums">{{
                      cart[name]
                    }}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      @click="setQty(name, 1)"
                    >
                      <ClientOnly><Plus :size="14" /></ClientOnly>
                    </Button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </CardContent>

      <Separator v-if="itemCount" />

      <CardFooter
        class="flex-col gap-5 p-5 bg-muted/10 rounded-b-xl"
        :class="!itemCount && 'hidden'"
      >
        <!-- Modos -->
        <Tabs v-model="mode" class="w-full">
          <TabsList class="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger v-for="m in MODES" :key="m" :value="m" class="text-xs">
              {{ MODE_SHORT[m] }}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <!-- Formulario Domicilio -->
        <div v-if="mode === 'domicilio'" class="w-full space-y-3">
          <div class="relative">
            <ClientOnly
              ><User
                :size="15"
                class="absolute text-muted-foreground left-3 top-3"
            /></ClientOnly>
            <Input
              v-model="customer.name"
              placeholder="Nombre del cliente"
              class="pl-9"
            />
          </div>
          <div class="relative">
            <ClientOnly
              ><Phone
                :size="15"
                class="absolute text-muted-foreground left-3 top-3"
            /></ClientOnly>
            <Input
              v-model="customer.phone"
              type="tel"
              placeholder="WhatsApp (10 dígitos)"
              class="pl-9"
            />
          </div>
          <div class="relative">
            <ClientOnly
              ><MapPin
                :size="15"
                class="absolute text-muted-foreground left-3 top-3"
            /></ClientOnly>
            <Input
              v-model="customer.address"
              placeholder="Dirección de entrega"
              class="pl-9"
            />
          </div>
        </div>

        <!-- Fecha y Nota -->
        <div class="w-full space-y-4">
          <div class="space-y-2">
            <Label
              for="fulfill-date"
              class="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-muted-foreground"
            >
              <ClientOnly><CalendarIcon :size="13" /></ClientOnly>
              Fecha de entrega
            </Label>
            <Input
              id="fulfill-date"
              v-model="fulfillDate"
              type="date"
              :min="minDate"
            />
          </div>

          <div class="space-y-2">
            <Label
              for="note"
              class="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-muted-foreground"
            >
              <ClientOnly><StickyNote :size="13" /></ClientOnly>
              Notas adicionales
            </Label>
            <Input
              id="note"
              v-model="note"
              placeholder="Ej: sin cebolla, mesa 4, etc..."
            />
          </div>
        </div>

        <!-- Acciones -->
        <div class="w-full space-y-3 pt-2">
          <Button
            size="lg"
            class="w-full font-bold"
            :disabled="!itemCount"
            @click="send"
          >
            <ClientOnly><Send :size="18" class="mr-2" /></ClientOnly>
            Enviar Orden
          </Button>

          <Button
            size="lg"
            class="w-full font-bold"
            variant="ghost"
            @click="clearCart"
          >
            <ClientOnly><Trash2 :size="18" class="mr-2" /></ClientOnly>
            Vaciar orden
          </Button>
        </div>
      </CardFooter>
    </Card>
  </section>
</template>

<script lang="ts" setup>
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Separator } from "@common/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import {
  Plus,
  Minus,
  Send,
  Utensils,
  Ban,
  CheckCircle2,
  ShoppingCart,
  Trash2,
  CalendarIcon,
  StickyNote,
  User,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-vue-next";
import { MENU, MODES, MODE_SHORT, groups } from "~/utils/comandas";

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
