export const onboardingQuestions = [
  {
    type: "Retirees",
    questions: [
      {
        type: 'radio',
        question: "What is your preferred climate for retirement?",
        options: [
          { value: 'tropical', label: 'Tropical' },
          { value: 'temperate', label: 'Temperate' },
          { value: 'arid', label: 'Arid' },
        ]
      },
      {
        type: 'checkbox',
        question: "What activities do you enjoy?",
        options: [
          { value: 'golf', label: 'Golf' },
          { value: 'fishing', label: 'Fishing' },
          { value: 'hiking', label: 'Hiking' },
        ]
      },
      {
        type: 'text',
        question: "What is your ideal retirement location?",
        placeholder: "Enter a city or region"
      }
    ]
  },
  {
    type: "SnowBirds",
    questions: [
      {
        type: 'radio',
        question: "What is your preferred climate for winter?",
        options: [
          { value: 'tropical', label: 'Tropical' },
          { value: 'temperate', label: 'Temperate' },
          { value: 'arid', label: 'Arid' },
        ]
      },
      {
        type: 'checkbox',
        question: "What activities do you enjoy during winter?",
        options: [
          { value: 'skiing', label: 'Skiing' },
          { value: 'snowboarding', label: 'Snowboarding' },
          { value: 'hiking', label: 'Hiking' },
        ]
      },
      {
        type: 'text',
        question: "What is your ideal winter location?",
        placeholder: "Enter a city or region"
      }
    ]
  },
  {
    type: "Digital Nomads",
    questions: [
      {
        type: 'radio',
        question: "What is your preferred work environment?",
        options: [
          { value: 'beach', label: 'Beach' },
          { value: 'mountains', label: 'Mountains' },
          { value: 'city', label: 'City' },
        ]
      },
      {
        type: 'checkbox',
        question: "What activities do you enjoy while working remotely?",
        options: [
          { value: 'yoga', label: 'Yoga' },
          { value: 'surfing', label: 'Surfing' },
          { value: 'hiking', label: 'Hiking' },
        ]
      },
      {
        type: 'text',
        question: "What is your ideal location for remote work?",
        placeholder: "Enter a city or region"
      }
    ]
  },
  {
    type: "Family Adventurers",
    questions: [
      {
        type: 'radio',
        question: "What is your preferred family vacation style?",
        options: [
          { value: 'beach', label: 'Beach' },
          { value: 'mountains', label: 'Mountains' },
          { value: 'city', label: 'City' },
        ]
      },
      {
        type: 'checkbox',
        question: "What activities do you enjoy as a family?",
        options: [
          { value: 'theme_parks', label: 'Theme Parks' },
          { value: 'nature_trails', label: 'Nature Trails' },
          { value: 'cultural_sites', label: 'Cultural Sites' },
        ]
      },
      {
        type: 'text',
        question: "What is your ideal family vacation location?",
        placeholder: "Enter a city or region"
      }
    ]
  }
]