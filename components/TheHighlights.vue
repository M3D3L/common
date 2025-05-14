<script setup lang="ts">
import type { Component } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface Skill {
  icon: Component
  name: string
  category: string
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  years?: number
  link: string
}

const props = defineProps<{
  skills: Skill[]
  columns?: 2 | 3 | 4
}>()

const gridClasses = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4'
}

const proficiencyColors = {
  Beginner: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  Intermediate: 'bg-green-100 text-green-800 hover:bg-green-200',
  Advanced: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  Expert: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
}
</script>

<template>
  <section class="w-full py-12">
    <div class="container px-4 mx-auto">
      <div class="grid grid-cols-1 gap-6" :class="gridClasses[columns || 3]">
        <Card
          v-for="(skill, index) in skills"
          :key="index"
          class="transition-all hover:shadow-lg hover:border-primary/30 group"
        >
          <CardHeader class="flex flex-row items-center gap-4 pb-3 space-y-0">
            <div class="p-3 rounded-lg bg-primary/10">
              <component
                :is="skill.icon"
                class="w-6 h-6 text-primary"
              />
            </div>
            <div class="flex-1 space-y-1">
              <CardTitle class="text-lg font-semibold">
                {{ skill.name }}
              </CardTitle>
              <p class="text-sm text-muted-foreground">
                {{ skill.category }}
              </p>
            </div>
          </CardHeader>

          <CardContent class="space-y-2">
            <div v-if="skill.proficiency" class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground">Level:</span>
              <Badge 
                :class="proficiencyColors[skill.proficiency]"
                class="transition-colors"
              >
                {{ skill.proficiency }}
              </Badge>
            </div>

            <div v-if="skill.years" class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground">Experience:</span>
              <Badge variant="outline">
                {{ skill.years }} year{{ skill.years > 1 ? 's' : '' }}
              </Badge>
            </div>
          </CardContent>

          <CardFooter>
            <a
              :href="skill.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-sm font-medium transition-colors text-primary hover:text-primary/80 group-hover:underline"
            >
              Documentation
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="ml-1"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  </section>
</template>