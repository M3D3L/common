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

interface AuthResult {
  success: boolean
  message?: string
}

export default () => {
  const pb = usePocketBase()
  const router = useRouter()
  const route = useRoute()

  // Utility to transform PB model into AuthUser
  const getUserFromModel = (): AuthUser | null => {
    const model = pb.authStore.model
    if (!model) return null

    return {
      id: model.id,
      email: model.email,
      username: model.username,
      ...model
    }
  }

  // Reactive auth state
  const user = useState<AuthUser | null>('auth:user', () =>
    pb.authStore.model ? getUserFromModel() : null
  )

  const isAuthenticated = useState<boolean>('auth:isAuthenticated', () =>
    pb.authStore.isValid
  )

  // Load auth state from cookie on client
  onMounted(() => {
    if (process.client) {
      pb.authStore.loadFromCookie(document?.cookie || '')
    }
  })

  // Listen for auth store changes
  pb.authStore.onChange(() => {
    user.value = getUserFromModel()
    isAuthenticated.value = pb.authStore.isValid

    if (process.client) {
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      })
    }
  }, true)

  // Register new user
  const register = async (credentials: RegisterCredentials): Promise<AuthResult> => {
    if (credentials.password !== credentials.passwordConfirm) {
      return { success: false, message: 'Passwords do not match' }
    }

    try {
      await pb.collection('users').create(credentials)
      const loginResult = await login({
        email: credentials.email,
        password: credentials.password
      })
      return loginResult.success
        ? { success: true }
        : { success: false, message: 'Login after registration failed' }
    } catch (error: any) {
      console.error('Registration error:', error)
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  // Login with email/password
  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      await pb.collection('users').authWithPassword(credentials.email, credentials.password)

      if (!pb.authStore.isValid) {
        throw new Error('Authentication failed')
      }

      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  // Login with OAuth provider
  const loginWithOAuth = async (
    provider: 'google' | 'github' | 'facebook' | 'discord'
  ): Promise<AuthResult> => {
    try {
      await pb.collection('users').authWithOAuth2({ provider })

      if (!pb.authStore.isValid) {
        throw new Error('OAuth authentication failed')
      }

      return { success: true }
    } catch (error: any) {
      console.error('OAuth login error:', error)
      return { success: false, message: error.message || 'OAuth login failed' }
    }
  }

  // Logout user
  const logout = async (redirectPath?: string): Promise<AuthResult> => {
    try {
      pb.authStore.clear()

      if (process.client) {
        document.cookie = pb.authStore.exportToCookie({
          expires: new Date(0),
          path: '/'
        })
      }

      if (redirectPath) {
        await router.push(redirectPath)
      }

      return { success: true }
    } catch (error: any) {
      console.error('Logout error:', error)
      return { success: false, message: error.message || 'Logout failed' }
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
