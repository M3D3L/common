import {
  TwitterLogoIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from "@radix-icons/vue";

// --- SEO Defaults ---
export const seoDefaults = {
  home: {
    // Title: Positions you as the expert in Nuxt first, then as a Full-Stack developer
    title:
      "Guillermo Medel | Nuxt Specialist & Full-Stack Developer | Remote Expert",

    // Description: Highlights the Nuxt expertise and the full-stack capability
    description: `I'm Guillermo Medel, a <span class="font-bold">Nuxt Specialist</span> and full-stack developer working remotely with international clients. I deliver high-performance web solutions, focusing on Nuxt/Vue, Go, and Node.js modernization.`,

    // Keywords: Includes both "specialist" and "connoisseur" intent for SEO benefit
    keywords:
      "Nuxt specialist, Nuxt expert, Vue.js specialist, remote full-stack developer, Nuxt freelance, Go backend, Node.js modernization, web application delivery, high-performance web, freelance developer, native English speaker, Nuxt connoisseur",

    image: "/images/block-me.png",
  },
};

// --- Contact Info ---
export const contactInfo = {
  siteName: "GuillermoMedel.com",
  // Slogan: Reinforces the expert development and remote status
  slogan: "Nuxt Specialist & Full-Stack Developer | Remote",
  email: "guillermoantoniomedel@gmail.com",
  phone: "+52 (644) 194-2391",
};

// --- Recent Projects ---
export const recentProjects = {
  title: "Featured Nuxt & Modernization Projects",
  // Adjusted description to focus on your specific expertise (Nuxt/web development)
  description:
    'Here’s a look at projects where I provided <span class="font-bold">Nuxt and web development expertise</span> and was the primary developer for the <span class="font-bold">modernization</span> and launch of platforms for international publishers and digital brands.',
  image: "/images/projects.webp",
  link: "#portfolio",
  items: [
    {
      id: 1,
      title: "Law.com Platform Modernization & Redesign",
      client: "Law.com",
      description:
        "Developed the homepage redesign using Nuxt.js and Tailwind CSS for performance.",
      cover_image: "/images/law.webp",
      slug: "https://www.law.com",
      tags: ["Performance Optimization", "Nuxt.js", "Front-End Coding"],
    },
    {
      id: 2,
      title: "China Law & Practice Tech Stack Migration",
      client: "China Law & Practice",
      description:
        "Built and maintained the platform with Nuxt.js and GraphQL for scalability.",
      cover_image: "/images/clp.webp",
      slug: "https://www.chinalawandpractice.com/",
      tags: ["Tech Migration", "GraphQL", "Nuxt.js"],
    },
    {
      id: 3,
      title: "Law Journal Newsletters System Upgrade",
      client: "ALM Law Journals",
      description:
        "Developed the platform and implemented testing with Cypress and Storybook.",
      cover_image: "/images/ljn.webp",
      slug: "https://www.lawjournalnewsletters.com/",
      tags: ["Cypress Testing", "System Rebuild", "Front-end Coding"],
    },
    {
      id: 4,
      title: "ThinkAdvisor Full Redesign & Implementation",
      client: "ThinkAdvisor",
      description:
        "Developed high-performance apps using Nuxt.js, ensuring SEO and accessibility.",
      cover_image: "/images/thinkadvisor.webp",
      slug: "https://www.thinkadvisor.com/",
      tags: ["UX Implementation", "Nuxt.js", "SEO"],
    },
    {
      id: 5,
      title: "Globest Platform Development & Data Tools",
      client: "Globest",
      description:
        "Integrated GraphQL for efficient data fetching and system maintainability.",
      cover_image: "/images/globest.webp",
      slug: "https://www.globest.com/",
      tags: ["Real Estate Tech", "GraphQL", "Performance"],
    },
    {
      id: 6,
      title: "Consulting Magazine Website Overhaul",
      client: "Consulting Magazine",
      description:
        "Developed the platform with Nuxt.js and Tailwind CSS in an agile environment.",
      cover_image: "/images/consultingmag.webp",
      slug: "https://www.consultingmag.com/",
      tags: ["Professional Services", "Agile Workflows", "Nuxt.js"],
    },
  ],
};

// --- Skills Section ---
export const skillsSection = {
  title: "Expertise: Nuxt, Full-Stack Development & Tools",
  // Description: Highlights Nuxt expertise and full-stack development
  description:
    'I work as a <span class="font-bold">remote Nuxt Specialist and Full-Stack Developer</span>, specializing in building fast, scalable, and clean digital solutions. My native English fluency allows for seamless collaboration with U.S. and international teams.',
  skills: [
    // Frontend Skills
    {
      title: "Nuxt 3",
      // Emphasize expertise
      description:
        "As a Nuxt Specialist, I focus on building and optimizing modern web applications for performance, advanced SEO, and dynamic user interfaces.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
      link: "https://nuxtjs.org/",
      category: "frontend",
      proficiency: "advanced",
    },
    {
      title: "Pinia",
      description:
        "Managing complex application state effectively with Pinia, the modern, type-safe store for large-scale Vue.js projects.",
      icon: "https://pinia.vuejs.org/logo.svg",
      link: "https://pinia.vuejs.org/",
      category: "frontend",
      proficiency: "advanced",
    },
    {
      title: "Tailwind CSS",
      description:
        "Rapidly building and customizing responsive, utility-first UI designs using the Tailwind CSS framework.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      link: "https://tailwindcss.com/",
      category: "frontend",
      proficiency: "advanced",
    },
    {
      title: "React Native",
      description:
        "Developing and deploying high-quality cross-platform mobile applications for both iOS and Android.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      link: "https://reactnative.dev/",
      category: "frontend",
      proficiency: "intermediate",
    },
    {
      title: "TypeScript",
      description:
        "Using TypeScript to write robust, scalable, and maintainable application code with improved development tooling.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      link: "https://www.typescriptlang.org/",
      category: "frontend",
      proficiency: "intermediate",
    },

    // Backend Skills
    {
      title: "GraphQL",
      description:
        "Developing efficient APIs and optimizing data fetching using GraphQL for both new and legacy systems.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
      link: "https://graphql.org/",
      category: "backend",
      proficiency: "advanced",
    },
    {
      title: "Go (Golang)",
      description:
        "Building fast, concurrent, and highly reliable backend services and microservices with the Go language.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
      link: "https://go.dev/",
      category: "backend",
      proficiency: "intermediate",
    },
    {
      title: "SQLite",
      description:
        "Using SQLite for lightweight, embedded database solutions, excellent for fast prototyping and local data management.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
      link: "https://sqlite.org/",
      category: "backend",
      proficiency: "intermediate",
    },
    {
      title: "Node.js (APIs & Services)",
      description:
        "Creating scalable server-side applications and high-throughput REST/GraphQL APIs with Node.js.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      link: "https://nodejs.org/",
      category: "backend",
      proficiency: "advanced",
    },

    // DevOps Skills
    {
      title: "Docker & Containerization",
      description:
        "Implementing Docker for consistent, portable development and deployment environments.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      link: "https://www.docker.com/",
      category: "devops",
      proficiency: "intermediate",
    },
    {
      title: "GitHub & CI/CD",
      description:
        "Utilizing GitHub for advanced version control, collaborative workflows, and configuring CI/CD pipelines.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      link: "https://github.com/",
      category: "devops",
      proficiency: "advanced",
    },
    {
      title: "Linux & Server Management",
      description:
        "Experienced in Linux server deployment, environment setup, and command-line proficiency.",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png",
      link: "https://www.linux.org/",
      category: "operating system",
      proficiency: "intermediate",
    },
    {
      title: "Cypress (E2E Testing)",
      description:
        "Writing and implementing end-to-end (E2E) testing suites for web applications using Cypress.",
      icon: "https://docs.cypress.io/img/logo/cypress-logo-circle-dark.png",
      link: "https://www.cypress.io/",
      category: "devops",
      proficiency: "intermediate",
    },
    {
      title: "Google Cloud Platform",
      description:
        "Leveraging GCP services for hosting, scalable infrastructure, and efficient deployment pipelines.",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
      link: "https://cloud.google.com/",
      category: "devops",
      proficiency: "intermediate",
    },
  ],
  video:
    "https://videos.pexels.com/video-files/1456685/1456685-hd_1920_1080_30fps.mp4",
};

// --- Hero Section ---
export const heroSection = {
  id: "hero",
  // Title: Nuxt focus
  title: "Guillermo Medel | Nuxt Specialist & Full-Stack Developer",
  subTitle: "High-Performance Nuxt/Vue and Full-Stack Delivery",
  // Description: Highlights Nuxt expertise and core tech
  description: `I’m Guillermo Medel, a <span class="font-bold">Nuxt Specialist</span> and full-stack developer from Sonora, Mexico. I partner with international clients to build and modernize high-performance web applications using <span class="font-bold">Nuxt, Vue, Go, and Node.js.</span>`,
  buttons: [
    {
      title: "Hire A Nuxt Specialist", // Action-oriented button
      link: "#contact",
    },
    {
      title: "View Recent Projects",
      link: "#portfolio",
    },
  ],
  imageAlt:
    "Illustration of Guillermo Medel, remote Nuxt specialist and full-stack developer",
};

// --- Blog Section ---
export const blogSection = {
  title: "Modern Web Development & Nuxt Insights",
  // Description: Focuses on Nuxt best practices and related technologies
  description: `I share practical guides, code tips, and insights on <span class="!text-accent">Nuxt best practices</span>, <span class="!text-accent">performance optimization</span>, and the <span class="!text-accent">Nuxt/Go/Node stack</span>.`,
};

// --- Contact Section ---
export const contactSection = {
  // Title: Focuses on working with the expert
  title: "Work With Guillermo Medel (Nuxt Specialist)",
  // Description: Clear pitch focusing on expertise
  description: `I’m a remote Nuxt Specialist fluent in English and Spanish. Let’s connect to discuss the technical delivery and modernization of your next project.`,
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

// --- Site Map ---
export const siteMap = [
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

// --- Socials ---
export const socials = [
  {
    icon: LinkedinLogoIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/guillermo-medel-9a4465151/",
  },
  { icon: GithubLogoIcon, label: "GitHub", href: "https://github.com/M3D3L" },
];
