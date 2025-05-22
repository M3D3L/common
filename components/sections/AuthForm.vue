<template>
  <containers-video video="https://videos.pexels.com/video-files/2867873/2867873-uhd_2560_1440_24fps.mp4"
    class="min-h-[90vh]">
    <template #video-container-content>
      <ClientOnly>
        <div class="flex items-center justify-center w-full h-full p-4 mx-auto md:max-w-3xl">
          <div class="w-full">
            <Card
              class="-mt-32 transition-all duration-300 shadow-lg bg-background/90 backdrop-blur-sm border-border/50">
              <CardContent class="p-6">
                <div class="flex justify-center mb-6">
                  <span class="flex flex-col logo-text">
                    <span class="text-xl font-bold">GuillermoMedel</span>
                  </span>
                </div>

                <div class="flex justify-center mb-6">
                  <Tabs :modelValue="activeTab" class="w-full" @update:modelValue="handleTabChange">
                    <TabsList class="grid w-full grid-cols-2">
                      <TabsTrigger value="login" asChild>
                        <NuxtLink to="/login" class="w-full">Login</NuxtLink>
                      </TabsTrigger>
                      <TabsTrigger value="register" asChild>
                        <NuxtLink to="/register" class="w-full">Register</NuxtLink>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <!-- Success Notification -->
                <div v-if="showSuccess" class="p-4 mb-4 text-center text-green-600 bg-green-100 rounded-md">
                  <p>Thank you for registering! You can now login with your credentials.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <div class="space-y-2" v-if="isRegister">
                    <Label for="username">Username</Label>
                    <Input id="username" v-model="form.username" placeholder="johndoe" required
                      autocomplete="username" />
                    <div v-if="errors.username" class="text-sm text-destructive">
                      {{ errors.username }}
                    </div>
                  </div>

                  <!-- Email Input -->
                  <div class="space-y-2">
                    <Label for="email">Email</Label>
                    <Input id="email" v-model="form.email" type="email" placeholder="your@email.com" required
                      autocomplete="email" />
                    <div v-if="errors.email" class="text-sm text-destructive">
                      {{ errors.email }}
                    </div>
                  </div>

                  <!-- Password Input -->
                  <div class="space-y-2">
                    <Label for="password">Password</Label>
                    <Input id="password" v-model="form.password" type="password" placeholder="••••••••" required
                      :minlength="isRegister ? 8 : 1" autocomplete="current-password" />
                    <div v-if="errors.password" class="text-sm text-destructive">
                      {{ errors.password }}
                    </div>
                    <div v-if="isRegister" class="text-xs text-muted-foreground">
                      Password must be at least 8 characters
                    </div>
                  </div>

                  <!-- Confirm Password Input -->
                  <div v-if="isRegister" class="space-y-2">
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" v-model="form.confirmPassword" type="password" placeholder="••••••••"
                      required minlength="8" autocomplete="new-password" />
                    <div v-if="errors.confirmPassword" class="text-sm text-destructive">
                      {{ errors.confirmPassword }}
                    </div>
                  </div>

                  <div v-if="isRegister" class="space-y-2">
                    <Label for="bio">Bio</Label>
                    <textarea id="bio" v-model="form.bio"
                      class="w-full px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="A short bio about yourself"></textarea>
                    <div v-if="errors.bio" class="text-sm text-destructive">
                      {{ errors.bio }}
                    </div>
                  </div>

                  <div v-if="isRegister" class="space-y-2">
                    <Label for="avatar">Avatar</Label>
                    <Input id="avatar" type="file" @change="handleAvatarChange" accept="image/*" />
                    <div v-if="errors.avatar" class="text-sm text-destructive">
                      {{ errors.avatar }}
                    </div>
                    <div v-if="form.avatarUrl" class="mt-2">
                      <img :src="form.avatarUrl" alt="Avatar Preview" class="object-cover w-16 h-16 rounded-full">
                    </div>
                  </div>

                  <!-- <div v-if="!isRegister" class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <Checkbox id="remember" v-model="form.remember" />
                      <Label for="remember">Remember me</Label>
                    </div>
                    <button type="button" class="text-sm font-medium text-primary hover:underline"
                      @click="handleForgotPassword">
                      Forgot password?
                    </button>
                  </div> -->

                  <Button type="submit" class="w-full">
                    <span v-if="isSubmitting" class="flex items-center">
                      <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </span>
                    <span v-else>
                      {{ isRegister ? 'Create Account' : 'Sign In' }}
                    </span>
                  </Button>
                </form>
              </CardContent>

              <CardFooter class="flex flex-col items-center justify-center p-6 pt-0">
                <p class="text-sm text-muted-foreground">
                  {{ isRegister ? 'Already have an account?' : "Don't have an account?" }}
                  <NuxtLink :to="isRegister ? '/login' : '/register'" class="font-medium text-primary hover:underline">
                    {{ isRegister ? 'Sign in' : 'Sign up' }}
                  </NuxtLink>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </ClientOnly>
    </template>
  </containers-video>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
const auth = useAuth()
const isRegister = computed(() => route.path === '/register')
const showSuccess = ref(false)

const route = useRoute()
const router = useRouter()

// Extract the source URL from the query parameters
const sourceUrl = computed(() => {
  const source = route.query.source
  return source ? String(source) : '/'
})

const activeTab = computed(() => isRegister.value ? 'register' : 'login')

const handleTabChange = (tab: string) => {
  if (tab === 'register' && route.path !== '/register') {
    router.push('/register')
  } else if (tab === 'login' && route.path !== '/login') {
    router.push('/login')
  }
}

interface FormData {
  username?: string
  email: string
  password: string
  confirmPassword?: string
  bio?: string
  avatar?: File | null
  avatarUrl?: string | null
  remember: boolean
}

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  bio?: string
  avatar?: string
}

const form = reactive<FormData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  bio: '',
  avatar: null,
  avatarUrl: null,
  remember: false
})

const errors = reactive<FormErrors>({})

const isSubmitting = ref(false)

const resetForm = () => {
  form.username = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  form.bio = ''
  form.avatar = null
  form.avatarUrl = null
  form.remember = false

  // Clear file input if it exists
  const fileInput = document.getElementById('avatar') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key as keyof FormErrors])

  if (isRegister.value) {
    if (!form.username) {
      errors.username = 'Username is required'
    }
  }

  // Email validation
  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Please enter a valid email'
  }

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
  } else if (isRegister.value && form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  // Confirm password validation (register only)
  if (isRegister.value) {
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
  }

  return Object.keys(errors).length === 0
}

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    form.avatar = target.files[0]
    form.avatarUrl = URL.createObjectURL(target.files[0])
  } else {
    form.avatar = null
    form.avatarUrl = null
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  showSuccess.value = false

  try {
    if (isRegister.value) {
      const registerData: Record<string, any> = {
        email: form.email,
        password: form.password,
        passwordConfirm: form.confirmPassword,
        username: form.username,
        bio: form.bio,
      }
      if (form.avatar) {
        registerData.avatar = form.avatar
      }

      const success = await auth.register(registerData)

      if (success) {
        // Show success message and reset form
        showSuccess.value = true
        resetForm()

        // Optionally auto-hide the success message after some time
        setTimeout(() => {
          showSuccess.value = false
        }, 5000)
      }
    } else {
      const success = await auth.login({
        email: form.email,
        password: form.password
      })

      if (success) {
        sourceUrl.value === '/' ? await router.push('/') : await router.push(sourceUrl.value);
      } else {
        errors.email = 'Invalid email or password'
      }
    }
  } catch (error: any) {
    // Handle specific error messages from auth composable
    if (error.message) {
      // Set field-specific errors if available
      if (error.data?.data) {
        Object.entries(error.data.data).forEach(([field, message]) => {
          if (field in errors) {
            errors[field as keyof FormErrors] = Array.isArray(message)
              ? message.join(', ')
              : String(message)
          }
        })
      } else {
        console.error("Registration/Login error:", error)
      }
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleForgotPassword = async () => {
  if (!form.email) {
    errors.email = 'Email is required to reset password'
    return
  }

  isSubmitting.value = true
  try {
    const success = await auth.requestPasswordReset(form.email)
    if (success) {
      await router.push('/login?reset=email-sent')
    }
  } catch (error: any) {
    if (error.message) {
      errors.email = error.message
    }
  } finally {
    isSubmitting.value = false
  }
}

</script>