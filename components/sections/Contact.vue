<template>
  <containers-video id="contact" :video="videoArray[randomIndex]" title="" :description="description" class="w-full min-h-screen">
    <template #video-container-content>
      <Card class="relative w-full py-1 my-8 overflow-hidden">
        <TextSectionTitle :title :description :imgSrc :h1="false" class="px-6 pt-6 pb-4 md:px-8" />
        <CardContent class="relative grid grid-cols-1 gap-8 pt-2 lg:grid-cols-2 lg:gap-12" :initial="'hidden'" :animate="'visible'"
          :variants="containerVariants">
          <!-- Contact Form -->
          <motion.div :variants="fadeUp" class="px-6 py-8 border shadow-lg rounded-xl md:px-8 border-border/40 bg-card/50 backdrop-blur-sm">
            <form ref="form" :action="formAction" method="POST" class="space-y-6" @submit.prevent="handleSubmit">
              <!-- Honeypot -->
              <div class="absolute opacity-0 left-[-9999px]">
                <label for="honeypot">Leave this field empty</label>
                <input id="honeypot" v-model="honeypot" type="text" name="honeypot" tabindex="-1" autocomplete="off" />
              </div>

              <!-- Email Field -->
              <div class="space-y-2">
                <Label for="email" class="text-sm font-semibold text-foreground">Email Address</Label>
                <div class="relative group">
                  <Mail class="absolute w-5 h-5 transition-colors -translate-y-1/2 left-3 top-1/2 text-muted-foreground group-focus-within:text-primary" />
                  <Input 
                    id="email" 
                    v-model="email" 
                    name="email" 
                    type="email" 
                    placeholder="you@example.com"
                    class="w-full py-3 pl-10 pr-4 transition-all duration-300 border rounded-lg border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50"
                    :class="{ 'border-destructive focus:ring-destructive/20 focus:border-destructive': emailError }" 
                    required
                    @input="validateEmail" 
                  />
                </div>
                <p v-if="emailError" class="flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ emailError }}
                </p>
              </div>

              <!-- Message Field -->
              <div class="space-y-2">
                <Label for="message" class="text-sm font-semibold text-foreground">Message</Label>
                <Textarea 
                  id="message" 
                  v-model="message" 
                  name="message" 
                  placeholder="Tell us about your project or inquiry..."
                  class="min-h-[140px] rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none hover:border-primary/50"
                  :class="{ 'border-destructive focus:ring-destructive/20 focus:border-destructive': messageError }" 
                  required
                  @input="validateMessage" 
                />
                <p v-if="messageError" class="flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ messageError }}
                </p>
              </div>

              <!-- Form Message -->
              <div v-if="formMessage" class="p-4 text-sm rounded-lg animate-in fade-in slide-in-from-top-2" :class="formMessageClass">
                <div class="flex items-center gap-2">
                  <svg v-if="formMessageClass.includes('success')" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ formMessage }}</span>
                </div>
              </div>

              <!-- Submit Button -->
              <Button 
                type="submit" 
                size="lg"
                class="w-full h-12 text-base font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting" class="flex items-center justify-center gap-2">
                  <Mail class="w-5 h-5" />
                  Send Message
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              </Button>
            </form>
          </motion.div>

          <!-- Contact Information -->
          <motion.div :variants="fadeUp" class="space-y-8">
            <div class="p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40">
              <h3 class="mb-2 text-2xl font-bold">Get in Touch</h3>
              <p class="text-sm leading-relaxed text-muted-foreground">
                Fill out the form or reach out directly through these channels. We'll get back to you as soon as possible.
              </p>
            </div>

            <div class="space-y-4">
              <!-- Email -->
              <a 
                :href="`mailto:${contactInfo?.email}`"
                class="flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
              >
                <div class="flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110">
                  <Mail class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="mb-1 text-base font-semibold">Email</p>
                  <p class="text-sm transition-colors text-muted-foreground group-hover:text-primary">
                    {{ contactInfo?.email }}
                  </p>
                </div>
              </a>

              <!-- Phone -->
              <a 
                :href="`tel:${contactInfo?.phone}`"
                class="flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
              >
                <div class="flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110">
                  <Phone class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="mb-1 text-base font-semibold">Phone</p>
                  <p class="text-sm transition-colors text-muted-foreground group-hover:text-primary">
                    {{ contactInfo?.phone }}
                  </p>
                </div>
              </a>
            </div>

            <!-- Social Links -->
            <div class="p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40">
              <h3 class="mb-4 text-xl font-bold">Follow Us</h3>
              <ContainersSocials :socialLinks="socialLinks" />
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
    formMessage.value = 'There was an error submitting your message. Please try again.'
    formMessageClass.value = 'bg-destructive/10 text-destructive border border-destructive/20'
    return
  }

  if (!validateForm()) return

  isSubmitting.value = true
  formMessage.value = ''

  try {
    if (props.formAction) {
      const formData = new FormData(form.value as HTMLFormElement)

      formData.append('_captcha', 'false')
      formData.append('_template', 'table')
      formData.append('_next', window.location.href)

      const response = await fetch(props.formAction, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        formMessage.value = 'Message sent successfully! We will get back to you soon.'
        formMessageClass.value = 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
        email.value = ''
        message.value = ''
      } else {
        throw new Error('Failed to submit form')
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500))
      formMessage.value = 'Message sent successfully! We will get back to you soon.'
      formMessageClass.value = 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
      email.value = ''
      message.value = ''
    }
  } catch (error) {
    formMessage.value = 'There was an error submitting your message. Please try again later.'
    formMessageClass.value = 'bg-destructive/10 text-destructive border border-destructive/20'
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>