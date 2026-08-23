<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="max-w-sm rounded-2xl border-border/70 bg-white text-center shadow-2xl backdrop-blur"
    >
      <div class="flex flex-col items-center gap-2 pt-2">
        <img
          :src="logoSrc"
          alt="Breezy Meals"
          class="h-16 w-16 rounded-full border-2 border-primary/20 object-cover shadow-xs"
        />
      </div>
      <DialogHeader class="text-center sm:text-center">
        <DialogTitle class="text-center font-heading text-xl">
          ¡Gracias {{ thankYouName }} por tu pedido! / Thank you
          {{ thankYouName }} for your order!
        </DialogTitle>
        <DialogDescription class="text-center">
          Ya lo recibimos en cocina y lo estamos preparando.
          <br />
          We've received it in the kitchen and it's being prepared.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="sm:justify-center">
        <Button class="w-full" @click="open = false">
          Entendido / Got it
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@common/components/ui/dialog";

defineProps<{ thankYouName: string; logoSrc: string }>();
const open = defineModel<boolean>("open", { required: true });
</script>
