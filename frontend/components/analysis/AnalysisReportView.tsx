"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  Activity,
  Scissors,
  Check,
  Clock,
  Droplets,
  Utensils,
  Calendar,
  Lightbulb,
  MoreHorizontal,
  Plus,
  Leaf,
  ScanLine
} from 'lucide-react';

export function AnalysisReportView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Scalp' | 'Density' | 'Concerns' | 'Photo Comparison' | 'History'>('Overview');

  const photos = [
    { label: 'Front Hairline', date: '12 Sep 2025', url: '/images/front_hairline.jpg' },
    { label: 'Top of Scalp', date: '12 Sep 2025', url: '/images/scalp_progress.jpg' },
    { label: 'Left Side', date: '12 Sep 2025', url: '/images/side_profile.jpg' },
    { label: 'Right Side', date: '12 Sep 2025', url: '/images/side_profile.jpg' },
  ];

  return (
    <div className="space-y-6 w-full pb-10 text-[#12241A] font-sans selection:bg-[#0B3C26] selection:text-white">
      {/* 1. Page Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082014] tracking-tight font-heading">
            My Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6256] font-medium mt-1">
            View your hair and scalp analysis results, previous reports and track changes over time.
          </p>
        </div>

        <button
          onClick={() => router.push('/upload-photos')}
          className="px-4 py-2.5 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white font-extrabold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Camera className="w-4 h-4 text-white" />
          <span>Upload New Photos</span>
        </button>
      </div>

      {/* 2. Top Summary Section (2 Cards Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full">
        {/* Latest Analysis Card (Span 7 Cols) */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF5EE] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">Latest Analysis</h3>
                <p className="text-xs text-[#5C7063] font-medium">12 Sep 2025 at 10:30 AM</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#16A34A] text-xs font-extrabold flex items-center gap-1.5 border border-[#C5E8CE]">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Analysis Completed
            </span>
          </div>

          {/* 4 Angle Thumbnails Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 w-full">
            {photos.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center group cursor-pointer w-full">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#E2ECE2] border border-[#CCDCCD] group-hover:border-[#0B3C26] transition-all shadow-2xs">
                  <img
                    src={item.url}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#4B5F53] mt-2 group-hover:text-[#0B3C26]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Assessment Card (Span 5 Cols) */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 w-full">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Leaf className="w-5 h-5 text-[#0B3C26]" />
                </div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">Overall Assessment</h3>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-[#FEF3D6] text-[#D97706] text-xs font-extrabold border border-[#FDE68A]">
                Moderate
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4E6256] font-medium leading-relaxed pt-1">
              Your hair density appears slightly below average, with mild thinning at the crown. Your scalp looks generally healthy.
            </p>
          </div>

          <button
            onClick={() => router.push('/plan')}
            className="w-full py-3 px-6 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white font-extrabold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>View Personalized Plan</span> <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* 3. Horizontal Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
        {(['Overview', 'Scalp', 'Density', 'Concerns', 'Photo Comparison', 'History'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === tab
              ? 'bg-[#0B3C26] text-white shadow-sm font-extrabold'
              : 'bg-white/70 hover:bg-white text-[#4E6256] border border-[#CCDCCD]'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4. Main Tab Content Grid (Overview Tab) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">

        {/* Column 1: Key Metrics (Span 5 Cols) */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
          <h3 className="text-base font-extrabold text-[#082014] font-heading">Key Metrics</h3>

          <div className="space-y-4 w-full pt-1">
            {/* Metric 1: Hair Density */}
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2.5 font-bold text-[#142A1E]">
                  <div className="w-7 h-7 rounded-xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  Hair Density
                </span>
                <span className="font-extrabold text-[#142A1E]">Moderate</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#E5ECE3] overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: '55%' }} />
              </div>
            </div>

            {/* Metric 2: Scalp Health */}
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2.5 font-bold text-[#142A1E]">
                  <div className="w-7 h-7 rounded-xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  Scalp Health
                </span>
                <span className="font-extrabold text-[#142A1E]">Good</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#E5ECE3] overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Metric 3: Hair Thickness */}
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2.5 font-bold text-[#142A1E]">
                  <div className="w-7 h-7 rounded-xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  Hair Thickness
                </span>
                <span className="font-extrabold text-[#142A1E]">Slightly Low</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#E5ECE3] overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: '42%' }} />
              </div>
            </div>

            {/* Metric 4: Signs of Damage */}
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2.5 font-bold text-[#142A1E]">
                  <div className="w-7 h-7 rounded-xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  Signs of Damage
                </span>
                <span className="font-extrabold text-[#142A1E]">Minimal</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#E5ECE3] overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Notable Observations (Span 4 Cols) */}
        <div className="lg:col-span-4 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 w-full h-full">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#0B3C26]" />
              <h3 className="text-base font-extrabold text-[#082014] font-heading">Notable Observations</h3>
            </div>

            <ul className="space-y-2.5 pt-1 text-xs text-[#2A3E31] font-semibold">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B3C26] flex-shrink-0 mt-1.5" />
                <span>Mild thinning at the crown area</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B3C26] flex-shrink-0 mt-1.5" />
                <span>No major signs of scalp inflammation</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B3C26] flex-shrink-0 mt-1.5" />
                <span>Slight dryness visible</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B3C26] flex-shrink-0 mt-1.5" />
                <span>Overall healthy hair structure</span>
              </li>
            </ul>
          </div>

          {/* Disclaimer Box */}
          <div className="p-3.5 rounded-xl bg-[#EFF5EE] border border-[#E0EAE0] flex items-start gap-2.5 text-xs text-[#526659]">
            <Info className="w-4 h-4 text-[#0B3C26] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-snug">
              This analysis is for informational purposes only and not a medical diagnosis.
            </p>
          </div>
        </div>

        {/* Column 3: Image Quality & Recommendations (Span 3 Cols) */}
        <div className="lg:col-span-3 space-y-4 w-full">
          {/* Image Quality Card */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 shadow-sm space-y-3 w-full">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-[#082014]">Image Quality</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4EA] text-[#16A34A] text-[11px] font-extrabold flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" /> Good
              </span>
            </div>

            <ul className="space-y-2 text-[11px] text-[#3A4E41] font-semibold">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 fill-current text-white" />
                <span>Clear and well-focused images</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 fill-current text-white" />
                <span>Good natural lighting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 fill-current text-white" />
                <span>All required angles available</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 fill-current text-white" />
                <span>Suitable for accurate analysis</span>
              </li>
            </ul>
          </div>

          {/* Recommendations Card */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 shadow-sm space-y-3 w-full">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4.5 h-4.5 text-[#CA8A04]" />
              <h4 className="text-sm font-extrabold text-[#082014]">Recommendations</h4>
            </div>

            <ul className="space-y-2.5 text-[11px] text-[#3A4E41] font-semibold">
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
                <span>Continue regular hair care routine</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Droplets className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
                <span>Keep your scalp clean and hydrated</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Utensils className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
                <span>Maintain a balanced diet</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
                <span>Track progress with regular check-ins</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Bottom Section: Your Photos */}
      <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
        <h3 className="text-base font-extrabold text-[#082014] font-heading">Your Photos</h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
          {photos.map((item, idx) => (
            <div key={idx} className="relative group cursor-pointer flex flex-col items-center w-full">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#E2ECE2] border border-[#CCDCCD] group-hover:border-[#0B3C26] transition-all shadow-2xs relative">
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs font-bold text-[#142A1E] mt-2 group-hover:text-[#0B3C26]">
                {item.label}
              </span>
              <span className="text-[10px] font-semibold text-[#66796E]">
                {item.date}
              </span>
            </div>
          ))}

          {/* Card 5: Add New Photos Box */}
          <div
            onClick={() => router.push('/upload-photos')}
            className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-[#BCCFC0] bg-[#F7FAF7] hover:bg-white hover:border-[#0B3C26] transition-all flex flex-col items-center justify-center text-center p-3 cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-full bg-[#E6F4EA] group-hover:bg-[#0B3C26] text-[#0B3C26] group-hover:text-white flex items-center justify-center mb-1.5 transition">
              <Camera className="w-4.5 h-4.5" />
            </div>
            <h5 className="text-xs font-extrabold text-[#082014] group-hover:text-[#0B3C26]">Add New Photos</h5>
            <p className="text-[10px] text-[#66796E] font-medium leading-tight mt-0.5">
              Upload new photos to track your progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
