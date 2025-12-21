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
      <Button @click="openAddModal" class="gap-2 shadow-sm">
        <Plus class="w-4 h-4" />
        Add Property
      </Button>
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
      <Table>
        <TableHeader class="bg-muted/50">
          <TableRow>
            <TableHead class="w-[100px]">Preview</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead class="lg:w-auto min-w-24">Specs</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell colspan="6" class="h-32 text-center">
              <div
                class="flex items-center justify-center gap-2 text-muted-foreground"
              >
                <span class="animate-spin text-primary">|</span> Loading
                properties...
              </div>
            </TableCell>
          </TableRow>

          <TableRow v-else-if="!filteredProperties.length">
            <TableCell
              colspan="6"
              class="h-32 text-center text-muted-foreground"
            >
              No properties found in this category.
            </TableCell>
          </TableRow>

          <TableRow
            v-for="property in filteredProperties"
            :key="property.id"
            class="group transition-colors hover:bg-muted/30"
          >
            <TableCell>
              <div class="w-16 h-16 rounded-md bg-muted border overflow-hidden">
                <nuxt-link
                  v-if="property.cover_image"
                  :to="`/real-estate${property.slug}`"
                  class="w-full h-full block"
                >
                  <img
                    :src="getImageUrl(property)"
                    :alt="property.title"
                    class="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </nuxt-link>
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground"
                >
                  No Image
                </div>
              </div>
            </TableCell>
            <TableCell>
              <nuxt-link
                :to="`/real-estate${property.slug}`"
                class="font-medium hover:underline hover:text-primary transition-colors"
              >
                {{ property.title }}
              </nuxt-link>
              <div class="text-xs text-muted-foreground truncate max-w-[250px]">
                {{ property.description }}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                :variant="getBadgeVariant(property.type)"
                class="capitalize"
              >
                {{ property.type }}
              </Badge>
            </TableCell>
            <TableCell class="font-medium">
              {{ property.price ? `$${property.price.toLocaleString()}` : "—" }}
              {{ property.pricingType ? property.pricingType : "" }}
            </TableCell>
            <TableCell>
              <div class="flex flex-col text-xs text-muted-foreground">
                <span
                  >Beds: {{ property.bedrooms || 0 }} / Baths:
                  {{ property.bathrooms || 0 }}</span
                >
                <span>{{ property.area ? `${property.area} m²` : "" }}</span>
              </div>
            </TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  @click="openEditModal(property)"
                  title="Edit"
                >
                  <Edit class="w-4 h-4 text-blue-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="confirmDelete(property)"
                  title="Delete"
                >
                  <Trash2 class="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <Dialog :open="showModal" @update:open="showModal = $event">
      <DialogContent
        class="sm:max-w-[800px] h-[90vh] flex flex-col p-0 overflow-hidden"
      >
        <DialogHeader class="p-6 pb-0">
          <DialogTitle class="text-2xl font-bold">{{
            isEditing ? "Edit Listing" : "Create Listing"
          }}</DialogTitle>
          <DialogDescription>
            Update the property details and specifications below.
          </DialogDescription>
        </DialogHeader>

        <form
          @submit.prevent="saveProperty"
          class="flex-1 overflow-y-auto p-6 space-y-8"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="col-span-2 space-y-2">
              <Label for="title">Property Title *</Label>
              <Input
                id="title"
                v-model="formData.title"
                placeholder="e.g. Modern Beachfront Villa"
                required
              />
            </div>

            <div class="col-span-2 space-y-2">
              <Label for="description">Short Description *</Label>
              <Textarea
                id="description"
                v-model="formData.description"
                placeholder="A brief summary of the property..."
                required
              />
            </div>

            <div class="md:col-span-1 col-span-2 space-y-2">
              <Label>Listing Type *</Label>
              <Select v-model="formData.type">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">Sale (Properties)</SelectItem>
                  <SelectItem value="rental">Rental (Rentals)</SelectItem>
                  <SelectItem value="lot">Land Lot (Lots)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2 md:col-span-1 col-span-2">
              <Label for="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                v-model.number="formData.price"
              />
            </div>

            <div class="space-y-2 col-span-2">
              <Label>Price Type</Label>
              <Select v-model="formData.pricingType">
                <SelectTrigger>
                  <SelectValue placeholder="Select price type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per/night">Per Night</SelectItem>
                  <SelectItem value="per/month">Per Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="col-span-2 flex md:flex-row flex-col gap-4">
              <div class="space-y-2 w-full">
                <Label for="beds">Bedrooms</Label>
                <Input
                  id="beds"
                  type="number"
                  v-model.number="formData.bedrooms"
                />
              </div>
              <div class="space-y-2 w-full">
                <Label for="baths">Bathrooms</Label>
                <Input
                  id="baths"
                  type="number"
                  step="0.5"
                  v-model.number="formData.bathrooms"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="area">Area (m²)</Label>
                <Input id="area" type="number" v-model.number="formData.area" />
              </div>
              <div class="space-y-2">
                <Label for="lot">Lot Size (m²)</Label>
                <Input
                  id="lot"
                  type="number"
                  v-model.number="formData.lotSize"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-3 space-y-2">
              <Label for="address">Full Address</Label>
              <Input
                id="address"
                v-model="formData.address"
                placeholder="123 Street, City, Country"
              />
            </div>
            <div class="space-y-2">
              <Label for="lat">Latitude</Label>
              <Input id="lat" v-model="formData.lat" placeholder="0.0000" />
            </div>
            <div class="space-y-2">
              <Label for="long">Longitude</Label>
              <Input id="long" v-model="formData.long" placeholder="0.0000" />
            </div>
          </div>

          <Separator />

          <div class="space-y-4">
            <Label class="text-base">Amenities & Features</Label>

            <div class="flex flex-wrap gap-2 w-full">
              <Button
                v-for="(amenity, amenityIndex) in amenitiesList"
                :key="amenityIndex"
                type="button"
                variant="secondary"
                size="sm"
                @click="
                  addAmenity({
                    name: amenity,
                  })
                "
              >
                <Plus class="w-3 h-3 mr-2" /> {{ amenity }}
              </Button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(amenity, index) in formData?.amenities"
                :key="index"
                class="flex gap-2"
              >
                <Input
                  v-model="amenity.name"
                  placeholder="Pool, WiFi, Parking..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  @click="removeAmenity(index)"
                  class="shrink-0"
                >
                  <X class="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              @click="addAmenity"
            >
              <Plus class="w-3 h-3 mr-2" /> Add Amenity
            </Button>
          </div>

          <div class="space-y-2">
            <Label for="content">Detailed Content (HTML)</Label>
            <Textarea
              id="content"
              v-model="formData.content"
              rows="6"
              class="font-mono text-xs"
              placeholder="<p>Full property details...</p>"
            />
          </div>

          <div class="space-y-2">
            <ImageUploader
              label="Cover Image"
              :id="formData?.id"
              :collection-id="formData?.collectionId"
              :image="formData?.cover_image"
              :name="`${formData?.title || 'cover_image'}-cover`"
              @upload="(filename) => (formData.cover_image = filename)"
              @remove="formData.cover_image = ''"
              format="webp"
              :width="800"
              :height="600"
              :quality="85"
            />

            <ImageGalleryUploader
              :key="formData?.gallery?.length || 0"
              label="Gallery Images"
              :collection-id="formData?.collectionId"
              :record-id="formData?.id"
              :images="formData?.gallery || []"
              :name="formData?.title || 'gallery_image'"
              @update:images="(imgs) => (formData.gallery = imgs)"
              @remove="(imgs) => (formData.gallery = imgs)"
              format="webp"
              :width="1200"
              :height="800"
              :quality="80"
            />
          </div>
        </form>

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
            >? This action will remove all data from our servers and cannot be
            undone.
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
import { Plus, Edit, Trash2, X, Save } from "lucide-vue-next";

// Shadcn Components
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Card } from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Textarea } from "@common/components/ui/textarea";
import { Separator } from "@common/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@common/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
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
import ImageUploader from "@common/components/molecules/ImageUploader.vue";
import ImageGalleryUploader from "@common/components/organisms/ImageGalleryUploader.vue";

const {
  fetchCollection,
  createItem,
  updateItem,
  deleteItem,
  getFileUrl,
  invalidateCollectionCache,
} = usePocketBaseCore();

// --- State ---
const properties = ref([]);
const loading = ref(true);
const activeFilter = ref("all");
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const deleting = ref(false);
const propertyToDelete = ref(null);

const formData = ref({
  id: null,
  title: "",
  slug: "",
  description: "",
  type: "",
  price: 0,
  pricingType: "",
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
});

const amenitiesList = [
  "Swimming Pool",
  "High-Speed Wi-Fi",
  "Private Parking",
  "Central Air Conditioning",
  "Fully Equipped Fitness Center",
  "Landscaped Garden",
  "Private Balcony or Terrace",
  "Indoor Fireplace",
  "24/7 Security",
  "Smart TV",
  "Fully Equipped Kitchen",
  "In-Unit Washer & Dryer",
  "Pet-Friendly",
  "Outdoor Seating Area",
  "Backup Power Generator",
  "Reverse Osmosis Water System",
  "Rooftop Sunset Deck",
  "Large Water Cistern (Pila)",
  "Palapa-Shaded Patio",
  "Views of Cerro Tetakawi",
  "Outdoor Shower",
  "Hurricane Shutters",
  "Built-in BBQ Grill",
  "Boat or Trailer Parking",
  "Heated Pool or Jacuzzi",
  "Starlink Satellite Internet",
  "Keyless Smart Locks",
  "Beach Gear & Kayaks",
  "Outdoor Misting System",
  "Solar Power Panels",
  "Fish Cleaning Station",
  "Dedicated Workspace",
  "Mini-Split A/C Units",
  "EV Charging Station",
  "Water Softener System",
];

// --- Logic ---
const getBadgeVariant = (type: string) => {
  if (type === "rental") return "secondary";
  if (type === "lot") return "outline";
  return "default";
};

const filteredProperties = computed(() => {
  if (activeFilter.value === "all") return properties.value?.items;
  return properties.value?.items.filter((p) => p.type === activeFilter.value);
});

const loadProperties = async (ignoreCache = false) => {
  loading.value = true;
  try {
    properties.value = await fetchCollection(
      "properties",
      1,
      100,
      "",
      "-created",
      null,
      null,
      ignoreCache
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (property: any) => {
  return property.cover_image ? getFileUrl(property, property.cover_image) : "";
};

const openAddModal = () => {
  isEditing.value = false;
  formData.value = {
    id: null,
    title: "",
    slug: "",
    description: "",
    type: "property",
    price: 0,
    pricingType: "",
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
  };
  showModal.value = true;
};

const openEditModal = (property: any) => {
  isEditing.value = true;
  formData.value = {
    ...property,
    amenities: Array.isArray(property.amenities) ? [...property.amenities] : [],
  };
  showModal.value = true;
};

const addAmenity = (item = { name: "" }) => {
  formData.value.amenities.push({ ...item });
};

const removeAmenity = (index: number) => {
  formData.value.amenities.splice(index, 1);
};

const saveProperty = async () => {
  if (!formData.value.title) return;
  saving.value = true;

  try {
    // 1. DYNAMIC SLUG LOGIC
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

    const payload: any = {
      title: formData.value.title,
      description: formData.value.description || "",
      type: formData.value.type,
      content: formData.value.content || "",
      price: formData.value.price || 0,
      pricingType: formData.value.pricingType || "",
      bedrooms: formData.value.bedrooms || 0,
      bathrooms: formData.value.bathrooms || 0,
      area: formData.value.area || 0,
      lotSize: formData.value.lotSize || 0,
      address: formData.value.address || "",
      lat: formData.value.lat || "",
      long: formData.value.long || "",
      amenities: formData.value.amenities
        .filter((a: any) => a.name && a.name.trim())
        .map((a: any) => ({ name: a.name.trim() })),

      // Update slug if it's new OR if the slug doesn't start with the correct folder
      slug:
        !isEditing.value || !formData.value.slug.startsWith(`/${folder}/`)
          ? generatedSlug
          : formData.value.slug,

      sub_title: formData.value.sub_title || "",
      tags: formData.value.tags || null,
      video: formData.value.video || "",
      cover_image: formData.value.cover_image || "",
      gallery: formData.value.gallery || [],
    };

    if (isEditing.value) {
      await updateItem("properties", formData.value.id, payload);
    } else {
      await createItem("properties", payload);
    }

    invalidateCollectionCache("properties");
    await loadProperties(true);
    showModal.value = false;
  } catch (error) {
    console.error("Save failed:", error);
    alert(`Failed to save property: ${error.message || "Unknown error"}`);
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

onMounted(async () => await loadProperties());

definePageMeta({
  layout: "admin",
  middleware: defineNuxtRouteMiddleware((to) => {
    const { isUserVerified } = usePocketBaseCore();
    if (!isUserVerified()) {
      return navigateTo("/");
    }
  }),
});
</script>
