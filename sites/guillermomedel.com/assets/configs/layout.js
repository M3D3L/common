import {
  TwitterLogoIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from "@radix-icons/vue";

export const seoDefaults = {
    home: {
        title: "Guillermo Medel | Full-Stack Developer & Tech Enthusiast",
        description: `Guillermo Medel is a Full-Stack Developer & Tech Enthusiast based in San Carlos, Sonora. Discover his latest projects, insights, and expertise in web development and technology.`,
        keywords: "Guillermo Medel, Full-Stack Developer, Tech Enthusiast, San Carlos, web development, programming, technology",
        image: "/images/block-me.png",
    },
}

export const contactInfo = {
    siteName: "GuillermoMedel.com",
    slogan: "Full-Stack Developer & Tech Enthusiast",
    email: "guillermoantoniomedel@gmail.com",
    phone: "+52 (644) 194-2391",
}

export const recentProjects = {
  title: "Projects",
  description: "A selection of projects I've worked on recently.",
  image: "/images/projects.webp",
  link: "#portfolio",
  items: [
    {
      id: 1,
      title: "Law.com Redesign",
      client: "Law.com",
      description:
        "Complete redesign of the leading legal news platform with improved UX and performance.",
      cover_image: "/images/law.webp",
      slug: "https://www.law.com",
      tags: ["Redesign", "UX", "CMS"],
      // "tech": ["Vue.js", "Nuxt", "Tailwind CSS", "Storyblok", "Node.js"]
    },
    {
      id: 2,
      title: "China Law & Practice Conversion",
      client: "China Law & Practice",
      description:
        "Migration and modernization of the legal publication platform with improved content delivery.",
      cover_image: "/images/clp.webp",
      slug: "https://www.chinalawandpractice.com/",
      tags: ["Migration", "Content Platform"],
    },
    {
      id: 3,
      title: "Law Journal Newsletters Conversion",
      client: "ALM Law Journals",
      description:
        "Conversion of legal newsletter platform to modern web standards with improved subscription management.",
      cover_image: "/images/ljn.webp",
      slug: "https://www.lawjournalnewsletters.com/",
      tags: ["Newsletters", "Subscription"],
    },
    {
      id: 4,
      title: "ThinkAdvisor Redesign",
      client: "ThinkAdvisor",
      description:
        "Redesign of financial advisory news platform with enhanced content discovery and reader engagement.",
      cover_image: "/images/thinkadvisor.webp",
      slug: "https://www.thinkadvisor.com/",
      tags: ["Redesign", "Financial Media"],
    },
    {
      id: 5,
      title: "Globest Redesign",
      client: "Globest",
      description:
        "Modernization of commercial real estate news platform with improved property market data visualization.",
      cover_image: "/images/globest.webp",
      slug: "https://www.globest.com/",
      tags: ["Redesign", "Real Estate"],
    },
    {
      id: 6,
      title: "Consulting Magazine Redesign",
      client: "Consulting Magazine",
      description:
        "Overhaul of professional services industry publication with enhanced article presentation and analytics.",
      cover_image: "/images/consultingmag.webp",
      slug: "https://www.consultingmag.com/",
      tags: ["Redesign", "Professional Services"],
    },
  ],
};

export const skillsSection = {
  title: "My Skills",
  description:
    "Full-stack developer focused on sleek digital experiences — a part-time drone pilot bringing both code and cameras to new heights. This unique combination allows for a diverse approach to problem-solving and project execution.",
  skills: [
    // Frontend Skills
    {
      title: "Nuxt 3",
      description:
        "Building modern web applications with Nuxt 3, a powerful framework for Vue.js. I leverage its features to create dynamic and performant user experiences.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
      link: "https://nuxtjs.org/",
      category: "frontend",
      proficiency: "advanced",
    },
    {
      title: "Pinia",
      description:
        "Managing state efficiently with Pinia, the modern and intuitive store for Vue.js applications.",
      icon: "https://pinia.vuejs.org/logo.svg",
      link: "https://pinia.vuejs.org/",
      category: "frontend",
      proficiency: "advanced",
    },
    {
      title: "Tailwind CSS",
      description:
        "Crafting beautiful and responsive designs using Tailwind CSS, a utility-first CSS framework. I utilize its classes to build custom styles efficiently.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      link: "https://tailwindcss.com/",
      category: "frontend",
      proficiency: "advanced",
    },
    {
      title: "React Native",
      description:
        "Building cross-platform mobile applications with React Native. Experienced in creating native-like user interfaces for iOS and Android.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      link: "https://reactnative.dev/",
      category: "frontend",
      proficiency: "intermediate",
    },
    {
      title: "TypeScript",
      description:
        "Building type-safe applications with TypeScript to improve code quality and developer experience.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      link: "https://www.typescriptlang.org/",
      category: "frontend",
      proficiency: "intermediate",
    },

    // Backend Skills
    {
      title: "GraphQL",
      description:
        "Querying APIs efficiently using GraphQL. Experienced with schema design, resolvers, and client-side integration.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
      link: "https://graphql.org/",
      category: "backend",
      proficiency: "advanced",
    },
    {
      title: "Go",
      description:
        "Developing efficient and scalable backend services with Go. Experienced in building robust APIs and concurrent applications.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
      link: "https://go.dev/",
      category: "backend",
      proficiency: "intermediate",
    },
    {
      title: "SQLite",
      description:
        "Using SQLite for lightweight, embedded database solutions. Useful for prototyping and local-first applications.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
      link: "https://sqlite.org/",
      category: "backend",
      proficiency: "intermediate",
    },
    {
      title: "Node.js",
      description:
        "Creating scalable server-side applications with Node.js. Experience with Express and other frameworks.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      link: "https://nodejs.org/",
      category: "backend",
      proficiency: "advanced",
    },

    // DevOps Skills
    {
      title: "Docker",
      description:
        "Containerizing applications with Docker for consistent development and deployment environments.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      link: "https://www.docker.com/",
      category: "devops",
      proficiency: "beginner",
    },
    {
      title: "GitHub",
      description:
        "Utilizing GitHub for version control, collaboration, and CI/CD workflows.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      link: "https://github.com/",
      category: "devops",
      proficiency: "advanced",
    },
    {
      title: "Linux",
      description:
        "Using the Linux operating system for development, server management, and command-line proficiency.",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png",
      link: "https://www.linux.org/",
      category: "operating system",
      proficiency: "intermediate",
    },
    {
      title: "Cypress",
      description:
        "Writing and running end-to-end tests for web applications using Cypress.",
      icon: "https://docs.cypress.io/img/logo/cypress-logo-circle-dark.png",
      link: "https://www.cypress.io/",
      category: "devops",
      proficiency: "intermediate",
    },
    {
      title: "Google Cloud Platform",
      description:
        "Leveraging Google Cloud Platform services for hosting, deployment, and scalable infrastructure.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
      link: "https://cloud.google.com/",
      category: "devops",
      proficiency: "intermediate",
    },
  ],
  video:
    "https://videos.pexels.com/video-files/1456685/1456685-hd_1920_1080_30fps.mp4",
};

// Hero Section
export const heroSection = {
  id: "hero",
  title: "Guillermo Medel | Full Stack Developer | Digital Experiences",
  subTitle: "Full-Stack Developer & Tech Enthusiast",
  description: `Based in San Carlos, Sonora, I specialize in creating dynamic and responsive web applications. Explore my portfolio to see how I can help bring your ideas to life.`,
  buttons: [
    {
      title: "Get in Touch",
      link: "#contact",
    },
    {
      title: "See My Projects",
      link: "#portfolio",
    },
  ],
  imageAlt: "A block person version of Guillermo Medel - Full-Stack Developer",
};

// Blog Section
export const blogSection = {
  title: "Learn the latest tech trends and tips",
  description: `Explore articles on web development, programming, and tech insights to stay ahead in the ever-evolving digital landscape.`,
};

// Contact Section
export const contactSection = {
  title: "Get in Touch with Guillermo",
  description: `Have questions or need assistance? I'm here to help! Reach out via email or phone, and let's connect.`,
  formAction: "https://formsubmit.co/7cbfcf8a8143c9f8708006416b2a0aae",
  contactEmail: "guillermoantoniomedel@gmail.com",
  contactPhone: "+52 (644) 194-2391",
  videoArray: [
    "https://www.pexels.com/download/video/33792753/",
    "https://www.pexels.com/download/video/32926637/",
    "https://www.pexels.com/download/video/32106032/",
    "https://www.pexels.com/download/video/32104595/",
  ],
  imgSrc: "",
};

export const siteMap = [
  { label: "Blog", href: "/blog" },
  { label: "Contact Me", href: "/#contact" },
];

// Socials Icons
export const socials = [
  {
    icon: LinkedinLogoIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/guillermo-medel-9a4465151/",
  },
  { icon: GithubLogoIcon, label: "GitHub", href: "https://github.com/M3D3L" },
];
