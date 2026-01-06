<template>
  <motion.div :variants="fadeUp" initial="hidden" animate="visible">
    <Card>
      <CardContent class="p-6 space-y-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="newsletter-email">{{ emailLabel }}</Label>
            <Input
              id="newsletter-email"
              v-model="form.email"
              type="email"
              placeholder="..."
              required
              class="bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div class="space-y-2">
            <Label for="newsletter-name">{{ nameLabel }}</Label>
            <Input
              id="newsletter-name"
              v-model="form.name"
              type="text"
              placeholder="..."
              class="bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div class="flex items-center">
            <input
              id="newsletter-consent"
              v-model="form.consent"
              type="checkbox"
              required
              class="w-4 h-4 rounded text-primary-600 bg-white/10 border-white/20 focus:ring-primary-500"
            />
            <label for="newsletter-consent" class="ml-2 text-sm">
              {{ privacyLabel }}
              <modal
                title="Privacy Policy"
                description="This Privacy Policy explains how information may be collected, used, and shared."
                :htmlContent="privacyConfig"
              >
                <template #button>
                  <span class="cursor-pointer text-primary hover:underline">
                    {{ privacyButton }}
                  </span>
                </template>
              </modal>
            </label>
          </div>
          <Button
            size="lg"
            class="w-full"
            :disabled="isSubmitting"
            type="submit"
          >
            {{ isSubmitting ? "..." : buttonLabel }}
          </Button>
        </form>

        <div
          v-if="message"
          class="p-4 text-sm rounded-lg"
          :class="{
            'bg-green-900/50 text-green-300': message.type === 'success',
            'bg-red-900/50 text-red-300': message.type === 'error',
          }"
        >
          {{ message.text }}
        </div>

        <div class="border-t border-white/10 pt-4">
          <div class="flex flex-col items-center space-y-2 text-center">
            <div class="flex space-x-2">
              <div class="p-2 rounded-lg bg-primary-600/10">
                <ShieldCheck class="w-5 h-5 text-primary-400" />
              </div>
              <div class="p-2 rounded-lg bg-primary-600/10">
                <Lock class="w-5 h-5 text-primary-400" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock } from "lucide-vue-next";
import usePocketBaseCore from "@/composables/usePocketBaseCore";
import Modal from "@/components/ui/modal/Modal.vue";
import { privacyConfig } from "@/assets/configs/privacy.js";

const props = defineProps<{
  emailLabel: {
    type: String;
    default: string;
  };
  nameLabel: {
    type: String;
    default: string;
  };
  privacyLabel: {
    type: String;
    default: string;
  };
  privacyButton: {
    type: String;
    default: string;
  };
  buttonLabel: {
    type: String;
    default: string;
  };
}>();

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Form state
const form = ref({
  email: "",
  name: "",
  consent: false,
});

const isSubmitting = ref(false);
const message = ref<{ type: "success" | "error"; text: string } | null>(null);

const { createItem } = usePocketBaseCore();

// Form submission handler
const handleSubmit = async () => {
  // Validation
  if (!form.value.consent) {
    message.value = {
      type: "error",
      text: "Please agree to the privacy policy",
    };
    return;
  }

  isSubmitting.value = true;
  message.value = null;

  try {
    // Create record in newsletterSubs collection using the core composable
    await createItem("newsletterSubs", {
      email: form.value.email,
      name: form.value.name,
      consent_given: true,
      subscribed_at: new Date().toISOString(),
    });

    // Success response
    message.value = {
      type: "success",
      text: "Thank you for subscribing!",
    };

    form.value = {
      email: "",
      name: "",
      consent: false,
    };
  } catch (error) {
    console.error("Subscription process failed:", error);
    message.value = {
      type: "error",
      text: "Subscription failed. You may already be subscribed or the server is unavailable.",
    };
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Custom scrollbar for form elements */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
