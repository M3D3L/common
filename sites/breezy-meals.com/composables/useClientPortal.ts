import usePocketBase from "@common/composables/usePocketbase";
import type { ClientPortalResponse } from "~/types/membership";

export default function useClientPortal() {
  const pb = usePocketBase();

  const lookup = (memberCode: string, phoneLast4: string) =>
    pb.send<ClientPortalResponse>("/api/breezy/client-portal", {
      method: "POST",
      body: {
        memberCode: memberCode.replace(/\s+/g, "").toUpperCase(),
        phoneLast4: phoneLast4.replace(/\D/g, ""),
      },
      requestKey: null,
    });

  return { lookup };
}
