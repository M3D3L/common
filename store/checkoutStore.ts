import { defineStore } from 'pinia';

const getItemKey = (item: { id?: string; nameEn?: string; price?: number }) =>
  item.id ?? `${item.nameEn}-${item.price}`;

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    items: [] as {
      key: string;
      id?: string;
      nameEn?: string;
      nameEs?: string;
      price: number;
      image?: string;
      quantity: number;
    }[],
    phone: null as string | null,
  }),
  getters: {
    total: (state) =>
      state.items.reduce((sum, { price, quantity }) => sum + price * quantity, 0),
    itemCount: (state) =>
      state.items.reduce((sum, { quantity }) => sum + quantity, 0),
  },
  actions: {
    addItem(item: any) {
      const key = getItemKey(item);
      const existing = this.items.find((i) => i.key === key);

      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({
          key,
          id: item.id,
          nameEn: item.nameEn,
          nameEs: item.nameEs,
          price: item.price,
          image: item.image,
          quantity: 1,
        });
      }
    },

    removeItem(item: any) {
      const key = getItemKey(item);
      const existing = this.items.find((i) => i.key === key);
      if (!existing) return;

      existing.quantity--;
      if (existing.quantity <= 0) {
        this.items = this.items.filter((i) => i.key !== key);
      }
    },

    setItemQuantity(item: any, quantity: number) {
      const key = getItemKey(item);
      const existing = this.items.find((i) => i.key === key);
      if (!existing) return;

      existing.quantity = quantity;
      if (existing.quantity <= 0) {
        this.items = this.items.filter((i) => i.key !== key);
      }
    },

    clearCart() {
      this.items = [];
    },
  },
});
