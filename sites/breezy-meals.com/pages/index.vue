<template>
  <div class="bg-gradient-to-b from-background via-background to-muted/20 font-body">
    <main class="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-10">
      <section aria-labelledby="home-title">
        <Card class="overflow-hidden rounded-3xl border-border/70 shadow-sm">
          <CardContent class="relative p-6 sm:p-10">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-400/10"
            />
            <div class="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-12">
              <div>
                <Badge variant="outline" class="gap-1.5 rounded-full bg-background/70 px-3 py-1">
                  <MapPin class="size-3.5" aria-hidden="true" />
                  Breezy Market · San Carlos, Sonora
                </Badge>
                <h1
                  id="home-title"
                  class="mt-5 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl"
                >
                  Tu comida de hoy,
                  <span class="text-primary">sin complicaciones.</span>
                </h1>
                <p class="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                  ¿Qué se te antoja? Consulta el menú del día, elige tus favoritos
                  y envía tu pedido por WhatsApp.
                </p>
                <Button as-child size="lg" class="mt-6 h-12 w-full gap-3 text-base font-bold sm:w-auto">
                  <NuxtLink to="/menu">
                    Ver menú y pedir
                    <ArrowRight class="size-5" aria-hidden="true" />
                  </NuxtLink>
                </Button>
                <p class="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Utensils class="size-4 shrink-0 text-primary" aria-hidden="true" />
                  Para llevar o a domicilio. Tú eliges.
                </p>
              </div>

              <div class="rounded-2xl border border-border/70 bg-background/80 p-5 sm:p-6">
                <div class="mb-5 flex items-center gap-3">
                  <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShoppingBag class="size-5" aria-hidden="true" />
                  </span>
                  <h2 class="font-heading text-lg font-bold">Pedir es así de fácil</h2>
                </div>
                <ol class="space-y-5">
                  <li v-for="(step, index) in steps" :key="step.title" class="flex gap-3">
                    <span class="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-xs font-bold text-primary">
                      {{ index + 1 }}
                    </span>
                    <div>
                      <h3 class="text-sm font-bold">{{ step.title }}</h3>
                      <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{{ step.description }}</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="explore-title">
        <div class="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="explore-title" class="font-heading text-xl font-bold">Más de Breezy</h2>
          <p class="text-sm text-muted-foreground">Para cada antojo y ocasión.</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          <NuxtLink
            v-for="destination in destinations"
            :key="destination.to"
            :to="destination.to"
            class="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card class="h-full rounded-2xl border-border/70 shadow-sm transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
              <CardContent class="p-5">
                <div class="flex items-center justify-between text-primary">
                  <component :is="destination.icon" class="size-5" aria-hidden="true" />
                  <ArrowUpRight class="size-4" aria-hidden="true" />
                </div>
                <h3 class="mt-4 text-base font-bold">{{ destination.title }}</h3>
                <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{{ destination.description }}</p>
              </CardContent>
            </Card>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, ArrowUpRight, ChefHat, MapPin, ShoppingBag, Store, Tags, Utensils } from "lucide-vue-next";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Card, CardContent } from "@common/components/ui/card";

definePageMeta({ layout: "breezy" });

useSeoMeta({
  title: "Breezy Market | Comida del día en San Carlos",
  description: "Consulta el menú del día de Breezy Market en San Carlos, Sonora. Elige tu comida para llevar o a domicilio y envía tu pedido por WhatsApp.",
});

const steps = [
  { title: "Explora el menú", description: "Consulta los platillos y las promociones disponibles." },
  { title: "Arma tu pedido", description: "Agrega tus favoritos y elige cómo recibirlos." },
  { title: "Envíalo por WhatsApp", description: "Revisa tu pedido y compártelo con nuestro equipo." },
];

const destinations = [
  { to: "/promos", title: "Promociones", description: "Encuentra un combo para tu antojo.", icon: Tags },
  { to: "/tienda", title: "Tienda", description: "Explora más productos de Breezy.", icon: Store },
  { to: "/catering", title: "Catering", description: "Lleva Breezy a tu próxima reunión.", icon: ChefHat },
];
</script>
