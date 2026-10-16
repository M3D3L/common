<template>
  <section class="js-reveal-item border-y border-border py-4">
    <h2 class="text-base font-bold">Servicio y entregas</h2>
    <dl class="my-4 grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt class="font-semibold">Horario</dt>
        <dd class="text-muted-foreground">{{ businessHours }}</dd>
      </div>
      <div>
        <dt class="font-semibold">Pedidos del día</dt>
        <dd class="text-muted-foreground">{{ cutoff }}</dd>
      </div>
      <div>
        <dt class="font-semibold">Entrega a domicilio</dt>
        <dd class="text-muted-foreground">
          San Carlos, Sonora. Envío desde $60 MXN; confirma cobertura y costo
          por WhatsApp.
        </dd>
      </div>
      <div>
        <dt class="font-semibold">Para recoger</dt>
        <dd class="text-muted-foreground">
          Breezy Market, San Carlos. Confirma la ubicación y el tiempo de
          preparación por WhatsApp.
        </dd>
      </div>
    </dl>
    <div class="mb-3 flex items-center justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-primary">
          Breezy Meals
        </p>
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
    <details>
      <summary class="cursor-pointer py-2 text-sm font-semibold">
        Cómo pedir
      </summary>
      <ol
        class="list-inside list-decimal space-y-1.5 text-sm text-muted-foreground"
      >
        <li>Selecciona tus platillos.</li>
        <li>Elige entrega a domicilio, para llevar o para comer aquí.</li>
        <li>Ingresa tu nombre y los datos de entrega cuando corresponda.</li>
        <li>
          Presiona "Pedir por WhatsApp" y envía el mensaje para confirmar tu
          pedido.
        </li>
      </ol>
      <p class="mt-3 text-sm text-muted-foreground">
        El tiempo de entrega y la forma de pago de tu pedido se confirman por
        WhatsApp.
      </p>
    </details>
  </section>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Instagram } from "lucide-vue-next";

defineProps<{ whatsappNumber: string }>();

const runtimeConfig = useRuntimeConfig();
const broadcast = runtimeConfig.public.business.menuBroadcast;
const businessHours = String(
  broadcast.businessHours || "9:00 a. m. a 7:00 p. m.",
).replace(/Business hours:/i, "Horario:");
const cutoff = String(broadcast.cutoff || "Ordena antes de las 5:00 p. m.");
</script>
