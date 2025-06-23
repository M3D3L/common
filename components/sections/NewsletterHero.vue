<template>
    <!-- Newsletter form -->
    <motion.div :variants="fadeUp" class="md:pl-2">
        <Card>
            <CardContent class="p-6 space-y-6">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="space-y-2">
                        <Label for="newsletter-email" class="text-white">Email Address</Label>
                        <Input id="newsletter-email" v-model="form.email" type="email" placeholder="your@email.com"
                            required
                            class="text-white placeholder-gray-400 bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div class="space-y-2">
                        <Label for="newsletter-name" class="text-white">Name (Optional)</Label>
                        <Input id="newsletter-name" v-model="form.name" type="text" placeholder="Your name"
                            class="text-white placeholder-gray-400 bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500" />
                    </div>

                    <div class="flex items-center">
                        <input id="newsletter-consent" v-model="form.consent" type="checkbox" required
                            class="w-4 h-4 rounded text-primary-600 bg-white/10 border-white/20 focus:ring-primary-500">
                        <label for="newsletter-consent" class="ml-2 text-sm text-gray-300">
                            I agree to receive emails and accept the 
                            <modal title="Privacy Policy" description='`This Privacy Policy describes how Guillermo Medel ("I," "me," or "my") collects, uses, and discloses information when you visit my website, subscribe to my newsletter, or interact with my blog.`' :htmlContent="privacyConfig">
                                <template #button>
                                    <span class="cursor-pointer text-primary-500 hover:underline">privacy policy</span>
                                </template>
                            </modal>
                        </label>
                    </div>
                    <Button size="lg" class="w-full" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Subscribing...' : 'Subscribe Now' }}
                    </Button>
                </form>

                <!-- Success/error messages -->
                <div v-if="message" class="p-4 text-sm rounded-lg" :class="{
                    'bg-green-900/50 text-green-300': message.type === 'success',
                    'bg-red-900/50 text-red-300': message.type === 'error'
                }">
                    {{ message.text }}
                </div>

                <!-- Trust indicators -->
                <div class="pt-4 border-t border-white/10">
                    <div class="flex flex-col items-center space-y-2 text-center">
                        <div class="flex space-x-2">
                            <div class="p-2 rounded-lg bg-primary-600/10">
                                <ShieldCheck class="w-5 h-5 text-primary-400" />
                            </div>
                            <div class="p-2 rounded-lg bg-primary-600/10">
                                <Lock class="w-5 h-5 text-primary-400" />
                            </div>
                        </div>
                        <!-- <p class="text-sm text-gray-400">
                            I respect your privacy. Unsubscribe at any time.
                        </p> -->
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, Lock } from 'lucide-vue-next'
import usePocketBaseCore from '~/composables/usePocketBaseCore'
import Modal from '~/components/ui/modal/Modal.vue';
import { privacyConfig } from '~/assets/configs/privacy.js'

// Animation variants
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

// Form state
const form = ref({
    email: '',
    name: '',
    consent: false
})

const isSubmitting = ref(false)
const message = ref(null)

const pbCore = usePocketBaseCore()

// Form submission handler
const handleSubmit = async () => {
    if (!form.value.consent) {
        message.value = {
            type: 'error',
            text: 'Please agree to the privacy policy'
        }
        return
    }

    if (!form.value.email) {
        message.value = {
            type: 'error',
            text: 'Email is required'
        }
        return
    }

    isSubmitting.value = true
    message.value = null

    try {
        await pbCore.createItem('newsletterSubs', {
            email: form.value.email,
            name: form.value.name || '', // Send empty string if name not provided
            consent_given: true,
            subscribed_at: new Date().toISOString()
        })

        message.value = {
            type: 'success',
            text: 'Thank you for subscribing!'
        }

        // Reset form
        form.value = {
            email: '',
            name: '',
            consent: false
        }
    } catch (error) {
        console.error('Subscription error:', error)

        // Check if this is a duplicate email error
        if (error?.response?.data?.email?.code === 'validation_not_unique') {
            message.value = {
                type: 'error',
                text: 'This email is already subscribed'
            }
        } else {
            message.value = {
                type: 'error',
                text: 'Subscription failed. Please try again later.'
            }
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
/* Custom scrollbar for form elements */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}
</style>