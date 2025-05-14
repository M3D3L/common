// @/config/highlightsData.ts
import { RocketIcon, CodeIcon } from '@radix-icons/vue'
import type { Component } from 'vue'

export interface Skill {
  icon: Component
  name: string
  category: string
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  years?: number
  link: string
}

export const highlightsData: Skill[] = [
  {
    icon: RocketIcon,
    name: 'Blazing Fast',
    category: 'Performance Optimization',
    proficiency: 'Advanced',
    years: 3,
    link: '#',
  },
  {
    icon: CodeIcon,
    name: 'Developer Friendly',
    category: 'DX / Tooling',
    proficiency: 'Expert',
    years: 5,
    link: '#',
  },
  {
    icon: RocketIcon,
    name: 'Scalable',
    category: 'Architecture & Infrastructure',
    proficiency: 'Advanced',
    years: 4,
    link: '#',
  },
  {
    icon: CodeIcon,
    name: 'Secure',
    category: 'Security Practices',
    proficiency: 'Intermediate',
    years: 2,
    link: '#',
  },
]
