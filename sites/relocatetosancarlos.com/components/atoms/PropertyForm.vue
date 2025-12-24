<template>
  <form
    @submit.prevent="$emit('save')"
    class="flex-1 overflow-y-auto p-6 space-y-8"
  >
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

      <div class="space-y-2 col-span-2">
        <Label>Price Type</Label>
        <Select v-model="modelValue.pricingType">
          <SelectTrigger
            ><SelectValue placeholder="Select price type"
          /></SelectTrigger>
          <SelectContent>
            <SelectItem value="per/night">Per Night</SelectItem>
            <SelectItem value="per/month">Per Month</SelectItem>
            <SelectItem value="usd">usd</SelectItem>
            <SelectItem value="mxn">mxn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="col-span-2 flex md:flex-row flex-col gap-4">
        <div class="space-y-2 w-full">
          <Label for="beds">Bedrooms</Label>
          <Input id="beds" type="number" v-model.number="modelValue.bedrooms" />
        </div>
        <div class="space-y-2 w-full">
          <Label for="baths">Bathrooms</Label>
          <Input
            id="baths"
            type="number"
            step="0.5"
            v-model.number="modelValue.bathrooms"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="area">Area (m²)</Label>
          <Input id="area" type="number" v-model.number="modelValue.area" />
        </div>
        <div class="space-y-2">
          <Label for="lot">Lot Size (m²)</Label>
          <Input id="lot" type="number" v-model.number="modelValue.lotSize" />
        </div>
      </div>
    </div>

    <Separator />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-3 space-y-2">
        <Label for="address">Full Address</Label>
        <Input
          id="address"
          v-model="modelValue.address"
          placeholder="123 Street..."
        />
      </div>
      <div class="space-y-2">
        <Label for="lat">Latitude</Label>
        <Input id="lat" v-model="modelValue.lat" placeholder="0.0000" />
      </div>
      <div class="space-y-2">
        <Label for="long">Longitude</Label>
        <Input id="long" v-model="modelValue.long" placeholder="0.0000" />
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
          @click="addAmenity({ name: amenity })"
        >
          <Plus class="w-3 h-3 mr-2" /> {{ amenity }}
        </Button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="(amenity, index) in modelValue.amenities"
          :key="index"
          class="flex gap-2"
        >
          <Input v-model="amenity.name" placeholder="Amenity name..." />
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
      <Button type="button" variant="secondary" size="sm" @click="addAmenity()">
        <Plus class="w-3 h-3 mr-2" /> Add Amenity
      </Button>
    </div>

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
        :name="modelValue?.title || 'gallery'"
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
import { amenitiesList } from "~/assets/configs/amenities";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({ amenities: [] }),
  },
  authorDisplay: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "save"]);

const addAmenity = (payload?: { name: string }) => {
  // If a payload with a name is passed (from the buttons), use it.
  // Otherwise (from the "Add Amenity" button), use an empty string.
  const amenityName = payload?.name || "";
  props.modelValue.amenities.push({ name: amenityName });
};

const removeAmenity = (index: number) => {
  props.modelValue.amenities.splice(index, 1);
};
</script>
