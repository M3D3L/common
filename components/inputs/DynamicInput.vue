<template>
  <div>
    <!-- RADIO -->
    <div v-if="q.questionType === 'radio'" class="space-y-3">
      <div
        v-for="opt in q.options"
        :key="opt.value"
        class="flex items-center space-x-3"
      >
        <input
          type="radio"
          :id="`${q.question}-${opt.value}`"
          :name="sanitizedName"
          :value="opt.value"
          v-model="localValue"
          class="w-4 h-4 cursor-pointer text-primary focus:ring-2 focus:ring-primary accent-primary"
        />
        <label 
          :for="`${q.question}-${opt.value}`"
          class="text-sm cursor-pointer select-none"
        >
          {{ opt.label }}
        </label>
      </div>
    </div>

    <!-- CHECKBOX -->
    <div v-else-if="q.questionType === 'checkbox'" class="space-y-3">
      <div
        v-for="opt in q.options"
        :key="opt.value"
        class="flex items-center space-x-3"
      >
        <input
          type="checkbox"
          :id="`${q.question}-${opt.value}`"
          :value="opt.value"
          v-model="localValue"
          class="w-4 h-4 rounded cursor-pointer text-primary focus:ring-2 focus:ring-primary accent-primary"
        />
        <label 
          :for="`${q.question}-${opt.value}`"
          class="text-sm cursor-pointer select-none"
        >
          {{ opt.label }}
        </label>
      </div>
    </div>

    <!-- SLIDER -->
    <div v-else-if="q.questionType === 'slider'" class="space-y-2">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-muted-foreground">
          ${{ Number(q.min || 0).toLocaleString() }}
        </span>
        <span class="text-base font-semibold text-primary">
          ${{ Number(localValue || q.min || 0).toLocaleString() }}
        </span>
        <span class="text-sm text-muted-foreground">
          ${{ Number(q.max || 10000).toLocaleString() }}
        </span>
      </div>
      <input
        type="range"
        :min="q.min || 0"
        :max="q.max || 10000"
        :step="q.step || 100"
        v-model.number="localValue"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>

    <!-- NUMBER -->
    <div v-else-if="q.questionType === 'number'">
      <input
        type="number"
        v-model.number="localValue"
        :min="q.min || 0"
        :max="q.max || 100"
        :placeholder="q.placeholder || 'Enter a number'"
        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>

    <!-- TEXT -->
    <div v-else-if="q.questionType === 'text'">
      <input
        type="text"
        v-model="localValue"
        :placeholder="q.placeholder || 'Enter text...'"
        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>

    <!-- EMAIL -->
    <div v-else-if="q.questionType === 'email'" class="flex flex-col gap-2">
      <input
        type="email"
        v-model="localValue"
        :placeholder="q.placeholder || 'your.email@example.com'"
        @blur="validateEmail"
        class="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        :class="{ 'border-red-500 focus:ring-red-500': error }"
      />
      <p v-if="error" class="flex items-center gap-1 text-sm text-red-500">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </p>
    </div>

    <!-- PHONE -->
    <div v-else-if="q.questionType === 'phone'" class="flex flex-col gap-2">
      <input
        type="tel"
        v-model="localValue"
        :placeholder="q.placeholder || '+1 (555) 123-4567'"
        @blur="validatePhone"
        class="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        :class="{ 'border-red-500 focus:ring-red-500': phoneError }"
      />
      <p v-if="phoneError" class="flex items-center gap-1 text-sm text-red-500">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ phoneError }}
      </p>
    </div>

    <!-- MULTISELECT -->
    <div v-else-if="q.questionType === 'multiselect'" class="flex flex-col gap-2">
      <select
        multiple
        v-model="localValue"
        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
      >
        <option
          v-for="opt in q.options"
          :key="opt.value"
          :value="opt.value"
          class="p-2"
        >
          {{ opt.label }}
        </option>
      </select>
      <p class="flex items-center gap-1 text-xs text-muted-foreground">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Hold Ctrl (Cmd on Mac) to select multiple
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  q: any
  modelValue: any
}>()

const emits = defineEmits(["update:modelValue"])

// Initialize with proper default values based on question type
const getInitialValue = () => {
  if (props.modelValue !== undefined && props.modelValue !== null) {
    return props.modelValue
  }
  
  switch (props.q.questionType) {
    case 'checkbox':
    case 'multiselect':
      return []
    case 'slider':
      return props.q.min || 0
    case 'number':
      return props.q.min || 0
    case 'radio':
    case 'text':
    case 'email':
    case 'phone':
    default:
      return ''
  }
}

const localValue = ref(getInitialValue())

// Create a sanitized name for radio groups (remove special characters)
const sanitizedName = computed(() => {
  return props.q.question.replace(/[^a-zA-Z0-9]/g, '_')
})

// Watch for changes and emit
watch(localValue, (val) => {
  emits("update:modelValue", val)
}, { deep: true })

// Watch for external changes
watch(() => props.modelValue, (val) => {
  if (JSON.stringify(val) !== JSON.stringify(localValue.value)) {
    localValue.value = val ?? getInitialValue()
  }
}, { deep: true })

// Email validation
const error = ref("")

const validateEmail = () => {
  if (!localValue.value) {
    error.value = "Email is required"
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(localValue.value)) {
    error.value = "Please enter a valid email address"
  } else {
    error.value = ""
  }
}

// Phone validation
const phoneError = ref("")

const validatePhone = () => {
  if (!localValue.value) {
    phoneError.value = ""
    return
  }
  
  // Basic phone validation - allows various formats
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  if (!phoneRegex.test(localValue.value)) {
    phoneError.value = "Please enter a valid phone number"
  } else if (localValue.value.replace(/\D/g, '').length < 10) {
    phoneError.value = "Phone number must be at least 10 digits"
  } else {
    phoneError.value = ""
  }
}
</script>