<template>
  <section :id="id" class="w-full">
    <a :href="button.href" target="_blank" rel="noopener noreferrer">
      <Card class="w-full py-6 md:pb-6 md:pt-10 group">
        <CardContent class="flex flex-col items-center justify-center gap-4">
          <div class="relative mx-auto text-center">
            <h2 class="text-2xl font-bold md:text-4xl text-primary">
              {{ title }}
            </h2>
            <p class="max-w-xl mx-auto mt-4 text-lg text-muted-foreground">
              {{ description }}
            </p>
          </div>

          <Button @click="() => { }" :variant="button.variant || 'default'" size="lg">
            {{ button.label }}
          </Button>

        </CardContent>
      </Card>
    </a>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@common/components/ui/button';
import { Card, CardContent } from '@common/components/ui/card';

interface BannerButton {
  label: string;
  href: string;
  variant?: 'default' | 'outline' | 'secondary';
}

defineProps<{
  id: string;
  title: string;
  description: string;
  button: BannerButton;
}>();
</script>