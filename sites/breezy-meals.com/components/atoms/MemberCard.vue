<template>
  <Card
    class="member-card bg-white relative text-black rounded-full aspect-square overflow-hidden p-0 border-[3px] border-black"
    style="width: 192px; height: 192px"
  >
    <!-- Ribbon cap: clipped by the circle into a curved banner -->
    <div
      class="absolute top-0 inset-x-0 h-12 bg-black flex items-end justify-center gap-1 pb-1.5"
    >
      <div class="w-16 h-16 pt-10 -mb-px brightness-0 invert">
        <MoleculesSvg src="/icons/tetakawi.svg" />
      </div>
    </div>

    <!-- Badge content -->
    <div
      class="relative z-10 flex flex-col items-center w-full h-full pt-9 px-4 text-center"
    >
      <div class="mt-6 w-full">
        <p
          class="font-black uppercase text-[10.5px] leading-[1.1] tracking-[0.02em] text-black line-clamp-1"
        >
          {{ member.name }}
        </p>
        <p
          class="text-[6px] font-bold uppercase tracking-[0.2em] text-neutral-500 mt-0.5"
        >
          Socio Breezy 🦭
        </p>
      </div>

      <div class="mt-1 flex items-center justify-center">
        <MoleculesBarcode
          :value="member.member_code"
          format="CODE128"
          :width="1.3"
          :height="22"
        />
      </div>
    </div>

    <!-- Joined date — curves along the bottom rim -->
    <svg
      class="absolute mt-4 inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <path
          :id="`arcJoined-${member.id}`"
          d="M 40,140 A 82,82 0 0, 0 152,140"
          fill="none"
        />
      </defs>
      <text
        font-size="5.5"
        font-weight="800"
        fill="black"
        font-family="Barlow, Arial, sans-serif"
        letter-spacing="0.3"
        text-anchor="middle"
      >
        <textPath
          :href="`#arcJoined-${member.id}`"
          startOffset="50%"
          dominant-baseline="central"
        >
          MIEMBRO DESDE: {{ joinedLabel }}
        </textPath>
      </text>
    </svg>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Card } from "@common/components/ui/card";
import type { Member } from "~/types/membership";

const props = defineProps<{
  member: Member;
}>();

const joinedLabel = computed(() =>
  new Date(props.member.joined_date).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
);

const statusLabel = computed(() => {
  const s = props.member.status;
  return s === "dormant"
    ? "Inactivo"
    : s === "archived"
      ? "Archivado"
      : "Activo";
});

// First letters of the first two name words, accent-stripped, A–Z only.
const initials = computed(() => {
  const letters = props.member.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Z]/g, "")[0])
    .filter(Boolean);
  return ((letters[0] ?? "?") + (letters[1] ?? "")).slice(0, 2);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600;800&display=swap");

.member-card {
  font-family: "Barlow", Arial, sans-serif;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.member-card .font-black {
  font-family: "Oswald", Impact, sans-serif;
}
</style>
