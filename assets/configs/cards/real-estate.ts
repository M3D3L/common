// why-rent-config.ts
export interface BenefitItem {
  title: string;
  description: string;
}

export const whyRentConfig = {
  sectionTitle: "Why Rent in San Carlos, Sonora?",
  sectionSubTitle: "Experience the Benefits of Coastal Living",
  title: "Save Money, Live Better",
  type: "rentals",
  subtitle: "Discover why more people are choosing to rent in San Carlos, Sonora — a beachfront paradise with real advantages.",
  footerText: "San Carlos is more than a destination it's a lifestyle.",
  benefits: [
    {
      title: 'Lower Cost of Living',
      description: 'Affordable rent, groceries, and services compared to the U.S.',
    },
    {
      title: 'Beach Lifestyle',
      description: 'Enjoy warm sun, sea breeze, and ocean views all year.',
    },
    {
      title: 'Outdoor Adventures',
      description: 'Snorkel, hike, fish, or kayak right outside your door.',
    },
  ] as BenefitItem[]
};

// why-buy-real-estate-config.ts
export interface BenefitItem {
  title: string;
  description: string;
}

export const whyBuyRealEstateConfig = {
  sectionTitle: "Why Buy Real Estate in San Carlos, Sonora?",
  sectionSubTitle: "Invest in Your Dream Coastal Home",
  title: "Own Your Paradise",
  type: "properties",
  subtitle: "Discover why purchasing property in San Carlos is a smart investment for your future and lifestyle.",
  footerText: "San Carlos real estate offers both beauty and value that appreciates over time.",
  benefits: [
    {
      title: 'Strong Investment Potential',
      description: 'Property values consistently rise in this growing coastal community.',
    },
    {
      title: 'Permanent Vacation Home',
      description: 'Have your own retreat in Mexico\'s beautiful Sea of Cortez.',
    },
    {
      title: 'Rental Income Opportunities',
      description: 'Earn income by renting your property when you\'re not using it.',
    },
  ] as BenefitItem[]
};

// why-buy-lots-config.ts
export interface BenefitItem {
  title: string;
  description: string;
}

export const whyBuyLotsConfig = {
  sectionTitle: "Why Purchase Lots in San Carlos, Sonora?",
  sectionSubTitle: "Build Your Vision from the Ground Up",
  title: "Secure Your Piece of Paradise",
  type: "lots",
  subtitle: "Discover the advantages of buying land in San Carlos - the perfect canvas for your dream home.",
  footerText: "Land ownership in San Carlos is your opportunity to create exactly what you want.",
  benefits: [
    {
      title: 'Lower Entry Cost',
      description: 'Get into the market at a more affordable price point than built homes.',
    },
    {
      title: 'Custom Design Freedom',
      description: 'Build exactly what you want rather than settling for existing layouts.',
    },
    {
      title: 'Long-Term Appreciation',
      description: 'Prime coastal land becomes more valuable as development grows.',
    },
  ] as BenefitItem[]
};

export const categories = [
  {
    sectionTitle: whyBuyRealEstateConfig.sectionTitle,
    sectionSubTitle: whyBuyRealEstateConfig.sectionSubTitle,
    name: whyBuyRealEstateConfig.title,
    type: whyBuyRealEstateConfig.type,
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
    type: whyRentConfig.type,
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
    type: whyBuyLotsConfig.type,
    description: whyBuyLotsConfig.subtitle,
    mode: 'lot',
    cta: 'Be notified about new land listings',
    benifits: whyBuyLotsConfig.benefits,
    footerText: whyBuyLotsConfig.footerText
  }
]