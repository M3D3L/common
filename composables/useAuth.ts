import usePocketBase from "./usePocketbase";
import { onMounted } from "vue";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  passwordConfirm: string;
  username?: string;
  [key: string]: any;
}

interface AuthUser {
  id: string;
  email: string;
  username?: string;
  [key: string]: any;
}

interface AuthResult {
  success: boolean;
  message?: string;
}

export default function useAuth() {
  const pb = usePocketBase();
  const config = useRuntimeConfig();

  // Initialize state with stored user if available
  const user = useState<AuthUser | null>("auth:user", () => {
    return pb.authStore.model ? getUserFromModel() : null;
  });

  const isAuthenticated = useState<boolean>("auth:isAuthenticated", () => {
    return pb.authStore.isValid;
  });

  // Load auth state from cookie when composable is initialized
  onMounted(() => {
    pb.authStore.loadFromCookie(document?.cookie || "");
  });

  function getUserFromModel(): AuthUser | null {
    const model = pb.authStore.model;
    if (!model) return null;

    return { ...(model as any) } as AuthUser;
  }

  // Set up auth store change listener
  pb.authStore.onChange((token, model) => {
    user.value = getUserFromModel();
    isAuthenticated.value = pb.authStore.isValid;

    // Update cookie when auth state changes (client-side only)
    if (import.meta.client) {
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        sameSite: "lax",
        secure: config.public.nodeEnv === "production",
        path: "/",
      });
    }
  }, true);

  async function register(
    credentials: RegisterCredentials
  ): Promise<AuthResult> {
    // Validate passwords match
    if (credentials.password !== credentials.passwordConfirm) {
      return {
        success: false,
        message: "Passwords do not match",
      };
    }

    try {
      // Create the user
      await pb.collection("users").create(credentials);

      // Return success without auto-login
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);

      // Extract PocketBase error message
      let message = "Registration failed";

      if (error?.data?.data) {
        const firstError = Object.values(error.data.data)[0];
        if (Array.isArray(firstError)) {
          message = firstError[0]?.message || firstError[0] || message;
        } else if (typeof firstError === "object" && firstError.message) {
          message = firstError.message;
        } else if (typeof firstError === "string") {
          message = firstError;
        }
      } else if (error?.message) {
        message = error.message;
      }

      return {
        success: false,
        message,
      };
    }
  }

  async function login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Trim email and authenticate
      const identity = credentials.email.trim();
      const password = credentials.password;

      await pb.collection("users").authWithPassword(identity, password);

      // Verify authentication was successful
      if (!pb.authStore.isValid) {
        return {
          success: false,
          message: "Authentication failed",
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error codes
      let message = "Login failed";

      if (error?.status === 400) {
        message = "Invalid email or password";
      } else if (error?.status === 401) {
        message = "Invalid credentials";
      } else if (error?.status === 403) {
        message = "Account is not verified or disabled";
      } else if (error?.message) {
        message = error.message;
      }

      return {
        success: false,
        message,
      };
    }
  }

  async function loginWithOAuth(
    provider: "google" | "github" | "facebook" | "discord"
  ): Promise<AuthResult> {
    try {
      await pb.collection("users").authWithOAuth2({ provider });

      if (!pb.authStore.isValid) {
        return {
          success: false,
          message: "OAuth authentication failed",
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error("OAuth login error:", error);
      return {
        success: false,
        message: error?.message || "OAuth login failed",
      };
    }
  }

  async function logout(): Promise<AuthResult> {
    try {
      pb.authStore.clear();

      if (import.meta.client) {
        // Clear the auth cookie
        document.cookie = pb.authStore.exportToCookie({
          expires: new Date(0), // Expire immediately
          path: "/",
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: error?.message || "Logout failed",
      };
    }
  }

  return {
    user,
    isAuthenticated,
    register,
    login,
    loginWithOAuth,
    logout,
  };
}
