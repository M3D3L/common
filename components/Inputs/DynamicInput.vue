<template>
  <div>
    <!-- RADIO -->
    <div v-if="q.questionType === 'radio'" class="space-y-2">
      <div
        v-for="opt in q.options"
        :key="opt.value"
        class="flex items-center space-x-2"
      >
        <input
          type="radio"
          :name="q.question"
          :value="opt.value"
          v-model="localValue"
          class="accent-primary"
        />
        <label class="text-sm">{{ opt.label }}</label>
      </div>
    </div>

    <!-- SLIDER -->
    <div v-else-if="q.questionType === 'slider'" class="space-y-2">
      <div class="mb-1 text-sm">Selected: {{ localValue }}</div>
      <input
        type="range"
        :min="q.min"
        :max="q.max"
        v-model.number="localValue"
        class="w-full accent-primary"
      />
    </div>

    <!-- NUMBER -->
    <div v-else-if="q.questionType === 'number'">
      <input
        type="number"
        v-model.number="localValue"
        :min="q.min"
        :max="q.max"
        class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <!-- TEXT -->
    <div v-else-if="q.questionType === 'text'">
      <input
        type="text"
        v-model="localValue"
        placeholder="Enter text..."
        class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <!-- EMAIL -->
    <div v-else-if="q.questionType === 'email'" class="flex flex-col gap-1">
      <input
        type="email"
        v-model="localValue"
        placeholder="Enter your email..."
        @blur="validateEmail"
        class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        :class="{ 'border-red-500 focus:ring-red-500': error }"
      />
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  q: any
  modelValue: any
}>()

const emits = defineEmits(["update:modelValue"])

const localValue = ref(props.modelValue)

watch(localValue, (val) => emits("update:modelValue", val))
watch(() => props.modelValue, (val) => (localValue.value = val))

const error = ref("")

const validateEmail = () => {
  if (props.q.questionType !== "email") return
  if (!localValue.value) {
    error.value = "Email is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localValue.value)) {
    error.value = "Please enter a valid email address."
  } else {
    error.value = ""
  }
}
</script>
