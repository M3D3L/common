import { Facebook, Youtube, Instagram, Music } from "lucide-vue-next";

export const seoDefaults = {
  home: {
    title: "Relocate to San Carlos Sonora, Mexico: Real Estate & Expat Guide",
    description: `Your trusted guide to Relocate to Mexico: San Carlos, Sonora Real Estate for US/Canadian Expats, Retirees, and Investors. Get expert, bilingual help finding long-term rentals & property for sale in coastal Mexico. Brenda is your specialist.`,
    keywords:
      "relocate to San Carlos, San Carlos real estate agent, San Carlos relocation specialist, move to San Carlos Mexico, San Carlos Sonora expats, buy property San Carlos, San Carlos rentals long term, Mexico coastal real estate, retire in San Carlos Sonora, relocate to mexico, move to sonora mexico, real estate in san carlos, mexico expats guide, retire in mexico",
    image: "/images/brenda.webp",
  },
};

export const contactInfo = {
  siteName: "RelocateToSanCarlos.com",
  slogan:
    "Your Expert Guide to Coastal Living and Mexico Real Estate Investment in San Carlos.",
  email: "Brenda@RelocateToSanCarlos.com",
  phone: "+52(644)457-2193",
};

// Hero Section
export const heroSection = {
  id: "hero",
  padding: "",
  video: "/videos/intro.mp4",
  headerId: "header",
  imageSrc: "/images/brenda.webp",
  imageAlt: "Brenda - San Carlos Relocation Specialist and Real Estate Agent",
  titleLine1: "San Carlos, Sonora, Mexico:",
  titleHighlight: "Relocation & Real Estate Expert",
  description: `As a dedicated Real Estate Agent and Relocation Specialist, Brenda offers seamless, bilingual support for expats, retirees, and investors moving to San Carlos, Sonora, Mexico. From finding the perfect home or rental to navigating local logistics, we make your transition to the Sea of Cortez simple and stress-free.`,
  buttons: [
    {
      link: "/blog/",
      title: "Essential Relocation Blog",
    },
    {
      link: "/#contact",
      title: "Book a Consultation",
    },
  ],
};

// Services Section
export const servicesSection = {
  title:
    "Relocate to San Carlos, Sonora: Comprehensive Real Estate and Moving Services for Expats in Mexico",
  description: `Our comprehensive services cover every detail of your move to San Carlos, Sonora, Mexico. We provide expert market analysis for buyers and investors in Mexico Real Estate, personalized property search, long-term rental assistance, and essential guidance on residency, local services, and community integration.`,
};

export const socialsSection = {
  title: "Connect With Brenda: Your San Carlos Expert",
  description:
    "Follow Brenda and RelocateToSanCarlos.com for the latest updates on San Carlos real estate trends, expat lifestyle tips, and exclusive insights.",
  socials: [
    {
      platform: "TikTok",
      handle: "@RelocateToSanCarlos",
      tagline: "Behind the Scenes of San Carlos Life",
      description: "Property tours, local tips & expat stories 🎥",
      ctaText: "Follow on TikTok",
      link: "https://www.tiktok.com/@relocatetosancarlos?is_from_webapp=1&sender_device=pc",
      imageUrl:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=1000&fit=crop",
    },
    {
      platform: "Instagram",
      handle: "@RelocateToSanCarlos",
      tagline: "Your San Carlos Journey Starts Here",
      description: "Daily updates from paradise 🌊🏡",
      ctaText: "Follow on Instagram",
      link: "https://www.instagram.com/relocatetosancarlos?igsh=anVwYW95NTMwc3E%3D&utm_source=qr",
      imageUrl:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=1000&fit=crop",
    },
    {
      platform: "Facebook",
      handle: "RelocateToSanCarlos",
      tagline: "Join Our San Carlos Expat Community",
      description: "Connect with San Carlos locals & expats 🏖️",
      ctaText: "Like Our Page", // Corrected Facebook link, assuming the intent was the Facebook page name
      link: "https://www.facebook.com/RelocateToSanCarlos",
      imageUrl:
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=1000&fit=crop",
    },
    {
      platform: "YouTube",
      handle: "RelocateToSanCarlos",
      tagline: "In-Depth San Carlos Property & Area Guides",
      description: "Tours, guides, and local insights 🎬",
      ctaText: "Subscribe on YouTube",
      link: "https://www.youtube.com/channel/UCc5E3eWOS19TF6ri4IpFGww",
      imageUrl:
        "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=800&h=1000&fit=crop",
    },
  ],
};

// Blog Section
export const blogSection = {
  title:
    "Relocate to Mexico Blog: San Carlos Real Estate & Insider Tips for Expats",
  description: `Learn everything about retiring, investing, and moving to San Carlos, Sonora, Mexico with Brenda's expert blog. We cover real estate investment strategies in Mexico, long-term rental tips, essential residency documents, and hidden local gems to help newcomers make informed decisions about coastal living.`,
};

// Contact Section
export const contactSection = {
  title: "Ready to Move? Contact Brenda, Your San Carlos Specialist",
  description: `Start your seamless move or real estate investment today. Reach out to Brenda for a personalized consultation, market insights, and full relocation guidance.`,
  formAction: "https://formsubmit.co/7cbfcf8a8143c9f8708006416b2a0aae",
  contactEmail: "Brenda@RelocateToSanCarlos.com",
  contactPhone: "+52(644)457-2193",
  videoArray: [
    "https://www.pexels.com/download/video/33792753/",
    "https://www.pexels.com/download/video/32926637/",
    "https://www.pexels.com/download/video/32106032/",
    "https://www.pexels.com/download/video/32104595/",
  ],
  imgSrc: "",
};

// Site Map - Listings are commented out as requested
export const siteMap = [
  // { label: "Real Estate", href: "/real-estate" },
  // { label: "Rentals", href: "/real-estate/rentals" },
  // { label: "Homes for Sale", href: "/real-estate/properties" },
  // { label: "Available Lots", href: "/real-estate/lots" },
  { label: "Relocation Blog", href: "/blog" },
  { label: "Contact Brenda", href: "/#contact" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/register" },
];

// Socials Icons
export const socials = [
  {
    icon: Music,
    label: "TikTok",
    href: "https://www.tiktok.com/@relocatetosancarlos?is_from_webapp=1&sender_device=pc",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/relocatetosancarlos?igsh=anVwYW95NTMwc3E%3D&utm_source=qr",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/RelocateToSanCarlos",
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCc5E3eWOS19TF6ri4IpFGww",
  },
];

// Real Estate Hero Section
export const realEstateHeroSection = {
  id: "hero",
  padding: "",
  video: "/videos/intro.mp4",
  headerId: "header",
  imageSrc: "/images/brenda.webp",
  imageAlt:
    "Brenda - San Carlos Real Estate Expert for U.S. and Canadian Expats",
  titleLine1: "Expert Realty & Relocation for",
  titleHighlight: "San Carlos, Sonora Expats",
  description: `Brenda at RelocateToSanCarlos.com offers trusted, bilingual realty services and relocation support to U.S. and Canadian clients. We specialize in long-term rentals, homes for sale, and investment lots along the Sea of Cortez. Get personalized guidance to secure your coastal future in Mexico.`,
  propertiesLink: "/#contact",
  propertiesText: "Get Personalized Property Info",
};

const categoryConfigs = {
  rentals: {
    title: "Secure Your Long-Term Rental in San Carlos",
    sectionSubTitle: "Enjoy Affordable Coastal Living",
    sectionTitle:
      "Long-Term Rental Assistance for Expats Relocating to San Carlos, Sonora, Mexico",
    type: "rentals",
    subTitle:
      "Brenda provides personalized assistance to secure the perfect long-term rental, ensuring a smooth start to your San Carlos lifestyle.",
    footerText:
      "San Carlos isn't just a destination, it's a lifestyle you can start now.",
    benefits: [
      {
        title: "Lower Cost of Living in Mexico",
        description:
          "Enjoy affordable rent, groceries, and services compared to U.S. cities.",
      },
      {
        title: "Personalized Search",
        description:
          "Let us pre-screen and tour properties to meet your exact needs before you arrive.",
      },
      {
        title: "Lease Negotiation",
        description:
          "Expert help with bilingual contracts and securing favorable terms.",
      },
    ],
    mode: "rental",
    cta: "Contact Brenda for long-term rental opportunities",
  },
  properties: {
    title: "Invest in Your San Carlos Paradise Today",
    subTitle:
      "Purchasing property in San Carlos is a smart investment and your gateway to an ideal coastal lifestyle. We guide you step-by-step.",
    sectionTitle: "Expert Real Estate Investment in San Carlos, Sonora, Mexico",
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
        title: "Trusted Guidance in Mexico",
        description:
          "Bilingual support through the entire legal and closing process.",
      },
      {
        title: "Retirement Security",
        description:
          "Own a permanent vacation home or a property for year-round coastal living.",
      },
    ],
    mode: "property",
    cta: "Schedule a consultation for home buying in San Carlos",
  },
  lots: {
    title: "Secure Your Prime Coastal Land",
    subTitle:
      "Buying land in San Carlos gives you the freedom to design your ideal home on the perfect canvas with expert construction referral support.",
    sectionTitle: "Build Your Dream Home in San Carlos, Sonora, Mexico",
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
          "Build your home exactly as you envision it, with our trusted network of builders.",
      },
      {
        title: "Long-Term Appreciation",
        description:
          "Prime coastal land increases in value as the area develops.",
      },
    ],
    mode: "lot",
    cta: "Inquire about available land and construction guidance",
  },
};

// Export categories as array for easy use
export const categories = Object.values(categoryConfigs);
