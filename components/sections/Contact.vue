<template>
  <containers-video
    id="contact"
    :video="videoArray[randomIndex]"
    title=""
    :description="description"
    class="w-full min-h-screen"
  >
    <template #video-container-content>
      <Card class="relative w-full py-1 my-8 overflow-hidden">
        <TextSectionTitle
          :title
          :description
          :imgSrc
          :h1="false"
          class="px-6 pt-6 pb-4 md:px-8"
        />
        <CardContent
          class="relative grid grid-cols-1 gap-8 pt-2 lg:grid-cols-2 lg:gap-12"
          :initial="'hidden'"
          :animate="'visible'"
          :variants="containerVariants"
        >
          <motion.div
            :variants="fadeUp"
            class="px-6 py-8 border shadow-lg rounded-xl md:px-8 border-border/40 bg-card/50 backdrop-blur-sm"
          >
            <form
              ref="form"
              :action="formAction"
              method="POST"
              class="space-y-6"
              @submit.prevent="handleSubmit"
            >
              <div class="absolute opacity-0 left-[-9999px]">
                <label for="honeypot">Leave this field empty</label>
                <input
                  id="honeypot"
                  v-model="honeypot"
                  type="text"
                  name="honeypot"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <div class="space-y-2">
                <Label
                  for="email"
                  class="text-sm font-semibold text-foreground"
                  >{{ componentText.email }}</Label
                >
                <div class="relative group">
                  <Mail
                    class="absolute w-5 h-5 transition-colors -translate-y-1/2 left-3 top-1/2 text-muted-foreground group-focus-within:text-primary"
                  />
                  <Input
                    id="email"
                    v-model="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    class="w-full py-3 pl-10 pr-4 transition-all duration-300 border rounded-lg border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50"
                    :class="{
                      'border-destructive focus:ring-destructive/20 focus:border-destructive':
                        emailError,
                    }"
                    required
                    @input="validateEmail"
                  />
                </div>
                <p
                  v-if="emailError"
                  class="flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                >
                  {{ emailError }}
                </p>
              </div>

              <div class="space-y-2">
                <Label
                  for="message"
                  class="text-sm font-semibold text-foreground"
                  >{{ componentText.message }}</Label
                >
                <span class="sr-only">Message Label</span>
                <Textarea
                  id="message"
                  v-model="message"
                  name="message"
                  placeholder="..."
                  class="min-h-[140px] rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none hover:border-primary/50"
                  :class="{
                    'border-destructive focus:ring-destructive/20 focus:border-destructive':
                      messageError,
                  }"
                  required
                  @input="validateMessage"
                />
                <p
                  v-if="messageError"
                  class="flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                >
                  {{ messageError }}
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                class="w-full h-12 text-base font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                :disabled="isSubmitting"
              >
                <span
                  v-if="!isSubmitting"
                  class="flex items-center justify-center gap-2"
                >
                  <Mail class="w-5 h-5" />
                  {{ componentText.submit }}
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg
                    class="w-5 h-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              </Button>
            </form>
          </motion.div>

          <motion.div :variants="fadeUp" class="space-y-8">
            <div
              class="p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40"
            >
              <h3 class="mb-2 text-2xl font-bold">
                {{ componentText.header }}
              </h3>
              <p class="text-sm leading-relaxed text-muted-foreground">
                {{ componentText.subHeader }}
              </p>
            </div>

            <div class="space-y-4">
              <a
                :href="`mailto:${contactEmail}`"
                class="flex items-start gap-1 md:gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
              >
                <div
                  class="flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
                >
                  <Mail class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="mb-1 text-base font-semibold">
                    {{ componentText.email }}
                  </p>
                  <p
                    class="text-xs transition-colors text-muted-foreground group-hover:text-primary"
                  >
                    {{ contactEmail }}
                  </p>
                </div>
              </a>

              <a
                :href="`tel:${contactPhone}`"
                class="flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
              >
                <div
                  class="flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
                >
                  <Phone class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="mb-1 text-base font-semibold">
                    {{ componentText.call }}
                  </p>
                  <p
                    class="text-xs transition-colors text-muted-foreground group-hover:text-primary"
                  >
                    {{ contactPhone }}
                  </p>
                </div>
              </a>
            </div>

            <div
              class="p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40"
            >
              <h3 class="mb-4 text-xl font-bold">{{ componentText.follow }}</h3>
              <ContainersSocials :socialLinks="socialLinks" />
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </template>
  </containers-video>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Linkedin, Github } from "lucide-vue-next";

const props = defineProps({
  title: { type: String, default: "Contact Me" },
  description: { type: String, default: "" },
  formAction: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  contactPhone: { type: String, default: "" },
  videoArray: { type: Array as PropType<string[]>, default: () => [] },
  imgSrc: { type: String, default: "" },
  componentText: {
    type: Object,
    default: () => ({
      header: "Get in Touch",
      subHeader: "Fill out the form or reach out directly.",
      follow: "Follow Us",
      call: "Call Us",
      email: "Email Us",
      message: "Message",
      submit: "Send Message",
    }),
  },
  socialLinks: {
    type: Array,
    default: () => [
      { icon: Linkedin, href: "#" },
      { icon: Github, href: "#" },
    ],
  },
});

const randomIndex = Math.floor(Math.random() * props.videoArray.length);

// Form logic remains the same...
const form = ref<HTMLFormElement | null>(null);
const email = ref("");
const message = ref("");
const honeypot = ref("");
const emailError = ref("");
const messageError = ref("");
const isSubmitting = ref(false);
const formMessage = ref("");
const formMessageClass = ref("");

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.value = !email.value
    ? "Email is required"
    : !emailRegex.test(email.value)
    ? "Invalid email"
    : "";
};

const validateMessage = () => {
  messageError.value = !message.value
    ? "Message is required"
    : message.value.length < 10
    ? "Too short"
    : "";
};

const handleSubmit = async () => {
  if (honeypot.value || !email.value || !message.value) return;
  isSubmitting.value = true;

  try {
    const formData = new FormData(form.value!);
    const response = await fetch(props.formAction, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      formMessage.value = "Sent!";
      email.value = "";
      message.value = "";
    }
  } catch (e) {
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
