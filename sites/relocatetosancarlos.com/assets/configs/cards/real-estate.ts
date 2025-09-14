export interface BenefitItem {
  title: string;
  description: string;
}

export const whyRentConfig = {
  sectionTitle: "Live by the Beach in San Carlos, Sonora",
  sectionSubTitle: "Enjoy Affordable Coastal Living",
  title: "Start Your Beach Lifestyle Today",
  type: "rentals",
  subtitle: "Experience comfort, adventure, and affordability by renting in San Carlos, Mexico’s coastal paradise.",
  footerText: "San Carlos isn’t just a destination, it’s a lifestyle you can start now.",
  benefits: [
    {
      title: 'Lower Cost of Living',
      description: 'Enjoy affordable rent, groceries, and services compared to U.S. cities.',
    },
    {
      title: 'Beachfront Lifestyle',
      description: 'Wake up to warm sun, ocean breezes, and stunning Sea of Cortez views every day.',
    },
    {
      title: 'Outdoor Adventures',
      description: 'Snorkel, hike, fish, or kayak, all right outside your door.',
    },
  ] as BenefitItem[]
};

// why-buy-real-estate-config.ts
export interface BenefitItem {
  title: string;
  description: string;
}

export const whyBuyRealEstateConfig = {
  sectionTitle: "Invest in Real Estate in San Carlos, Sonora",
  sectionSubTitle: "Secure Your Dream Coastal Home",
  title: "Own Your Paradise Today",
  type: "properties",
  subtitle: "Purchasing property in San Carlos is a smart investment and your gateway to an ideal coastal lifestyle.",
  footerText: "San Carlos real estate offers both beauty and long-term value growth.",
  benefits: [
    {
      title: 'Strong Investment Potential',
      description: 'Property values in this thriving coastal community continue to rise.',
    },
    {
      title: 'Permanent Vacation Home',
      description: 'Own a private retreat on Mexico\'s stunning Sea of Cortez.',
    },
    {
      title: 'Rental Income Opportunities',
      description: 'Generate income by renting your property when you’re not using it.',
    },
  ] as BenefitItem[]
};

// why-buy-lots-config.ts
export interface BenefitItem {
  title: string;
  description: string;
}

export const whyBuyLotsConfig = {
  sectionTitle: "Build Your Dream Home in San Carlos, Sonora",
  sectionSubTitle: "Prime Coastal Land Available Now",
  title: "Secure Your Piece of Paradise",
  type: "lots",
  subtitle: "Buying land in San Carlos gives you the freedom to design your ideal home on the perfect canvas.",
  footerText: "Owning land in San Carlos allows you to create exactly the lifestyle you want.",
  benefits: [
    {
      title: 'Lower Entry Cost',
      description: 'Enter the market at a more affordable price than purchasing a completed home.',
    },
    {
      title: 'Custom Design Freedom',
      description: 'Build your home exactly as you envision it, without compromises.',
    },
    {
      title: 'Long-Term Appreciation',
      description: 'Prime coastal land increases in value as the area develops.',
    },
  ] as BenefitItem[]
};

export const categories = [
  {
    sectionTitle: whyBuyRealEstateConfig.sectionTitle,
    sectionSubTitle: whyBuyRealEstateConfig.sectionSubTitle,
    name: whyBuyRealEstateConfig.title,
    description: whyBuyRealEstateConfig.subtitle,
    mode: 'property',
    cta: 'Get exclusive home listings in San Carlos',
    benifits: whyBuyRealEstateConfig.benefits,
    footerText: whyBuyRealEstateConfig.footerText
  },
  {
    sectionTitle: whyRentConfig.sectionTitle,
    sectionSubTitle: whyRentConfig.sectionSubTitle,
    name: whyRentConfig.title,
    description: whyRentConfig.subtitle,
    mode: 'rental',
    cta: 'Receive rental opportunities first',
    benifits: whyRentConfig.benefits,
    footerText: whyRentConfig.footerText
  },
  {
    sectionTitle: whyBuyLotsConfig.sectionTitle,
    sectionSubTitle: whyBuyLotsConfig.sectionSubTitle,
    name: whyBuyLotsConfig.title,
    description: whyBuyLotsConfig.subtitle,
    mode: 'lot',
    cta: 'Be notified about new land listings',
    benifits: whyBuyLotsConfig.benefits,
    footerText: whyBuyLotsConfig.footerText
  }
];
