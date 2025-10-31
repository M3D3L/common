<template>
  <div class="flex items-center gap-3 overflow-hidden text-center">
    <Button @click="decrement"><Minus class="w-4 h-4" /></Button>
    <input
      type="number"
      :value="itemCount"
      @input="setItem"
      class="w-12 text-center text-black"
    />
    <Button @click="increment"><Plus class="w-4 h-4" /></Button>
  </div>
</template>

<script setup>
import { useCheckoutStore } from "~/store/checkoutStore";
import { Button } from "@common/components/ui/button";
import { Minus, Plus } from 'lucide-vue-next';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

// Get the item key for tracking
const getItemKey = () => `${props.item.nameEn}-${props.item.price}`;

// Computed property for the item's quantity
const itemCount = computed(() => {
  const store = useCheckoutStore();
  const key = getItemKey();
  const foundItem = store.items.find((i) => i.key === key);
  return foundItem ? foundItem.quantity : 0;
});

// Increment the quantity
const increment = () => {
  const store = useCheckoutStore();
  store.addItem(props.item);
};

// Decrement the quantity
const decrement = () => {
  const store = useCheckoutStore();
  store.removeItem(props.item);
};

// Set the quantity directly from the input field
const setItem = (event) => {
  const store = useCheckoutStore();
  let value = parseInt(event.target.value, 10);
  if (isNaN(value) || value < 0) {
    value = 0;
  }
  store.setItemQuantity(props.item, value);
};
</script>