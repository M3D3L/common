<template>
  <div class="container py-8 min-h-screen bg-background text-foreground">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
    >
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Property Management</h1>
        <p class="text-muted-foreground">
          Manage, edit, and track your real estate listings.
        </p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <Button
          @click="loadProperties(true)"
          variant="outline"
          class="gap-2 shadow-sm"
        >
          <RefreshCw class="w-4 h-4" /> Reset Listings
        </Button>
        <Button @click="openAddModal" class="gap-2 shadow-sm">
          <Plus class="w-4 h-4" /> Add Property
        </Button>
        <Button variant="outline" class="gap-2 shadow-sm">
          <input
            type="checkbox"
            v-model="disableAi"
            id="disable-ai-checkbox"
            class="mr-2"
          />
          <label for="disable-ai-checkbox" class="select-none"
            >Disable AI</label
          >
        </Button>
      </div>
    </div>

    <Tabs v-model="activeFilter" class="mb-6">
      <TabsList class="grid w-full max-w-md grid-cols-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="property">Property</TabsTrigger>
        <TabsTrigger value="rental">Rental</TabsTrigger>
        <TabsTrigger value="lot">Lot</TabsTrigger>
      </TabsList>
    </Tabs>

    <Card class="overflow-hidden border-muted/60">
      <AtomsPropertyTable
        :properties="filteredProperties"
        :loading="loading"
        @edit="openEditModal"
        @delete="confirmDelete"
      />
    </Card>

    <Dialog :open="showModal" @update:open="showModal = $event">
      <DialogContent
        class="sm:max-w-[850px] h-[90vh] flex flex-col p-0 overflow-hidden"
      >
        <DialogHeader class="p-6 pb-0">
          <DialogTitle class="text-2xl font-bold">
            {{ isEditing ? "Edit Listing" : "Create Listing" }}
          </DialogTitle>
          <DialogDescription>
            Update property details. AI will populate missing English and
            Spanish fields.
          </DialogDescription>
        </DialogHeader>

        <div class="px-6 py-4 space-y-6 overflow-y-auto">
          <AtomsPropertyForm
            v-model="formData"
            :author-display="getAuthorDisplay()"
          />

          <div class="space-y-2">
            <Label for="keywords" class="text-sm font-medium"
              >Keywords (EN)</Label
            >
            <Input
              id="keywords"
              v-model="formData.keywords"
              placeholder="ocean view, luxury, beachfront..."
            />
          </div>

          <hr class="border-muted/40" />

          <div
            class="p-4 rounded-lg border border-dashed border-primary/20 bg-primary/5 space-y-4"
          >
            <div class="flex items-center gap-2">
              <span class="text-xl">🇲🇽</span>
              <h3
                class="text-sm font-bold uppercase tracking-wider text-primary"
              >
                Spanish Localization
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="sub_title_Sp" class="text-xs font-semibold"
                  >Spanish Sub-title</Label
                >
                <Input
                  id="sub_title_Sp"
                  v-model="formData.sub_title_Sp"
                  placeholder="Título en español..."
                />
              </div>
              <div class="space-y-2">
                <Label for="keywords_Sp" class="text-xs font-semibold"
                  >Spanish Keywords</Label
                >
                <Input
                  id="keywords_Sp"
                  v-model="formData.keywords_Sp"
                  placeholder="palabras clave..."
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="description_Sp" class="text-xs font-semibold"
                >Spanish Meta Description</Label
              >
              <Input
                id="description_Sp"
                v-model="formData.description_Sp"
                placeholder="Resumen SEO..."
              />
            </div>

            <!-- <div class="space-y-2">
              <Label class="text-xs font-semibold">Spanish Amenities</Label>
              <div class="p-3 border rounded-md bg-background">
                <AtomsAmenitySelector v-model="formData.amenities_Sp" />
              </div>
            </div> -->

            <div class="space-y-2">
              <Label for="content_Sp" class="text-xs font-semibold"
                >Spanish Content (HTML)</Label
              >
              <textarea
                id="content_Sp"
                v-model="formData.content_Sp"
                class="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                placeholder="Descripción detallada en HTML..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="p-6 border-t bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" @click="showModal = false">Cancel</Button>
          <Button :disabled="saving" @click="saveProperty">
            <Save v-if="!saving" class="w-4 h-4 mr-2" />
            {{ saving ? "Processing AI & Saving..." : "Save Property" }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <AlertDialog
      :open="showDeleteModal"
      @update:open="showDeleteModal = $event"
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Property Listing?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete
            <span class="font-bold">"{{ propertyToDelete?.title }}"</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteProperty"
            class="bg-destructive text-destructive-foreground"
            >Delete</AlertDialogAction
          >
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Plus, Save, RefreshCw } from "lucide-vue-next";
import useAuth from "@common/composables/useAuth";
import { useChatGPT } from "@common/composables/useChatGPT";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import usePocketBase from "@common/composables/usePocketbase";

// UI Components
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Card } from "@common/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@common/components/ui/alert-dialog";

const {
  fetchCollection,
  createItem,
  updateItem,
  deleteItem,
  invalidateCollectionCache,
} = usePocketBaseCore();
const { user } = useAuth();
const { run: runChatGPT } = useChatGPT();

/* ---------------- State ---------------- */
const properties = ref({ items: [] });
const loading = ref(true);
const activeFilter = ref("all");
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const propertyToDelete = ref<any>(null);
const disableAi = ref(false);

onMounted(() => {
  disableAi.value = localStorage.getItem("property_ai_disabled") !== "false";
  loadProperties();
});

watch(disableAi, (newVal) => {
  localStorage.setItem("property_ai_disabled", newVal.toString());
});

const getInitialFormData = () => ({
  id: null,
  title: "",
  slug: "",
  sub_title: "",
  description: "",
  content: "",
  keywords: "",
  sub_title_Sp: "",
  description_Sp: "",
  content_Sp: "",
  keywords_Sp: "",
  amenities_Sp: [] as any[], // Default to Array
  type: "property",
  price: 0,
  pricingType: "usd",
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  lotSize: 0,
  address: "",
  lat: "",
  long: "",
  amenities: [] as any[], // Default to Array
  cover_image: "",
  gallery: [],
  author: user.value?.id || null,
});

const formData = ref(getInitialFormData());

/* ---------------- Helpers ---------------- */
const filteredProperties = computed(() => {
  if (activeFilter.value === "all") return properties.value.items || [];
  return properties.value.items.filter(
    (p: any) => p.type === activeFilter.value
  );
});

const getAuthorDisplay = () => {
  if (!formData.value.author) return user.value?.username || "Current User";
  return typeof formData.value.author === "object"
    ? formData.value.author.username || "Author"
    : `ID: ${formData.value.author}`;
};

// Ensures data coming from DB is converted to the Array format the Selector expects
const ensureArray = (input: any) => {
  if (Array.isArray(input)) return [...input];
  if (typeof input === "string" && input.trim()) {
    return input
      .split(",")
      .map((i) => ({ name: i.trim() }))
      .filter((i) => i.name);
  }
  return [];
};

// Formats array for AI consumption
const formatAmenitiesToString = (input: any) => {
  if (typeof input === "string") return input;
  if (Array.isArray(input)) return input.map((a) => a.name || a).join(", ");
  return "";
};

const needsAIEnrichment = (data: any) => {
  const fields = [
    "description",
    "content",
    "sub_title",
    "keywords",
    "description_Sp",
    "content_Sp",
    "sub_title_Sp",
    "keywords_Sp",
  ];
  const hasEmptyField = fields.some(
    (f) => !data[f] || (typeof data[f] === "string" && !data[f].trim())
  );
  const hasEmptyAmenities =
    !data.amenities_Sp || data.amenities_Sp.length === 0;

  return hasEmptyField || hasEmptyAmenities;
};

/* ---------------- Actions ---------------- */
const loadProperties = async (ignoreCache = false) => {
  loading.value = true;
  try {
    properties.value = await fetchCollection(
      "properties",
      1,
      100,
      "",
      "-created",
      "author",
      null,
      ignoreCache
    );
  } finally {
    loading.value = false;
  }
};

const openAddModal = () => {
  isEditing.value = false;
  formData.value = getInitialFormData();
  showModal.value = true;
};

const openEditModal = (property: any) => {
  isEditing.value = true;
  formData.value = {
    ...property,
    amenities: ensureArray(property.amenities),
    amenities_Sp: ensureArray(property.amenities_Sp),
  };
  showModal.value = true;
};

const saveProperty = async () => {
  if (!formData.value.title) return;
  saving.value = true;

  try {
    if (needsAIEnrichment(formData.value) && !disableAi.value) {
      try {
        const aiContext = {
          title: formData.value.title,
          sub_title: formData.value.sub_title,
          description: formData.value.description,
          content: formData.value.content,
          amenities_list: formatAmenitiesToString(formData.value.amenities),
        };

        const instruction = `You are a Real Estate SEO Expert. 
        Return ONLY a JSON object with keys: sub_title, description, content, keywords, sub_title_Sp, description_Sp, content_Sp, keywords_Sp, amenities_Sp.
        CRITICAL: amenities_Sp MUST be a JSON array of objects like: [{"name": "Alberca"}]`;

        const aiResult = await runChatGPT(instruction, aiContext);
        const jsonMatch = aiResult?.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          Object.keys(parsed).forEach((key) => {
            const currentVal = formData.value[key];
            const isEmpty =
              !currentVal ||
              (Array.isArray(currentVal)
                ? currentVal.length === 0
                : !currentVal.toString().trim());

            if (isEmpty) {
              formData.value[key] = parsed[key];
            }
          });
        }
      } catch (err) {
        console.warn("AI enrichment failed", err);
      }
    }

    const folderMap: Record<string, string> = {
      property: "properties",
      rental: "rentals",
      lot: "lots",
    };
    const folder = folderMap[formData.value.type] || "properties";
    const titleSlug = formData.value.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

    const payload = {
      ...formData.value,
      amenities: formData.value.amenities,
      amenities_Sp: formData.value.amenities_Sp,
      slug: `/${folder}/${titleSlug}`,
      author:
        typeof formData.value.author === "object"
          ? formData.value.author?.id
          : formData.value.author || user.value?.id,
    };

    if (isEditing.value) {
      await updateItem("properties", formData.value.id, payload);
    } else {
      await createItem("properties", payload);
    }

    ["properties", "rentals", "lots"].forEach(invalidateCollectionCache);
    await loadProperties(true);
    showModal.value = false;
  } catch (err: any) {
    alert(err.message || "Save failed");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (p: any) => {
  propertyToDelete.value = p;
  showDeleteModal.value = true;
};

const deleteProperty = async () => {
  if (!propertyToDelete.value) return;
  try {
    await deleteItem("properties", propertyToDelete.value.id);
    await loadProperties(true);
    showDeleteModal.value = false;
  } finally {
  }
};

definePageMeta({
  layout: "admin",
  middleware: defineNuxtRouteMiddleware(() => {
    const pb = usePocketBase();
    if (!pb.authStore.isValid || pb.authStore.model?.verified !== true)
      return navigateTo("/");
  }),
});
</script>
