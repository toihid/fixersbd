import type { SmartSearchMapping } from "@/types";

// Smart intent detection: maps natural language queries to categories
const searchMappings: SmartSearchMapping[] = [
  {
    keywords: ["fan", "light", "wiring", "switch", "socket", "electrical", "power", "voltage", "circuit", "fuse", "elec"],
    category: "Electrician",
  },
  {
    keywords: ["water", "leak", "pipe", "tap", "drain", "toilet", "bathroom", "plumb", "faucet", "sewage"],
    category: "Plumber",
  },
  {
    keywords: ["wood", "furniture", "door", "window", "cabinet", "shelf", "table", "chair", "carpen"],
    category: "Carpenter",
  },
  {
    keywords: ["ac", "air conditioner", "cooling", "hvac", "compressor", "refrigerator", "fridge"],
    category: "AC Technician",
  },
  {
    keywords: ["car", "engine", "brake", "tire", "oil change", "auto", "vehicle", "gear"],
    category: "Car Mechanic",
  },
  {
    keywords: ["bike", "motorcycle", "scooter", "two wheeler", "chain", "kick"],
    category: "Motorcycle Mechanic",
  },
  {
    keywords: ["labor", "daily", "helper", "loading", "unloading", "shifting", "moving"],
    category: "Daily Worker",
  },
  {
    keywords: ["clean", "wash", "mop", "dust", "sweep", "housekeeping", "sanitize"],
    category: "Cleaner",
  },
  {
    keywords: ["cook", "food", "chef", "meal", "kitchen", "catering", "recipe"],
    category: "Cook",
  },
  {
    keywords: ["baby", "child", "nanny", "babysit", "childcare", "kids"],
    category: "Babysitter",
  },
  {
    keywords: ["paint", "wall", "color", "coating", "whitewash"],
    category: "Painter",
  },
  {
    keywords: ["mason", "brick", "cement", "concrete", "construction", "building", "plaster"],
    category: "Mason",
  },
  {
    keywords: ["delivery", "courier", "parcel", "send", "pickup", "drop"],
    category: "Delivery Helper",
  },
  {
    keywords: ["tubewell", "tube-well", "boring", "water pump", "submersible", "well"],
    category: "Tube-well Mechanic",
  },
];

export function detectCategory(query: string): string | null {
  const lower = query.toLowerCase().trim();

  for (const mapping of searchMappings) {
    for (const keyword of mapping.keywords) {
      if (lower.includes(keyword)) {
        return mapping.category;
      }
    }
  }

  return null;
}

export function getAutoSuggestions(query: string): string[] {
  if (!query || query.length < 2) return [];
  const lower = query.toLowerCase();

  const suggestions: string[] = [];
  for (const mapping of searchMappings) {
    // Match category name
    if (mapping.category.toLowerCase().includes(lower)) {
      suggestions.push(mapping.category);
      continue;
    }
    // Match keywords
    for (const keyword of mapping.keywords) {
      if (keyword.includes(lower)) {
        suggestions.push(mapping.category);
        break;
      }
    }
  }

  return Array.from(new Set(suggestions)).slice(0, 5);
}

export function getAllCategories(): string[] {
  return searchMappings.map((m) => m.category);
}
