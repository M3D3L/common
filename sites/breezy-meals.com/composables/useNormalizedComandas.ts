import usePocketBase from "@common/composables/usePocketbase";
import { planComandaLines } from "~/lib/comanda-record";
import type { NormalizedRecord } from "~/lib/normalized-domain";
import type { PlacedOrder } from "~/utils/comandas";

export function useNormalizedComandas() {
  const pb = usePocketBase();

  async function syncLines(comandaId: string, order: PlacedOrder) {
    const existing = (await pb.collection("comanda_lines").getFullList({
      filter: pb.filter("comanda = {:comanda}", { comanda: comandaId }),
      sort: "sort_order",
      requestKey: null,
    })) as unknown as NormalizedRecord[];
    const plan = planComandaLines(comandaId, order, existing);

    for (const upsert of plan.upserts) {
      if (upsert.id) {
        await pb.collection("comanda_lines").update(upsert.id, upsert.data, {
          requestKey: null,
        });
      } else {
        await pb.collection("comanda_lines").create(upsert.data, {
          requestKey: null,
        });
      }
    }
    await Promise.all(
      plan.deletes.map((id) =>
        pb.collection("comanda_lines").delete(id, { requestKey: null }),
      ),
    );
  }

  return { syncLines };
}
