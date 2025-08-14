<template>
  <div class="flex items-center gap-3 overflow-hidden text-center">
    <button @click="decrement" :disabled="itemCount === 0"
      class="items-center w-6 h-6 text-lg font-bold text-white rounded-full bg-destructive hover:bg-destructive-hover disabled:opacity-40 disabled:cursor-not-allowed">
      −
    </button>

    <input
      type="number"
      :value="itemCount"
      @input="setItemQuantity"
      class="w-12 text-lg text-center text-black border-none outline-none font-semibold [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
    />

    <button @click="increment"
      class="items-center w-6 h-6 text-lg font-bold rounded-full text-secondary bg-foreground ">
      +
    </button>
  </div>
</template>

<script setup>
import { useCheckoutStore } from "@/store/checkoutStore";

const props = defineProps({
  item: { type: Object, required: true },
});

const checkoutStore = useCheckoutStore();

// The computed property for the item's quantity
const itemCount = computed(() => {
  const key = `${props.item.nameEn}-${props.item.price}`;
  const foundItem = checkoutStore.items.find((i) => i.key === key);
  return foundItem ? foundItem.quantity : 0;
});

// Increment the quantity
const increment = () => {
  checkoutStore.addItem(props.item);
};

// Decrement the quantity
const decrement = () => {
  checkoutStore.removeItem(props.item);
};

// Set the quantity directly from the input field
const setItemQuantity = (event) => {
  let value = parseInt(event.target.value, 10);
  if (isNaN(value) || value < 0) {
    value = 0;
  }
  checkoutStore.setItemQuantity(props.item, value);
};
</script>