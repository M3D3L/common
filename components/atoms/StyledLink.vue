<template>
  <NuxtLink
    :to="to"
    :aria-label="ariaLabel || title"
    :aria-current="isActive ? 'page' : undefined"
    class="text-sm transition-all text-muted-foreground hover:text-primary hover:translate-x-1 w-fit group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
    active-class="font-semibold text-primary"
    role="link"
  >
    <span :aria-hidden="hasIcon ? 'true' : 'false'">{{ title }}</span>

    <!-- Active indicator -->
    <span
      class="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 bg-primary group-hover:w-full"
      aria-hidden="true"
    />

    <!-- Screen reader only text for current page -->
    <span v-if="isActive" class="sr-only"> (current page) </span>
  </NuxtLink>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "#app";

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  ariaLabel: {
    type: String,
    default: "",
  },
  hasIcon: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();

// Check if current route matches the link
const isActive = computed(() => {
  return route.path === props.to || route.path.startsWith(props.to + "/");
});
</script>

<style scoped>
/* Screen reader only utility class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
