<template>
  <div
    class="container relative w-full py-10 md:py-16 font-body bg-background text-foreground"
  >
    <!-- Header Section -->
    <div class="mb-12">
      <TitleBlock :title="pageTitle" :description="pageDescription" />

      <!-- Language Toggle -->
      <button
        @click="isSpanish = !isSpanish"
        class="fixed flex flex-col items-center content-center gap-2 right-4 bottom-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        <img
          :src="
            isSpanish
              ? '/images/countries/USA.png'
              : '/images/countries/Mexico.png'
          "
          alt="Country Flag"
          class="w-10 h-10"
        />
        {{ isSpanish ? "English" : "Español" }}
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center min-h-[50vh] text-center"
    >
      <p class="text-lg font-semibold">{{ loadingText }}</p>
      <div
        class="w-12 h-12 mt-4 border-b-2 rounded-full animate-spin border-primary"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center min-h-[50vh] text-center text-red-500"
    >
      <h2 class="text-2xl font-bold">{{ errorTitle }}</h2>
      <p class="mt-2">{{ error.message || errorText }}</p>
    </div>

    <!-- Businesses Content -->
    <div v-else class="space-y-8">
      <!-- Search and Filter Controls -->
      <Card class="p-6">
        <div class="space-y-4">
          <!-- Search Bar -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="searchPlaceholder"
              class="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute w-5 h-5 text-gray-400 left-3 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Filters Row -->
          <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <!-- Featured Filter -->
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="showFeaturedOnly"
                  type="checkbox"
                  class="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span class="text-sm">{{ featuredOnlyLabel }}</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="showOpenNow"
                  type="checkbox"
                  class="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span class="text-sm">{{ openNowLabel }}</span>
              </label>
            </div>

            <!-- Sort Dropdown -->
            <select
              v-model="sortBy"
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="name">{{ sortByNameLabel }}</option>
              <option value="newest">{{ sortByNewestLabel }}</option>
              <option value="featured">{{ sortByFeaturedLabel }}</option>
            </select>
          </div>

          <!-- Results Count -->
          <p class="text-sm text-muted-foreground">
            {{ filteredBusinessCountText }}
          </p>
        </div>
      </Card>

      <!-- Business Cards Grid -->
      <div
        v-if="filteredBusinesses.length"
        class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <Card
          v-for="business in paginatedBusinesses"
          :key="business.id"
          class="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl group"
        >
          <!-- Business Image/Logo -->
          <NuxtLink
            :to="`/businesses/${business.slug}`"
            class="relative block h-48 overflow-hidden bg-gray-100"
          >
            <img
              :src="getBusinessImage(business)"
              :alt="business.name"
              class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              @error="replaceWithPlaceholder($event, 'Business')"
            />

            <!-- Featured Badge -->
            <div
              v-if="business.is_featured"
              class="absolute px-3 py-1 text-xs font-bold text-white rounded-full top-3 right-3 bg-primary"
            >
              {{ featuredLabel }}
            </div>

            <!-- Open/Closed Status -->
            <div
              v-if="isOpenNow(business)"
              class="absolute px-3 py-1 text-xs font-bold text-white bg-green-600 rounded-full bottom-3 left-3"
            >
              {{ openLabel }}
            </div>
          </NuxtLink>

          <!-- Business Info -->
          <div class="flex flex-col flex-grow p-6">
            <!-- Name and Description -->
            <div class="mb-4">
              <NuxtLink :to="`/businesses/${business.slug}`">
                <h3
                  class="mb-2 text-xl font-bold transition-colors text-primary hover:text-primary/80"
                >
                  {{ business.name }}
                </h3>
              </NuxtLink>
              <p class="text-sm text-muted-foreground line-clamp-2">
                {{ getDescription(business) }}
              </p>
            </div>

            <!-- Contact Info -->
            <div class="mt-auto space-y-2">
              <!-- Address -->
              <div
                v-if="business.address"
                class="flex items-start gap-2 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 w-4 h-4 mt-0.5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span class="text-muted-foreground line-clamp-1">
                  {{ formatAddress(business.address) }}
                </span>
              </div>

              <!-- Phone -->
              <div
                v-if="business.contact?.phone"
                class="flex items-center gap-2 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  :href="`tel:${business.contact.phone}`"
                  class="text-muted-foreground hover:text-primary"
                >
                  {{ business.contact.phone }}
                </a>
              </div>

              <!-- Hours Today -->
              <div
                v-if="getTodayHours(business)"
                class="flex items-center gap-2 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span
                  :class="
                    getTodayHours(business) === 'Closed'
                      ? 'text-red-500'
                      : 'text-muted-foreground'
                  "
                >
                  {{
                    getTodayHours(business) === "Closed"
                      ? closedLabel
                      : getTodayHours(business)
                  }}
                </span>
              </div>
            </div>

            <!-- Social Links -->
            <div v-if="business.socials?.length" class="flex gap-2 mt-4">
              <a
                v-for="social in business.socials"
                :key="social.platform"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 transition-colors rounded-full hover:bg-primary/10"
                @click.stop
              >
                <component
                  :is="getSocialIcon(social.platform)"
                  class="w-4 h-4 text-primary"
                />
              </a>
            </div>

            <!-- View Details Button -->
            <NuxtLink :to="`/businesses/${business.slug}`" class="block mt-4">
              <Button class="w-full">
                {{ viewDetailsLabel }}
              </Button>
            </NuxtLink>
          </div>
        </Card>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center min-h-[30vh] text-center"
      >
        <p class="text-lg text-muted-foreground">{{ noResultsText }}</p>
        <Button @click="clearFilters" class="mt-4" variant="outline">
          {{ clearFiltersLabel }}
        </Button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <Button
          @click="currentPage--"
          :disabled="currentPage === 1"
          variant="outline"
          size="sm"
        >
          {{ previousLabel }}
        </Button>

        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">
            {{ pageLabel }} {{ currentPage }} {{ ofLabel }} {{ totalPages }}
          </span>
        </div>

        <Button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          variant="outline"
          size="sm"
        >
          {{ nextLabel }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-vue-next";

import usePocketBaseCore from "@common/composables/usePocketBaseCore";

const { fetchCollection } = usePocketBaseCore();

const businesses = ref<any[]>([]);
const loading = ref(true);
const error = ref<Error | null>(null);
const isSpanish = ref(false);

// Filter and search state
const searchQuery = ref("");
const showFeaturedOnly = ref(false);
const showOpenNow = ref(false);
const sortBy = ref("name");
const currentPage = ref(1);
const itemsPerPage = 9;

// --- Data Fetching Logic ---
const loadBusinesses = async () => {
  try {
    loading.value = true;
    const result = await fetchCollection(
      "businesses",
      1,
      100,
      "",
      "-created",
      "socials,services",
    );

    if (result.items) {
      businesses.value = result.items;
    } else {
      throw new Error(
        isSpanish.value
          ? "No se encontraron negocios."
          : "No businesses found.",
      );
    }
  } catch (err: any) {
    error.value = err;
    console.error("Error loading businesses:", err);
  } finally {
    loading.value = false;
  }
};

// --- Computed Props ---
const filteredBusinesses = computed(() => {
  let result = [...businesses.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (b) =>
        b.name?.toLowerCase().includes(query) ||
        b.description_En?.toLowerCase().includes(query) ||
        b.description_Sp?.toLowerCase().includes(query) ||
        b.address?.city?.toLowerCase().includes(query),
    );
  }

  // Featured filter
  if (showFeaturedOnly.value) {
    result = result.filter((b) => b.is_featured);
  }

  // Open now filter
  if (showOpenNow.value) {
    result = result.filter((b) => isOpenNow(b));
  }

  // Sort
  if (sortBy.value === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "newest") {
    result.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
  } else if (sortBy.value === "featured") {
    result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredBusinesses.value.length / itemsPerPage),
);

const paginatedBusinesses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBusinesses.value.slice(start, end);
});

const pageTitle = computed(() =>
  isSpanish.value ? "Negocios Locales" : "Local Businesses",
);

const pageDescription = computed(() =>
  isSpanish.value
    ? "Descubre los mejores negocios y servicios en San Carlos, Sonora"
    : "Discover the best businesses and services in San Carlos, Sonora",
);

const loadingText = computed(() =>
  isSpanish.value ? "Cargando negocios..." : "Loading businesses...",
);

const errorTitle = computed(() => (isSpanish.value ? "Error" : "Error"));

const errorText = computed(() =>
  isSpanish.value
    ? "No se pudo cargar la información."
    : "Could not load information.",
);

const searchPlaceholder = computed(() =>
  isSpanish.value
    ? "Buscar negocios, servicios, ubicaciones..."
    : "Search businesses, services, locations...",
);

const featuredLabel = computed(() =>
  isSpanish.value ? "Destacado" : "Featured",
);

const featuredOnlyLabel = computed(() =>
  isSpanish.value ? "Solo destacados" : "Featured only",
);

const openNowLabel = computed(() =>
  isSpanish.value ? "Abierto ahora" : "Open now",
);

const openLabel = computed(() => (isSpanish.value ? "Abierto" : "Open"));

const closedLabel = computed(() => (isSpanish.value ? "Cerrado" : "Closed"));

const sortByNameLabel = computed(() =>
  isSpanish.value ? "Ordenar: Nombre" : "Sort: Name",
);

const sortByNewestLabel = computed(() =>
  isSpanish.value ? "Ordenar: Más reciente" : "Sort: Newest",
);

const sortByFeaturedLabel = computed(() =>
  isSpanish.value ? "Ordenar: Destacados" : "Sort: Featured",
);

const viewDetailsLabel = computed(() =>
  isSpanish.value ? "Ver Detalles" : "View Details",
);

const noResultsText = computed(() =>
  isSpanish.value
    ? "No se encontraron negocios con estos filtros."
    : "No businesses found with these filters.",
);

const clearFiltersLabel = computed(() =>
  isSpanish.value ? "Limpiar Filtros" : "Clear Filters",
);

const previousLabel = computed(() =>
  isSpanish.value ? "Anterior" : "Previous",
);

const nextLabel = computed(() => (isSpanish.value ? "Siguiente" : "Next"));

const pageLabel = computed(() => (isSpanish.value ? "Página" : "Page"));

const ofLabel = computed(() => (isSpanish.value ? "de" : "of"));

const filteredBusinessCountText = computed(() => {
  const count = filteredBusinesses.value.length;
  const total = businesses.value.length;
  return isSpanish.value
    ? `${count} de ${total} negocio${total !== 1 ? "s" : ""}`
    : `${count} of ${total} business${total !== 1 ? "es" : ""}`;
});

// --- Helper Functions ---
function placeholderUrl(text: string) {
  return `https://placehold.co/400x300/F0F0F0/000000?text=${encodeURIComponent(text)}`;
}

function replaceWithPlaceholder(e: Event, text: string) {
  (e.target as HTMLImageElement).src = placeholderUrl(text);
}

function formatAddress(addr: any) {
  if (typeof addr === "string") return addr;
  return [addr.street, addr.city, addr.state, addr.zip, addr.country]
    .filter(Boolean)
    .join(", ");
}

function getDescription(business: any) {
  return isSpanish.value
    ? business.description_Sp ||
        business.description_Es ||
        business.description_En ||
        ""
    : business.description_En ||
        business.description_Sp ||
        business.description_Es ||
        "";
}

function getTodayHours(business: any) {
  if (!business.hours_of_operation) return null;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return business.hours_of_operation[today] || null;
}

function isOpenNow(business: any): boolean {
  const hours = getTodayHours(business);
  if (!hours || hours === "Closed") return false;

  // Simple check - could be enhanced with actual time parsing
  return true;
}

function getBusinessImage(business: any): string {
  return (
    business.logo ||
    business.promoGallery?.[0]?.url ||
    business.gallery?.[0]?.url ||
    placeholderUrl("Business")
  );
}

function getSocialIcon(platform: string) {
  const iconMap: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
  };
  return iconMap[platform.toLowerCase()] || Facebook;
}

function clearFilters() {
  searchQuery.value = "";
  showFeaturedOnly.value = false;
  showOpenNow.value = false;
  sortBy.value = "name";
  currentPage.value = 1;
}

// Watch for filter changes and reset to page 1
watch([searchQuery, showFeaturedOnly, showOpenNow, sortBy], () => {
  currentPage.value = 1;
});

onMounted(loadBusinesses);
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
