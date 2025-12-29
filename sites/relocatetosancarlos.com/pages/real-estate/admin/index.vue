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
          <RefreshCw class="w-4 h-4" />
          Reset Listings
        </Button>
        <Button @click="openAddModal" class="gap-2 shadow-sm">
          <Plus class="w-4 h-4" />
          Add Property
        </Button>

        <Button variant="outline" class="gap-2 shadow-sm">
          <input
            type="checkbox"
            v-model="disableAi"
            id="disable-ai-checkbox"
            class="mr-2"
          />
          <label for="disable-ai-checkbox" class="select-none">
            Disable AI
          </label>
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
        class="sm:max-w-[800px] h-[90vh] flex flex-col p-0 overflow-hidden"
      >
        <DialogHeader class="p-6 pb-0">
          <DialogTitle class="text-2xl font-bold">
            {{ isEditing ? "Edit Listing" : "Create Listing" }}
          </DialogTitle>
          <DialogDescription>
            Update the property details and specifications below.
          </DialogDescription>
        </DialogHeader>

        <div class="px-6 py-4 space-y-4 overflow-y-auto">
          <AtomsPropertyForm
            v-model="formData"
            :author-display="getAuthorDisplay()"
          />

          <div class="space-y-2 pb-6">
            <Label for="keywords" class="text-sm font-medium"
              >Keywords (SEO)</Label
            >
            <Input
              id="keywords"
              v-model="formData.keywords"
              placeholder="ocean view, luxury, beachfront..."
            />
            <p class="text-[10px] text-muted-foreground italic">
              AI will generate these if left empty.
            </p>
          </div>
        </div>

        <div class="p-6 border-t bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" @click="showModal = false">Cancel</Button>
          <Button :disabled="saving" @click="saveProperty">
            <Save v-if="!saving" class="w-4 h-4 mr-2" />
            {{ saving ? "Processing..." : "Save Property" }}
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
            <span class="font-bold text-foreground">
              "{{ propertyToDelete?.title }}" </span
            >?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteProperty"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {{ deleting ? "Deleting..." : "Delete Listing" }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Save, RefreshCw } from "lucide-vue-next";
import useAuth from "@common/composables/useAuth";
import { useChatGPT } from "@common/composables/useChatGPT";
// Shadcn
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
const deleting = ref(false);
const propertyToDelete = ref<any>(null);

// PERSISTENCE: Initialize from localStorage or default to true (meaning AI is disabled by default)
const disableAi = ref(localStorage.getItem("property_ai_disabled") !== "false");

// Watch for changes to save state to localStorage
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
  keywords: "", // Added Keywords field
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
  amenities: [],
  cover_image: "",
  gallery: [],
  collectionId: "",
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
  if (typeof formData.value.author === "object") {
    return (
      formData.value.author.username ||
      formData.value.author.email ||
      "Unknown Author"
    );
  }
  return `Author ID: ${formData.value.author}`;
};

const needsAIEnrichment = (data: any) => {
  return (
    !data.description?.trim() ||
    !data.content?.trim() ||
    !data.sub_title?.trim() ||
    !data.keywords?.trim()
  );
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
    amenities: Array.isArray(property.amenities) ? [...property.amenities] : [],
    keywords: property.keywords || "",
  };
  showModal.value = true;
};

const saveProperty = async () => {
  if (!formData.value.title) return;
  saving.value = true;

  try {
    /* ---- AI enrichment (NON-BLOCKING) ---- */
    // disableAi.value should be synced with your localStorage preference
    if (needsAIEnrichment(formData.value) && !disableAi.value) {
      try {
        const aiContext = {
          title: formData.value.title,
          type: formData.value.type,
          price: formData.value.price,
          bedrooms: formData.value.bedrooms,
          bathrooms: formData.value.bathrooms,
          area: formData.value.area,
          address: formData.value.address,
          amenities: formData.value.amenities
            .filter((a: any) => a?.name?.trim())
            .map((a: any) => a.name.trim()),
        };

        const instruction = `Act as a senior Real Estate SEO Copywriter. Using the provided property data, generate a high-conversion, SEO-optimized JSON object. 
        
Strategy:
1. sub_title: High-intent keywords. Max 120 chars.
2. description: Meta Description style summary. Max 300 chars.
3. content: Semantic HTML (h2, p, strong). Focus on San Carlos Lifestyle.
4. keywords: Generate a comma-separated string of 8-12 relevant SEO keywords. ONLY USE KEYWORDS BASED OFF THE data available (type, location, amenities, features).

Return ONLY a JSON object. Omit all other text. 

Format: { "sub_title": "...", "description": "...", "content": "...", "keywords": "..." }`;

        console.log("AI enrichment started...");

        const aiPromise = runChatGPT(instruction, aiContext);
        const timeoutPromise = new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error("AI timeout")), 20000)
        );

        const aiResult = await Promise.race([aiPromise, timeoutPromise]);

        if (aiResult) {
          // Extract JSON using regex in case the AI includes markdown or preamble
          const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);

            // Update fields only if they are currently empty or just whitespace
            if (!formData.value.sub_title?.trim() && parsed.sub_title) {
              formData.value.sub_title = parsed.sub_title.slice(0, 120);
            }
            if (!formData.value.description?.trim() && parsed.description) {
              formData.value.description = parsed.description.slice(0, 300);
            }
            if (!formData.value.content?.trim() && parsed.content) {
              formData.value.content = parsed.content;
            }
            // Fix for inconsistent keywords: Ensure we check .trim()
            if (!formData.value.keywords?.trim() && parsed.keywords) {
              formData.value.keywords = parsed.keywords;
              console.log("Keywords enriched:", parsed.keywords);
            }
          }
        }
      } catch (err: any) {
        console.warn("AI enrichment skipped or failed:", err.message);
      }
    }

    /* ---- Slug and Payload Logic ---- */
    const folderMap: Record<string, string> = {
      property: "properties",
      rental: "rentals",
      lot: "lots",
    };

    const folder = folderMap[formData.value.type] || "properties";
    const titleSlug = formData.value.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const slug = `/${folder}/${titleSlug}`;

    const payload = {
      ...formData.value,
      slug:
        !isEditing.value || !formData.value.slug?.startsWith(`/${folder}/`)
          ? slug
          : formData.value.slug,
      author:
        typeof formData.value.author === "object"
          ? formData.value.author?.id
          : formData.value.author || user.value?.id,
      amenities: formData.value.amenities
        .filter((a: any) => a?.name?.trim())
        .map((a: any) => ({ name: a.name.trim() })),
    };

    /* ---- Persist to Database ---- */
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

const confirmDelete = (property: any) => {
  propertyToDelete.value = property;
  showDeleteModal.value = true;
};

const deleteProperty = async () => {
  if (!propertyToDelete.value) return;
  deleting.value = true;
  try {
    await deleteItem("properties", propertyToDelete.value.id);
    await loadProperties(true);
    showDeleteModal.value = false;
  } finally {
    deleting.value = false;
  }
};

onMounted(loadProperties);

definePageMeta({
  layout: "admin",
  middleware: defineNuxtRouteMiddleware(() => {
    const { isUserVerified } = usePocketBaseCore();
    if (!isUserVerified()) return navigateTo("/");
  }),
});
</script>
