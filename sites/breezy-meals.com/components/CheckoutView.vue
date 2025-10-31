<template>
  <div class="max-w-xl p-4 mx-auto">
    <Card class="w-full p-6">
      <CardHeader>
        <CardTitle class="text-3xl font-bold text-center">Your Cart</CardTitle>
      </CardHeader>

      <div v-if="checkoutStore.items.length === 0" class="py-10 text-center text-muted-foreground">
        <p class="text-xl">Your cart is empty.</p>
        <p class="mt-2 text-md">Start adding some delicious items!</p>
      </div>

      <div v-else>
        <div class="space-y-6 max-h-[300px] overflow-y-auto pr-2">
          <div v-for="(item, index) in checkoutStore.items" :key="item.key"
            class="flex flex-col items-center p-4 border rounded-lg md:flex-row md:justify-between border-border">

            <div class="flex items-center w-full gap-4 mb-4 md:w-auto md:mb-0">
              <img :src="item.image || 'https://placehold.co/80x80/E0E0E0/333333?text=No+Image'" alt="Item Image"
                class="flex-shrink-0 object-cover w-20 h-20 rounded-md"
                onerror="this.onerror=null;this.src='https://placehold.co/80x80/E0E0E0/333333?text=No+Image';">
              <div class="flex-grow">
                <p class="text-lg font-semibold text-foreground">{{ item.nameEn }}</p>
                <p class="text-sm text-muted-foreground">{{ item.nameEs }}</p>
                <p class="mt-1 text-base font-medium text-primary">${{ item.price.toFixed(2) }}</p>
              </div>
            </div>

            <div class="flex flex-col items-end w-full gap-2 md:w-auto md:items-start">
              <Checkout :index="index" :item="item" />

              <div class="min-w-[80px] text-right">
                <p class="text-lg font-bold text-foreground">${{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end pt-4 mt-8 border-t-2 border-border">
          <p class="text-2xl font-bold text-foreground">Total: ${{ checkoutStore.total.toFixed(2) }}</p>
        </div>

        <div class="flex justify-center mt-6">
          <Button class="w-full text-lg font-bold md:w-auto" size="lg">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { useCheckoutStore } from "@/store/checkoutStore";
import { Button } from '@common/components/ui/button';
import { Card, CardHeader, CardTitle } from '@common/components/ui/card';

const checkoutStore = useCheckoutStore();
</script>