<script lang="ts" setup>
import TitleBlock from "@common/components/TitleBlock.vue";
import { Button } from "@common/components/ui/button";
import { Card, CardContent, CardTitle } from "@common/components/ui/card";
import { createSeoObject } from "@common/composables/useSeo";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import userData from "../../../data/user-data.json";

const route = useRoute();
const { fetchCollection, createItem } = usePocketBaseCore();

/** * 1. FIX: Move route parsing logic out of onMounted.
 * This ensures 'userType' is populated during SSR.
 */
const typeParam = Array.isArray(route.params?.type)
  ? route.params.type[0]
  : route.params?.type;

const formattedUrl =
  typeParam
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase()) || "";

const userType = ref(formattedUrl);

// State for posts
const posts = ref<any>(null);

// current user type object
const currentType = computed(() => {
  return (
    userData.find(
      (x) => x?.type?.toUpperCase() === userType.value.toUpperCase()
    ) || null
  );
});

// questions for this type
const currentQuestions = computed(() => currentType.value?.questions || []);

// answers array
const formAnswers = ref<any[]>([]);

// Data fetching
const { data: fetchedPosts, error } = await useAsyncData("posts", () =>
  fetchCollection("relocateBlog", 1, 3, "", "-created")
);

if (fetchedPosts.value) {
  posts.value = fetchedPosts.value;
}

/**
 * 2. FIX: SEO Meta
 * We pass a getter function to useSeoMeta so it stays reactive
 * and uses the correct data during SSR.
 */
const seoData = computed(() => {
  const pageTitle = currentType.value?.type || "Relocate To San Carlos";
  const pageDescription =
    currentType.value?.description || "Expert relocation advice.";

  return createSeoObject({
    title: pageTitle,
    summary: pageDescription,
    imageUri: "",
    pubDate: new Date().toISOString(),
    byline: "RelocateToSanCarlos",
    siteName: "relocatetosancarlos.com",
    jsonLd: {
      "@type": "WebSite",
      url: "https://relocatetosancarlos.com",
      name: pageTitle,
      description: pageDescription,
    },
  });
});

// Apply SEO (Nuxt handles the reactive computed here)
useSeoMeta({
  title: () => seoData.value.title,
  description: () => seoData.value.description,
  ogTitle: () => seoData.value.title,
  ogDescription: () => seoData.value.description,
  // Add other properties from your seoData object as needed
});

// re-init answers when questions change
watch(
  currentQuestions,
  (newQs) => {
    formAnswers.value = newQs.map((q) => {
      if (q.questionType === "slider" || q.questionType === "number") return 0;
      return "";
    });
  },
  { immediate: true }
);

const sendMessage = (email: string, message: string) => {
  createItem("inbox", {
    email: email || "default@example.com",
    message,
  });
};

const handleSubmit = () => {
  // ... (Your existing handleSubmit logic is fine)
  const hasInvalidEmail = currentQuestions.value.some(
    (q, i) =>
      q.questionType === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formAnswers.value[i])
  );

  if (hasInvalidEmail) {
    alert("Please fix invalid email addresses before submitting.");
    return;
  }

  try {
    const message = currentQuestions.value
      .map((q, i) => `${q.question}: ${formAnswers.value[i]}`)
      .join("\n");

    const submittedEmailIndex = currentQuestions.value.findIndex(
      (q) => q.questionType === "email"
    );
    const submittedEmail =
      submittedEmailIndex >= 0
        ? formAnswers.value[submittedEmailIndex]
        : "onboardingQuestions@relocatetosancarlos.com";

    sendMessage(submittedEmail, message);
    alert("Your responses have been submitted successfully!");

    const router = useRouter();
    router.push("/");
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
</script>

<template>
  <div
    v-if="currentType?.type"
    class="container relative content-center min-h-screen pt-10 pb-32"
  >
    <TitleBlock
      class="mb-8"
      :title="currentType.type"
      :description="currentType.description"
      type="h1"
    />

    <div class="relative flex flex-col gap-6 lg:flex-row">
      <form
        class="w-full lg:w-1/2"
        v-if="currentQuestions.length"
        @submit.prevent="handleSubmit"
      >
        <Card class="flex flex-col gap-4 p-8">
          <div v-for="(q, index) in currentQuestions" :key="index">
            <CardTitle class="mb-4 text-lg font-semibold">
              {{ q.question }}
            </CardTitle>
            <CardContent>
              <InputsDynamicInput v-model="formAnswers[index]" :q="q" />
            </CardContent>
          </div>
        </Card>

        <div class="flex w-full mt-8">
          <Button
            class="w-full text-lg font-bold"
            variant="outline"
            size="lg"
            type="submit"
            :disabled="
              !formAnswers.every(
                (a) => a !== undefined && a !== '' && a !== null
              )
            "
          >
            Submit
          </Button>
        </div>
      </form>

      <div class="sticky grid w-full h-full gap-3 top-32 lg:w-1/2">
        <h2 class="">Related Posts</h2>
        <template v-for="(post, index) in posts?.items" :key="post.id">
          <CardsBlogHorizontal v-bind="post" :index="index" />
        </template>
        <div class="w-full flex justify-end">
          <nuxt-link
            to="/blog"
            class="font-bold w-full transition-all hover:opacity-90 text-primary hover:underline pb-2"
          >
            View All Posts
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container pt-20 text-center">
    <p>Loading or Category not found...</p>
  </div>
</template>
