<template>
  <Card class="mt-4 text-center bg-black/5 dark:bg-white/5">
    <CardContent class="flex flex-col items-center gap-4 px-6 py-8">
      <h3 class="text-xl font-semibold">Ready to get started?</h3>
      <p class="max-w-2xl text-muted-foreground">
        Join thousands of satisfied users who are already benefiting from our
        solution.
      </p>
      <div class="flex gap-3 mt-4">
        <Button variant="default"> Get Started </Button>
        <Button variant="outline"> Learn More </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
</script>
