<template>
  <form @submit.prevent class="flex-1 overflow-y-auto p-6 space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="col-span-2 space-y-2">
        <Label for="title">Property Title *</Label>
        <Input
          id="title"
          v-model="modelValue.title"
          placeholder="e.g. Modern Beachfront Villa"
          required
        />
      </div>

      <div class="col-span-2 space-y-2">
        <Label for="description">Short Description *</Label>
        <Textarea
          id="description"
          v-model="modelValue.description"
          placeholder="A brief summary..."
          required
        />
      </div>

      <div class="md:col-span-1 col-span-2 space-y-2">
        <Label>Listing Type *</Label>
        <Select v-model="modelValue.type">
          <SelectTrigger
            ><SelectValue placeholder="Select type"
          /></SelectTrigger>
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
          v-model.number="modelValue.price"
        />
      </div>
    </div>

    <Separator />

    <div class="space-y-4">
      <Label class="text-base">Amenities & Features</Label>
      <div class="flex flex-wrap gap-2 w-full">
        <Button
          v-for="amenity in amenitiesList"
          :key="amenity"
          type="button"
          variant="secondary"
          size="sm"
          @click="addAmenity(amenity)"
        >
          <Plus class="w-3 h-3 mr-2" /> {{ amenity }}
        </Button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="(item, index) in modelValue.amenities"
          :key="index"
          class="flex gap-2"
        >
          <Input v-model="item.name" placeholder="Amenity name..." />
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
    </div>

    <Separator />

    <div class="space-y-2">
      <Label for="content">Detailed Content (HTML)</Label>
      <Textarea
        id="content"
        v-model="modelValue.content"
        rows="6"
        class="font-mono text-xs"
      />
    </div>

    <div class="space-y-2">
      <ImageUploader
        label="Cover Image"
        :name="`${modelValue?.title || 'cover_image'}-cover`"
        :id="modelValue.id"
        :collection-id="modelValue.collectionId"
        :image="modelValue.cover_image"
        @upload="(f) => (modelValue.cover_image = f)"
        @remove="modelValue.cover_image = ''"
        format="webp"
        :width="800"
        :height="600"
        :quality="80"
      />

      <ImageGalleryUploader
        :key="modelValue.gallery?.length || 0"
        label="Gallery Images"
        :name="`${modelValue?.title || 'gallery'}-gallery`"
        :record-id="modelValue.id"
        :collection-id="modelValue.collectionId"
        :images="modelValue.gallery || []"
        @update:images="(imgs) => (modelValue.gallery = imgs)"
        format="webp"
        :width="1200"
        :height="800"
        :quality="80"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { Plus, X } from "lucide-vue-next";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Textarea } from "@common/components/ui/textarea";
import { Separator } from "@common/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import ImageUploader from "@common/components/molecules/ImageUploader.vue";
import ImageGalleryUploader from "@common/components/organisms/ImageGalleryUploader.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({ amenities: [] }),
  },
  authorDisplay: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

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

const addAmenity = (name: string) => {
  // We mutate the object property directly since modelValue is an object.
  // Vue 3's reactive system will track this change.
  props.modelValue.amenities.push({ name });
};

const removeAmenity = (index: number) => {
  props.modelValue.amenities.splice(index, 1);
};
</script>
