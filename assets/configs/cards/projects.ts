interface Project {
    id: number;
    title: string;
    client: string;
    description: string;
    image: string;
    link: string;
    tags: string[];
    // tech?: string[]; // Uncomment if you want to include technology stack
}
export const projectsData: Project[] = [
    {
        "id": 1,
        "title": "Law.com Redesign",
        "client": "Law.com",
        "description": "Complete redesign of the leading legal news platform with improved UX and performance.",
        "image": "/images/law.webp",
        "link": "https://www.law.com",
        "tags": ["Redesign", "UX", "CMS"],
        // "tech": ["Vue.js", "Nuxt", "Tailwind CSS", "Storyblok", "Node.js"]
    },
    {
        "id": 2,
        "title": "China Law & Practice Conversion",
        "client": "China Law & Practice",
        "description": "Migration and modernization of the legal publication platform with improved content delivery.",
        "image": "/images/clp.webp",
        "link": "https://www.chinalawandpractice.com/",
        "tags": ["Migration", "Content Platform"],
    },
    {
        "id": 3,
        "title": "Law Journal Newsletters Conversion",
        "client": "ALM Law Journals",
        "description": "Conversion of legal newsletter platform to modern web standards with improved subscription management.",
        "image": "/images/ljn.webp",
        "link": "https://www.lawjournalnewsletters.com/",
        "tags": ["Newsletters", "Subscription"],
    },
    {
        "id": 4,
        "title": "ThinkAdvisor Redesign",
        "client": "ThinkAdvisor",
        "description": "Redesign of financial advisory news platform with enhanced content discovery and reader engagement.",
        "image": "/images/thinkadvisor.webp",
        "link": "https://www.thinkadvisor.com/",
        "tags": ["Redesign", "Financial Media"],
    },
    {
        "id": 5,
        "title": "Globest Redesign",
        "client": "Globest",
        "description": "Modernization of commercial real estate news platform with improved property market data visualization.",
        "image": "/images/globest.webp",
        "link": "https://www.globest.com/",
        "tags": ["Redesign", "Real Estate"],
    },
    {
        "id": 6,
        "title": "Consulting Magazine Redesign",
        "client": "Consulting Magazine",
        "description": "Overhaul of professional services industry publication with enhanced article presentation and analytics.",
        "image": "/images/consultingmag.webp",
        "link": "https://www.consultingmag.com/",
        "tags": ["Redesign", "Professional Services"],
    }
]