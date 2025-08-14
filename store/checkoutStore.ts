function getItemKey(item) {
  return item.id ? item.id : `${item.nameEn}-${item.price}`;
}

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    items: [],
    phone: null
  }),

  getters: {
    total: (state) => {
      return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    itemCount: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    }
  },

  actions: {
    addItem(item) {
      const key = getItemKey(item);
      const existing = this.items.find(i => i.key === key);

      if (existing) {
        existing.quantity++;
      } else {
        // Create a new, streamlined item object for the store
        const newItem = {
          key: key,
          id: item.id,
          nameEn: item.nameEn,
          nameEs: item.nameEs,
          price: item.price,
          image: item.image,
          quantity: 1,
        };
        this.items.push(newItem);
      }
    },

    removeItem(item) {
      const key = getItemKey(item);
      const existing = this.items.find(i => i.key === key);
      if (existing) {
        existing.quantity--;
        if (existing.quantity <= 0) {
          this.items = this.items.filter(i => i.key !== key);
        }
      }
    },

    setItemQuantity(item, quantity) {
      const key = getItemKey(item);
      const existing = this.items.find(i => i.key === key);
      if (!existing) return;
      existing.quantity = quantity;
      if (existing.quantity <= 0) {
        this.items = this.items.filter(i => i.key !== key);
      }
    },

    clearCart() {
      this.items = [];
    }
  },
});