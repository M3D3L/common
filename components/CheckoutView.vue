<template>
  <section class="container max-w-xl p-4 mx-auto my-8 md:my-12">
    <Card class="w-full p-6 overflow-y-auto shadow-lg bg-background/95 shadow-accent">
      <header>
        <CardHeader>
          <CardTitle class="text-3xl font-bold text-center">Your Cart</CardTitle>
        </CardHeader>
      </header>

      <div v-if="items.length === 0" class="py-10 text-center text-muted-foreground">
        <p class="text-xl">Your cart is empty.</p>
        <p class="mt-2 text-md">Start adding some delicious items!</p>
      </div>

      <div v-else>
        <div class="space-y-6 max-h-[300px] pr-2" role="list" aria-label="Shopping Cart Items">
          <div v-for="(item, index) in items" :key="item.key"
            class="flex flex-col items-center p-4 border rounded-lg md:flex-row md:justify-between border-border"
            role="listitem">
            <div class="flex items-center w-full gap-4 mb-4 md:w-auto md:mb-0">
              <img :src="item.image || placeholderImage" alt="Image of {{ item.nameEn }}"
                class="flex-shrink-0 object-cover w-20 h-20 rounded-md" @error="handleImageError" loading="lazy"
                aria-label="Product Image" />
              <div class="flex-grow">
                <p class="text-lg font-semibold text-foreground">{{ item.nameEn }}</p>
                <p class="text-sm text-muted-foreground">{{ item.nameEs }}</p>
                <p class="mt-1 text-base font-medium text-primary">{{ formatPrice(item.price) }}</p>
              </div>
            </div>

            <div class="flex flex-col items-end w-full gap-2 md:w-auto md:items-start">
              <Checkout :index="index" :item="item" />

              <div class="min-w-[80px] text-right" aria-label="Total price for item">
                <p class="text-lg font-bold text-foreground">
                  {{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <iframe v-if="lat && long" class="w-full h-48 mt-6 border rounded-lg md:h-64" width="100%" height="300"
          frameborder="0" scrolling="no" marginheight="0" marginwidth="0" :src="mapUrl?.[1]" allowfullscreen></iframe>

        <div class="flex items-center justify-end pt-4 mt-8 border-t-2 border-border" aria-live="polite">
          <p class="text-2xl font-bold text-foreground">Total: {{ formatPrice(total) }}</p>
        </div>

        <div class="flex flex-col items-center gap-3 mt-6 md:flex-row md:justify-between">

          <Button @click="locate">
            Send Location
          </Button>

          <Button :disabled="items.length === 0 || !whatsappNumber || isSending"
            class="w-full mx-auto text-lg font-bold bg-green-500 md:w-auto" size="lg" @click="sendOrderToWhatsapp"
            :aria-busy="isSending.toString()" aria-live="assertive"
            aria-label="Proceed to checkout and send order via WhatsApp">
            <template v-if="isSending">
              Sending...
            </template>
            <template v-else>
              Proceed to Checkout
            </template>
          </Button>
        </div>
      </div>
    </Card>
  </section>
</template>

<script setup>
import { useCheckoutStore } from '@/store/checkoutStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const config = useRuntimeConfig();

const lat = ref(null)
const long = ref(null)
const zoom = 20
const whatsappNumber = ref(config.public.whatsappNumber || '6444444444');
const checkoutStore = useCheckoutStore();

const mapUrl = computed(() => {
  if (lat.value && long.value) {
    const baseMapUrl = `https://maps.google.com/maps?q=${lat.value},${long.value}`
    const embeddedExtention = `&z=${zoom}&t=k&output=embed`;
    return [baseMapUrl, baseMapUrl + embeddedExtention]
  }
  return '';
});
const items = computed(() => checkoutStore.items);
const total = computed(() =>
  items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
);

const isSending = ref(false);
const customerNote = ref('');

const placeholderImage = 'https://placehold.co/80x80/E0E0E0/333333?text=No+Image';

const locate = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      lat.value = latitude;
      long.value = longitude;
    }, (error) => {
      console.error('Error getting location:', error);
      alert('Unable to retrieve your location. Please enable location services.');
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
};


function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function handleImageError(event) {
  event.target.src = placeholderImage;
  event.target.onerror = null;
}

function getWhatsappUrl(message) {
  // Detect if user is on mobile for better WhatsApp URL
  const isMobile = /iPhone|Android/i.test(navigator.userAgent);
  const baseUrl = isMobile ? 'https://wa.me/' : 'https://api.whatsapp.com/send?phone=';
  return `${baseUrl}${whatsappNumber.value}?text=${encodeURIComponent(message)}`;
}

async function sendOrderToWhatsapp() {
  if (!whatsappNumber.value || items.value.length === 0) return;

  isSending.value = true;

  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  let message = '🛍️ *New Order Details* 🛍️\n';
  if (mapUrl.value?.[0]) {
    message += `📍 *Location:* ${mapUrl.value?.[0]}\n`;
  }
  message += `_Order Placed: ${timestamp}_\n`;
  message += `------------------------------------\n\n`;
  message += '📋 *Items Ordered*\n';

  items.value.forEach((item) => {
    message += `  - ${item.nameEn} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}\n`;
  });

  message += `\n------------------------------------\n`;
  message += `💰 *Order Summary*\n`;
  message += `  - *Subtotal:* ${formatPrice(total.value)}\n`;
  message += `  - *Tax/Fees:* $0.00\n`;
  message += `  - *Total:* *${formatPrice(total.value)}*\n\n`;

  if (customerNote.value.trim()) {
    message += `📝 *Note:* ${customerNote.value.trim()}\n\n`;
  }

  message += `------------------------------------\n`;
  message += '🙏 Thank you for your order! We will process it shortly.\n';
  message += `------------------------------------\n`;

  try {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.value}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  } catch (error) {
    alert('Oops! Something went wrong while opening WhatsApp. Please try again.');
  } finally {
    isSending.value = false;
  }
}
</script>