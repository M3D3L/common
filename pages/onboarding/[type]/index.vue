<template>
  <div class="container relative content-center min-h-screen py-10">
    <TitleBlock
      class="mb-6"
      title="Tell Us About Yourself"
      description="Share your interests and preferences to help us tailor your experience."
    />
    <form
      v-if="currentQuestions"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div v-for="(q, index) in currentQuestions" :key="index">
        <Card class="p-6">
          <CardTitle class="mb-4 text-lg font-semibold">{{
            q.question
          }}</CardTitle>
          <CardContent>
            <!-- Radio -->
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

            <!-- Checkbox -->
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

            <!-- Text Input -->
            <div v-else-if="q.type === 'text'">
              <input
                type="text"
                v-model="formAnswers[index]"
                :placeholder="q.placeholder"
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="flex w-full">
        <Button
          class="w-full text-lg font-bold"
          variant="outline"
          size="lg"
          type="submit"
          :disabled="
            !formAnswers.every(
              (answer) => answer !== undefined && answer !== ''
            )
          "
          @click="handleSubmit"
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

onMounted(() => {
  // separate - and capitalize
  const formattedUrl = route.params.type
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  userType.value = formattedUrl;
});

// pull out the right set of questions depending on route param
const currentQuestions = computed(() => {
  return (
    onboardingQuestions.find(
      (x) => x.type.toUpperCase() === userType.value.toUpperCase()
    )?.questions || []
  );
});

// store answers in parallel array
const formAnswers = ref<any[]>([]);

function handleSubmit() {
  console.log("Collected Answers:", formAnswers.value);
  // do something useful here, like post to PocketBase
}
</script>
