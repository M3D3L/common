<template>
  <Table>
    <TableHeader class="bg-muted/50">
      <TableRow>
        <TableHead class="w-[100px]">Preview</TableHead>
        <TableHead>Details</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Price</TableHead>
        <TableHead class="lg:w-auto min-w-24">Specs</TableHead>
        <TableHead v-if="!hideEdit" class="text-right">Actions</TableHead>
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

      <TableRow v-else-if="!properties.length">
        <TableCell colspan="6" class="h-32 text-center text-muted-foreground">
          No properties found in this category.
        </TableCell>
      </TableRow>

      <TableRow
        v-for="property in properties"
        :key="property.id"
        class="group transition-colors hover:bg-muted/30"
      >
        <TableCell>
          <div
            :class="imgMode === 'large' ? 'w-32 h-32 my-4' : 'w-16 h-16'"
            class="rounded-md bg-muted border overflow-hidden"
          >
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
          <Badge :variant="getBadgeVariant(property.type)" class="capitalize">
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
        <TableCell v-if="!hideEdit" class="text-right">
          <div class="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              @click="$emit('edit', property)"
              title="Edit"
            >
              <Edit class="w-4 h-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              @click="$emit('delete', property)"
              title="Delete"
            >
              <Trash2 class="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@common/components/ui/table";

const props = defineProps({
  properties: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  hideEdit: { type: Boolean, default: false },
  imgMode: { type: String, default: "small" },
});

defineEmits(["edit", "delete"]);

const { getFileUrl } = usePocketBaseCore();

const getImageUrl = (property: any) => {
  return property.cover_image ? getFileUrl(property, property.cover_image) : "";
};

const getBadgeVariant = (type: string) => {
  if (type === "rental") return "secondary";
  if (type === "lot") return "outline";
  return "default";
};
</script>
