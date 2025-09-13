<template>
  <Card class="w-full p-6 space-y-4">
    {{ title }}
    <CardHeader class="p-0 space-y-2">
      <CardTitle class="text-2xl font-bold tracking-tight text-primary-800">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
          {{ title }}
        </span>
      </CardTitle>
      <CardDescription class="text-base text-muted-foreground">
        {{ subtitle }}
      </CardDescription>
    </CardHeader>

    <CardContent class="p-0">
      <ul class="space-y-4">
        <li
          v-for="(item, index) in benefits"
          :key="index"
          class="flex items-start gap-4"
        >
          <div>
            <span class="flex items-center justify-center w-8 h-8 font-semibold rounded-full text-background bg-foreground">
              {{ index + 1 }}
            </span>
          </div>
          <div>
            <p class="font-semibold text-primary-900">{{ item.title }}</p>
            <p class="text-sm text-muted-foreground">{{ item.description }}</p>
          </div>
        </li>
      </ul>
    </CardContent>

    <p class="text-xs text-muted-foreground">
      {{ footerText }}
    </p>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'

export interface BenefitItem {
  title: string;
  description: string;
}

interface Props {
  title: string;
  subtitle: string;
  footerText: string;
  benefits: BenefitItem[];
}

const props = defineProps<Props>();
</script>