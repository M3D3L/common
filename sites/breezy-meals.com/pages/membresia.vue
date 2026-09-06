<template>
  <main
    class="membership-page min-h-[calc(100vh-76px)] bg-background text-foreground"
  >
    <section class="border-b border-border bg-primary/5">
      <div
        class="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-[1fr_340px] md:items-end md:px-8 md:py-14"
      >
        <div>
          <p class="mb-3 text-sm font-bold uppercase text-primary">
            Membresía Breezy
          </p>
          <h1
            class="max-w-2xl font-heading text-4xl font-extrabold md:text-6xl"
          >
            {{ offer.credits }} comidas por ${{ offer.price }}
          </h1>
          <p class="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Compra tu paquete por transferencia o paga directamente en tienda.
            Tus créditos se activan después de verificar el pago.
          </p>
        </div>
        <div class="border-l-4 border-primary pl-5">
          <p class="text-sm text-muted-foreground">Precio por comida</p>
          <p class="mt-1 text-3xl font-bold tabular-nums">
            ${{ Math.round(offer.price / offer.credits) }}
            <span class="text-base font-normal">{{ offer.currency }}</span>
          </p>
        </div>
      </div>
    </section>

    <section
      class="membership-content mx-auto max-w-3xl px-5 pt-8 md:px-8 md:pt-12"
    >
      <Alert v-if="errorMessage" variant="destructive" class="mb-5">
        <CircleAlert :size="18" />
        <AlertTitle>No se pudo enviar</AlertTitle>
        <AlertDescription>{{ errorMessage }}</AlertDescription>
      </Alert>

      <Card v-if="submittedReference" class="border-emerald-600">
        <CardHeader>
          <div
            class="mb-3 flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"
          >
            <Check :size="24" />
          </div>
          <CardTitle>Solicitud recibida</CardTitle>
          <CardDescription>
            Revisaremos el pago antes de agregar los créditos. Conserva esta
            referencia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="border-y border-border py-4">
            <p class="text-xs font-bold uppercase text-muted-foreground">
              Referencia
            </p>
            <p class="mt-1 font-mono text-lg font-bold">
              {{ submittedReference }}
            </p>
          </div>
          <Button class="mt-5 w-full" variant="outline" @click="resetForm">
            Enviar otra solicitud
          </Button>
        </CardContent>
      </Card>

      <Card v-else>
        <CardHeader>
          <CardTitle>Solicita tu paquete</CardTitle>
          <CardDescription>
            Usaremos estos datos para crear o localizar tu membresía.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            class="membership-form space-y-6"
            @submit.prevent="submitRequest"
          >
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-1.5 sm:col-span-2">
                <Label for="membership-name">Nombre completo</Label>
                <Input
                  id="membership-name"
                  v-model="form.name"
                  autocomplete="name"
                  required
                />
              </div>
              <div class="space-y-1.5">
                <Label for="membership-phone">Teléfono</Label>
                <Input
                  id="membership-phone"
                  v-model="form.phone"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  required
                />
              </div>
              <div class="space-y-1.5">
                <Label for="membership-code">Código de socio</Label>
                <Input
                  id="membership-code"
                  v-model="form.existingMemberCode"
                  class="uppercase"
                  placeholder="Opcional"
                />
              </div>
              <div class="space-y-1.5 sm:col-span-2">
                <Label for="membership-address">Dirección</Label>
                <Input
                  id="membership-address"
                  v-model="form.address"
                  autocomplete="street-address"
                  placeholder="Opcional, para entregas"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label>Forma de pago</Label>
              <div class="grid grid-cols-2 rounded-lg border border-border p-1">
                <button
                  type="button"
                  class="flex min-h-12 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors"
                  :class="
                    form.paymentMethod === 'transfer'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  "
                  @click="form.paymentMethod = 'transfer'"
                >
                  <Landmark :size="17" />
                  Transferencia
                </button>
                <button
                  type="button"
                  class="flex min-h-12 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors"
                  :class="
                    form.paymentMethod === 'in_store'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  "
                  @click="form.paymentMethod = 'in_store'"
                >
                  <Store :size="17" />
                  En tienda
                </button>
              </div>
            </div>

            <div
              v-if="form.paymentMethod === 'transfer'"
              class="space-y-5 border-l-4 border-primary bg-muted/50 p-4"
            >
              <div class="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p class="text-muted-foreground">Banco</p>
                  <p class="font-semibold">{{ offer.bank.bankName }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Titular</p>
                  <p class="font-semibold">{{ offer.bank.accountHolder }}</p>
                </div>
                <div class="sm:col-span-2">
                  <p class="text-muted-foreground">CLABE</p>
                  <p class="font-mono text-base font-bold">
                    {{ offer.bank.clabe }}
                  </p>
                </div>
                <div class="sm:col-span-2">
                  <p class="text-muted-foreground">Concepto</p>
                  <p class="font-semibold">{{ offer.bank.reference }}</p>
                </div>
              </div>

              <div class="space-y-1.5">
                <Label for="payment-proof">Comprobante de pago</Label>
                <label
                  for="payment-proof"
                  class="flex min-h-24 cursor-pointer items-center justify-center gap-3 rounded-md border border-dashed border-primary/60 bg-background px-4 text-center text-sm font-semibold hover:bg-primary/5"
                >
                  <ImageUp :size="20" />
                  {{
                    processingProof
                      ? "Optimizando imagen..."
                      : proofName || "Tomar foto o elegir imagen"
                  }}
                </label>
                <input
                  id="payment-proof"
                  class="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  required
                  @change="selectProof"
                />
                <p class="text-xs text-muted-foreground">
                  JPG, PNG o WebP. Se optimizará antes de enviar.
                </p>
              </div>
            </div>

            <Alert v-else>
              <Store :size="18" />
              <AlertTitle>Pago en tienda</AlertTitle>
              <AlertDescription>
                Presenta tu referencia al pagar. Los créditos se agregan después
                de que el personal confirme el cobro.
              </AlertDescription>
            </Alert>

            <Button
              class="h-12 w-full"
              type="submit"
              :disabled="submitting || processingProof"
            >
              {{
                submitting
                  ? "Enviando..."
                  : `Solicitar ${offer.credits} comidas`
              }}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@common/components/ui/alert";
import { Button } from "@common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { compressImage } from "@common/composables/useImageCompression";
import { Check, CircleAlert, ImageUp, Landmark, Store } from "lucide-vue-next";

definePageMeta({ layout: "breezy" });

const requests = useMembershipPaymentRequests();
const offer = requests.offer;
const submitting = ref(false);
const errorMessage = ref("");
const submittedReference = ref("");
const paymentProof = ref<File>();
const processingProof = ref(false);
const proofName = computed(() => {
  if (!paymentProof.value) return "";
  const sizeKB = Math.max(1, Math.round(paymentProof.value.size / 1024));
  return `${paymentProof.value.name} · ${sizeKB} KB`;
});
const form = reactive({
  name: "",
  phone: "",
  address: "",
  existingMemberCode: "",
  paymentMethod: "transfer" as "transfer" | "in_store",
});

async function selectProof(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  errorMessage.value = "";
  paymentProof.value = undefined;
  if (file.size > 20 * 1024 * 1024) {
    input.value = "";
    errorMessage.value = "La imagen original supera el máximo de 20 MB";
    return;
  }
  processingProof.value = true;
  try {
    paymentProof.value = await compressImage(file, {
      format: "webp",
      maxSizeMB: 0.35,
      maxWidthOrHeight: 1600,
      quality: 0.65,
      fileName: "comprobante-pago",
    });
  } catch {
    input.value = "";
    errorMessage.value =
      "No se pudo optimizar la imagen. Intenta con otra foto.";
  } finally {
    processingProof.value = false;
  }
}

async function submitRequest() {
  errorMessage.value = "";
  submitting.value = true;
  try {
    const record = await requests.submit({
      ...form,
      paymentProof: paymentProof.value,
    });
    submittedReference.value = record.id.toUpperCase();
  } catch (error: any) {
    errorMessage.value =
      error?.response?.message ||
      error?.message ||
      "No se pudo enviar la solicitud";
  } finally {
    submitting.value = false;
  }
}

function resetForm() {
  form.name = "";
  form.phone = "";
  form.address = "";
  form.existingMemberCode = "";
  form.paymentMethod = "transfer";
  paymentProof.value = undefined;
  submittedReference.value = "";
  errorMessage.value = "";
}

onMounted(() => {
  document.documentElement.classList.add("membership-scroll-active");
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove("membership-scroll-active");
});
</script>

<style scoped>
.membership-page {
  min-height: calc(100dvh - 76px);
  overflow-x: clip;
}

.membership-content {
  padding-bottom: calc(2rem + env(safe-area-inset-bottom, 0px));
}

.membership-form :is(input, button, [role="button"]) {
  scroll-margin-block: 6rem;
}

:global(html.membership-scroll-active) {
  scroll-behavior: auto !important;
  scroll-padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
}
</style>
