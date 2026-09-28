"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  Sparkles,
  Utensils,
  Scissors,
  CheckCircle2,
  Heart,
  RefreshCw,
  Info,
  ArrowRight,
  ShieldCheck,
  Clock,
  Leaf,
  Check
} from 'lucide-react';

interface NutrientItem {
  name: string;
  benefit: string;
  category?: string;
}

interface FoodItem {
  name: string;
  category?: string;
  benefit: string;
}

interface RoutineSuggestion {
  title: string;
  frequency: string;
  instructions: string;
}

interface LifestyleHabit {
  title: string;
  recommendation: string;
}

interface PlanData {
  id?: string;
  summary: string;
  nutrients: NutrientItem[];
  recommendedFoods: FoodItem[];
  routineSuggestions: RoutineSuggestion[];
  lifestyleHabits: LifestyleHabit[];
  disclaimer?: string;
}

const DEFAULT_PLAN: PlanData = {
  summary: 'A personalized trichology plan crafted for your hair density, scalp health, and nutritional profile.',
  nutrients: [
    { name: 'Protein', benefit: 'Supports keratin synthesis for strand strength' },
    { name: 'Iron & Folate', benefit: 'Boosts oxygen circulation to scalp follicles' },
    { name: 'Zinc', benefit: 'Promotes tissue repair and hair oil gland regulation' },
    { name: 'Omega-3 Fatty Acids', benefit: 'Nourishes scalp barrier and reduces dryness' },
  ],
  recommendedFoods: [
    { name: 'Eggs & Dairy', category: 'Biotin & Protein', benefit: 'Essential building blocks for hair follicle growth' },
    { name: 'Salmon & Mackerel', category: 'Omega-3', benefit: 'Provides natural scalp hydration and reduces flaking' },
    { name: 'Spinach & Kale', category: 'Iron & Folate', benefit: 'Prevents shedding caused by iron deficiency' },
    { name: 'Nuts & Seeds', category: 'Zinc & Vitamin E', benefit: 'Protects scalp cell membranes from oxidative stress' },
  ],
  routineSuggestions: [
    { title: 'Gentle Scalp Wash', frequency: '2-3 times/week', instructions: 'Use sulfate-free shampoo focused on scalp cleansing with lukewarm water.' },
    { title: 'Nourishing Hair Mask', frequency: 'Once a week', instructions: 'Apply deep conditioner from mid-lengths to tips for 10-15 minutes.' },
    { title: 'Stimulating Scalp Massage', frequency: 'Daily (5 mins)', instructions: 'Gently massage scalp with fingertips to boost micro-circulation.' },
  ],
  lifestyleHabits: [
    { title: 'Optimal Hydration', recommendation: 'Drink at least 2.5 Liters of water daily to maintain scalp moisture balance.' },
    { title: 'Stress Management', recommendation: 'Practice 10 minutes of daily mindfulness to minimize stress-induced shedding.' },
    { title: 'Heat & Damage Protection', recommendation: 'Limit hot styling tools to <180°C and use protective thermal spray.' },
  ],
  disclaimer: 'This plan provides general wellness and nutrition guidance derived from your trichology analysis.',
};

export function WellnessPlanView() {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanData>(DEFAULT_PLAN);
  const [loading, setLoading] = useState<boolean>(true);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean>(false);

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ plan: PlanData }>('/wellness-plans/current');
      if (res.plan && res.plan.summary) {
        setPlan(res.plan);
      }
    } catch (err) {
      // Fallback to default clean plan
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await apiClient.post<{ plan: PlanData }>('/wellness-plans/generate');
      if (res.plan) {
        setPlan(res.plan);
      }
    } catch (err) {
      // Keep existing plan on error
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-12 text-[#12241A] font-sans selection:bg-[#0B3C26] selection:text-white">
      {/* 1. Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1 w-full border-b border-[#D8E4D8] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#16A34A] text-xs font-extrabold flex items-center gap-1.5 border border-[#C5E8CE]">
              <Sparkles className="w-3.5 h-3.5" /> AI Personalized Plan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082014] tracking-tight font-heading">
            My AI Hair Care Plan
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6256] font-medium mt-1 max-w-2xl leading-relaxed">
            {plan.summary}
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-[#CCDCCD] text-[#082014] font-extrabold text-xs sm:text-sm transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-[#0B3C26] ${regenerating ? 'animate-spin' : ''}`} />
          <span>{regenerating ? 'Generating...' : 'Regenerate AI Plan'}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#0B3C26]/30 border-t-[#0B3C26] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#526659]">Loading your AI wellness plan...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 2. AI Hair Care Routine Section */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">1. Tailored Hair Care Routine</h3>
                <p className="text-xs text-[#5C7063] font-medium">Custom care steps generated based on your scalp type</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {plan.routineSuggestions.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#0B3C26]/10 text-[#0B3C26] text-[10px] font-extrabold uppercase font-mono">
                      {item.frequency}
                    </span>
                    <h4 className="text-sm font-extrabold text-[#082014]">{item.title}</h4>
                    <p className="text-xs text-[#4E6256] font-medium leading-relaxed">{item.instructions}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Nutrition & Key Nutrients Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Column 1: Key Nutrients (Span 5) */}
            <div className="lg:col-span-5 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#082014] font-heading">2. Target Nutrients</h3>
                  <p className="text-xs text-[#5C7063] font-medium">Essential nutrients for follicle repair</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {plan.nutrients.map((n, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2] flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-extrabold text-[#082014]">{n.name}</h5>
                      <p className="text-[11px] text-[#55695C] font-medium leading-snug">{n.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Recommended Foods (Span 7) */}
            <div className="lg:col-span-7 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#082014] font-heading">3. Recommended Superfoods</h3>
                  <p className="text-xs text-[#5C7063] font-medium">Dietary sources rich in your required hair vitamins</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {plan.recommendedFoods.map((food, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2] space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-extrabold text-[#082014]">{food.name}</h5>
                      {food.category && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#16A34A]">
                          {food.category}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#55695C] font-medium leading-snug">{food.benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Lifestyle & Habit Adjustments */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">4. Lifestyle & Scalp Care Habits</h3>
                <p className="text-xs text-[#5C7063] font-medium">Daily habits to promote long-term hair retention</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {plan.lifestyleHabits.map((habit, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2] space-y-1.5">
                  <h4 className="text-xs font-extrabold text-[#082014]">{habit.title}</h4>
                  <p className="text-xs text-[#4E6256] font-medium leading-relaxed">{habit.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Accept & Action Footer */}
          <div className="p-6 rounded-2xl bg-[#0B3C26] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <h3 className="text-base font-extrabold font-heading">Ready to start your routine?</h3>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Track your daily routine progress and schedule a follow-up assessment in 30 days.
              </p>
            </div>

            <button
              onClick={() => {
                setAccepted(true);
                router.push('/dashboard');
              }}
              className="px-6 py-3 rounded-full bg-white text-[#0B3C26] font-extrabold text-xs sm:text-sm hover:bg-emerald-50 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              {accepted ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> Plan Active
                </>
              ) : (
                <>
                  <span>Activate My AI Plan</span> <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="p-3.5 rounded-xl bg-[#EFF5EE] border border-[#E0EAE0] flex items-center justify-between text-xs text-[#526659]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
              <p className="text-[11px] font-medium">
                {plan.disclaimer || 'This plan provides general wellness and nutrition guidance derived from your trichology analysis.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
