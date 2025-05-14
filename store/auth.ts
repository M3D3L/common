import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    setToken(token: string) {
      this.token = token;
    },
    clear() {
      this.user = null;
      this.token = null;
    }
  },
  persist: true 
});