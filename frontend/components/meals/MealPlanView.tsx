"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Utensils,
  Sparkles,
  Clock,
  CheckCircle2,
  Flame,
  Droplets,
  Heart,
  Calendar,
  Check,
  ChevronRight,
  Leaf,
  Plus,
  RefreshCw,
  ShoppingBag,
  Lightbulb,
  ArrowRight,
  Award
} from 'lucide-react';

interface Meal {
  id: string;
  type: string;
  time: string;
  title: string;
  description: string;
  calories: string;
  nutrients: string[];
  ingredients: string[];
  bg: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WEEKLY_MEALS: Record<string, Meal[]> = {
  Mon: [
    {
      id: 'm1',
      type: 'Breakfast',
      time: '8:00 AM',
      title: 'Biotin Berry Oatmeal Bowl',
      description: 'Rolled oats cooked in almond milk, topped with fresh blueberries, chopped walnuts, chia seeds, and raw honey.',
      calories: '340 kcal',
      nutrients: ['Protein: 14g', 'Biotin: 25mcg', 'Omega-3: 1.8g'],
      ingredients: ['1/2 cup Rolled Oats', '1 cup Almond Milk', '1/4 cup Blueberries', '1 tbsp Chia Seeds', '10 Walnut halves'],
      bg: 'bg-[#F9FBF9] border-[#D6E3D6]',
    },
    {
      id: 'm2',
      type: 'Lunch',
      time: '1:00 PM',
      title: 'Iron-Rich Spinach & Salmon Quinoa Bowl',
      description: 'Pan-seared Atlantic salmon fillet served over fluffy quinoa, baby spinach, steamed edamame, and cold-pressed extra virgin olive oil.',
      calories: '480 kcal',
      nutrients: ['Protein: 32g', 'Iron: 4.5mg', 'Omega-3: 2.2g'],
      ingredients: ['150g Wild Salmon', '1/2 cup Quinoa', '1 cup Baby Spinach', '1/2 cup Edamame', '1 tbsp Olive Oil'],
      bg: 'bg-[#F4FAF4] border-[#CCE0CC]',
    },
    {
      id: 'm3',
      type: 'Evening Snack',
      time: '5:00 PM',
      title: 'Zinc Boost Avocado & Seed Smoothie',
      description: 'Blended ripe avocado, organic Greek yogurt, almond milk, banana, and roasted pumpkin seeds.',
      calories: '260 kcal',
      nutrients: ['Protein: 12g', 'Zinc: 3.8mg', 'Vitamin E: 6mg'],
      ingredients: ['1/2 Avocado', '1/2 cup Greek Yogurt', '1 Banana', '2 tbsp Pumpkin Seeds', '1 cup Almond Milk'],
      bg: 'bg-[#F8FAF8] border-[#D6E3D6]',
    },
    {
      id: 'm4',
      type: 'Dinner',
      time: '8:00 PM',
      title: 'Keratin Building Lentil & Broccoli Curry',
      description: 'Yellow & brown lentil dal cooked with turmeric, ginger, and garlic, served with brown rice and steamed broccoli florets.',
      calories: '420 kcal',
      nutrients: ['Protein: 22g', 'Folate: 180mcg', 'Iron: 5.1mg'],
      ingredients: ['3/4 cup Yellow Lentils', '1 cup Steamed Broccoli', '1/2 cup Brown Rice', '1 tbsp Ginger-Garlic Paste', 'Turmeric & Cumin'],
      bg: 'bg-[#F4FAF4] border-[#CCE0CC]',
    },
  ],
  Tue: [
    {
      id: 't1',
      type: 'Breakfast',
      time: '8:00 AM',
      title: 'Protein Scrambled Eggs & Avocado Toast',
      description: 'Two organic eggs scrambled with baby spinach on whole-grain sourdough toast with sliced avocado and sesame seeds.',
      calories: '380 kcal',
      nutrients: ['Protein: 20g', 'Biotin: 30mcg', 'Choline: 250mg'],
      ingredients: ['2 Eggs', '1 slice Sourdough Bread', '1/2 Avocado', '1 cup Spinach', '1 tsp Sesame Seeds'],
      bg: 'bg-[#F9FBF9] border-[#D6E3D6]',
    },
    {
      id: 't2',
      type: 'Lunch',
      time: '1:00 PM',
      title: 'Mediterranean Chickpea & Chicken Salad',
      description: 'Grilled chicken breast with chickpeas, cherry tomatoes, cucumbers, bell peppers, extra virgin olive oil, and feta cheese.',
      calories: '460 kcal',
      nutrients: ['Protein: 36g', 'Zinc: 4.2mg', 'Iron: 3.8mg'],
      ingredients: ['150g Chicken Breast', '1/2 cup Chickpeas', '1 cup Chopped Greens', '1/4 cup Feta Cheese', 'Olive Oil & Lemon'],
      bg: 'bg-[#F4FAF4] border-[#CCE0CC]',
    },
    {
      id: 't3',
      type: 'Evening Snack',
      time: '5:00 PM',
      title: 'Mixed Seeds & Berry Collagen Cup',
      description: 'Handful of sunflower seeds, pumpkin seeds, and fresh raspberries paired with green tea.',
      calories: '210 kcal',
      nutrients: ['Vitamin C: 45mg', 'Vitamin E: 8mg', 'Antioxidants'],
      ingredients: ['1 tbsp Sunflower Seeds', '1 tbsp Pumpkin Seeds', '1/2 cup Raspberries', '1 cup Green Tea'],
      bg: 'bg-[#F8FAF8] border-[#D6E3D6]',
    },
    {
      id: 't4',
      type: 'Dinner',
      time: '8:00 PM',
      title: 'Tofu & Vegetable Stir-Fry with Sesame',
      description: 'Firm tofu cubes stir-fried with red bell peppers, snap peas, garlic, ginger, and toasted sesame seeds over wild rice.',
      calories: '390 kcal',
      nutrients: ['Protein: 24g', 'Calcium: 350mg', 'Iron: 4.2mg'],
      ingredients: ['150g Firm Tofu', '1 cup Bell Peppers & Peas', '1/2 cup Wild Rice', '1 tbsp Sesame Oil', 'Garlic & Ginger'],
      bg: 'bg-[#F4FAF4] border-[#CCE0CC]',
    },
  ],
};

// Fallback for rest of the week
DAYS.forEach((day) => {
  if (!WEEKLY_MEALS[day]) {
    WEEKLY_MEALS[day] = WEEKLY_MEALS['Mon'].map((m, idx) => ({ ...m, id: `${day}-${idx}` }));
  }
});

export function MealPlanView() {
  const router = useRouter();
  const [activeDay, setActiveDay] = useState<string>('Mon');
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [waterGlasses, setWaterGlasses] = useState<boolean[]>([true, true, true, true, true, false, false, false]);
  const [groceryItems, setGroceryItems] = useState<Record<string, boolean>>({
    'Wild Atlantic Salmon': true,
    'Organic Eggs & Spinach': true,
    'Raw Walnuts & Chia Seeds': false,
    'Greek Yogurt & Avocado': true,
    'Yellow Lentils & Quinoa': false,
    'Pumpkin & Sunflower Seeds': false,
  });

  const toggleMealCompleted = (id: string) => {
    setCompletedMeals((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleWater = (index: number) => {
    setWaterGlasses((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const toggleGrocery = (item: string) => {
    setGroceryItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const currentMeals = WEEKLY_MEALS[activeDay] || WEEKLY_MEALS['Mon'];
  const waterCount = waterGlasses.filter(Boolean).length;
  const waterPercentage = Math.round((waterCount / 8) * 100);

  return (
    <div className="space-y-6 w-full pb-12 text-[#12241A] font-sans selection:bg-[#0B3C26] selection:text-white">
      {/* 1. Full-Width Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-4 border-b border-[#D8E4D8] w-full">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#16A34A] text-xs font-extrabold flex items-center gap-1.5 border border-[#C5E8CE]">
              <Utensils className="w-3.5 h-3.5" /> Trichology Meal Plan
            </span>
            <span className="px-3 py-1 rounded-full bg-[#0B3C26] text-white text-[11px] font-extrabold tracking-wide uppercase font-mono">
              AI Tailored
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082014] tracking-tight font-heading">
            Hair Growth Meal Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6256] font-medium mt-1 max-w-3xl leading-relaxed">
            Nutrient-dense recipes formulated specifically to nourish scalp micro-circulation, fortify hair follicle roots, and boost natural keratin production.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => router.push('/plan')}
            className="px-4 py-2.5 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white font-extrabold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Overall Plan</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Cards Row (4 Grid Columns - Full Screen Width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        {/* KPI 1: Daily Caloric Goal */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Flame className="w-6 h-6 fill-current text-[#16A34A]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166] uppercase font-mono tracking-wider">Caloric Target</p>
            <p className="text-base font-extrabold text-[#082014]">1,950 kcal / day</p>
            <span className="text-[10px] text-[#16A34A] font-extrabold">Biotin & Keratin Balance</span>
          </div>
        </div>

        {/* KPI 2: Protein Target */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Utensils className="w-6 h-6 text-[#4F46E5]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166] uppercase font-mono tracking-wider">Protein Target</p>
            <p className="text-base font-extrabold text-[#082014]">65g / day</p>
            <span className="text-[10px] text-[#4F46E5] font-extrabold">Follicle Strand Strength</span>
          </div>
        </div>

        {/* KPI 3: Key Minerals Target */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3D6] text-[#EA580C] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Sparkles className="w-6 h-6 text-[#EA580C]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166] uppercase font-mono tracking-wider">Iron & Zinc Goal</p>
            <p className="text-base font-extrabold text-[#082014]">18mg Fe • 11mg Zn</p>
            <span className="text-[10px] text-[#EA580C] font-extrabold">Scalp Sebum & Oxygenation</span>
          </div>
        </div>

        {/* KPI 4: Hydration Target */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Droplets className="w-6 h-6 fill-current text-[#0284C7]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166] uppercase font-mono tracking-wider">Daily Hydration</p>
            <p className="text-base font-extrabold text-[#082014]">{waterCount} / 8 Glasses</p>
            <span className="text-[10px] text-[#0284C7] font-extrabold">{waterPercentage}% Daily Target</span>
          </div>
        </div>
      </div>

      {/* 3. Day Selector Bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none w-full bg-white/90 backdrop-blur-xs border border-white/80 p-2.5 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeDay === day
                  ? 'bg-[#0B3C26] text-white shadow-sm'
                  : 'bg-[#F4FAF4] hover:bg-[#E2ECE2] text-[#4F6256] border border-[#CCDCCD]'
              }`}
            >
              {day} Schedule
            </button>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#55695C] px-3 py-1.5 rounded-xl bg-[#F4FAF4] border border-[#E0ECE0]">
          <Calendar className="w-3.5 h-3.5 text-[#0B3C26]" />
          <span>Active Week 3</span>
        </div>
      </div>

      {/* 4. Main 12-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        {/* Left Section: Meals Timeline & Recipes (Span 8 Cols) */}
        <div className="lg:col-span-8 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#082014] font-heading flex items-center gap-2">
              <span>{activeDay}&apos;s Trichology Meal Menu</span>
              <span className="text-xs font-semibold text-[#5C7063] bg-[#E6F4EA] px-2.5 py-0.5 rounded-full border border-[#C5E8CE]">
                {currentMeals.length} Meals
              </span>
            </h3>
            <span className="text-xs font-bold text-[#16A34A]">
              {Object.keys(completedMeals).filter((k) => completedMeals[k] && k.startsWith(activeDay)).length} / {currentMeals.length} Consumed
            </span>
          </div>

          <div className="space-y-4 w-full">
            {currentMeals.map((meal) => {
              const isDone = !!completedMeals[meal.id];
              const isExpanded = expandedMeal === meal.id;

              return (
                <div
                  key={meal.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-sm space-y-4 w-full ${
                    isDone
                      ? 'bg-[#F2F7F2] border-[#C5D9C5] opacity-85'
                      : `${meal.bg} hover:border-[#0B3C26]/40`
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-[#0B3C26] text-white text-[10px] font-extrabold uppercase font-mono tracking-wider">
                        {meal.type} • {meal.time}
                      </span>
                      <span className="text-xs font-extrabold text-[#082014] bg-white/90 px-2.5 py-0.5 rounded-md border border-black/10">
                        {meal.calories}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleMealCompleted(meal.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto ${
                        isDone
                          ? 'bg-[#16A34A] text-white shadow-2xs'
                          : 'bg-white text-[#0B3C26] border border-[#CBD8CB] hover:bg-[#E6F4EA]'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isDone ? 'fill-current text-white' : ''}`} />
                      <span>{isDone ? 'Meal Logged' : 'Mark as Eaten'}</span>
                    </button>
                  </div>

                  <div>
                    <h4 className={`text-base sm:text-lg font-extrabold font-heading ${isDone ? 'line-through text-[#667A6C]' : 'text-[#082014]'}`}>
                      {meal.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4E6256] font-medium leading-relaxed mt-1">
                      {meal.description}
                    </p>
                  </div>

                  {/* Nutrients Badges */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {meal.nutrients.map((n, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white border border-[#CBD8CB] text-[#0B3C26] shadow-2xs"
                        >
                          {n}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setExpandedMeal(isExpanded ? null : meal.id)}
                      className="text-xs font-extrabold text-[#0B3C26] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Ingredients' : 'View Key Ingredients'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded Recipe & Ingredients Box */}
                  {isExpanded && (
                    <div className="p-4 rounded-xl bg-white border border-[#CCDCCD] space-y-2.5 animate-in fade-in zoom-in-95">
                      <h5 className="text-xs font-extrabold text-[#082014] uppercase font-mono tracking-wider flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-[#16A34A]" /> Key Hair Ingredients
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-[#4E6256]">
                        {meal.ingredients.map((ing, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                            <span>{ing}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Hydration, Grocery & Nutrients (Span 4 Cols) */}
        <div className="lg:col-span-4 space-y-5 w-full">
          {/* Card 1: Interactive Hydration Tracker */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Droplets className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#082014] font-heading">Hydration Tracker</h3>
                  <p className="text-xs text-[#5C7063] font-medium">Goal: 2.5 Liters (8 Glasses)</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#082014]">Scalp Hydration Balance</span>
                <span className="text-[#0284C7] font-mono">{waterPercentage}%</span>
              </div>
              <div className="w-full bg-[#E0F2FE] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#0284C7] h-full rounded-full transition-all duration-500"
                  style={{ width: `${waterPercentage}%` }}
                />
              </div>
            </div>

            {/* 8 Glasses Buttons Grid */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {waterGlasses.map((done, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleWater(idx)}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                    done
                      ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-2xs'
                      : 'bg-[#F8FAF8] text-[#6B7280] border-[#E5E7EB] hover:border-[#0284C7]'
                  }`}
                >
                  <Droplets className={`w-4 h-4 ${done ? 'fill-current' : ''}`} />
                  <span className="text-[10px] font-bold">Glass {idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Micro-Nutrient Targets Progress */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Award className="w-5 h-5 text-[#0B3C26]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">Key Micronutrients</h3>
                <p className="text-xs text-[#5C7063] font-medium">Daily scalp nourishment levels</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {/* Biotin */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#082014]">Biotin (Vitamin B7)</span>
                  <span className="text-[#16A34A]">30 mcg (100%)</span>
                </div>
                <div className="w-full bg-[#E2ECE2] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#16A34A] h-full rounded-full w-full" />
                </div>
              </div>

              {/* Iron */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#082014]">Iron & Folate</span>
                  <span className="text-[#16A34A]">18 mg (90%)</span>
                </div>
                <div className="w-full bg-[#E2ECE2] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#16A34A] h-full rounded-full w-[90%]" />
                </div>
              </div>

              {/* Zinc */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#082014]">Zinc & Vitamin E</span>
                  <span className="text-[#16A34A]">11 mg (85%)</span>
                </div>
                <div className="w-full bg-[#E2ECE2] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#16A34A] h-full rounded-full w-[85%]" />
                </div>
              </div>

              {/* Omega-3 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#082014]">Omega-3 Fatty Acids</span>
                  <span className="text-[#16A34A]">2,000 mg (95%)</span>
                </div>
                <div className="w-full bg-[#E2ECE2] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#16A34A] h-full rounded-full w-[95%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Hair Superfood Grocery Checklist */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF3D6] text-[#EA580C] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <ShoppingBag className="w-5 h-5 text-[#EA580C]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">Weekly Superfood List</h3>
                <p className="text-xs text-[#5C7063] font-medium">Grocery check for hair density</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {Object.keys(groceryItems).map((item) => {
                const checked = groceryItems[item];
                return (
                  <button
                    key={item}
                    onClick={() => toggleGrocery(item)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2] hover:bg-[#F0FAF0] transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                          checked ? 'bg-[#0B3C26] border-[#0B3C26] text-white' : 'border-[#A3B8A8]'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-bold ${checked ? 'line-through text-[#667A6C]' : 'text-[#082014]'}`}>
                        {item}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

