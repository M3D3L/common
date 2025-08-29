export const onboardingQuestions = [
  {
    type: "Retirees",
    questions: [
      {
        type: 'radio',
        question: "Do you need medical assistance at home?",
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]
      },
      {
        type: 'radio',
        question: "Are you looking to buy or rent a home?",
        options: [
          { value: 'buy', label: 'Buy' },
          { value: 'rent', label: 'Rent' },
        ]
      },
      {
        type: 'radio',
        question: "Are you here for a short term or long term?",
        options: [
          { value: 'short', label: 'Short term (less than 6 months)' },
          { value: 'long', label: 'Long term (more than 6 months)' },
        ]
      },
      {
        type: 'slider',
        question: "What is your monthly budget?",
        min: 0,
        max: 10000
      },
      {
        type: 'number',
        question: "How many people will be in the household?",
        min: 1,
        max: 10
      }
    ]
  },
  {
    type: "Family Adventurers",
    questions: [
      {
        type: 'radio',
        question: "Do you need to enroll kids in school?",
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]
      },
      {
        type: 'radio',
        question: "Are you here for a short term or long term?",
        options: [
          { value: 'short', label: 'Short term' },
          { value: 'long', label: 'Long term' },
        ]
      },
      {
        type: 'slider',
        question: "What is your monthly budget?",
        min: 0,
        max: 15000
      },
      {
        type: 'number',
        question: "How many people will be in the household?",
        min: 1,
        max: 15
      }
    ]
  },
  {
    type: "Digital Nomads",
    questions: [
      {
        type: 'number',
        question: "How many people are in your group?",
        min: 1,
        max: 10
      },
      {
        type: 'radio',
        question: "Are you here for a short term or long term?",
        options: [
          { value: 'short', label: 'Short term' },
          { value: 'long', label: 'Long term' },
        ]
      },
      {
        type: 'radio',
        question: "Are you looking to buy or rent?",
        options: [
          { value: 'buy', label: 'Buy' },
          { value: 'rent', label: 'Rent' },
        ]
      }
    ]
  },
  {
    type: "SnowBirds",
    questions: [
      {
        type: 'radio',
        question: "Are you looking to buy or rent a home?",
        options: [
          { value: 'buy', label: 'Buy' },
          { value: 'rent', label: 'Rent' },
        ]
      },
      {
        type: 'radio',
        question: "Are you here for a short term or long term?",
        options: [
          { value: 'short', label: 'Short term (less than 6 months)' },
          { value: 'long', label: 'Long term (more than 6 months)' },
        ]
      },
      {
        type: 'slider',
        question: "What is your monthly budget?",
        min: 0,
        max: 10000
      },
      {
        type: 'number',
        question: "How many people will be in the household?",
        min: 1,
        max: 10
      }
    ]
  },
  // {
  //   type: "Vacation",
  //   questions: [
  //     {
  //       type: 'number',
  //       question: "How many people are in your group?",
  //       min: 1,
  //       max: 20
  //     },
  //     {
  //       type: 'number',
  //       question: "How many weeks will you be staying?",
  //       min: 1,
  //       max: 52
  //     },
  //     {
  //       type: 'text',
  //       question: "What are the ages of the family members?",
  //       placeholder: "e.g., 2 adults, 3 kids (ages 5, 8, 12)"
  //     }
  //   ]
  // },
]