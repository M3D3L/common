<template>
  <section
    class="js-reveal-item rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-4 shadow-sm"
  >
    <div class="mb-3 flex items-center justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-primary">
          Breezy Meals
        </p>
        <h3 class="mt-1 flex items-center gap-2 text-sm font-bold">
          <span>💡</span> How to order / Cómo pedir
        </h3>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span
          class="hidden text-right text-xs font-semibold text-[#128c4a] sm:block"
        >
          Síguenos o<br />escríbenos
        </span>
        <Button
          as-child
          variant="outline"
          size="icon"
          class="h-10 w-10 rounded-full border-transparent shadow-sm"
        >
          <a
            href="https://www.instagram.com/breezymarketsc/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Seguir a Breezy Market en Instagram"
            style="
              background: linear-gradient(
                135deg,
                #feda75 0%,
                #fa7e1e 25%,
                #d62976 50%,
                #962fbf 75%,
                #4f5bd5 100%
              ) !important;
              color: #fff !important;
            "
          >
            <Instagram class="h-5 w-5" />
          </a>
        </Button>
        <MoleculesWhatsappButton
          :phone="whatsappNumber"
          message="Hola Breezy Meals, tengo una pregunta sobre el menú de hoy."
          icon-styles="h-10 w-10"
          class="rounded-full shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        />
      </div>
    </div>
    <ol
      class="list-inside list-decimal space-y-1.5 text-xs text-muted-foreground"
    >
      <li>Select your dishes / Selecciona tus platillos.</li>
      <li>Choose delivery/pickup / Elige entrega o recoger.</li>
      <li>
        Fill in your name (required for delivery) / Ingresa tu nombre (requerido
        para domicilio).
      </li>
      <li>Tap "Order on WhatsApp" / Presiona "Pedir por WhatsApp".</li>
    </ol>
  </section>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Instagram } from "lucide-vue-next";

defineProps<{ whatsappNumber: string }>();
</script>
