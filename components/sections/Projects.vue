<template>
  <containers-video id="portfolio" video="https://videos.pexels.com/video-files/7874813/7874813-hd_1080_1920_25fps.mp4" :img-src="BlockMe3" :title description class="min-h-[90vh] md:min-h-screen">
    <template #video-container-content>
      <main class="relative z-10 flex items-center w-full h-full px-0">
        <motion.div class="w-full mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true,
          amount: 0.2 }} :variants="{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }">
          <!-- Portfolio Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" :variants="{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }">
            <div :class="{ 'md:block hidden' : index > 2 }" v-for="(project, index) in content.projects">
              <Card
                class="h-full overflow-hidden transition-all duration-300 border border-muted hover:border-primary/30 hover:shadow-lg">
                <CardHeader class="p-0 border-b border-muted">
                  <div class="relative overflow-hidden aspect-video">
                    <img :src="project.image" :alt="project.title"
                      class="object-cover w-full h-full transition-all duration-500 aspect-video hover:scale-105 " />
                    <div
                      class="absolute inset-0 flex items-end p-4 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100">
                      <div class="flex flex-wrap gap-2">
                        <Badge v-for="tag in project.tags" :key="tag" variant="secondary" class="text-xs font-medium">
                          {{ tag }}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="p-6 lg:p-8">
                  <div class="flex flex-col h-full">
                    <div>
                      <h3 class="text-xl font-bold">{{ project.title }}</h3>
                      <p class="mt-2 text-sm text-muted-foreground">{{ project.client }}</p>
                      <p class="mt-3 text-sm">{{ project.description }}</p>
                    </div>
                    <div class="mt-6">
                      <div v-if="project?.tech" class="flex flex-wrap gap-2 mt-auto">
                        <Badge v-for="tech in project?.tech?.slice(0, 3)" :key="tech" variant="outline" class="text-xs">
                          {{ tech }}
                        </Badge>
                        <Badge v-if="project.tech.length > 3" variant="outline" class="text-xs">
                          +{{ project.tech.length - 3 }} more
                        </Badge>
                      </div>
                    </div>
                    <div class="flex gap-3 mt-6">
                      <Button class="w-full">
                        <a :href="project.link" target="_blank" rel="noopener noreferrer">
                          Visit Site
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </template>
  </containers-video>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BlockMe3 from '/images/block-me-3.png'

// Props
const props = defineProps({
  content: {
    type: Object,
    required: false,
    default: () => ({
      title: 'My Portfolio',
      subtitle: 'Selected projects I\'ve worked on for clients and companies',
      video: 'https://videos.pexels.com/video-files/2344545/2344545-uhd_2560_1440_25fps.mp4',
      projects: [
        {
          "id": 1,
          "title": "Law.com Redesign",
          "client": "Law.com",
          "description": "Complete redesign of the leading legal news platform with improved UX and performance.",
          "image": "/images/law.jpg",
          "link": "https://www.law.com",
          "caseStudy": "/case-studies/law-com",
          "tags": ["Redesign", "UX", "CMS"],
          // "tech": ["Vue.js", "Nuxt", "Tailwind CSS", "Storyblok", "Node.js"]
        },
        {
          "id": 2,
          "title": "China Law & Practice Conversion",
          "client": "China Law & Practice",
          "description": "Migration and modernization of the legal publication platform with improved content delivery.",
          "image": "/images/clp.jpg",
          "link": "https://www.chinalawandpractice.com/",
          "tags": ["Migration", "Content Platform"],
        },
        {
          "id": 3,
          "title": "Law Journal Newsletters Conversion",
          "client": "ALM Law Journals",
          "description": "Conversion of legal newsletter platform to modern web standards with improved subscription management.",
          "image": "/images/ljn.jpg",
          "link": "https://www.lawjournalnewsletters.com/",
          "caseStudy": "/case-studies/law-newsletters",
          "tags": ["Newsletters", "Subscription"],
        },
        {
          "id": 4,
          "title": "ThinkAdvisor Redesign",
          "client": "ThinkAdvisor",
          "description": "Redesign of financial advisory news platform with enhanced content discovery and reader engagement.",
          "image": "/images/thinkadvisor.jpg",
          "link": "https://www.thinkadvisor.com/",
          "tags": ["Redesign", "Financial Media"],
        },
        {
          "id": 5,
          "title": "Globest Redesign",
          "client": "Globest",
          "description": "Modernization of commercial real estate news platform with improved property market data visualization.",
          "image": "/images/globest.jpg",
          "link": "https://www.globest.com/",
          "tags": ["Redesign", "Real Estate"],
        },
        {
          "id": 6,
          "title": "Consulting Magazine Redesign",
          "client": "Consulting Magazine",
          "description": "Overhaul of professional services industry publication with enhanced article presentation and analytics.",
          "image": "/images/consultingmag.jpg",
          "link": "https://www.consultingmag.com/",
          "tags": ["Redesign", "Professional Services"],
        }
      ]
    })
  },
  title: {
    type: String,
    default: 'My Projects'
  },
  description: {
    type: String,
    default: 'A selection of projects I have worked on, showcasing my skills and expertise.'
  }
})
</script>