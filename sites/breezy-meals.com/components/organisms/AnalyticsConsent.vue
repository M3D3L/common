<template>
  <aside
    v-if="configured && !isStaff"
    class="mx-auto max-w-2xl px-4 py-4 text-sm"
    aria-label="Preferencias de privacidad"
  >
    <div v-if="showChoices" class="border-y border-border py-4">
      <p class="text-muted-foreground">
        Con tu permiso, usamos Google Analytics para medir visitas y acciones de
        compra. No enviamos tus datos de contacto, notas ni comprobantes. No se
        utiliza para publicidad.
      </p>
      <div class="mt-3 flex flex-wrap gap-3">
        <Button variant="outline" @click="choose('declined')">Rechazar</Button>
        <Button @click="choose('accepted')">Aceptar estadísticas</Button>
      </div>
    </div>
    <button
      v-else
      type="button"
      class="py-2 text-muted-foreground underline underline-offset-2"
      @click="showChoices = true"
    >
      Preferencias de privacidad
    </button>
  </aside>
</template>

<script setup lang="ts">
import { Button } from "@common/components/ui/button";
import usePocketBase from "@common/composables/usePocketbase";
import {
  publicAnalyticsPath,
  validMeasurementId,
} from "~/utils/publicAnalytics";

const config = useRuntimeConfig();
const route = useRoute();
const pb = usePocketBase();
const { initialize, gtag, disableAnalytics, enableAnalytics } = useGtag();
const track = useBreezyAnalytics();
const consent = useState<"accepted" | "declined" | null>(
  "breezy-analytics-consent",
  () => null,
);
const ready = useState("breezy-analytics-ready", () => false);
const configured = validMeasurementId(config.public.breezyAnalyticsId);
const id = String(config.public.breezyAnalyticsId || "");
const isStaff = ref(true);
const showChoices = ref(false);
let lastPage: string | null = null;
let stopAuthListener: (() => void) | undefined;

function syncTracking() {
  ready.value = false;
  if (!configured) return;
  try {
    const path = publicAnalyticsPath(route.path);
    if (consent.value !== "accepted" || isStaff.value || !path) {
      disableAnalytics(id);
      lastPage = null;
      return;
    }
    enableAnalytics(id);
    initialize(id);
    gtag("consent", "update", { analytics_storage: "granted" });
    ready.value = true;
    if (path !== lastPage && track("page_view")) lastPage = path;
  } catch {
    ready.value = false;
  }
}

function choose(value: "accepted" | "declined") {
  consent.value = value;
  showChoices.value = false;
  try {
    localStorage.setItem("breezy-analytics-consent", value);
  } catch {}
  if (value === "declined" && ready.value) {
    try {
      gtag("consent", "update", { analytics_storage: "denied" });
    } catch {}
  }
  syncTracking();
}

onMounted(() => {
  try {
    const saved = localStorage.getItem("breezy-analytics-consent");
    if (saved === "accepted" || saved === "declined") consent.value = saved;
  } catch {}
  showChoices.value = consent.value === null;
  isStaff.value = pb.authStore.isValid;
  stopAuthListener = pb.authStore.onChange(() => {
    isStaff.value = pb.authStore.isValid;
    syncTracking();
  });
  syncTracking();
});

watch(() => route.path, syncTracking);
onBeforeUnmount(() => {
  stopAuthListener?.();
  ready.value = false;
  if (configured) {
    try {
      disableAnalytics(id);
    } catch {}
  }
});
</script>
