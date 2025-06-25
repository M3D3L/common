// Imports (standard practice to keep at top)
import { TwitterLogoIcon, GithubLogoIcon, LinkedinLogoIcon, DiscordLogoIcon, RocketIcon, CodeIcon } from '@radix-icons/vue'

// Interfaces
export interface Skill {
  title: string;
  description: string;
  icon: string;
  link: string;
  category?: 'frontend' | 'backend' | 'devops' | 'design' | 'other';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface HighlightSkill {
  icon: Component
  name: string
  category: string
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  years?: number
  link: string
}

interface SkillSection {
  title: string;
  description: string;
  skills: Skill[];
  video: string;
}

export interface Card {
  title: string
  description: string
}

export interface Button {
  title: string
  link: string
}

export interface Hero {
  title: string
  description: string
  image: string
  link: string
  cards: Card[],
  buttons: Button[],
  video: string
}

interface Link {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: Link[]
}

interface FooterData {
  socialLinks: { icon: any; label: string; href: string }[]
  footerColumns: FooterColumn[]
  bottomLinks: Link[]
}

// Constants
export const defaultTitle = 'Feature Highlights'
export const defaultDescription = 'Discover what makes our solution stand out'

// Data
export const heroData: Hero = {
  title: 'Guillermo Medel | Full Stack Developer | Digital Experiences',
  description: "Hey, I'm a full-stack developer based in San Carlos, Sonora, crafting complete web experiences—from sleek frontends to robust backends. I've contributed to platforms like Law.com, and when I'm not coding, I'm offering drone photography to help local businesses elevate their online presence.",
  image: 'https://images.pexels.com/photos/31317409/pexels-photo-31317409/free-photo-of-serene-white-sands-in-new-mexico-s-desert.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  link: '#',
  buttons: [
    {
      title: 'Get in Touch',
      link: '#contact'
    },
    {
      title: 'See My Projects',
      link: '#portfolio'
    }
  ],
}

export const skillsData: SkillSection = {
  title: 'My Skills',
  description: 'Full-stack developer focused on sleek digital experiences — a part-time drone pilot bringing both code and cameras to new heights. This unique combination allows for a diverse approach to problem-solving and project execution.',
  skills: [
    // Frontend Skills
    {
      title: 'Nuxt 3',
      description: 'Building modern web applications with Nuxt 3, a powerful framework for Vue.js. I leverage its features to create dynamic and performant user experiences.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      link: 'https://nuxtjs.org/',
      category: 'frontend',
      proficiency: 'advanced',
    },
    {
      title: 'Pinia',
      description: 'Managing state efficiently with Pinia, the modern and intuitive store for Vue.js applications.',
      icon: 'https://pinia.vuejs.org/logo.svg',
      link: 'https://pinia.vuejs.org/',
      category: 'frontend',
      proficiency: 'advanced',
    },
    {
      title: 'Tailwind CSS',
      description: 'Crafting beautiful and responsive designs using Tailwind CSS, a utility-first CSS framework. I utilize its classes to build custom styles efficiently.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      link: 'https://tailwindcss.com/',
      category: 'frontend',
      proficiency: 'advanced',
    },
    {
      title: 'React Native',
      description: 'Building cross-platform mobile applications with React Native. Experienced in creating native-like user interfaces for iOS and Android.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      link: 'https://reactnative.dev/',
      category: 'frontend',
      proficiency: 'intermediate',
    },
    {
      title: 'TypeScript',
      description: 'Building type-safe applications with TypeScript to improve code quality and developer experience.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      link: 'https://www.typescriptlang.org/',
      category: 'frontend',
      proficiency: 'intermediate',
    },

    // Backend Skills
    {
      title: 'GraphQL',
      description: 'Querying APIs efficiently using GraphQL. Experienced with schema design, resolvers, and client-side integration.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
      link: 'https://graphql.org/',
      category: 'backend',
      proficiency: 'advanced',
    },
    {
      title: 'Go',
      description: 'Developing efficient and scalable backend services with Go. Experienced in building robust APIs and concurrent applications.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
      link: 'https://go.dev/',
      category: 'backend',
      proficiency: 'intermediate',
    },
    {
      title: 'SQLite',
      description: 'Using SQLite for lightweight, embedded database solutions. Useful for prototyping and local-first applications.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
      link: 'https://sqlite.org/',
      category: 'backend',
      proficiency: 'intermediate',
    },
    {
      title: 'Node.js',
      description: 'Creating scalable server-side applications with Node.js. Experience with Express and other frameworks.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      link: 'https://nodejs.org/',
      category: 'backend',
      proficiency: 'advanced',
    },

    // DevOps Skills
    {
      title: 'Docker',
      description: 'Containerizing applications with Docker for consistent development and deployment environments.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      link: 'https://www.docker.com/',
      category: 'devops',
      proficiency: 'beginner',
    },
    {
      title: 'GitHub',
      description: 'Utilizing GitHub for version control, collaboration, and CI/CD workflows.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      link: 'https://github.com/',
      category: 'devops',
      proficiency: 'advanced',
    },
    {
      title: 'Linux',
      description: 'Using the Linux operating system for development, server management, and command-line proficiency.',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png',
      link: 'https://www.linux.org/',
      category: 'operating system',
      proficiency: 'intermediate',
    },
    {
      title: 'Cypress',
      description: 'Writing and running end-to-end tests for web applications using Cypress.',
      icon: 'https://docs.cypress.io/img/logo/cypress-logo-circle-dark.png',
      link: 'https://www.cypress.io/',
      category: 'devops',
      proficiency: 'intermediate',
    },
    {
      title: 'Google Cloud Platform',
      description: 'Leveraging Google Cloud Platform services for hosting, deployment, and scalable infrastructure.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
      link: 'https://cloud.google.com/',
      category: 'devops',
      proficiency: 'intermediate',
    },
  ],
  video: 'https://videos.pexels.com/video-files/1456685/1456685-hd_1920_1080_30fps.mp4',
};

export const highlightsData: HighlightSkill[] = [
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

export const footerData: FooterData = {
  socialLinks: [
    { icon: LinkedinLogoIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/guillermo-medel-9a4465151/' },
    { icon: GithubLogoIcon, label: 'GitHub', href: 'https://github.com/M3D3L' },
  ],
  footerColumns: [
    {
      title: 'General',
      links: [
        { label: 'Rentals', href: '/rentals' },
        { label: 'Properties', href: '/properties' },
        { label: 'Lots', href: '/lots' },
        { label: 'Blog', href: '/blog' },
      ],
    },
  ],
  bottomLinks: [],
}

// Layout Configuration
export const layoutConfig = {
  heroData,
  skillsData,
  highlightsData,
  footerData
}