<template>
  <section class="max-w-3xl">
    <h2 class="text-xl font-bold">Completadas hoy</h2>
    <p class="mb-6 text-muted-foreground">
      {{ prettyDate }} · {{ completedToday.length }} de
      {{ activeTemplates.length }} listas.
    </p>

    <div
      v-if="!completedToday.length"
      class="py-16 text-center border border-dashed rounded-xl border-border"
    >
      <p class="font-semibold">Aún no hay checklists completadas.</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Las que marques como completadas aparecerán aquí.
      </p>
    </div>

    <div v-else class="space-y-3">
      <Card
        v-for="row in completedToday"
        :key="row.template.id"
        class="flex items-center gap-3 p-4"
      >
        <span
          class="grid rounded-lg shrink-0 h-10 w-10 place-items-center bg-green-600/10 text-green-700"
        >
          <ClientOnly><CircleCheck :size="18" /></ClientOnly>
        </span>

        <div class="flex-1 min-w-0">
          <h3 class="font-bold leading-tight truncate">
            {{ row.template.title }}
          </h3>
          <p class="mt-0.5 text-sm text-muted-foreground">
            {{ progressFor(row.template.id).done }}/{{
              progressFor(row.template.id).total
            }}
            · {{ completedTime(row.run?.completedAt) }}
            <template v-if="row.run?.by"> · {{ row.run.by }}</template>
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          @click="reopenChecklist(row.template.id)"
        >
          <ClientOnly><RotateCcw :size="15" class="mr-1.5" /></ClientOnly>
          Reabrir
        </Button>
      </Card>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { CircleCheck, RotateCcw } from "lucide-vue-next";

const {
  activeTemplates,
  runFor,
  prettyDate,
  progressFor,
  statusFor,
  reopenChecklist,
} = useChecklists();

const completedToday = computed(() =>
  activeTemplates.value
    .filter((t) => statusFor(t.id) === "done")
    .map((t) => ({ template: t, run: runFor(t.id) }))
    .sort((a, b) => (b.run?.completedAt || 0) - (a.run?.completedAt || 0)),
);

const completedTime = (ts?: number) =>
  ts
    ? new Date(ts).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
</script>
