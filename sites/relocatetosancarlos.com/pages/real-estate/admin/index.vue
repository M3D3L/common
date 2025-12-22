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
      <div class="flex gap-2">
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

        <AtomsPropertyForm
          v-model="formData"
          :author-display="getAuthorDisplay()"
        />

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
            <span class="font-bold text-foreground"
              >"{{ propertyToDelete?.title }}"</span
            >? This action cannot be undone.
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

// Shadcn Components
import { Button } from "@common/components/ui/button";
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

// --- State Management ---
const properties = ref({ items: [] });
const loading = ref(true);
const activeFilter = ref("all");
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const deleting = ref(false);
const propertyToDelete = ref(null);

const getInitialFormData = () => ({
  id: null,
  title: "",
  slug: "",
  description: "",
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
  content: "",
  cover_image: "",
  collectionId: "",
  gallery: [],
  author: user.value?.id || null,
});

const formData = ref(getInitialFormData());

// --- Computed & Helpers ---
const filteredProperties = computed(() => {
  if (activeFilter.value === "all") return properties.value?.items || [];
  return properties.value?.items.filter((p) => p.type === activeFilter.value);
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
  return "Author ID: " + formData.value.author;
};

// --- Actions ---
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
  } catch (error) {
    console.error("Fetch error:", error);
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
  // Use a spread to create a fresh object so we don't mutate the list directly
  formData.value = {
    ...property,
    amenities: Array.isArray(property.amenities) ? [...property.amenities] : [],
  };
  showModal.value = true;
};

const saveProperty = async () => {
  if (!formData.value.title) return;
  saving.value = true;

  try {
    // 1. Slug Logic
    const typePathMap: Record<string, string> = {
      property: "properties",
      rental: "rentals",
      lot: "lots",
    };
    const folder = typePathMap[formData.value.type] || "properties";
    const titleSlug = formData.value.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const generatedSlug = `/${folder}/${titleSlug}`;

    // 2. Prepare Payload
    const authorId =
      typeof formData.value.author === "object"
        ? formData.value.author?.id
        : formData.value.author;

    const payload = {
      ...formData.value,
      author: authorId || user.value?.id,
      slug:
        !isEditing.value || !formData.value.slug.startsWith(`/${folder}/`)
          ? generatedSlug
          : formData.value.slug,
      amenities: formData.value.amenities
        .filter((a: any) => a.name?.trim())
        .map((a: any) => ({ name: a.name.trim() })),
    };

    // 3. Persist
    if (isEditing.value) {
      await updateItem("properties", formData.value.id, payload);
    } else {
      await createItem("properties", payload);
    }

    // 4. Cleanup & Refresh
    ["rentals", "lots", "properties"].forEach(invalidateCollectionCache);
    await loadProperties(true);
    showModal.value = false;
  } catch (error: any) {
    alert(`Error: ${error.message || "Save failed"}`);
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
