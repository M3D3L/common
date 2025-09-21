<template>
  <containers-video id="contact" :video="videoArray[randomIndex]" title="" :description="description" class="w-full min-h-screen">
    <template #video-container-content>
      <Card class="relative w-full py-1 my-8 overflow-hidden">
        <TextSectionTitle :title :description :imgSrc :h1="false" class="px-6 pt-6 pb-4 md:px-8" />
        <CardContent class="relative grid grid-cols-1 gap-10 pt-2 lg:grid-cols-2" :initial="'hidden'" :animate="'visible'"
          :variants="containerVariants">
          <motion.div :variants="fadeUp" class="px-4 pb-6 border rounded-lg md:px-6 border-border bg-foreground/15">
            <form ref="form" :action="formAction" method="POST" class="space-y-6" @submit.prevent="handleSubmit">
              <div class="absolute opacity-0 left-[-9999px]">
                <label for="honeypot">Leave this field empty</label>
                <input id="honeypot" v-model="honeypot" type="text" name="honeypot" tabindex="-1" autocomplete="off" />
              </div>

              <div class="space-y-2">
                <Label for="email" class="font-semibold text-foreground">Email</Label>
                <div class="relative">
                  <Mail class="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input id="email" v-model="email" name="email" type="email" placeholder="you@example.com"
                    class="w-full py-2 pl-10 pr-4 transition-colors duration-200 border rounded-md border-input focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    :class="{ 'border-destructive focus:ring-destructive': emailError }" required
                    @input="validateEmail" />
                </div>
                <p v-if="emailError" class="mt-1 text-sm text-destructive">{{ emailError }}</p>
              </div>

              <div class="space-y-2">
                <Label for="message" class="font-semibold text-foreground">Message</Label>
                <Textarea id="message" v-model="message" name="message" placeholder="Your message..."
                  class="min-h-[120px] rounded-md border border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200"
                  :class="{ 'border-destructive focus:ring-destructive': messageError }" required
                  @input="validateMessage" />
                <p v-if="messageError" class="mt-1 text-sm text-destructive">{{ messageError }}</p>
              </div>

              <div v-if="formMessage" class="p-3 text-sm rounded-md" :class="formMessageClass">
                {{ formMessage }}
              </div>

              <Button type="submit" size="default"
                class="w-full h-12 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
                :disabled="isSubmitting">
                <span v-if="!isSubmitting">Send Message</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2 text-white animate-spin"
                    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Sending...
                </span>
              </Button>
            </form>
          </motion.div>

          <motion.div :variants="fadeUp" class="space-y-8 rounded-lg md:p-6 md:bg-secondary/20">
            <div>
              <h3 class="text-xl font-bold">Contact Information</h3>
              <p class="mt-2 text-sm text-muted-foreground">
                Fill out the form or reach out directly through these channels
              </p>
            </div>

            <div class="space-y-6">
              <div class="flex items-start gap-4 p-4 transition-colors duration-200 rounded-md hover:bg-muted/50">
                <div class="flex-shrink-0 p-2 rounded-full bg-primary/10">
                  <Mail class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="text-base font-medium">Email</p>
                  <a :href="`mailto:${contactInfo?.email}`" class="text-xs md:text-sm text-muted-foreground hover:underline">{{ contactInfo?.email }}</a>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 transition-colors duration-200 rounded-md hover:bg-muted/50">
                <div class="flex-shrink-0 p-2 rounded-full bg-primary/10">
                  <Phone class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="text-base font-medium">Phone</p>
                  <a :href="`tel:${contactInfo?.phone}`" class="text-sm text-muted-foreground hover:underline">{{ contactInfo?.phone }}</a>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-bold">Follow Me</h3>
              <div class="mt-4">
                <ContainersSocials :socialLinks="socialLinks" />
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

const props = defineProps({
  title: { type: String, default: 'Contact Me' },
  description: { type: String, default: '' },
  formAction: {
    type: String,
    default: 'https://formsubmit.co/7cbfcf8a8143c9f8708006416b2a0aae'
  },
  contactInfo : {
    type: Object,
    default: () => ({})
  },
  imgSrc: {
    type: String,
    default: ''
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

const videoArray = [
  'https://www.pexels.com/download/video/33792753/',
  'https://www.pexels.com/download/video/32926637/',
  'https://www.pexels.com/download/video/32106032/',
  'https://www.pexels.com/download/video/32104595/',
]

const randomIndex = Math.floor(Math.random() * videoArray.length)

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