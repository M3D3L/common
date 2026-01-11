import { defineStore } from "pinia";

export interface DebugQueryEntry {
  query: string;
  result: unknown;
}

export const useDebugStore = defineStore("debug", {
  state: () => ({
    queries: [] as DebugQueryEntry[],
  }),

  actions: {
    addQuery(query: string, result: unknown) {
      this.queries.push({ query, result });
    },

    removeQueryAt(index: number) {
      if (index >= 0 && index < this.queries.length) {
        this.queries.splice(index, 1);
      }
    },

    clearQueries() {
      this.queries = [];
    },
  },

  persist: true,
});
