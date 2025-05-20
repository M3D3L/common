import usePocketBase from './usePocketbase'
import { useRouter, useRoute } from '#app'
import { onMounted } from 'vue'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  email: string
  password: string
  passwordConfirm: string
  username?: string
  [key: string]: any
}

interface AuthUser {
  id: string
  email: string
  username?: string
  [key: string]: any
}

export default function useAuth() {
  const pb = usePocketBase()
  const router = useRouter()
  const route = useRoute()

  // Initialize state with stored user if available
  const user = useState<AuthUser | null>('auth:user', () => {
    return pb.authStore.model ? getUserFromModel() : null
  })
  
  const isAuthenticated = useState<boolean>('auth:isAuthenticated', () => {
    return pb.authStore.isValid
  })

  // Load auth state from cookie when composable is initialized
  onMounted(() => {
    if (process.client) {
      pb.authStore.loadFromCookie(document?.cookie || '')
    }
  })

  function getUserFromModel(): AuthUser | null {
    const model = pb.authStore.model
    if (!model) return null

    return {
      id: model.id,
      email: model.email,
      username: model.username,
      ...model
    }
  }

  // Set up auth store change listener
  pb.authStore.onChange((token, model) => {
    user.value = getUserFromModel()
    isAuthenticated.value = pb.authStore.isValid
    
    // Update cookie when auth state changes
    if (process.client) {
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false, // Set to true in production if using HTTPS
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'lax',
        path: '/'
      })
    }
  }, true) // Trigger immediately

  async function register(credentials: RegisterCredentials): Promise<boolean> {
    try {
      await pb.collection('users').create(credentials)
      return await login({ email: credentials.email, password: credentials.password })
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  async function login(credentials: LoginCredentials): Promise<boolean> {
    try {
      await pb.collection('users').authWithPassword(
        credentials.email,
        credentials.password
      )
      
      if (!pb.authStore.isValid) {
        throw new Error('Authentication failed')
      }
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  async function loginWithOAuth(provider: 'google' | 'github' | 'facebook' | 'discord'): Promise<boolean> {
    try {
      const authData = await pb.collection('users').authWithOAuth2({ provider })
      
      if (!pb.authStore.isValid) {
        throw new Error('OAuth authentication failed')
      }
      
      return true
    } catch (error) {
      console.error('OAuth login error:', error)
      return false
    }
  }

  async function logout(): Promise<boolean> {
    try {
      pb.authStore.clear()
      if (process.client) {
        // Clear the auth cookie
        document.cookie = pb.authStore.exportToCookie({
          expires: new Date(0), // Expire immediately
          path: '/'
        })
      }
      return true
    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    register,
    login,
    loginWithOAuth,
    logout
  }
}