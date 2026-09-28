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

export interface UserContext {
  diet?: string;
  concerns?: string[];
  hairDensity?: string;
  scalpHealth?: string;
  hairThickness?: string;
  signsOfDamage?: string;
  overallAssessment?: string;
  notableObservations?: string[];
}

export async function generateWellnessPlanAI(
  userContext: UserContext
): Promise<GeneratedWellnessPlan> {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  // Build dynamic customized fallback plan tailored to the user's hair photo findings
  const density = userContext.hairDensity || 'Moderate';
  const scalp = userContext.scalpHealth || 'Good';
  const thickness = userContext.hairThickness || 'Normal';
  const damage = userContext.signsOfDamage || 'Minimal';
  const observations = userContext.notableObservations?.join('. ') || 'Mild thinning at crown area';
  const concernsStr = userContext.concerns?.join(', ') || 'Hair shedding and volume';

  const dynamicSummary = `Personalized trichology plan generated for ${density} hair density, ${scalp.toLowerCase()} scalp condition, and ${thickness.toLowerCase()} strand thickness observed in your photo scan.`;

  const dynamicPlan: GeneratedWellnessPlan = {
    summary: dynamicSummary,
    nutrients: [
      { name: 'Protein & Keratin', benefit: `Strengthens ${thickness.toLowerCase()} hair shaft structure`, category: 'Macronutrient', color: 'coral' },
      { name: 'Iron & Folate', benefit: `Encourages oxygen delivery to scalp with ${density.toLowerCase()} density`, category: 'Mineral', color: 'red' },
      { name: 'Zinc', benefit: `Balances sebum secretion for ${scalp.toLowerCase()} scalp health`, category: 'Mineral', color: 'green' },
      { name: 'Omega-3 Fatty Acids', benefit: `Hydrates scalp and repairs ${damage.toLowerCase()} strand damage`, category: 'Essential Fatty Acid', color: 'gold' },
      { name: 'B-Complex & Biotin', benefit: `Fosters active follicle micro-circulation for ${concernsStr}`, category: 'Vitamin', color: 'purple' },
    ],
    recommendedFoods: [
      { name: 'Eggs & Dairy', category: 'Protein & Biotin', benefit: 'Directly supports keratin synthesis to combat thinning' },
      { name: 'Salmon & Sardines', category: 'Omega-3', benefit: 'Calms scalp dryness and promotes natural shine' },
      { name: 'Spinach & Dark Greens', category: 'Iron & Folate', benefit: 'Prevents nutritional shedding and fuels hair roots' },
      { name: 'Almonds & Pumpkin Seeds', category: 'Zinc & Vitamin E', benefit: 'Maintains healthy scalp sebum regulation' },
      { name: 'Lentils & Chickpeas', category: 'Plant Protein', benefit: 'Provides steady amino acids for strand thickness' },
      { name: 'Blueberries & Citrus', category: 'Vitamin C', benefit: 'Protects follicles from environmental oxidative stress' },
    ],
    routineSuggestions: [
      {
        title: scalp.includes('Dry') ? 'Hydrating Scalp Wash' : 'Gentle Cleansing Routine',
        frequency: '2-3 times/week',
        instructions: `Use sulfate-free shampoo tailored for ${scalp.toLowerCase()} scalp condition; rinse thoroughly with lukewarm water.`
      },
      {
        title: damage.includes('High') || damage.includes('Moderate') ? 'Intensive Bond Repair Mask' : 'Deep Moisture Mask',
        frequency: 'Once a week',
        instructions: `Apply rich conditioning mask from mid-lengths to ends to treat ${damage.toLowerCase()} hair damage.`
      },
      {
        title: 'Micro-Circulation Scalp Massage',
        frequency: 'Daily (5 mins)',
        instructions: `Gently massage scalp with fingertips to stimulate blood flow to ${density.toLowerCase()} density areas.`
      },
    ],
    lifestyleHabits: [
      { title: 'Hydration Target', recommendation: 'Drink at least 2.5 Liters of water daily to maintain scalp moisture balance.' },
      { title: 'Stress & Sleep Balance', recommendation: 'Aim for 7-8 hours of sleep to minimize cortisol-induced hair shedding.' },
      { title: 'Thermal Protection', recommendation: 'Limit hot styling tools to <180°C and always apply heat protectant spray.' },
    ],
    disclaimer: 'This plan provides general wellness and nutrition guidance derived from your visual hair photo analysis.',
  };

  if (!apiKey) {
    return dynamicPlan;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `You are a professional Trichology and Hair Care AI Specialist.
Create a customized wellness plan BASED ON THE USER'S UPLOADED HAIR PHOTO ANALYSIS FINDINGS:

User Hair Photo Visual Analysis Findings:
- Assessed Hair Density: ${density}
- Scalp Condition: ${scalp}
- Hair Thickness: ${thickness}
- Signs of Hair Damage: ${damage}
- Notable Photo Observations: ${observations}
- Primary Concerns: ${concernsStr}
- Dietary Preference: ${userContext.diet || 'Balanced'}

Generate a structured personalized wellness plan JSON adhering strictly to this schema:
{
  "summary": "AI-generated summary linking hair photo findings to the plan",
  "nutrients": [
    { "name": "Protein", "benefit": "Supports hair growth and strength", "category": "Macronutrient", "color": "coral" },
    { "name": "Iron", "benefit": "Helps prevent hair fall", "category": "Mineral", "color": "red" },
    { "name": "Zinc", "benefit": "Supports hair tissue repair", "category": "Mineral", "color": "green" },
    { "name": "Omega-3", "benefit": "Nourishes scalp and reduces inflammation", "category": "Essential Fatty Acid", "color": "gold" }
  ],
  "recommendedFoods": [
    { "name": "Eggs", "category": "Protein & Biotin", "benefit": "Essential building blocks for hair" },
    { "name": "Salmon", "category": "Omega-3", "benefit": "Scalp hydration" },
    { "name": "Spinach", "category": "Iron & Folate", "benefit": "Follicle oxygenation" },
    { "name": "Nuts", "category": "Zinc & Vitamin E", "benefit": "Cell membrane protection" }
  ],
  "routineSuggestions": [
    { "title": "Gentle Cleansing", "frequency": "2-3 times/week", "instructions": "Sulfate-free wash tailored for hair findings" }
  ],
  "lifestyleHabits": [
    { "title": "Optimal Hydration", "recommendation": "Drink 2.5L water daily" }
  ],
  "disclaimer": "This plan provides general wellness guidance derived from your hair photo analysis."
}
Return ONLY valid JSON without markdown code blocks.`;

    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    let textResponse = '';

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(prompt);
        textResponse = response.response.text();
        if (textResponse) break;
      } catch (e) {}
    }

    if (!textResponse) {
      return dynamicPlan;
    }

    const cleaned = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      summary: parsed.summary || dynamicPlan.summary,
      nutrients: Array.isArray(parsed.nutrients) && parsed.nutrients.length ? parsed.nutrients : dynamicPlan.nutrients,
      recommendedFoods: Array.isArray(parsed.recommendedFoods) && parsed.recommendedFoods.length ? parsed.recommendedFoods : dynamicPlan.recommendedFoods,
      routineSuggestions: Array.isArray(parsed.routineSuggestions) && parsed.routineSuggestions.length ? parsed.routineSuggestions : dynamicPlan.routineSuggestions,
      lifestyleHabits: Array.isArray(parsed.lifestyleHabits) && parsed.lifestyleHabits.length ? parsed.lifestyleHabits : dynamicPlan.lifestyleHabits,
      disclaimer: 'This plan provides general wellness guidance derived from your hair photo analysis.',
    };
  } catch (error) {
    logger.error({ error }, 'Gemini Wellness Plan AI generation fallback triggered');
    return dynamicPlan;
  }
}
