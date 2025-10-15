<template>
  <containers-video :id="id" :padding="padding" :video="video">
    <template #video-container-content>
      <section :id="headerId"
        class="relative flex flex-col items-center justify-center w-full py-16 overflow-hidden placeholder md:flex-row md:py-0">
        <!-- Left: Image -->
        <div class="relative flex items-end justify-center w-full lg:w-1/2 md:w-2/5">
          <img :src="imageSrc" :alt="imageAlt" class="hidden object-cover w-4/5 transform md:block" />
        </div>

        <!-- Right: Text content -->
        <Card>
          <CardHeader class="p-6 space-y-6 lg:p-8">
            <CardTitle class="text-4xl font-bold tracking-tight text-center md:text-5xl lg:text-6xl lg:text-left">
              {{ titleLine1 }}
              <span class="block mt-2 text-primary">
                {{ titleHighlight }}
              </span>
            </CardTitle>

            <CardDescription class="max-w-2xl mx-auto text-lg lg:mx-0 lg:text-left">
              {{ description }}
            </CardDescription>
          </CardHeader>

          <CardContent class="flex flex-col gap-4 px-6 sm:flex-row sm:justify-center lg:justify-start lg:px-8">
            <Button v-for="(button, index) in buttons" :key="button.title" asChild size="lg"
              :variant="index === 0 ? 'default' : 'outline'" class="font-semibold">
              <NuxtLink :to="button.link">
                {{ button.title }}
              </NuxtLink>
            </Button>
          </CardContent>
        </Card>
      </section>
    </template>
  </containers-video>
</template>

<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";

interface Props {
  id: string;
  padding: string;
  video: string;
  headerId: string;
  imageSrc: string;
  imageAlt: string;
  titleLine1: string;
  titleHighlight: string;
  description: string;
  buttons: Array<{ text: string; title: string; link: string }>;
}

const props = defineProps<Partial<Props>>();

const {
  id,
  padding,
  video,
  headerId,
  imageSrc,
  imageAlt,
  titleLine1,
  titleHighlight,
  description,
  propertiesLink,
  propertiesText,
} = props;
</script>
