<template>
  <div v-if="isMounted">
    <Button
      v-if="queries?.length"
      class="fixed bottom-4 left-4 z-50"
      size="icon"
      variant="outline"
      @click="open = !open"
    >
      {{ open ? "×" : "DB" }}
    </Button>

    <Card
      v-if="open"
      class="fixed bottom-16 left-4 z-40 w-[420px] max-h-[70vh] shadow-xl border-muted/60"
    >
      <CardContent class="p-4 space-y-4 overflow-hidden">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">Fetch Queries</h3>

          <Button
            v-if="queries.length"
            variant="destructive"
            size="sm"
            class="h-7 text-xs"
            @click="clear"
          >
            Clear
          </Button>
        </div>

        <Separator />

        <div
          v-if="queries.length"
          class="space-y-3 max-h-[55vh] overflow-auto pr-1"
        >
          <div
            v-for="(entry, index) in queries"
            :key="index"
            class="rounded-md border bg-muted/30 p-3 space-y-2"
          >
            <div class="flex items-start justify-between gap-3">
              <code
                class="text-[10px] break-all text-muted-foreground leading-tight"
              >
                {{ entry.query }}
              </code>

              <div class="flex gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="outline"
                  class="h-6 w-6"
                  @click="toggle(index)"
                >
                  <span class="text-xs">{{ expanded[index] ? "−" : "+" }}</span>
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  class="h-6 w-6 text-destructive hover:bg-destructive/10"
                  @click="remove(index)"
                >
                  <span class="text-xs">✕</span>
                </Button>
              </div>
            </div>

            <div
              v-if="expanded[index]"
              class="rounded bg-background border p-2 text-[10px] max-h-56 overflow-auto shadow-inner"
            >
              <pre class="whitespace-pre-wrap font-mono">{{
                JSON.stringify(entry.result, null, 2)
              }}</pre>
            </div>
          </div>
        </div>

        <p v-else class="text-xs text-muted-foreground text-center py-4 italic">
          No queries recorded.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { useDebugStore } from "~/store/debug";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/* --- State --- */
const isMounted = ref(false);
const open = ref(false);
const expanded = reactive<Record<number, boolean>>({});

// Initialize empty refs to hold store data later
const queries = ref<any[]>([]);
let debugStore: any = null;

/* --- Lifecycle --- */
onMounted(() => {
  // 1. Mark as mounted so the template v-if triggers
  isMounted.value = true;

  // 2. Access the store ONLY now that we are on the client
  debugStore = useDebugStore();

  // 3. Extract the reactive queries reference
  const { queries: storeQueries } = storeToRefs(debugStore);

  // 4. Keep our local ref in sync with Pinia
  watchEffect(() => {
    queries.value = storeQueries.value;
  });
});

/* --- Methods --- */
const toggle = (index: number) => {
  expanded[index] = !expanded[index];
};

const remove = (index: number) => {
  if (debugStore) {
    debugStore.removeQueryAt(index);
    delete expanded[index];
  }
};

const clear = () => {
  if (debugStore) {
    debugStore.clearQueries();
  }
};
</script>

<style scoped>
code,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* Scannable scrollbar */
.overflow-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--muted));
  border-radius: 4px;
}
</style>
