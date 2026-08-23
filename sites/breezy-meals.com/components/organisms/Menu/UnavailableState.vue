<template>
  <div class="grid min-h-screen place-items-center p-6 text-center">
    <div
      class="w-full max-w-md rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur"
    >
      <p class="mb-4 text-5xl">🍽️</p>
      <h1 class="text-xl font-bold font-heading">
        {{
          loadError ? "No pudimos cargar el menú" : "El menú aún no está listo"
        }}
      </h1>
      <p class="mt-2 text-sm text-muted-foreground">
        {{
          loadError
            ? "Revisa tu conexión y vuelve a intentarlo."
            : "El restaurante publica el menú al abrir. Vuelve en un momento."
        }}
      </p>
      <Button
        variant="outline"
        size="sm"
        class="mt-5 w-full"
        @click="$emit('retry')"
      >
        <ClientOnly><RotateCw :size="15" class="mr-2" /></ClientOnly>
        Reintentar
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { RotateCw } from "lucide-vue-next";

defineProps<{ loadError: boolean }>();
defineEmits<{ retry: [] }>();
</script>
