interface Project {
    id: number;
    title: string;
    client: string;
    description: string;
    cover_image: string;
    slug: string;
    tags: string[];
    // tech?: string[]; // Uncomment if you want to include technology stack
}
export const projectsData: Project[] = [
    {
        "id": 1,
        "title": "Law.com Redesign",
        "client": "Law.com",
        "description": "Complete redesign of the leading legal news platform with improved UX and performance.",
        "cover_image": "/images/law.webp",
        "slug": "https://www.law.com",
        "tags": ["Redesign", "UX", "CMS"],
        // "tech": ["Vue.js", "Nuxt", "Tailwind CSS", "Storyblok", "Node.js"]
    },
    {
        "id": 2,
        "title": "China Law & Practice Conversion",
        "client": "China Law & Practice",
        "description": "Migration and modernization of the legal publication platform with improved content delivery.",
        "cover_image": "/images/clp.webp",
        "slug": "https://www.chinalawandpractice.com/",
        "tags": ["Migration", "Content Platform"],
    },
    {
        "id": 3,
        "title": "Law Journal Newsletters Conversion",
        "client": "ALM Law Journals",
        "description": "Conversion of legal newsletter platform to modern web standards with improved subscription management.",
        "cover_image": "/images/ljn.webp",
        "slug": "https://www.lawjournalnewsletters.com/",
        "tags": ["Newsletters", "Subscription"],
    },
    {
        "id": 4,
        "title": "ThinkAdvisor Redesign",
        "client": "ThinkAdvisor",
        "description": "Redesign of financial advisory news platform with enhanced content discovery and reader engagement.",
        "cover_image": "/images/thinkadvisor.webp",
        "slug": "https://www.thinkadvisor.com/",
        "tags": ["Redesign", "Financial Media"],
    },
    {
        "id": 5,
        "title": "Globest Redesign",
        "client": "Globest",
        "description": "Modernization of commercial real estate news platform with improved property market data visualization.",
        "cover_image": "/images/globest.webp",
        "slug": "https://www.globest.com/",
        "tags": ["Redesign", "Real Estate"],
    },
    {
        "id": 6,
        "title": "Consulting Magazine Redesign",
        "client": "Consulting Magazine",
        "description": "Overhaul of professional services industry publication with enhanced article presentation and analytics.",
        "cover_image": "/images/consultingmag.webp",
        "slug": "https://www.consultingmag.com/",
        "tags": ["Redesign", "Professional Services"],
    }
]