<template>
  <div class="w-full">
    <Button class="w-full gap-2" size="lg" @click="open = true">
      <CalendarClock class="w-4 h-4" />
      {{ isSp ? "Solicitar visita" : "Request a Viewing" }}
    </Button>

    <p class="mt-2 text-xs leading-relaxed text-muted-foreground">
      {{
        isSp
          ? "Confirmamos disponibilidad antes de cerrar la cita y te respondemos por WhatsApp."
          : "We confirm availability before locking the slot and reply by WhatsApp."
      }}
    </p>

    <Dialog :open="open" @update:open="open = $event">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-2xl font-bold">
            {{ isSp ? "Solicitar visita" : "Request a Viewing" }}
          </DialogTitle>
          <DialogDescription>
            {{
              isSp
                ? "Envíanos tu solicitud por WhatsApp. Un agente confirmará la disponibilidad y compartirá los siguientes pasos."
                : "Send your request by WhatsApp. An agent will confirm availability and share the next steps."
            }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2 sm:col-span-2">
                <Label for="request-name">
                  {{ isSp ? "Nombre" : "Full Name" }}
                </Label>
                <Input
                  id="request-name"
                  v-model="fullName"
                  :placeholder="isSp ? 'Tu nombre completo' : 'Your full name'"
                />
              </div>

              <div class="space-y-2">
                <Label for="request-phone">
                  {{ isSp ? "Teléfono" : "Phone" }}
                </Label>
                <Input
                  id="request-phone"
                  v-model="phone"
                  :placeholder="isSp ? '+52...' : '+52...'"
                />
              </div>

              <div class="space-y-2">
                <Label for="request-date">
                  {{ isSp ? "Fecha preferida" : "Preferred Date" }}
                </Label>
                <Input id="request-date" v-model="preferredDate" type="date" />
              </div>

              <div class="space-y-2">
                <Label for="request-time">
                  {{ isSp ? "Hora preferida" : "Preferred Time" }}
                </Label>
                <Input id="request-time" v-model="preferredTime" type="time" />
              </div>

              <div class="space-y-2 sm:col-span-2">
                <Label for="request-notes">
                  {{ isSp ? "Notas" : "Notes" }}
                </Label>
                <Textarea
                  id="request-notes"
                  v-model="notes"
                  :placeholder="
                    isSp
                      ? 'Cuéntanos si deseas una visita presencial o si tienes algún horario especial.'
                      : 'Tell us if you want an in-person viewing or have any special timing needs.'
                  "
                  class="min-h-32"
                />
              </div>
            </div>

            <div
              v-if="errorMessage"
              class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {{ errorMessage }}
            </div>
          </div>

          <Card class="border-border/60 bg-muted/30 p-5">
            <div class="space-y-4">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {{ isSp ? "Propiedad" : "Property" }}
                </p>
                <h3 class="mt-1 text-xl font-bold text-foreground">
                  {{
                    property?.title ||
                    (isSp ? "Propiedad seleccionada" : "Selected property")
                  }}
                </h3>
                <p
                  v-if="property?.address"
                  class="mt-2 text-sm text-muted-foreground"
                >
                  {{ property.address }}
                </p>
              </div>

              <div class="rounded-lg bg-background p-4 shadow-sm">
                <p class="text-sm text-muted-foreground">
                  {{ isSp ? "Tu solicitud irá a" : "Your request will go to" }}
                </p>
                <p class="mt-1 font-semibold text-foreground">
                  {{ agentLabel }}
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  {{
                    resolvedPhone ||
                    (isSp ? "Sin teléfono configurado" : "No phone configured")
                  }}
                </p>
              </div>

              <ul class="space-y-3 text-sm text-muted-foreground">
                <li>
                  {{
                    isSp
                      ? "1. Revisamos disponibilidad en calendario."
                      : "1. We check calendar availability."
                  }}
                </li>
                <li>
                  {{
                    isSp
                      ? "2. Confirmamos la visita por WhatsApp."
                      : "2. We confirm the viewing by WhatsApp."
                  }}
                </li>
                <li>
                  {{
                    isSp
                      ? "3. Si todo cuadra, compartimos el siguiente paso."
                      : "3. If it fits, we share the next step."
                  }}
                </li>
              </ul>

              <p class="text-xs leading-relaxed text-muted-foreground">
                {{
                  isSp
                    ? "No permitimos reservas automáticas. Esto mantiene el control del agente sobre cada propiedad."
                    : "We do not allow automatic self-booking. This keeps the agent in control of each property."
                }}
              </p>
            </div>
          </Card>
        </div>

        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" @click="open = false">
            {{ isSp ? "Cerrar" : "Cancel" }}
          </Button>
          <Button class="gap-2" @click="sendRequest">
            <MessageCircle class="w-4 h-4" />
            {{ isSp ? "Enviar por WhatsApp" : "Send by WhatsApp" }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { CalendarClock, MessageCircle } from "lucide-vue-next";
import { Button } from "@common/components/ui/button";
import { Card } from "@common/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Textarea } from "@common/components/ui/textarea";

const props = defineProps<{
  property: any;
  isSp?: boolean;
}>();

const config = useRuntimeConfig();
const open = ref(false);
const fullName = ref("");
const phone = ref("");
const preferredDate = ref("");
const preferredTime = ref("");
const notes = ref("");
const errorMessage = ref("");

const normalizePhone = (value?: string) => (value || "").replace(/\D/g, "");

const resolvedPhone = computed(() => {
  const authorPhone = props.property?.expand?.author?.phone;
  return normalizePhone(authorPhone || config.public.whatsappNumber || "");
});

const agentLabel = computed(() => {
  const author = props.property?.expand?.author;
  return author?.name || author?.title || config.public.siteName || "Agent";
});

const buildMessage = () => {
  const title =
    props.property?.title || (props.isSp ? "propiedad" : "property");
  const address = props.property?.address
    ? `\nAddress: ${props.property.address}`
    : "";
  const date = preferredDate.value
    ? `\nPreferred date: ${preferredDate.value}`
    : "";
  const time = preferredTime.value
    ? `\nPreferred time: ${preferredTime.value}`
    : "";
  const extraNotes = notes.value ? `\nNotes: ${notes.value}` : "";

  return props.isSp
    ? `Hola, me gustaría solicitar una visita para "${title}".${address}${date}${time}${extraNotes}\n\nNombre: ${fullName.value || "N/A"}\nTeléfono: ${phone.value || "N/A"}\nPor favor confirmen disponibilidad.`
    : `Hello, I would like to request a viewing for "${title}".${address}${date}${time}${extraNotes}\n\nName: ${fullName.value || "N/A"}\nPhone: ${phone.value || "N/A"}\nPlease confirm availability.`;
};

const sendRequest = () => {
  errorMessage.value = "";

  if (!resolvedPhone.value) {
    errorMessage.value = props.isSp
      ? "No hay un teléfono de WhatsApp configurado para esta propiedad."
      : "No WhatsApp number is configured for this property.";
    return;
  }

  const message = buildMessage();
  const url = `https://wa.me/${resolvedPhone.value}?text=${encodeURIComponent(message)}`;

  if (process.client) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  open.value = false;
};
</script>
