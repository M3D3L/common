<template>
  <containers-video :id="id" :padding="padding" :video="video">
    <template #video-container-content>
      <section
        :id="headerId"
        class="relative flex flex-col items-center justify-center w-full overflow-hidden placeholder md:flex-row"
      >
        <!-- Left: Image -->
        <div
          class="relative flex items-end justify-center w-full lg:w-1/2 md:w-2/5"
        >
          <img
            :src="imageSrc"
            :alt="imageAlt"
            class="hidden object-cover w-4/5 transform md:block"
          />
        </div>

        <!-- Right: Text content -->
        <Card class="items-center my-16 lg:w-1/2 md:w-3/5">
          <CardHeader>
            <CardTitle
              class="text-3xl font-bold leading-tight text-center md:text-4xl lg:text-5xl md:text-left"
            >
              {{ titleLine1 }} <br />
              <span class="mt-2 text-primary">{{ titleHighlight }}</span>
            </CardTitle>

            <div class="w-full mx-auto mt-4 md:hidden md:w-1/3 lg:w-1/2">
              <img
                :src="imageSrc"
                :alt="imageAlt"
                class="object-cover w-full h-full"
              />
            </div>

            <CardDescription class="mt-4 text-sm lg:text-lg font-base">
              {{ description }}
            </CardDescription>
          </CardHeader>

          <CardContent
            class="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-start"
          >
            <Button asChild size="lg">
              <NuxtLink :to="propertiesLink">{{ propertiesText }}</NuxtLink>
            </Button>
            <WhatsappButton />
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
import WhatsappButton from "@common/components/molecules/WhatsappButton.vue";

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
  propertiesLink: string;
  propertiesText: string;
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
