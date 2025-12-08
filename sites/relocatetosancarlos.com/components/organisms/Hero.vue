<template>
  <containers-video :id="id" :padding="padding" :video="video">
    <template #video-container-content>
      <section
        :id="headerId"
        class="relative flex flex-col min-h-screen items-center justify-center w-full py-16 overflow-hidden placeholder md:flex-row md:py-0"
      >
        <!-- Left: Image -->
        <div
          class="relative flex flex-col md:bg-white/85 lg:bg-transparent rounded-lg items-center justify-center w-full overflow-hidden placeholder md:flex-row md:py-0"
        >
          <div
            class="relative flex items-end justify-center w-full md:w-1/2 lg:w-1/2 lg:min-h-screen"
          >
            <img
              :src="imageSrc"
              :alt="imageAlt"
              class="hidden object-cover w-full lg:w-4/5 transform md:block"
            />
          </div>

          <!-- Right: Text content -->
          <Card class="md:w-1/2">
            <CardHeader class="p-6 space-y-6 lg:p-8">
              <CardTitle
                class="text-3xl font-bold tracking-tight text-center md:text-4xl lg:text-5xl lg:text-left"
              >
                {{ titleLine1 }}
                <span class="block mt-2 text-primary md:text-4xl text-3xl">
                  {{ titleHighlight }}
                </span>
              </CardTitle>

              <img
                :src="imageSrc"
                :alt="imageAlt"
                class="object-cover w-4/5 md:hidden mx-auto"
              />

              <CardDescription
                class="max-w-2xl mx-auto text-lg lg:mx-0 lg:text-left"
              >
                {{ description }}
              </CardDescription>
            </CardHeader>

            <CardContent
              class="flex flex-col gap-4 px-6 lg:flex-row sm:justify-center lg:justify-start lg:px-8"
            >
              <Button
                v-for="(button, index) in buttons"
                :key="button.title"
                asChild
                size="lg"
                :variant="index === 0 ? 'default' : 'outline'"
                class="font-semibold"
              >
                <NuxtLink :to="button.link">
                  {{ button.title }}
                </NuxtLink>
              </Button>
            </CardContent>
          </Card>
        </div>
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
} = props;
</script>
