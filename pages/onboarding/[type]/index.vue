<template>
  <div :class="currentType?.color" class="container relative content-center min-h-screen py-10">
    <TitleBlock class="mb-6" :title="currentType.type" :description="currentType.description" />
    
    <form v-if="currentQuestions.length" @submit.prevent="handleSubmit">
      <Card class="grid gap-4 p-8 md:grid-cols-2">
        <div v-for="(q, index) in currentQuestions" :key="index">
          <CardTitle class="mb-4 text-lg font-semibold">
            {{ q.question }}
          </CardTitle>
          <CardContent>
            <div v-if="q.type === 'radio'" class="space-y-2">
              <div
                v-for="opt in q.options"
                :key="opt.value"
                class="flex items-center space-x-2"
              >
                <input
                  type="radio"
                  :name="'q-' + index"
                  :value="opt.value"
                  v-model="formAnswers[index]"
                  class="accent-primary"
                />
                <label class="text-sm">{{ opt.label }}</label>
              </div>
            </div>

            <div v-else-if="q.type === 'checkbox'" class="space-y-2">
              <div
                v-for="opt in q.options"
                :key="opt.value"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="opt.value"
                  v-model="formAnswers[index]"
                  class="accent-primary"
                />
                <label class="text-sm">{{ opt.label }}</label>
              </div>
            </div>

            <div v-else-if="q.type === 'text'">
              <input
                type="text"
                v-model="formAnswers[index]"
                :placeholder="q.placeholder"
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div v-else-if="q.type === 'slider'" class="space-y-2">
              <div class="mb-1 text-sm">Selected: {{ formAnswers[index] }}</div>
              <input
                type="range"
                :min="q.min"
                :max="q.max"
                v-model.number="formAnswers[index]"
                class="w-full accent-primary"
              />
            </div>

            <div v-else-if="q.type === 'number'">
              <input
                type="number"
                v-model.number="formAnswers[index]"
                :min="q.min"
                :max="q.max"
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
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
              (answer) =>
                answer !== undefined && answer !== '' && answer !== null
            )
          "
        >
          Submit
        </Button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import TitleBlock from "~/components/TitleBlock.vue";
import { onboardingQuestions } from "~/assets/configs/onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const route = useRoute();
const userType = ref("");
const description = ref(
  "Share your interests and preferences to help us tailor your experience."
);

const currentType = computed(() => {
  return (
    onboardingQuestions.find(
      (x) => x.type.toUpperCase() === userType.value.toUpperCase()
    )|| []
  );
})

// Get current questions based on user type
const currentQuestions = computed(() => {
  return currentType.value?.questions || [];
});

// Store answers in a parallel array
const formAnswers = ref<any[]>([]);

// Initialize formAnswers whenever questions change
watch(
  currentQuestions,
  (newQs) => {
    formAnswers.value = newQs.map((q) => {
      if (q.type === "checkbox") return [];
      if (q.type === "slider" || q.type === "number") return q.min || 0;
      return "";
    });
  },
  { immediate: true }
);

const handleSubmit = async () => {
  console.log("Collected Answers:", formAnswers.value);

  try {
    
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

// Format route param and set title/description
onMounted(() => {
  const formattedUrl = route.params.type
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  userType.value = formattedUrl;
});
</script>
