<template>
  <containers-video
    id="hero"
    padding=""
    video="/videos/intro.mp4"
  >
    <template #video-container-content>
      <section id="header" class="w-full">
        <div
          class="relative flex flex-col items-center overflow-hidden justify-center w-full !p-0 mx-auto placeholder md:flex-row"
        >
          <!-- Left: Brenda image -->
          <div class="relative flex items-end justify-center w-full md:w-1/2">
            <img
              :src="Brenda"
              alt="Brenda - Real Estate Agent"
              class="hidden object-cover w-4/5 transform md:block"
            />
          </div>

          <!-- Right: Text content -->
          <div
            class="flex items-center justify-center w-full py-12 text-center md:px-6 md:w-1/2 md:text-left"
          >
            <Card>
              <CardHeader>
                <CardTitle
                  class="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
                >
                  Ready to relocate to <br />
                  <span class="mt-2 text-primary">San Carlos</span>?
                </CardTitle>

                <div class="w-full mx-auto mt-4 md:hidden md:w-1/3 lg:w-1/2">
                  <img
                    :src="Brenda"
                    alt="Brenda - Real Estate Agent"
                    class="object-cover w-full h-full"
                  />
                </div>

                <CardDescription class="mt-4 text-lg font-base">
                  At RelocatetoSanCarlos.com, we offer full-service relocation
                  assistance, exclusive access to homes for sale in San Carlos,
                  and trusted expat-friendly property listings along the
                  stunning Sea of Cortez. From finding your dream home to
                  settling in smoothly, your beachside lifestyle begins here.
                </CardDescription>
              </CardHeader>

              <CardContent
                class="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-start"
              >
                <Button asChild size="lg">
                  <NuxtLink to="/real-estate/">View Properties</NuxtLink>
                </Button>
                <WhatsappButton />
              </CardContent>
            </Card>
          </div>
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
import WhatsappButton from "@common/components/molecules/WhatsappButton.vue";
import Brenda from "/images/real-estate-baddie2.png";
</script>
