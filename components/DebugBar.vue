<template>
  <!-- Floating toggle button -->
  <Button
    v-if="queries?.length"
    class="fixed bottom-4 left-4 z-50"
    size="icon"
    variant="outline"
    @click="open = !open"
  >
    {{ open ? "×" : "DB" }}
  </Button>

  <!-- Debug panel -->
  <Card v-if="open" class="fixed bottom-16 right-4 z-40 w-[420px] max-h-[70vh]">
    <CardContent class="space-y-4 overflow-hidden">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold">Fetch Queries</h3>

        <Button
          v-if="queries.length"
          variant="destructive"
          size="sm"
          @click="clear"
        >
          Clear
        </Button>
      </div>

      <Separator />

      <div v-if="queries.length" class="space-y-3 max-h-[55vh] overflow-auto">
        <div
          v-for="(entry, index) in queries"
          :key="index"
          class="rounded-md border p-3 space-y-2"
        >
          <div class="flex items-start justify-between gap-3">
            <code class="text-xs break-all">
              {{ entry.query }}
            </code>

            <div class="flex gap-1 shrink-0">
              <Button size="icon" variant="outline" @click="toggle(index)">
                {{ expanded[index] ? "−" : "+" }}
              </Button>

              <Button size="icon" variant="destructive" @click="remove(index)">
                ✕
              </Button>
            </div>
          </div>

          <div
            v-if="expanded[index]"
            class="rounded bg-muted p-2 text-xs max-h-56 overflow-auto"
          >
            <pre>{{ JSON.stringify(entry.result, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <p v-else class="text-xs text-muted-foreground">No queries found.</p>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useDebugStore } from "~/store/debug";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const debugStore = useDebugStore();
const { queries } = storeToRefs(debugStore);

const open = ref(false);
const expanded = reactive<Record<number, boolean>>({});

const toggle = (index: number) => {
  expanded[index] = !expanded[index];
};

const remove = (index: number) => {
  debugStore.removeQueryAt(index);
  delete expanded[index];
};

const clear = () => {
  debugStore.clearQueries();
};
</script>

<style scoped>
code,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
</style>
