import {
  TwitterLogoIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from "@radix-icons/vue";

export const seoDefaults = {
    home: {
        title: "Relocate to San Carlos, Sonora | Expert Real Estate & Relocation Services",
        description: `RelocateToSanCarlos.com helps you move seamlessly to San Carlos, Sonora. Discover your dream home, find ideal rental properties, or invest in prime lots along the breathtaking Sea of Cortez. Our expert relocation services guide you through every step, from property tours to settling into your new coastal lifestyle.`,
        keywords: "San Carlos real estate, San Carlos relocation services, San Carlos property rentals, San Carlos homes for sale, San Carlos lots for sale, move to San Carlos, invest in San Carlos real estate",
        image: "/images/brenda.png",
    },
}

export const contactInfo = {
    siteName: "RelocateToSanCarlos.com",
    slogan: "Invest in San Carlos, live like a local.",
    email: "brenda@gmail.com",
    phone: "+52 (644) 194-2391",
}

// Hero Section
export const heroSection = {
  id: "hero",
  padding: "",
  video: "/videos/intro.mp4",
  headerId: "header",
  imageSrc: "/images/brenda.png",
  imageAlt: "Brenda - San Carlos Real Estate Agent",
  titleLine1: "Relocate to",
  titleHighlight: "San Carlos, Sonora",
  description: `RelocateToSanCarlos.com helps you move seamlessly to San Carlos, Sonora. 
Discover your dream home, find ideal rental properties, or invest in prime lots along 
the breathtaking Sea of Cortez. Our expert relocation services guide you through every step, 
from property tours to settling into your new coastal lifestyle.`,
  propertiesLink: "/real-estate/",
  propertiesText: "Explore Properties",
};

// Services Section
export const servicesSection = {
  title: "San Carlos Relocation & Real Estate Services",
  description: `Our comprehensive relocation services make moving to San Carlos, Sonora simple and stress-free. 
Whether you're buying, renting, or investing, we provide expert guidance on properties, local amenities, 
and community insights to help you settle into your new home with confidence.`,
};

// Socials Section
export const socialsSection = {
  title: "Connect With Us on Social Media",
  description:
    "Follow Brenda and RelocateToSanCarlos.com for the latest updates on San Carlos real estate, rental opportunities, and lifestyle tips.",
  socials: [
    {
      title: "RelocateToSanCarlos.com",
      description: "Expert guidance for relocating to San Carlos. 🌊🏡",
      likes: 1245,
      imageUrl: "https://picsum.photos/400/400?random=1",
    },
    {
      title: "SanCarlosNomad",
      description: "Remote work and life in paradise. 💻🌮",
      likes: 842,
      imageUrl: "https://picsum.photos/400/400?random=2",
    },
    {
      title: "OceanViewHomes",
      description: "Find your perfect coastal home. ☕🌅",
      likes: 2301,
      imageUrl: "https://picsum.photos/400/400?random=3",
    },
    {
      title: "SonoraAdventures",
      description: "Explore San Carlos like a local. 🚣‍♂️🔥",
      likes: 563,
      imageUrl: "https://picsum.photos/400/400?random=4",
    },
    {
      title: "TasteSanCarlos",
      description: "Local cuisine, seafood, and culture. 🦐🍺",
      likes: 1769,
      imageUrl: "https://picsum.photos/400/400?random=5",
    },
    {
      title: "DesertMeetsSea",
      description: "Experience San Carlos nature and beaches. 🌵🌊",
      likes: 987,
      imageUrl: "https://picsum.photos/400/400?random=6",
    },
  ],
};

// Blog Section
export const blogSection = {
  title: "San Carlos Relocation Blog: Tips, Insights, and Property Guides",
  description: `Learn everything about moving to San Carlos, Sonora with our expert blog. 
From real estate investment strategies to rental tips and hidden local gems, 
we help newcomers and investors make informed decisions about coastal living.`,
};

// Contact Section
export const contactSection = {
  title: "Get in Touch with Brenda",
  description: `Ready to start your move or invest in San Carlos real estate? 
Reach out to Brenda for personalized advice, property tours, and relocation guidance.`,
  formAction: "https://formsubmit.co/7cbfcf8a8143c9f8708006416b2a0aae",
  contactEmail: "brenda@gmail.com",
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
  { label: "Real Estate", href: "/real-estate" },
  { label: "Rentals", href: "/real-estate/rentals" },
  { label: "Homes for Sale", href: "/real-estate/properties" },
  { label: "Available Lots", href: "/real-estate/lots" },
  { label: "Relocation Blog", href: "/blog" },
  { label: "Contact Brenda", href: "/#contact" },
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

// Real Estate Hero Section
export const realEstateHeroSection = {
  id: "hero",
  padding: "",
  video: "/videos/intro.mp4",
  headerId: "header",
  imageSrc: "/images/brenda.png",
  imageAlt: "Brenda - San Carlos Real Estate Expert",
  titleLine1: "Expert Realty Services in",
  titleHighlight: "San Carlos, Sonora",
  description: `Brenda at RelocateToSanCarlos.com helps buyers, renters, and investors navigate the San Carlos real estate market. 
Explore homes, rentals, and lots along the beautiful Sea of Cortez. With personalized tours and step-by-step guidance, 
we make starting your coastal lifestyle simple and enjoyable.`,
  propertiesLink: "/real-estate/",
  propertiesText: "Browse Listings",
};

const categoryConfigs = {
  rentals: {
    title: "Start Your Beach Lifestyle Today",
    sectionSubTitle: "Enjoy Affordable Coastal Living",
    sectionTitle: "Live by the Beach in San Carlos, Sonora",
    type: "rentals",
    subTitle:
      "Experience comfort, adventure, and affordability by renting in San Carlos, Mexico’s coastal paradise.",
    footerText:
      "San Carlos isn’t just a destination, it’s a lifestyle you can start now.",
    benefits: [
      {
        title: "Lower Cost of Living",
        description:
          "Enjoy affordable rent, groceries, and services compared to U.S. cities.",
      },
      {
        title: "Beachfront Lifestyle",
        description:
          "Wake up to warm sun, ocean breezes, and stunning Sea of Cortez views every day.",
      },
      {
        title: "Outdoor Adventures",
        description:
          "Snorkel, hike, fish, or kayak, all right outside your door.",
      },
    ],
    mode: "rental",
    cta: "Receive rental opportunities first",
  },
  properties: {
    title: "Own Your Paradise Today",
    subTitle:
      "Purchasing property in San Carlos is a smart investment and your gateway to an ideal coastal lifestyle.",
    sectionTitle: "Invest in Real Estate in San Carlos, Sonora",
    sectionSubTitle: "Secure Your Dream Coastal Home",
    type: "properties",
    footerText:
      "San Carlos real estate offers both beauty and long-term value growth.",
    benefits: [
      {
        title: "Strong Investment Potential",
        description:
          "Property values in this thriving coastal community continue to rise.",
      },
      {
        title: "Permanent Vacation Home",
        description:
          "Own a private retreat on Mexico's stunning Sea of Cortez.",
      },
      {
        title: "Rental Income Opportunities",
        description:
          "Generate income by renting your property when you’re not using it.",
      },
    ],
    mode: "property",
    cta: "Get exclusive home listings in San Carlos",
  },
  lots: {
    title: "Secure Your Piece of Paradise",
    subTitle:
      "Buying land in San Carlos gives you the freedom to design your ideal home on the perfect canvas.",
    sectionTitle: "Build Your Dream Home in San Carlos, Sonora",
    sectionSubTitle: "Prime Coastal Land Available Now",
    type: "lots",
    footerText:
      "Owning land in San Carlos allows you to create exactly the lifestyle you want.",
    benefits: [
      {
        title: "Lower Entry Cost",
        description:
          "Enter the market at a more affordable price than purchasing a completed home.",
      },
      {
        title: "Custom Design Freedom",
        description:
          "Build your home exactly as you envision it, without compromises.",
      },
      {
        title: "Long-Term Appreciation",
        description:
          "Prime coastal land increases in value as the area develops.",
      },
    ],
    mode: "lot",
    cta: "Be notified about new land listings",
  },
};

// Export categories as array for easy use
export const categories = Object.values(categoryConfigs);
