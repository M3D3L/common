<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-xl font-semibold">Property Details</CardTitle>
    </CardHeader>
    <dl class="grid grid-cols-1 p-4 gap-y-3 gap-x-6 sm:grid-cols-2 text-foreground">
      <template v-if="property?.price">
        <dt>
          <Label class="text-sm uppercase text-accent">Price</Label>
        </dt>
        <dd>
          <p class="text-lg font-bold">${{ property.price.toLocaleString() }}</p>
        </dd>
      </template>

      <template v-if="property?.address">
        <dt>
          <Label class="text-sm uppercase text-accent">Address</Label>
        </dt>
        <dd>
          <p class="text-lg">{{ property.address }}</p>
        </dd>
      </template>

      <template v-if="property?.bedrooms">
        <dt>
          <Label class="text-sm uppercase text-accent">Bedrooms</Label>
        </dt>
        <dd>
          <p class="text-lg">{{ property.bedrooms }}</p>
        </dd>
      </template>

      <template v-if="property?.bathrooms">
        <dt>
          <Label class="text-sm uppercase text-accent">Bathrooms</Label>
        </dt>
        <dd>
          <p class="text-lg">{{ property.bathrooms }}</p>
        </dd>
      </template>

      <template v-if="property?.area">
        <dt>
          <Label class="text-sm uppercase text-accent">Area</Label>
        </dt>
        <dd>
          <p class="text-lg">{{ property.area }} sq ft</p>
        </dd>
      </template>

      <template v-if="property?.lotSize">
        <dt>
          <Label class="text-sm uppercase text-accent">Lot Size</Label>
        </dt>
        <dd>
          <p class="text-lg">{{ property.lotSize }} acres</p>
        </dd>
      </template>

      <template v-if="property?.amenities?.length">
        <dt class="col-span-full">
          <Label class="text-sm uppercase text-accent">Amenities</Label>
        </dt>
        <dd class="col-span-full">
          <p class="text-lg">{{ property.amenities.join(", ") }}</p>
        </dd>
      </template>
    </dl>
  </Card>
</template>

<script lang="ts" setup>
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface Property {
  price?: number;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  lotSize?: number;
  amenities?: string[];
}

const props = defineProps<{
  property: Property;
}>()
</script>
