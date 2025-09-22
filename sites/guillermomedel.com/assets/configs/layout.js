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

// Hero Section
export const heroSection = {
  id: "hero",
  headerId: "header",
  imageSrc: "/images/block-me.png",
  imageAlt: "Guillermo Medel - Full-Stack Developer",
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
