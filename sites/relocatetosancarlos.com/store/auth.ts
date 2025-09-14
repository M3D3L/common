import { defineStore } from 'pinia';
interface User {
  id: string;
  name?: string;
  email?: string;
  [key: string]: any; // optional extra fields
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  actions: {
    setUser(user: User) {
      // Spread to ensure it's a plain object
      this.user = { ...user };
    },
    setToken(token: string) {
      this.token = token;
    },
    clear() {
      this.user = null;
      this.token = null;
    },
  },
  persist: true,
});