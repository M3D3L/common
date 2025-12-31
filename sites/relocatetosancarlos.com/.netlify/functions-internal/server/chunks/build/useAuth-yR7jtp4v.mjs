import { j as usePocketBase, k as useState } from './server.mjs';

function useAuth() {
  const pb = usePocketBase();
  const user = useState("auth:user", () => {
    return pb.authStore.model ? getUserFromModel() : null;
  });
  const isAuthenticated = useState("auth:isAuthenticated", () => {
    return pb.authStore.isValid;
  });
  function getUserFromModel() {
    const model = pb.authStore.model;
    if (!model) return null;
    return { ...model };
  }
  pb.authStore.onChange((token, model) => {
    user.value = getUserFromModel();
    isAuthenticated.value = pb.authStore.isValid;
  }, true);
  async function register(credentials) {
    var _a, _b;
    if (credentials.password !== credentials.passwordConfirm) {
      return {
        success: false,
        message: "Passwords do not match"
      };
    }
    try {
      await pb.collection("users").create(credentials);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      let message = "Registration failed";
      if ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.data) {
        const firstError = Object.values(error.data.data)[0];
        if (Array.isArray(firstError)) {
          message = ((_b = firstError[0]) == null ? void 0 : _b.message) || firstError[0] || message;
        } else if (typeof firstError === "object" && firstError.message) {
          message = firstError.message;
        } else if (typeof firstError === "string") {
          message = firstError;
        }
      } else if (error == null ? void 0 : error.message) {
        message = error.message;
      }
      return {
        success: false,
        message
      };
    }
  }
  async function login(credentials) {
    try {
      const identity = credentials.email.trim();
      const password = credentials.password;
      await pb.collection("users").authWithPassword(identity, password);
      if (!pb.authStore.isValid) {
        return {
          success: false,
          message: "Authentication failed"
        };
      }
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      let message = "Login failed";
      if ((error == null ? void 0 : error.status) === 400) {
        message = "Invalid email or password";
      } else if ((error == null ? void 0 : error.status) === 401) {
        message = "Invalid credentials";
      } else if ((error == null ? void 0 : error.status) === 403) {
        message = "Account is not verified or disabled";
      } else if (error == null ? void 0 : error.message) {
        message = error.message;
      }
      return {
        success: false,
        message
      };
    }
  }
  async function loginWithOAuth(provider) {
    try {
      await pb.collection("users").authWithOAuth2({ provider });
      if (!pb.authStore.isValid) {
        return {
          success: false,
          message: "OAuth authentication failed"
        };
      }
      return { success: true };
    } catch (error) {
      console.error("OAuth login error:", error);
      return {
        success: false,
        message: (error == null ? void 0 : error.message) || "OAuth login failed"
      };
    }
  }
  async function logout() {
    try {
      pb.authStore.clear();
      if (false) ;
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: (error == null ? void 0 : error.message) || "Logout failed"
      };
    }
  }
  return {
    user,
    isAuthenticated,
    register,
    login,
    loginWithOAuth,
    logout
  };
}

export { useAuth as u };
//# sourceMappingURL=useAuth-yR7jtp4v.mjs.map
