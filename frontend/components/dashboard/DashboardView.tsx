"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';
import {
  Calendar,
  Heart,
  FileText,
  Flame,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  ArrowRight,
  Camera,
  Edit3,
  BookOpen,
  X,
  Utensils,
  Droplets,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Leaf,
  Pill,
  Check
} from 'lucide-react';

export function DashboardView() {
  const router = useRouter();
  const { user } = useAuth();

  const [viewAngle, setViewAngle] = useState<'Top View' | 'Crown View' | 'Hairline View'>('Top View');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ date: string; url: string } | null>(null);
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [reminderDone, setReminderDone] = useState<Record<string, boolean>>({});

  const [progressPhotos, setProgressPhotos] = useState<Array<{ date: string; url: string; category?: string }>>([
    { date: 'Front Hairline', category: 'FRONT_HAIRLINE', url: '/images/front_hairline.jpg' },
    { date: 'Top Scalp', category: 'TOP_SCALP', url: '/images/scalp_progress.jpg' },
    { date: 'Left Side', category: 'LEFT_SIDE', url: '/images/side_profile.jpg' },
    { date: 'Right Side', category: 'RIGHT_SIDE', url: '/images/side_profile.jpg' },
  ]);

  useEffect(() => {
    // 1. Restore from localStorage map on mount
    if (typeof window !== 'undefined') {
      const savedStr = localStorage.getItem('haircare_uploaded_photos');
      if (savedStr) {
        try {
          const map = JSON.parse(savedStr);
          setProgressPhotos((prev) =>
            prev.map((item) => {
              if (item.category && map[item.category]) {
                return { ...item, url: map[item.category], date: `${item.date} (Uploaded)` };
              }
              return item;
            })
          );
        } catch (e) {}
      }
    }

    // 2. Retrieve logged in session photos from backend API
    apiClient
      .get<{ sessions: any[] }>('/photo-sessions')
      .then((res) => {
        if (res.sessions && res.sessions.length > 0) {
          const latestSession = res.sessions[0];
          if (latestSession.photos && latestSession.photos.length > 0) {
            const photoMap: Record<string, string> = {};
            latestSession.photos.forEach((p: any) => {
              if (p.category && p.storageKey) {
                photoMap[p.category] = `http://localhost:5000${p.storageKey}`;
              }
            });
            setProgressPhotos((prev) =>
              prev.map((item) => {
                if (item.category && photoMap[item.category]) {
                  return { ...item, url: photoMap[item.category] };
                }
                return item;
              })
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  const tips = [
    "Drink enough water! Hydration supports healthy hair and scalp.",
    "Scalp massage for 5 mins daily boosts follicle blood circulation.",
    "Avoid washing hair with scalding hot water to protect natural oils.",
    "Incorporate Omega-3 rich foods like walnuts and flaxseeds into your diet.",
  ];

  const handleNextTip = () => {
    setActiveTipIndex((prev) => (prev + 1) % tips.length);
  };

  const toggleReminder = (id: string) => {
    setReminderDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const userName = user?.name || 'Ananya';

  return (
    <div className="space-y-6 w-full pb-10 text-[#12241A] font-sans selection:bg-[#0B3C26] selection:text-white">
      {/* 1. Welcome Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082014] tracking-tight flex items-center gap-2.5 font-heading">
            Welcome back, {userName}! <span className="inline-block animate-bounce-short">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6256] font-medium mt-1">
            Your hair wellness journey is looking great. Keep going!
          </p>
        </div>
        <div className="text-xs font-bold text-[#55695D] bg-[#DDE7DC] px-4 py-2 rounded-xl border border-[#CBD8CB] self-start sm:self-auto shadow-2xs">
          Mon, 22 Sep 2025
        </div>
      </div>

      {/* 2. Stat KPI Cards Row (4 Grid Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        {/* Card 1: Last Analysis */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Calendar className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166]">Last Analysis</p>
            <p className="text-base font-extrabold text-[#082014]">12 Sep 2025</p>
          </div>
        </div>

        {/* Card 2: Hair Health */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] text-[#16A34A] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Heart className="w-5.5 h-5.5 fill-current text-[#16A34A]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166]">Hair Health</p>
            <p className="text-base font-extrabold text-[#082014]">Good</p>
          </div>
        </div>

        {/* Card 3: Current Plan */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#FCE8E6] text-[#DC2626] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <FileText className="w-5.5 h-5.5 text-[#DC2626]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166]">Current Plan</p>
            <p className="text-base font-extrabold text-[#082014]">Week 3 of 12</p>
          </div>
        </div>

        {/* Card 4: Streak */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3D6] text-[#EA580C] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Flame className="w-5.5 h-5.5 fill-current text-[#EA580C]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166]">Streak</p>
            <p className="text-base font-extrabold text-[#082014]">12 days</p>
          </div>
        </div>
      </div>

      {/* 3. Middle Grid Section (Hair Progress + Plan Progress + Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">

        {/* Hair Progress Card (Span 6 Cols) */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#082014] font-heading">Hair Progress</h3>
              <p className="text-xs text-[#5C7063] font-medium mt-0.5">See the difference over time</p>
            </div>

            {/* Dropdown Selector */}
            <div className="relative">
              <select
                value={viewAngle}
                onChange={(e) => setViewAngle(e.target.value as any)}
                className="appearance-none bg-[#EAF2EA] text-xs font-bold text-[#0B3C26] py-2 pl-3.5 pr-8 rounded-xl border border-[#CCDCCD] focus:outline-none cursor-pointer"
              >
                <option value="Top View">Top View</option>
                <option value="Crown View">Crown View</option>
                <option value="Hairline View">Hairline View</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#0B3C26] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4 Photos Grid */}
          <div className="relative w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full">
              {progressPhotos.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhotoModal(item)}
                  className="group relative cursor-pointer flex flex-col items-center w-full"
                >
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#E2ECE2] border border-[#CCDCCD] group-hover:border-[#0B3C26] transition-all shadow-2xs">
                    <img
                      src={item.url}
                      alt={`Hair progress ${item.date}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#4B5F53] mt-2 group-hover:text-[#0B3C26]">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Arrow Carousel Overlay Button */}
            <button
              onClick={() => setSelectedPhotoModal(progressPhotos[3])}
              className="absolute -right-3 top-1/3 -translate-y-1/2 w-8.5 h-8.5 rounded-full bg-white shadow-md border border-[#D5E2D4] text-[#0B3C26] flex items-center justify-center hover:bg-[#0B3C26] hover:text-white transition-all z-10 cursor-pointer"
              title="View Full Gallery"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Your Plan Progress Card (Span 3 Cols) */}
        <div className="lg:col-span-3 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-extrabold text-[#082014] font-heading">Your Plan Progress</h3>
            </div>
            <p className="text-xs font-bold text-[#5C7063] mb-4">68% completed</p>

            <div className="space-y-4 w-full">
              {/* Nutrition Plan */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold text-[#142A1E]">
                    <div className="w-6.5 h-6.5 rounded-lg bg-[#E6F4EA] text-[#16A34A] flex items-center justify-center">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    Nutrition Plan
                  </span>
                  <span className="font-extrabold text-[#142A1E]">80%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5ECE3] overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: '80%' }} />
                </div>
              </div>

              {/* Hair Care Routine */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold text-[#142A1E]">
                    <div className="w-6.5 h-6.5 rounded-lg bg-[#E6F4EA] text-[#16A34A] flex items-center justify-center">
                      <Droplets className="w-3.5 h-3.5" />
                    </div>
                    Hair Care Routine
                  </span>
                  <span className="font-extrabold text-[#142A1E]">60%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5ECE3] overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: '60%' }} />
                </div>
              </div>

              {/* Lifestyle Habits */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold text-[#142A1E]">
                    <div className="w-6.5 h-6.5 rounded-lg bg-[#E6F4EA] text-[#16A34A] flex items-center justify-center">
                      <Leaf className="w-3.5 h-3.5" />
                    </div>
                    Lifestyle Habits
                  </span>
                  <span className="font-extrabold text-[#142A1E]">70%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5ECE3] overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8EFE8] flex items-center justify-between text-xs text-[#526659] w-full mt-3">
            <span className="flex items-center gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-[#0B3C26]" /> Next Check-in
            </span>
            <span className="font-extrabold text-[#0B3C26] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#0B3C26]" /> 5 Oct 2025
            </span>
          </div>
        </div>

        {/* Quick Actions Card (Span 3 Cols) */}
        <div className="lg:col-span-3 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5 w-full">
          <h3 className="text-base font-extrabold text-[#082014] font-heading">Quick Actions</h3>

          <div className="space-y-2.5 w-full">
            <button
              onClick={() => router.push('/upload-photos')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E4D8] hover:border-[#0B3C26] text-xs font-bold text-[#142A1E] transition group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-7.5 h-7.5 rounded-lg bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <span>Upload New Photos</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#718578] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => router.push('/onboarding')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E4D8] hover:border-[#0B3C26] text-xs font-bold text-[#142A1E] transition group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-7.5 h-7.5 rounded-lg bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <span>Update Questionnaire</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#718578] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => router.push('/plan')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E4D8] hover:border-[#0B3C26] text-xs font-bold text-[#142A1E] transition group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-7.5 h-7.5 rounded-lg bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span>View My Plan</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#718578] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => router.push('/routine')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E4D8] hover:border-[#0B3C26] text-xs font-bold text-[#142A1E] transition group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-7.5 h-7.5 rounded-lg bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>Book Expert Consultation</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#718578] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Row 4 (Today's Tip + Quote + Stronger Hair Promo Banner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full">
        {/* Today's Tip Card (Span 6 Cols) */}
        <div className="lg:col-span-6 bg-[#EBF5EA] border border-[#D2E2D1] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3 w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FEF9C3] text-[#CA8A04] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Lightbulb className="w-4.5 h-4.5 fill-current" />
              </div>
              <h4 className="text-xs font-extrabold text-[#0B3C26] uppercase tracking-wider">Today's Tip</h4>
            </div>
            <button
              type="button"
              onClick={handleNextTip}
              className="w-7 h-7 rounded-full bg-[#DCE8DB] hover:bg-[#0B3C26] hover:text-white text-[#304439] flex items-center justify-center transition cursor-pointer"
              title="Next Tip"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#25392D] leading-relaxed">
            {tips[activeTipIndex]}
          </p>
        </div>

        {/* Inspirational Quote Card (Span 3 Cols) */}
        <div className="lg:col-span-3 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center space-y-1.5 w-full">
          <p className="text-xs font-bold italic text-[#25392D] leading-relaxed">
            "Healthy hair is a journey, not a destination."
          </p>
          <p className="text-xs font-extrabold text-[#0B3C26] flex items-center gap-1">
            Keep going! 💚
          </p>
        </div>

        {/* Stronger Hair Brighter Tomorrow Promo Banner Card (Span 3 Cols) */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-2xl bg-[#092217] p-6 text-white shadow-md flex flex-col justify-between space-y-4 w-full">
          {/* Foliage Background Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none mix-blend-luminosity"
            style={{ backgroundImage: `url('/promo-leaves.jpg')` }}
          />

          <div className="relative z-10 space-y-2">
            <h3 className="text-lg font-extrabold tracking-tight leading-tight font-heading">
              Stronger Hair<br />Brighter Tomorrow
            </h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
              AI-powered insights for a healthier, happier you.
            </p>
          </div>

          <div className="relative z-10 pt-1">
            <button
              onClick={() => router.push('/plan')}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#092217] text-xs font-extrabold hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
            >
              <span>Upgrade Now</span> <ArrowRight className="w-3.5 h-3.5 text-[#092217]" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Row 5 (Recent Activities & Upcoming Reminders) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        {/* Recent Activities Card (Span 6 Cols) */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#082014] font-heading">Recent Activities</h3>
            <button
              type="button"
              onClick={() => router.push('/progress')}
              className="text-xs font-bold text-[#0B3C26] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 w-full">
            {/* Activity 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F4] border border-[#E0ECE0] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D6E5D4] text-[#0B3C26] flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-[#082014]">Photos uploaded</p>
                  <p className="text-[11px] text-[#55695D] font-medium">4 photos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[#55695D]">12 Sep 2025</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#D6E5D4] text-[#0B3C26] font-extrabold text-[10px]">
                  Completed
                </span>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F4] border border-[#E0ECE0] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D6E5D4] text-[#0B3C26] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-[#082014]">Analysis completed</p>
                  <p className="text-[11px] text-[#55695D] font-medium">View your results</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[#55695D]">12 Sep 2025</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#D6E5D4] text-[#0B3C26] font-extrabold text-[10px]">
                  Completed
                </span>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F4] border border-[#E0ECE0] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D6E5D4] text-[#0B3C26] flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-[#082014]">Plan updated</p>
                  <p className="text-[11px] text-[#55695D] font-medium">Week 3 of 12</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[#55695D]">10 Sep 2025</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#D6E5D4] text-[#0B3C26] font-extrabold text-[10px]">
                  Completed
                </span>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F4] border border-[#E0ECE0] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D6E5D4] text-[#0B3C26] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-[#082014]">Routine check-in</p>
                  <p className="text-[11px] text-[#55695D] font-medium">Hair care routine</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[#55695D]">9 Sep 2025</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#D6E5D4] text-[#0B3C26] font-extrabold text-[10px]">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Reminders Card (Span 6 Cols) */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-[#082014] font-heading">Upcoming Reminders</h3>
              <p className="text-[11px] text-[#55695D] font-medium mt-0.5">Day-wise routine schedule & push alarms</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/routine')}
              className="text-xs font-bold text-[#0B3C26] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 7-Day Adherence Matrix Mini Strip */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 w-full pt-1 pb-2">
            {(() => {
              const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
              const currentJsDayIndex = new Date().getDay();
              const todayIndex = (currentJsDayIndex + 6) % 7;
              const currentTodayName = dayNames[todayIndex];

              return dayNames.map((day, idx) => {
                const isToday = day === currentTodayName;
                const isDone = idx < todayIndex;
                return (
                  <div
                    key={idx}
                    className={`py-2 px-1 rounded-xl border text-center space-y-0.5 transition flex flex-col items-center justify-between ${
                      isToday
                        ? 'bg-[#FFFDF0] border-2 border-amber-400 shadow-xs ring-1 ring-amber-300/40'
                        : isDone
                        ? 'bg-[#F4FAF4] border-[#CCE0CC]'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase font-mono ${
                      isToday ? 'text-amber-900 font-extrabold' : 'text-[#4F6256]'
                    }`}>
                      {isToday ? 'TODAY' : day}
                    </span>
                    <div className="flex justify-center pt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                      ) : isToday ? (
                        <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div className="space-y-3 w-full">
            {/* Reminder 1: Apply hair oil */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F4] border border-[#E0ECE0] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-[#082014]">Apply hair oil</p>
                  <p className="text-[11px] text-[#55695D] font-medium">Today, 8:00 PM</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleReminder('oil')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${reminderDone['oil']
                    ? 'bg-[#0B3C26] text-white'
                    : 'bg-[#D6E5D4] hover:bg-[#0B3C26] text-[#0B3C26] hover:text-white'
                  }`}
              >
                {reminderDone['oil'] ? 'Completed ✓' : 'Mark Done'}
              </button>
            </div>

            {/* Reminder 2: Take your supplements */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F4] border border-[#E0ECE0] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-[#082014]">Take your supplements</p>
                  <p className="text-[11px] text-[#55695D] font-medium">Tomorrow, 9:00 AM</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleReminder('supplements')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${reminderDone['supplements']
                    ? 'bg-[#0B3C26] text-white'
                    : 'bg-[#E2EBE1] hover:bg-[#D6E5D4] text-[#0B3C26]'
                  }`}
              >
                {reminderDone['supplements'] ? 'Set ✓' : 'Set Reminder'}
              </button>
            </div>

            {/* Reminder 3: Drink 2L water */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F4] border border-[#E0ECE0] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-[#082014]">Drink 2L water</p>
                  <p className="text-[11px] text-[#55695D] font-medium">Tomorrow, 12:00 PM</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleReminder('water')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${reminderDone['water']
                    ? 'bg-[#0B3C26] text-white'
                    : 'bg-[#E2EBE1] hover:bg-[#D6E5D4] text-[#0B3C26]'
                  }`}
              >
                {reminderDone['water'] ? 'Set ✓' : 'Set Reminder'}
              </button>
            </div>

            {/* Reminder 4: Weekly check-in */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8F4] border border-[#E0ECE0] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-[#082014]">Weekly check-in</p>
                  <p className="text-[11px] text-[#55695D] font-medium">5 Oct 2025</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleReminder('weekly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${reminderDone['weekly']
                    ? 'bg-[#0B3C26] text-white'
                    : 'bg-[#E2EBE1] hover:bg-[#D6E5D4] text-[#0B3C26]'
                  }`}
              >
                {reminderDone['weekly'] ? 'Set ✓' : 'Set Reminder'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Photo View Modal */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 font-heading">Hair Density Check-in</h3>
              <p className="text-xs text-gray-500 font-medium">{selectedPhotoModal.date} • {viewAngle}</p>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              <img src={selectedPhotoModal.url} alt="Scalp zoom" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between pt-2 text-xs text-gray-600">
              <span className="font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                Scalp Density: Optimal
              </span>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="px-5 py-2 rounded-xl bg-[#0B3C26] text-white font-extrabold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
