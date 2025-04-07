/**
 * Cultural etiquette categories and information for Dubai
 */

// Define the structure of etiquette category
export interface EtiquetteCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // SVG path data
  color: string; // Tailwind color class
  examples: string[];
}

// Define the structure of etiquette information returned from API
export interface EtiquetteResponse {
  category: string;
  advice: string;
  additional_info?: string;
  do_tips?: string[];
  dont_tips?: string[];
}

// Define the cultural etiquette categories
export const etiquetteCategories: EtiquetteCategory[] = [
  {
    id: "dress-code",
    name: "Dress Code",
    description: "Appropriate attire for different settings in Dubai",
    icon: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13ZM12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    examples: [
      "What should I wear in Dubai?",
      "Dress code for mosques in Dubai",
      "Appropriate clothing for beaches in Dubai"
    ]
  },
  {
    id: "greetings",
    name: "Greetings & Gestures",
    description: "Proper ways to greet and interact with locals",
    icon: "M16.5 14.5C16.5 15.3284 15.8284 16 15 16C14.1716 16 13.5 15.3284 13.5 14.5C13.5 13.6716 14.1716 13 15 13C15.8284 13 16.5 13.6716 16.5 14.5ZM15 10.5C11.9624 10.5 9.5 12.9624 9.5 16H7C7 11.5817 10.5817 8 15 8C19.4183 8 23 11.5817 23 16H20.5C20.5 12.9624 18.0376 10.5 15 10.5Z",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    examples: [
      "How to greet Emiratis",
      "Proper handshake in Dubai",
      "Business greeting etiquette in UAE"
    ]
  },
  {
    id: "religious-customs",
    name: "Religious Customs",
    description: "Respectful behavior regarding Islamic practices",
    icon: "M12.5 3L13.5 5H21V19H3V5H10.5L11.5 3H12.5ZM4 13.5L7 9.5L10 13.5L14 8.5L20 13.5",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    examples: [
      "Ramadan etiquette in Dubai",
      "Visiting a mosque in Dubai",
      "Religious customs to be aware of in UAE"
    ]
  },
  {
    id: "dining",
    name: "Dining Etiquette",
    description: "Table manners and food customs",
    icon: "M8.5 22H15.5C17.83 22 19.74 20.3 19.95 17.99L20.7 10.99C20.97 8.02 18.8 5.5 15.81 5.5C15.27 5.5 14.74 5.29 14.35 4.9L13.17 3.73C12.6 3.16 11.4 3.16 10.83 3.73L9.65 4.91C9.26 5.3 8.73 5.5 8.19 5.5C5.2 5.5 3.03 8.02 3.3 10.99L4.05 17.99C4.26 20.3 6.17 22 8.5 22Z",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    examples: [
      "Dining etiquette in Dubai",
      "How to eat traditional Emirati food",
      "Table manners in UAE"
    ]
  },
  {
    id: "public-behavior",
    name: "Public Behavior",
    description: "Acceptable conduct in public spaces",
    icon: "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    examples: [
      "PDA rules in Dubai",
      "Public behavior expectations in UAE",
      "Photography restrictions in Dubai"
    ]
  },
  {
    id: "business",
    name: "Business Etiquette",
    description: "Professional customs and expectations",
    icon: "M22 8V16C22 17.1 21.1 18 20 18H8L4 22V4C4 2.9 4.9 2 6 2H14",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    examples: [
      "Business meeting etiquette in Dubai",
      "Gift giving in UAE business context",
      "Business card exchange customs in Dubai"
    ]
  },
  {
    id: "home-visits",
    name: "Home Visits",
    description: "Customs when visiting Emirati homes",
    icon: "M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    examples: [
      "Visiting Emirati home etiquette",
      "What to bring when invited to an Emirati house",
      "Home visit customs in Dubai"
    ]
  },
  {
    id: "gender-interactions",
    name: "Gender Interactions",
    description: "Respectful interactions between genders",
    icon: "M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z",
    color: "bg-teal-100 text-teal-700 border-teal-200",
    examples: [
      "Gender etiquette in Dubai",
      "How to interact with opposite gender in UAE",
      "Gender segregation in Dubai"
    ]
  }
];

/**
 * Find etiquette category by ID
 */
export function getEtiquetteCategoryById(id: string): EtiquetteCategory | undefined {
  return etiquetteCategories.find(category => category.id === id);
}

/**
 * Determine if a query is asking about cultural etiquette
 */
export function isCulturalEtiquetteQuery(query: string): boolean {
  const etiquetteTerms = [
    "etiquette", "custom", "tradition", "dress code", "clothing", 
    "wear", "greet", "greeting", "handshake", "gesture", 
    "nod", "bow", "religious", "islam", "mosque", "ramadan",
    "dining", "eat", "food", "restaurant", "table manner",
    "public", "behavior", "conduct", "appropriate", "acceptable",
    "photo", "picture", "business", "meeting", "professional",
    "card", "gift", "home", "visit", "house", "gender", "male", "female",
    "prayer", "modest", "modesty", "rude", "polite", "offensive"
  ];
  
  const lowerQuery = query.toLowerCase();
  return etiquetteTerms.some(term => lowerQuery.includes(term));
}

/**
 * Looks for patterns in the query to detect which etiquette category it belongs to
 */
export function detectEtiquetteCategory(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  
  // Check each category's examples and description for matches
  for (const category of etiquetteCategories) {
    // Check if any example queries match
    if (category.examples.some(example => 
      lowerQuery.includes(example.toLowerCase())
    )) {
      return category.id;
    }
    
    // Check for category-specific keywords
    const categoryWords = [
      category.name.toLowerCase(),
      category.description.toLowerCase(),
      ...category.examples.map(ex => ex.toLowerCase())
    ];
    
    // Split all words and check for matches
    const words = categoryWords.flatMap(phrase => phrase.split(/\s+/));
    if (words.some(word => word.length > 3 && lowerQuery.includes(word))) {
      return category.id;
    }
  }
  
  // Special case patterns
  if (/dress|wear|clothes|attire|outfit/i.test(lowerQuery)) {
    return "dress-code";
  } else if (/greet|handshake|hello|salaam|gesture/i.test(lowerQuery)) {
    return "greetings";
  } else if (/mosque|islam|prayer|ramadan|religious|faith/i.test(lowerQuery)) {
    return "religious-customs";
  } else if (/eat|food|dining|restaurant|meal|breakfast|lunch|dinner/i.test(lowerQuery)) {
    return "dining";
  } else if (/public|behavior|acceptable|allowed|illegal|law|rule/i.test(lowerQuery)) {
    return "public-behavior";
  } else if (/business|meeting|professional|office|work|colleague/i.test(lowerQuery)) {
    return "business";
  } else if (/home|house|visit|invitation|invit|guest|host/i.test(lowerQuery)) {
    return "home-visits";
  } else if (/gender|man|woman|male|female|interaction|touch/i.test(lowerQuery)) {
    return "gender-interactions";
  }
  
  return null;
}
