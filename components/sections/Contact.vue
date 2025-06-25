<template>
  <containers-video
    id="contact"
    :img-src="imgSrc"
    :video="video"
    :title="title"
    :description="description"
  >
    <template #video-container-content>
      <Card class="relative w-full py-1 mt-16 overflow-x-hidden">
        <!-- Decorative Background Blob -->
        <div class="absolute top-[-4rem] right-[-4rem] w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none z-0" />

        <CardContent
          class="relative grid gap-10 py-8 lg:grid-cols-2"
          :initial="'hidden'"
          :animate="'visible'"
          :variants="containerVariants"
        >

          <!-- Contact Form -->
          <motion.div :variants="fadeUp">
            <form
              ref="form"
              :action="formAction"
              method="POST"
              class="space-y-6 rounded-b-none md:pr-6 md:border-r border-muted"
              @submit.prevent="handleSubmit"
            >
              <!-- Honeypot Field (hidden from humans but visible to bots) -->
              <div class="absolute opacity-0 left-[-9999px]">
                <label for="honeypot">Leave this field empty</label>
                <input
                  id="honeypot"
                  v-model="honeypot"
                  type="text"
                  name="honeypot"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <!-- Email Field -->
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <div class="flex items-center px-3 py-2 border rounded-md bg-background border-input" :class="{'border-destructive': emailError}">
                  <Mail class="w-4 h-4 mr-2 text-muted-foreground" />
                  <Input
                    id="email"
                    v-model="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    class="px-2 border-0 focus:ring-0"
                    required
                    @input="validateEmail"
                  />
                </div>
                <p v-if="emailError" class="text-sm text-destructive">{{ emailError }}</p>
              </div>

              <!-- Message Field -->
              <div class="space-y-2">
                <Label for="message">Message</Label>
                <Textarea
                  id="message"
                  v-model="message"
                  name="message"
                  placeholder="Your message..."
                  class="min-h-[120px]"
                  required
                  :class="{'border-destructive': messageError}"
                  @input="validateMessage"
                />
                <p v-if="messageError" class="text-sm text-destructive">{{ messageError }}</p>
              </div>

              <!-- Form Status Message -->
              <div v-if="formMessage" class="p-3 text-sm rounded-md" :class="formMessageClass">
                {{ formMessage }}
              </div>

              <!-- Submit Button -->
              <Button 
                type="submit" 
                size="default" 
                class="w-full transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting">Send Message</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              </Button>
            </form>
          </motion.div>

          <!-- Contact Info Panel -->
          <motion.div :variants="fadeUp" class="space-y-6 md:px-8">
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
                    {{ contactEmail }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="p-2 rounded-lg bg-primary/10">
                  <Phone class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p class="text-sm font-medium">Phone</p>
                  <p class="text-sm text-muted-foreground">{{ contactPhone }}</p>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <h3 class="text-lg font-bold">Follow Me</h3>
              <div class="flex gap-4 mt-3">
                <Button
                  v-for="social in socialLinks"
                  :key="social.href"
                  variant="outline"
                  size="icon"
                  as="a"
                  :href="social.href"
                  target="_blank"
                  class="transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  <component :is="social.icon" class="w-4 h-4 text-muted-foreground hover:text-primary" />
                </Button>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
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
import {
  Mail,
  Phone,
  Linkedin,
  Github,
} from 'lucide-vue-next'

import BlockMe4 from '/images/block-me-4.webp'

const props = defineProps({
  title: { type: String, default: 'Contact Me' },
  description: { type: String, default: '' },
  formAction: {
    type: String,
    default: 'https://formsubmit.co/7cbfcf8a8143c9f8708006416b2a0aae'
  },
  contactEmail: {
    type: String,
    default: 'guillermoantoniomedel@gmail.com'
  },
  contactPhone: {
    type: String,
    default: '+52 (644) 194-2391'
  },
  video: {
    type: String,
    default: 'https://videos.pexels.com/video-files/32106032/13687146_2560_1440_30fps.mp4'
  },
  imgSrc: {
    type: String,
    default: BlockMe4
  },
  socialLinks: {
    type: Array,
    default: () => [
      {
        icon: Linkedin,
        href: 'https://www.linkedin.com/in/guillermo-medel-9a4465151/'
      },
      {
        icon: Github,
        href: 'https://github.com/M3D3L'
      }
    ]
  }
})

// Form state
const form = ref<HTMLFormElement | null>(null)
const email = ref('')
const message = ref('')
const honeypot = ref('')
const emailError = ref('')
const messageError = ref('')
const isSubmitting = ref(false)
const formMessage = ref('')
const formMessageClass = ref('')

// Animations
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

// Validation functions
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
}

const validateMessage = () => {
  if (!message.value) {
    messageError.value = 'Message is required'
  } else if (message.value.length < 10) {
    messageError.value = 'Message should be at least 10 characters'
  } else {
    messageError.value = ''
  }
}

const validateForm = () => {
  validateEmail()
  validateMessage()
  return !emailError.value && !messageError.value
}

const handleSubmit = async () => {
  // Check honeypot first
  if (honeypot.value) {
    // Likely a bot, don't proceed
    formMessage.value = 'There was an error submitting your message. Please try again.'
    formMessageClass.value = 'bg-destructive/10 text-destructive'
    return
  }

  if (!validateForm()) return

  isSubmitting.value = true
  formMessage.value = ''
  
  try {
    // If using FormSubmit.co or similar service
    if (props.formAction) {
      const formData = new FormData(form.value as HTMLFormElement)
      
      // Add additional hidden fields if needed
      formData.append('_captcha', 'false') // Disable captcha for API submission
      formData.append('_template', 'table') // Example for FormSubmit.co
      formData.append('_next', window.location.href) // Redirect back after submit
      
      const response = await fetch(props.formAction, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        formMessage.value = 'Message sent successfully! We will get back to you soon.'
        formMessageClass.value = 'bg-success/10 text-success'
        email.value = ''
        message.value = ''
      } else {
        throw new Error('Failed to submit form')
      }
    } else {
      // If you have your own backend endpoint
      // You would handle the submission here
      // Simulate success for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500))
      formMessage.value = 'Message sent successfully! We will get back to you soon.'
      formMessageClass.value = 'bg-success/10 text-success'
      email.value = ''
      message.value = ''
    }
  } catch (error) {
    formMessage.value = 'There was an error submitting your message. Please try again later.'
    formMessageClass.value = 'bg-destructive/10 text-destructive'
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>