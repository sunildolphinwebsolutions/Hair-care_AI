import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { logger } from '../middleware/logger';

export interface NutrientItem {
  name: string;
  benefit: string;
  category: string;
  color: string;
}

export interface FoodItem {
  name: string;
  category: string;
  benefit: string;
}

export interface RoutineSuggestion {
  title: string;
  frequency: string;
  instructions: string;
}

export interface LifestyleHabit {
  title: string;
  recommendation: string;
}

export interface GeneratedWellnessPlan {
  summary: string;
  nutrients: NutrientItem[];
  recommendedFoods: FoodItem[];
  routineSuggestions: RoutineSuggestion[];
  lifestyleHabits: LifestyleHabit[];
  disclaimer: string;
}

// Curated Professional Hair Care & Nutrition Knowledge Base
export const CURATED_NUTRIENTS: NutrientItem[] = [
  { name: 'Protein', benefit: 'Supports hair growth and strength', category: 'Macronutrient', color: 'coral' },
  { name: 'Iron', benefit: 'Helps prevent hair fall', category: 'Mineral', color: 'red' },
  { name: 'Zinc', benefit: 'Supports hair tissue repair', category: 'Mineral', color: 'green' },
  { name: 'Omega-3', benefit: 'Nourishes scalp and reduces inflammation', category: 'Essential Fatty Acid', color: 'gold' },
  { name: 'Vitamin D', benefit: 'Supports healthy hair follicles', category: 'Vitamin', color: 'purple' },
];

export const CURATED_FOODS: FoodItem[] = [
  { name: 'Eggs', category: 'Protein & Biotin', benefit: 'Essential building blocks for keratin synthesis' },
  { name: 'Salmon', category: 'Omega-3 & Vitamin D', benefit: 'Provides natural shine and scalp hydration' },
  { name: 'Spinach', category: 'Iron & Folate', benefit: 'Boosts oxygen circulation to scalp follicles' },
  { name: 'Nuts', category: 'Zinc & Vitamin E', benefit: 'Protects hair cell membranes from oxidative stress' },
  { name: 'Lentils', category: 'Plant Protein & Folic Acid', benefit: 'Nourishes roots and strengthens strands' },
  { name: 'Berries', category: 'Vitamin C & Antioxidants', benefit: 'Enhances collagen production and iron absorption' },
];

export const CURATED_ROUTINE: RoutineSuggestion[] = [
  { title: 'Gentle Cleansing', frequency: '2-3 times/week', instructions: 'Use sulfate-free shampoo focused on scalp cleansing with lukewarm water.' },
  { title: 'Deep Conditioning Mask', frequency: 'Once a week', instructions: 'Apply moisture-rich mask from mid-lengths to ends; leave on for 10-15 minutes.' },
  { title: 'Scalp Massage', frequency: 'Daily (5 mins)', instructions: 'Massage scalp gently with fingertips or light jojoba oil to stimulate microcirculation.' },
];

export const CURATED_LIFESTYLE: LifestyleHabit[] = [
  { title: 'Optimal Hydration', recommendation: 'Drink at least 2.5 Liters of water daily to maintain scalp moisture balance.' },
  { title: 'Stress Management', recommendation: 'Practice 10 minutes of daily mindfulness or deep breathing to minimize stress-induced shedding.' },
  { title: 'Heat Protection', recommendation: 'Limit heat styling tools to <180°C and always apply thermal protectant spray.' },
];

export async function generateWellnessPlanAI(
  userContext: { diet?: string; concerns?: string[]; hairDensity?: string; scalpHealth?: string }
): Promise<GeneratedWellnessPlan> {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  const defaultPlan: GeneratedWellnessPlan = {
    summary: 'A complete plan for healthier, stronger hair based on your visual analysis and lifestyle profile.',
    nutrients: CURATED_NUTRIENTS,
    recommendedFoods: CURATED_FOODS,
    routineSuggestions: CURATED_ROUTINE,
    lifestyleHabits: CURATED_LIFESTYLE,
    disclaimer: 'This plan provides general wellness and nutrition education, not a medical diagnosis or treatment.',
  };

  if (!apiKey) {
    return defaultPlan;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a professional Trichology and Nutrition AI Coach.
User Profile:
- Hair Concerns: ${userContext.concerns?.join(', ') || 'Thinning hair, hair fall'}
- Diet Preference: ${userContext.diet || 'Balanced'}
- Assessed Density: ${userContext.hairDensity || 'Moderate'}
- Scalp Condition: ${userContext.scalpHealth || 'Good'}

Generate a structured personalized wellness plan JSON adhering strictly to this schema:
{
  "summary": "A complete plan for healthier, stronger hair based on your analysis and lifestyle.",
  "nutrients": [
    { "name": "Protein", "benefit": "Supports hair growth and strength", "category": "Macronutrient", "color": "coral" },
    { "name": "Iron", "benefit": "Helps prevent hair fall", "category": "Mineral", "color": "red" },
    { "name": "Zinc", "benefit": "Supports hair tissue repair", "category": "Mineral", "color": "green" },
    { "name": "Omega-3", "benefit": "Nourishes scalp and reduces inflammation", "category": "Essential Fatty Acid", "color": "gold" },
    { "name": "Vitamin D", "benefit": "Supports healthy hair follicles", "category": "Vitamin", "color": "purple" }
  ],
  "recommendedFoods": [
    { "name": "Eggs", "category": "Protein & Biotin", "benefit": "Essential building blocks for hair" },
    { "name": "Salmon", "category": "Omega-3", "benefit": "Scalp hydration" },
    { "name": "Spinach", "category": "Iron & Folate", "benefit": "Follicle oxygenation" },
    { "name": "Nuts", "category": "Zinc & Vitamin E", "benefit": "Cell membrane protection" },
    { "name": "Lentils", "category": "Plant Protein", "benefit": "Nourishes roots" },
    { "name": "Berries", "category": "Antioxidants", "benefit": "Collagen production" }
  ],
  "routineSuggestions": [
    { "title": "Gentle Cleansing", "frequency": "2-3 times/week", "instructions": "Sulfate-free wash" }
  ],
  "lifestyleHabits": [
    { "title": "Optimal Hydration", "recommendation": "Drink 2.5L water daily" }
  ],
  "disclaimer": "This plan provides general wellness and nutrition education, not a medical diagnosis or treatment."
}
Return ONLY valid JSON without markdown code blocks.`;

    const response = await model.generateContent(prompt);
    const cleaned = response.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      summary: parsed.summary || defaultPlan.summary,
      nutrients: Array.isArray(parsed.nutrients) ? parsed.nutrients : defaultPlan.nutrients,
      recommendedFoods: Array.isArray(parsed.recommendedFoods) ? parsed.recommendedFoods : defaultPlan.recommendedFoods,
      routineSuggestions: Array.isArray(parsed.routineSuggestions) ? parsed.routineSuggestions : defaultPlan.routineSuggestions,
      lifestyleHabits: Array.isArray(parsed.lifestyleHabits) ? parsed.lifestyleHabits : defaultPlan.lifestyleHabits,
      disclaimer: 'This plan provides general wellness and nutrition education, not a medical diagnosis or treatment.',
    };
  } catch (error) {
    logger.error({ error }, 'Gemini Wellness Plan AI generation fallback triggered');
    return defaultPlan;
  }
}
