<template>
  <div :style="{ height: height, width: width }">
    <LMap
      ref="map"
      :zoom="zoom"
      :center="mapCenter"
      :use-global-leaflet="false"
      v-bind="$attrs"
    >
      <LTileLayer
        :url="tileUrl"
        :attribution="attribution"
        layer-type="base"
        name="OpenStreetMap"
      />

      <LMarker v-if="showMarker" :lat-lng="mapCenter" />
    </LMap>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // Coordinates
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },

  // Map State
  zoom: { type: Number, default: 13 },

  // Display Options
  height: { type: String, default: "100vh" },
  width: { type: String, default: "100vw" },
  showMarker: { type: Boolean, default: true },

  // Provider Options
  tileUrl: {
    type: String,
    default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  attribution: {
    type: String,
    default:
      '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  },
});

// Reactive center calculation
const mapCenter = computed(() => [props.lat, props.lng]);
</script>
