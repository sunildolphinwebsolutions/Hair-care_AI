"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Utensils,
  Droplets,
  Leaf,
  Check,
  ChevronRight,
  ArrowRight,
  Heart,
  Flame,
  Zap,
  Sparkles,
  Download,
  ShoppingCart,
  Lightbulb,
  Calendar,
  Clock,
  Target,
  FileCheck
} from 'lucide-react';

export function WellnessPlanView() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<'Nutrition' | 'Hair Care' | 'Lifestyle'>('Nutrition');
  const [selectedDay, setSelectedDay] = useState('Day 1');
  const [tasksDone, setTasksDone] = useState<Record<string, boolean>>({
    water: true,
    breakfast: true,
    greens: false,
  });

  const toggleTask = (key: string) => {
    setTasksDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const nutrients = [
    {
      name: 'Protein',
      benefit: 'Supports hair growth and strength',
      iconBg: 'bg-rose-100 text-rose-600',
      icon: Heart,
    },
    {
      name: 'Iron',
      benefit: 'Helps prevent hair fall',
      iconBg: 'bg-red-100 text-red-600',
      icon: Flame,
    },
    {
      name: 'Zinc',
      benefit: 'Supports hair tissue repair',
      iconBg: 'bg-emerald-100 text-emerald-700',
      icon: Leaf,
    },
    {
      name: 'Omega-3',
      benefit: 'Nourishes scalp and reduces inflammation',
      iconBg: 'bg-amber-100 text-amber-700',
      icon: Droplets,
    },
    {
      name: 'Vitamin D',
      benefit: 'Supports healthy hair follicles',
      iconBg: 'bg-purple-100 text-purple-700',
      icon: Sparkles,
    },
  ];

  const foods = [
    { name: 'Eggs', benefit: 'Rich in protein and biotin', image: '/images/food_eggs.jpg' },
    { name: 'Salmon', benefit: 'High in omega-3 fatty acids', image: '/images/food_salmon.jpg' },
    { name: 'Spinach', benefit: 'Rich in iron and folate', image: '/images/nutrition_hero.jpg' },
    { name: 'Nuts', benefit: 'Good source of zinc and vitamin E', image: '/images/meal_breakfast.jpg' },
    { name: 'Lentils', benefit: 'Rich in protein and iron', image: '/images/meal_dinner.jpg' },
    { name: 'Berries', benefit: 'High in antioxidants', image: '/images/meal_snack.jpg' },
  ];

  const mealPlan = [
    {
      type: 'Breakfast',
      time: '8:00 AM',
      description: 'Oats with berries, nuts and seeds',
      calories: '320 kcal',
      image: '/images/meal_breakfast.jpg',
    },
    {
      type: 'Lunch',
      time: '1:00 PM',
      description: 'Grilled chicken, quinoa and mixed greens',
      calories: '450 kcal',
      image: '/images/meal_lunch.jpg',
    },
    {
      type: 'Evening Snack',
      time: '5:00 PM',
      description: 'Protein smoothie with banana',
      calories: '250 kcal',
      image: '/images/meal_snack.jpg',
    },
    {
      type: 'Dinner',
      time: '8:00 PM',
      description: 'Paneer, brown rice and steamed vegetables',
      calories: '400 kcal',
      image: '/images/meal_dinner.jpg',
    },
  ];

  return (
    <div className="space-y-6 w-full pb-10 text-[#12241A] font-sans selection:bg-[#0B3C26] selection:text-white">
      {/* 1. Page Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082014] tracking-tight font-heading">
            My Plan
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6256] font-medium mt-1">
            A complete plan for healthier, stronger hair based on your analysis and lifestyle.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading your personalized hair plan PDF...')}
          className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white border border-[#CBD5CC] text-[#082014] font-bold text-xs sm:text-sm transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-[#0B3C26]" />
          <span>View Plan PDF</span>
        </button>
      </div>

      {/* 2. Category Segmented Tabs */}
      <div className="grid grid-cols-3 gap-3 bg-white/60 p-1.5 rounded-2xl border border-white/80 max-w-xl shadow-2xs">
        <button
          onClick={() => setActiveCategory('Nutrition')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeCategory === 'Nutrition'
              ? 'bg-[#0B3C26] text-white shadow-sm'
              : 'text-[#4E6256] hover:bg-white/80'
            }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Nutrition</span>
        </button>

        <button
          onClick={() => setActiveCategory('Hair Care')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeCategory === 'Hair Care'
              ? 'bg-[#0B3C26] text-white shadow-sm'
              : 'text-[#4E6256] hover:bg-white/80'
            }`}
        >
          <Droplets className="w-4 h-4" />
          <span>Hair Care</span>
        </button>

        <button
          onClick={() => setActiveCategory('Lifestyle')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeCategory === 'Lifestyle'
              ? 'bg-[#0B3C26] text-white shadow-sm'
              : 'text-[#4E6256] hover:bg-white/80'
            }`}
        >
          <Leaf className="w-4 h-4" />
          <span>Lifestyle</span>
        </button>
      </div>

      {/* 3. Hero Banner Card */}
      <div className="bg-[#E5ECE3]/90 backdrop-blur-xs border border-white/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden relative w-full">
        <div className="space-y-2 max-w-lg z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#082014] tracking-tight leading-tight font-heading">
            Nutrition for<br />Stronger, Healthier Hair
          </h2>
          <p className="text-xs sm:text-sm text-[#4E6256] font-medium leading-relaxed">
            Fuel your hair from within. These nutrient-rich foods and meal suggestions are personalized based on your analysis and goals.
          </p>
        </div>

        <div className="relative w-full lg:w-[360px] aspect-[16/9] rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-white/60">
          <img
            src="/images/nutrition_hero.jpg"
            alt="Nutrition Hero Dish"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* 4. Main Grid Section (Left 8 Cols, Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">

        {/* Left Column (Span 8 Cols) */}
        <div className="lg:col-span-8 space-y-5 w-full">

          {/* Section 1: Top Nutrients for You */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">Top Nutrients for You</h3>
                <p className="text-xs text-[#5C7063] font-medium mt-0.5">These nutrients can help support your hair goals.</p>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-[#0B3C26] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 5 Nutrient Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 w-full">
              {nutrients.map((n, idx) => {
                const IconComp = n.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#F7FAF7] border border-[#E2ECE2] flex flex-col justify-between space-y-2 hover:border-[#0B3C26] transition-all shadow-2xs"
                  >
                    <div className={`w-8 h-8 rounded-xl ${n.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#082014]">{n.name}</h4>
                      <p className="text-[10px] text-[#5C7063] font-medium leading-tight mt-0.5">{n.benefit}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Recommended Foods */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">Recommended Foods</h3>
                <p className="text-xs text-[#5C7063] font-medium mt-0.5">Include these in your diet for better hair health.</p>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-[#0B3C26] hover:underline flex items-center gap-1 cursor-pointer"
              >
                See All Foods <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 6 Food Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-1 w-full">
              {foods.map((food, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-[#F7FAF7] border border-[#E2ECE2] flex flex-col items-center text-center space-y-2 hover:border-[#0B3C26] transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#E2ECE2] border border-[#CCDCCD]">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-[#082014] group-hover:text-[#0B3C26]">{food.name}</h5>
                    <p className="text-[10px] text-[#5C7063] font-medium leading-tight mt-0.5">{food.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Sample Meal Plan */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">Sample Meal Plan</h3>
                <p className="text-xs text-[#5C7063] font-medium mt-0.5">A simple 1-day meal plan to get you started.</p>
              </div>

              {/* Day Selector Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${selectedDay === day
                        ? 'bg-[#0B3C26] text-white shadow-xs font-extrabold'
                        : 'bg-[#EFF5EE] text-[#4E6256] hover:bg-[#E2ECE2]'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Meal Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-1 w-full">
              {mealPlan.map((meal, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#F7FAF7] border border-[#E2ECE2] flex flex-col justify-between space-y-2.5 hover:border-[#0B3C26] transition-all shadow-2xs group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-extrabold text-[#082014]">{meal.type}</h5>
                      <span className="text-[10px] font-bold text-[#5C7063]">{meal.time}</span>
                    </div>

                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#E2ECE2] border border-[#CCDCCD]">
                      <img
                        src={meal.image}
                        alt={meal.type}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <p className="text-[11px] text-[#4E6256] font-medium leading-snug">
                      {meal.description}
                    </p>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#EBF3EA] text-[#0B3C26] font-extrabold text-[10px] self-start border border-[#D5E2D4]">
                    {meal.calories}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Span 4 Cols) */}
        <div className="lg:col-span-4 space-y-5 w-full">

          {/* Card 1: Your Plan Overview */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#082014] font-heading">Your Plan Overview</h3>
              <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#16A34A] text-xs font-extrabold border border-[#C5E8CE]">
                Active Plan
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs text-[#2A3E31]">
              <div className="flex items-center justify-between pb-2 border-b border-[#EEF4EE]">
                <span className="flex items-center gap-2 font-bold text-[#5C7063]">
                  <FileCheck className="w-4 h-4 text-[#0B3C26]" /> Plan Type
                </span>
                <span className="font-extrabold text-[#082014]">Personalized Hair Wellness</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#EEF4EE]">
                <span className="flex items-center gap-2 font-bold text-[#5C7063]">
                  <Calendar className="w-4 h-4 text-[#0B3C26]" /> Start Date
                </span>
                <span className="font-extrabold text-[#082014]">12 Sep 2025</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#EEF4EE]">
                <span className="flex items-center gap-2 font-bold text-[#5C7063]">
                  <Clock className="w-4 h-4 text-[#0B3C26]" /> Duration
                </span>
                <span className="font-extrabold text-[#082014]">12 Weeks</span>
              </div>

              <div className="flex items-start justify-between pb-2 border-b border-[#EEF4EE] gap-2">
                <span className="flex items-center gap-2 font-bold text-[#5C7063]">
                  <Target className="w-4 h-4 text-[#0B3C26] flex-shrink-0" /> Goal
                </span>
                <span className="font-extrabold text-[#082014] text-right">Reduce hair fall & improve density</span>
              </div>

              <div className="flex items-start justify-between gap-2 pt-0.5">
                <span className="flex items-center gap-2 font-bold text-[#5C7063]">
                  <FileText className="w-4 h-4 text-[#0B3C26] flex-shrink-0" /> Based On
                </span>
                <span className="font-extrabold text-[#082014] text-right">Your analysis, lifestyle and goals</span>
              </div>
            </div>
          </div>

          {/* Card 2: Today's Nutrition */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#082014] font-heading">Today's Nutrition</h3>
              <button
                type="button"
                onClick={() => router.push('/routine')}
                className="text-xs font-bold text-[#0B3C26] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Full Plan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 w-full">
              {/* Task 1 */}
              <div
                onClick={() => toggleTask('water')}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F7FAF7] border border-[#E2ECE2] hover:border-[#0B3C26] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${tasksDone.water ? 'bg-[#10B981] text-white' : 'border-2 border-[#A0B5A3]'
                    }`}>
                    {tasksDone.water && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <Droplets className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
                  <span className="text-xs font-extrabold text-[#082014]">Drink 2L water</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#718578]" />
              </div>

              {/* Task 2 */}
              <div
                onClick={() => toggleTask('breakfast')}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F7FAF7] border border-[#E2ECE2] hover:border-[#0B3C26] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${tasksDone.breakfast ? 'bg-[#10B981] text-white' : 'border-2 border-[#A0B5A3]'
                    }`}>
                    {tasksDone.breakfast && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <Utensils className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
                  <span className="text-xs font-extrabold text-[#082014]">Have protein-rich breakfast</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#718578]" />
              </div>

              {/* Task 3 */}
              <div
                onClick={() => toggleTask('greens')}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F7FAF7] border border-[#E2ECE2] hover:border-[#0B3C26] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${tasksDone.greens ? 'bg-[#10B981] text-white' : 'border-2 border-[#A0B5A3]'
                    }`}>
                    {tasksDone.greens && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <Leaf className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
                  <span className="text-xs font-extrabold text-[#082014]">Include leafy greens</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#718578]" />
              </div>
            </div>
          </div>

          {/* Card 3: Weekly Nutrition Progress */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#082014] font-heading">Weekly Nutrition Progress</h3>
              <span className="text-xs font-extrabold text-[#0B3C26]">4/7 days ›</span>
            </div>

            <div className="flex items-center justify-between pt-1 w-full">
              {[
                { day: 'Mon', done: true },
                { day: 'Tue', done: true },
                { day: 'Wed', done: true },
                { day: 'Thu', done: true },
                { day: 'Fri', done: false },
                { day: 'Sat', done: false },
                { day: 'Sun', done: false },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition ${item.done
                        ? 'bg-[#10B981] text-white shadow-2xs'
                        : 'border-2 border-[#CCDCD0] bg-white/70 text-[#A0B5A3]'
                      }`}
                  >
                    {item.done ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                  </div>
                  <span className="text-[11px] font-bold text-[#5C7063]">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Additional Resources */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5 w-full">
            <h3 className="text-base font-extrabold text-[#082014] font-heading">Additional Resources</h3>

            <div className="space-y-2.5 w-full">
              <button
                type="button"
                onClick={() => alert('Downloading Meal Plan PDF...')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E4D8] hover:border-[#0B3C26] text-xs font-bold text-[#142A1E] transition group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Download Meal Plan PDF</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#718578] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => alert('Opening your personalized grocery list...')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E4D8] hover:border-[#0B3C26] text-xs font-bold text-[#142A1E] transition group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <span>Grocery List</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#718578] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => alert('Opening nutrition tips...')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E4D8] hover:border-[#0B3C26] text-xs font-bold text-[#142A1E] transition group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <span>Nutrition Tips</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#718578] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
