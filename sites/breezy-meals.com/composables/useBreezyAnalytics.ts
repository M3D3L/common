import {
  createPublicAnalytics,
  validMeasurementId,
} from "~/utils/publicAnalytics";
import usePocketBase from "@common/composables/usePocketbase";

export function useBreezyAnalytics() {
  const config = useRuntimeConfig();
  const route = useRoute();
  const consent = useState<"accepted" | "declined" | null>(
    "breezy-analytics-consent",
    () => null,
  );
  const ready = useState("breezy-analytics-ready", () => false);
  const pb = usePocketBase();
  const { gtag } = useGtag();
  return createPublicAnalytics({
    enabled: () =>
      import.meta.client &&
      ready.value &&
      consent.value === "accepted" &&
      validMeasurementId(config.public.breezyAnalyticsId) &&
      !pb.authStore.isValid,
    path: () => route.path,
    send: (event, payload) => gtag("event", event, payload),
  });
}
