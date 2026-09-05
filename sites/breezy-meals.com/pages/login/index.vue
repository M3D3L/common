<template>
  <section class="w-full max-w-sm" aria-labelledby="login-title">
    <div class="mb-7 text-center">
      <p class="mb-2 text-sm font-bold uppercase text-primary">
        Acceso de equipo
      </p>
      <h1 id="login-title" class="text-3xl font-bold sm:text-4xl">
        Inicia sesión
      </h1>
      <p class="mt-2 text-sm text-muted-foreground">
        Administra pedidos, menús y operaciones de Breezy.
      </p>
    </div>

    <form
      class="rounded-lg border border-border/80 bg-card p-6 shadow-xl shadow-foreground/5 sm:p-7"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div
        v-if="errorMessage"
        ref="errorAlert"
        id="login-error"
        role="alert"
        aria-live="assertive"
        tabindex="-1"
        class="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
      >
        {{ errorMessage }}
      </div>

      <div class="space-y-2">
        <label for="email" class="block text-sm font-semibold">Correo</label>
        <div class="relative">
          <Mail
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="email"
            v-model="email"
            type="email"
            inputmode="email"
            autocomplete="username"
            autocapitalize="none"
            spellcheck="false"
            :aria-describedby="errorMessage ? 'login-error' : undefined"
            :aria-invalid="!!errorMessage"
            required
            class="h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="tu@correo.com"
          />
        </div>
      </div>

      <div class="mt-5 space-y-2">
        <label for="password" class="block text-sm font-semibold"
          >Contraseña</label
        >
        <div class="relative">
          <LockKeyhole
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :aria-describedby="errorMessage ? 'login-error' : undefined"
            :aria-invalid="!!errorMessage"
            required
            class="h-12 w-full rounded-md border border-input bg-background pl-10 pr-12 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Tu contraseña"
          />
          <button
            type="button"
            class="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            :aria-label="
              showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
            "
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" class="h-4 w-4" aria-hidden="true" />
            <Eye v-else class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isSubmitting"
      >
        <LoaderCircle
          v-if="isSubmitting"
          class="h-5 w-5 animate-spin"
          aria-hidden="true"
        />
        {{ isSubmitting ? "Ingresando..." : "Ingresar" }}
      </button>
    </form>

    <NuxtLink
      to="/menu"
      class="mx-auto mt-6 flex w-fit items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <ArrowLeft class="h-4 w-4" aria-hidden="true" />
      Volver al menú
    </NuxtLink>
  </section>
</template>

<script lang="ts" setup>
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-vue-next";

definePageMeta({ layout: "login" });

useHead({
  title: "Iniciar sesión - Breezy Meals",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const auth = useAuth();
const route = useRoute();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const errorAlert = ref<HTMLElement | null>(null);

watch([email, password], () => {
  errorMessage.value = "";
});

const showError = async (message: string) => {
  errorMessage.value = message;
  await nextTick();
  errorAlert.value?.focus();
};

const redirectPath = computed(() => {
  const source =
    typeof route.query.source === "string" ? route.query.source : "";
  return source.startsWith("/") && !source.startsWith("//")
    ? source
    : "/inicio";
});

const handleSubmit = async () => {
  errorMessage.value = "";

  if (!email.value.trim() || !password.value) {
    await showError("Ingresa tu correo y contraseña.");
    return;
  }

  isSubmitting.value = true;

  try {
    const result = await auth.login({
      email: email.value.trim(),
      password: password.value,
    });

    if (!result.success) {
      await showError("El correo o la contraseña no son correctos.");
      return;
    }

    await navigateTo(redirectPath.value, { replace: true });
  } catch {
    await showError("No se pudo iniciar sesión. Intenta de nuevo.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
