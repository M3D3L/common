<template>
  <div id="top" class="w-full scroll-mt-40">
    <div class="flex flex-row items-center w-full gap-6 mb-6 align-center">
      <h1 class="w-full text-5xl text-center lg:text-7xl font-heading text-primary drop-shadow-md sm:text-left">
        {{ title }}
      </h1>
      <slot name="button"></slot>
    </div>

    <p v-if="description">
      {{ description }}
    </p>

    <nav id="top" v-if="sections?.length" aria-label="Page Navigation" ref="navbar"
      class="sticky z-20 flex gap-2 py-3 mb-6 overflow-x-auto border-b shadow-sm top-16 bg-background/80 backdrop-blur-md">
      <template v-for="(section, sectionIn) in sections" :key="`pill-${section.id}`">
        <Button v-if="section?.id && section?.title" :as="'a'" :id="`pill-${section.id}`" :href="`#${section.id}`"
          size="sm" variant="outline" :class="[
            'flex-shrink-0 transition-colors duration-200',
            activeSection === section.id ? activeClass : ''
          ]" @click.prevent="handlePillClick(section.id, $event)"
          :aria-current="activeSection === section.id ? 'true' : 'false'">
          {{ section.title }}
        </Button>
      </template>
    </nav>

    <div ref="slotContainer">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { Button } from "@/components/ui/button";

const props = defineProps({
  sections: { type: Array, required: true },
  activeClass: { type: String, default: "bg-primary text-primary-foreground" },
  initialActiveId: { type: String, default: null },
  centerOnMobile: { type: Boolean, default: true },
  title: { type: String, default: "" },
  description: { type: String, default: "" }
});

const emit = defineEmits(["sectionChange", "pillClick"]);

const navbar = ref(null);
const slotContainer = ref(null);
const activeSection = ref(props.initialActiveId ?? props.sections?.[0]?.id ?? null);
const sectionRefs = ref([]);
let observer = null;
let isLocked = false;

function debounce(fn, delay = 80) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const centerPill = debounce((pillId) => {
  const pill = navbar.value?.querySelector(`#${pillId}`);
  if (pill) pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}, 80);

function handlePillClick(id, event) {
  emit("pillClick", id);
  if (event?.preventDefault) event.preventDefault();
  activeSection.value = id;
  isLocked = true;

  const sectionEl = document.getElementById(id);
  const pillId = `pill-${id}`;
  const pill = navbar.value?.querySelector(`#${pillId}`);
  if (pill) centerPill(pillId);

  if (sectionEl) {
    sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    const distance = Math.abs(sectionEl.getBoundingClientRect().top);
    const approxDuration = Math.min(900, 200 + Math.round(distance * 0.6));
    setTimeout(() => {
      isLocked = false;
    }, approxDuration + 120);
  } else {
    setTimeout(() => {
      isLocked = false;
    }, 300);
  }

  try {
    history.replaceState(null, "", `#${id}`);
  } catch (e) {
    /* ignore */
  }
}

// Exposed function parents can call for dynamic sections
function setSectionRef(el) {
  if (!el) return;
  if (!sectionRefs.value.includes(el)) {
    sectionRefs.value.push(el);
  }
  // if observer exists, observe immediately
  if (observer && el instanceof HTMLElement) observer.observe(el);
}

// IntersectionObserver callback
function onIntersect(entries) {
  if (isLocked) return;
  entries.forEach((entry) => {
    if (entry.isIntersecting && activeSection.value !== entry.target.id) {
      activeSection.value = entry.target.id;
      emit("sectionChange", entry.target.id);
      if (props.centerOnMobile && window.innerWidth < 768) {
        centerPill(`pill-${activeSection.value}`);
      }
    }
  });
}

onMounted(() => {
  // create observer first
  observer = new IntersectionObserver(onIntersect, {
    rootMargin: "-40% 0px -55% 0px",
    threshold: 0,
  });

  // 1) try to pick up any <section id="..."> inside the slot immediately
  const found = slotContainer.value
    ? Array.from(slotContainer.value.querySelectorAll("section[id]"))
    : [];
  found.forEach((el) => setSectionRef(el));

  // 2) If URL has hash that matches a section, set initial active
  try {
    const hash = (window.location && window.location.hash) || "";
    if (hash) {
      const id = hash.replace("#", "");
      if (props.sections.some((s) => s.id === id)) {
        activeSection.value = id;
        // center pill initially a little later (visual nicety)
        setTimeout(() => centerPill(`pill-${id}`), 120);
      }
    }
  } catch (e) {
    console.warn("Error reading URL hash:", e);
  }
});

// watch activeSection and update URL hash
watch(activeSection, (newId) => {
  try {
    history.replaceState(null, "", `#${newId}`);
  } catch (e) {
    console.warn("Error updating URL hash:", e);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});

defineExpose({ setSectionRef });
</script>