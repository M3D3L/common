<template>
  <containers-video
    id="contact"
    :img-src="BlockMe4"
    video="https://videos.pexels.com/video-files/32106032/13687146_2560_1440_30fps.mp4"
    :title
    :description
  >
    <template #video-container-content>
      <motion.div
        initial="hidden"
        whileInView="visible"
        :variants="containerVariants"
        class="w-full mx-auto space-y-4 md:space-y-8"
      >
        <motion.div :variants="fadeUp">
          <Card class="w-full overflow-x-hidden">
            <CardContent class="grid py-8 md:grid-cols-2">
              <!-- Contact Form -->
              <form
                action="https://formsubmit.co/7cbfcf8a8143c9f8708006416b2a0aae"
                method="POST"
                class="space-y-6 rounded-b-none md:pr-6 md:border-r rounded-t-x rounded-x-none border-muted"
              >
                <div class="space-y-2">
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <Label for="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    class="min-h-[120px]"
                    required
                  />
                </div>
                <Button type="submit" size="default" class="w-full">
                  Send Message
                </Button>
              </form>

              <!-- Contact Info -->
              <div class="mt-8 space-y-6 md:px-8 md:mt-0">
                <div>
                  <h3 class="text-lg font-bold">Contact Information</h3>
                  <p class="mt-2 text-sm text-muted-foreground">
                    Fill out the form or reach out directly through these channels
                  </p>
                </div>
                <div class="space-y-4">
                  <div class="flex items-start gap-4">
                    <div class="p-2 rounded-lg bg-primary/10">
                      <Mail class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p class="text-sm font-medium">Email</p>
                      <p class="text-xs md:text-sm text-muted-foreground">
                        guillermoantoniomedel@gmail.com
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="p-2 rounded-lg bg-primary/10">
                      <Phone class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p class="text-sm font-medium">Phone</p>
                      <p class="text-sm text-muted-foreground">+52 (644) 194-2391</p>
                    </div>
                  </div>
                </div>

                <div class="pt-4">
                  <h3 class="text-lg font-bold">Follow Me</h3>
                  <div class="flex gap-4 mt-3">
                    <Button @click="()=>{}" variant="outline" size="icon">
                      <nuxt-link
                        to="https://www.linkedin.com/in/guillermo-medel-9a4465151/"
                        target="_blank"
                      >
                        <Linkedin class="w-4 h-4" />
                      </nuxt-link>
                    </Button>
                    <Button @click="()=>{}" variant="outline" size="icon">
                      <nuxt-link
                        to="https://github.com/M3D3L"
                        target="_blank"
                      >
                        <Github class="w-4 h-4" />
                      </nuxt-link>
                    </Button>
                    <!-- <Button variant="outline" size="icon">
                      <Instagram class="w-4 h-4" />
                    </Button> -->
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </template>
  </containers-video>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Twitter, Linkedin, Github, Instagram } from 'lucide-vue-next'
import BlockMe4 from '/images/block-me-4.webp'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Contact Me'
  },
  description: {
    type: String,
    default: 'I’d love to hear from you! Fill out the form or reach out directly.'
  }
})

// Reuse the same animations from your blog component
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
        }
    }
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}
</script>