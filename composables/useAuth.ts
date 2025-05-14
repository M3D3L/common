import usePocketBase from './usePocketbase';
import { useToast } from 'vue-toastification';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  passwordConfirm: string;
  username?: string;
  [key: string]: any; // Allow additional fields
}

interface AuthUser {
  id: string;
  email: string;
  username?: string;
  [key: string]: any; // Flexible for additional user fields
}

export default function useAuth() {
  const pb = usePocketBase();
  const router = useRouter();
  const toast = useToast();

  // Reactive state for the current user with generic type
  const user = useState<AuthUser | null>('user', () => {
    const model = pb.authStore.model;
    return model ? {
      id: model.id,
      email: model.email,
      username: model.username,
      ...model
    } : null;
  });

  /**
   * Register a new user
   */
  async function register(credentials: RegisterCredentials): Promise<boolean> {
    try {
      // Create the user record
      await pb.collection('users').create(credentials);
      
      // Automatically log in after registration
      await login({
        email: credentials.email,
        password: credentials.password
      });
      
      toast.success('Registration successful!');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return false;
    }
  }

  /**
   * Log in a user
   */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const { record } = await pb.collection('users').authWithPassword(
        credentials.email,
        credentials.password
      );
      
      user.value = {
        id: record.id,
        email: record.email,
        username: record.username,
        ...record
      };
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return false;
    }
  }

  /**
   * Log in with OAuth provider
   */
  async function loginWithOAuth(provider: 'google' | 'github' | 'facebook' | 'discord') {
    try {
      const authData = await pb.collection('users').authWithOAuth2({ provider });
      user.value = {
        id: authData.record.id,
        email: authData.record.email,
        username: authData.record.username,
        ...authData.record
      };
      toast.success(`Logged in with ${provider}`);
      return true;
    } catch (error: any) {
      console.error('OAuth error:', error);
      toast.error(`Failed to login with ${provider}`);
      return false;
    }
  }

  /**
   * Log out the current user
   */
  function logout(): void {
    pb.authStore.clear();
    user.value = null;
    toast.success('Logged out successfully');
    router.push('/login');
  }

  /**
   * Send password reset email
   */
  async function requestPasswordReset(email: string): Promise<boolean> {
    try {
      await pb.collection('users').requestPasswordReset(email);
      toast.success('Password reset email sent');
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset email');
      return false;
    }
  }

  /**
   * Confirm password reset
   */
  async function confirmPasswordReset(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> {
    try {
      await pb.collection('users').confirmPasswordReset(
        token,
        newPassword,
        confirmPassword
      );
      toast.success('Password reset successful');
      return true;
    } catch (error: any) {
      console.error('Password reset confirmation error:', error);
      toast.error(error.message || 'Failed to reset password');
      return false;
    }
  }

  /**
   * Verify user email
   */
  async function verifyEmail(token: string): Promise<boolean> {
    try {
      await pb.collection('users').confirmVerification(token);
      toast.success('Email verified successfully');
      return true;
    } catch (error: any) {
      console.error('Email verification error:', error);
      toast.error(error.message || 'Failed to verify email');
      return false;
    }
  }

  /**
   * Request email verification
   */
  async function requestEmailVerification(email: string): Promise<boolean> {
    try {
      await pb.collection('users').requestVerification(email);
      toast.success('Verification email sent');
      return true;
    } catch (error: any) {
      console.error('Verification request error:', error);
      toast.error(error.message || 'Failed to send verification email');
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => pb.authStore.isValid);

  /**
   * Refresh auth state (useful when returning to the app)
   */
  function refreshAuthState(): void {
    const model = pb.authStore.model;
    user.value = model ? {
      id: model.id,
      email: model.email,
      username: model.username,
      ...model
    } : null;
  }

  // Listen to auth store changes
  pb.authStore.onChange(() => {
    refreshAuthState();
  }, true);

  return {
    // State
    user,
    isAuthenticated,

    // Actions
    register,
    login,
    loginWithOAuth,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
    verifyEmail,
    requestEmailVerification,
    refreshAuthState,
  };
}