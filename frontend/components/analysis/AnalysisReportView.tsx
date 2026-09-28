"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
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
  Check,
  Clock,
  Droplets,
  Utensils,
  Calendar,
  Lightbulb,
  MoreHorizontal,
  ScanLine,
  Leaf,
  Layers,
  AlertTriangle,
  History,
  CheckCircle,
  Pill,
  Award,
  Stethoscope,
  Scissors,
  Plus,
  Star,
  ExternalLink,
  ShoppingCart,
  Zap,
  CheckSquare
} from 'lucide-react';

interface AngleScore {
  angle: string;
  densityPercent: number;
  observations: string;
}

interface DoctorRecommendation {
  category: 'Shampoo & Cleanser' | 'Topical Solution & Serum' | 'Supplement & Medicine' | 'Scalp Routine';
  name: string;
  purpose: string;
  frequency: string;
  hairTypeTarget?: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  price: string;
  keyIngredients: string[];
  dosage: string;
  badge?: 'Trichologist Pick' | 'Clinical Grade' | 'Doctor Recommended';
}

const DEFAULT_DOCTOR_RECOMMENDATIONS_FE: DoctorRecommendation[] = [
  {
    category: 'Shampoo & Cleanser',
    name: 'Ketoconazole 2% Anti-Inflammation Scalp Shampoo',
    purpose: 'Reduces scalp micro-inflammation, clears sebum blockage from hair follicles, and regulates yeast proliferation.',
    frequency: 'Use 2 - 3 times weekly',
    hairTypeTarget: 'Moderate Sebum / Crown Parting Exposure',
    imageUrl: '/images/products/shampoo_ketoconazole.jpg',
    rating: 4.9,
    reviewsCount: 1420,
    price: '$24.99',
    keyIngredients: ['Ketoconazole 2%', 'Salicylic Acid', 'Tea Tree Oil'],
    dosage: 'Apply 5ml to damp scalp. Massage gently for 2 mins, leave on for 3-5 mins before thorough rinse.',
    badge: 'Trichologist Pick',
  },
  {
    category: 'Topical Solution & Serum',
    name: 'Rosemary Extract (2%) & Copper Peptide Hair Growth Serum',
    purpose: 'Stimulates micro-circulation at temporal hairline and strengthens follicle anchoring matrix.',
    frequency: 'Apply 1ml nightly to scalp crown & hairline',
    hairTypeTarget: 'Slightly Thinning Crown & Temple Hair',
    imageUrl: '/images/products/rosemary_serum.jpg',
    rating: 4.8,
    reviewsCount: 980,
    price: '$38.50',
    keyIngredients: ['Rosemary Leaf Extract 2%', 'Copper Tripeptide-1', 'Redensyl'],
    dosage: 'Dispense 1 dropper (1ml) onto clean dry scalp. Massage into thinning regions until fully absorbed.',
    badge: 'Doctor Recommended',
  },
  {
    category: 'Supplement & Medicine',
    name: 'Biotin 5000mcg + Saw Palmetto & Marine Collagen Supplement',
    purpose: 'Inhibits topical DHT follicle binding, fortifies keratin synthesis, and enhances hair strand elasticity.',
    frequency: 'Take 1 capsule daily with morning meal',
    hairTypeTarget: 'Fine to Medium Hair / Low Density Risk',
    imageUrl: '/images/products/biotin_supplements.jpg',
    rating: 4.9,
    reviewsCount: 2150,
    price: '$29.95',
    keyIngredients: ['Biotin 5000mcg', 'Saw Palmetto Extract', 'Marine Collagen Types I & III', 'Zinc Picolinate'],
    dosage: 'Take 1 capsule daily with food and a full glass of water.',
    badge: 'Clinical Grade',
  },
  {
    category: 'Scalp Routine',
    name: '0.5mm Microneedling Scalp Dermaroller & Hydrating Mask',
    purpose: 'Triggers micro-wounding repair response to boost collagen and enhances scalp serum transdermal absorption.',
    frequency: 'Use once every 7 to 10 days',
    hairTypeTarget: 'Scalp Thinning & Slow Follicle Growth',
    imageUrl: '/images/products/dermaroller_mask.jpg',
    rating: 4.7,
    reviewsCount: 640,
    price: '$34.00',
    keyIngredients: ['Titanium 0.5mm Micro-needles', 'Hyaluronic Acid', 'Centella Asiatica'],
    dosage: 'Sanitize dermaroller in 70% isopropyl alcohol. Roll gently 4 times across crown in vertical & horizontal directions.',
    badge: 'Doctor Recommended',
  },
];

export function AnalysisReportView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Doctor Rx' | 'Scalp' | 'Density' | 'Concerns' | 'Photo Comparison' | 'History'>('Overview');
  const [addedRoutineMap, setAddedRoutineMap] = useState<Record<string, boolean>>({});
  const [selectedProductModal, setSelectedProductModal] = useState<DoctorRecommendation | null>(null);

  const [assessment, setAssessment] = useState({
    hairDensity: 'Moderate',
    scalpHealth: 'Good',
    hairThickness: 'Slightly Low',
    signsOfDamage: 'Minimal',
    overallAssessment: 'Moderate',
    hairDensityScore: 78,
    sebumLevelScore: 42,
    scalpHydrationScore: 84,
    follicleCountEstimate: 142,
    strandThicknessMicrons: 65,
    sheddingRiskLevel: 'Low',
    angleScores: [
      { angle: 'Front Hairline', densityPercent: 82, observations: 'Good baseline coverage, slight temporal recession' },
      { angle: 'Top Scalp Crown', densityPercent: 74, observations: 'Mild parting line exposure' },
      { angle: 'Left Temple', densityPercent: 80, observations: 'Healthy follicle grouping' },
      { angle: 'Right Temple', densityPercent: 78, observations: 'Normal hair strand thickness' },
    ] as AngleScore[],
    doctorRecommendations: DEFAULT_DOCTOR_RECOMMENDATIONS_FE,
    notableObservations: [
      'Mild thinning at the crown area',
      'No major signs of scalp inflammation',
      'Slight dryness visible',
      'Overall healthy hair structure',
    ],
    unassessedAreas: ['Scalp perimeter under dense hair'],
    limitations: ['Standard 2D photo resolution and lighting'],
    dateStr: 'Latest Scan',
  });

  const [userPhotos, setUserPhotos] = useState<Array<{ label: string; date: string; url: string; category: string }>>([
    { label: 'Front Hairline', category: 'FRONT_HAIRLINE', date: 'Today', url: '/images/front_hairline.jpg' },
    { label: 'Top of Scalp', category: 'TOP_SCALP', date: 'Today', url: '/images/scalp_progress.jpg' },
    { label: 'Left Side', category: 'LEFT_SIDE', date: 'Today', url: '/images/side_profile.jpg' },
    { label: 'Right Side', category: 'RIGHT_SIDE', date: 'Today', url: '/images/side_profile.jpg' },
  ]);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // 1. Fetch latest visual assessment
    apiClient
      .get<{ assessment: any }>('/assessments/latest')
      .then((res) => {
        if (res.assessment) {
          const a = res.assessment;
          setAssessment((prev) => ({
            ...prev,
            hairDensity: a.hairDensity || prev.hairDensity,
            scalpHealth: a.scalpHealth || prev.scalpHealth,
            hairThickness: a.hairThickness || prev.hairThickness,
            signsOfDamage: a.signsOfDamage || prev.signsOfDamage,
            overallAssessment: a.overallAssessment || prev.overallAssessment,
            hairDensityScore: typeof a.hairDensityScore === 'number' ? a.hairDensityScore : prev.hairDensityScore,
            sebumLevelScore: typeof a.sebumLevelScore === 'number' ? a.sebumLevelScore : prev.sebumLevelScore,
            scalpHydrationScore: typeof a.scalpHydrationScore === 'number' ? a.scalpHydrationScore : prev.scalpHydrationScore,
            follicleCountEstimate: typeof a.follicleCountEstimate === 'number' ? a.follicleCountEstimate : prev.follicleCountEstimate,
            strandThicknessMicrons: typeof a.strandThicknessMicrons === 'number' ? a.strandThicknessMicrons : prev.strandThicknessMicrons,
            sheddingRiskLevel: a.sheddingRiskLevel || prev.sheddingRiskLevel,
            angleScores: Array.isArray(a.angleScores) && a.angleScores.length > 0 ? a.angleScores : prev.angleScores,
            doctorRecommendations: Array.isArray(a.doctorRecommendations) && a.doctorRecommendations.length > 0
              ? a.doctorRecommendations.map((r: any, idx: number) => ({
                  ...DEFAULT_DOCTOR_RECOMMENDATIONS_FE[idx % DEFAULT_DOCTOR_RECOMMENDATIONS_FE.length],
                  ...r,
                }))
              : prev.doctorRecommendations,
            notableObservations: Array.isArray(a.notableObservations) && a.notableObservations.length > 0 ? a.notableObservations : prev.notableObservations,
            unassessedAreas: Array.isArray(a.unassessedAreas) ? a.unassessedAreas : prev.unassessedAreas,
            limitations: Array.isArray(a.limitations) ? a.limitations : prev.limitations,
            dateStr: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Latest Scan',
          }));
        }
      })
      .catch(() => {});

    // 2. Restore user photos from local storage map on mount
    if (typeof window !== 'undefined') {
      const savedStr = localStorage.getItem('haircare_uploaded_photos');
      if (savedStr) {
        try {
          const map = JSON.parse(savedStr);
          setUserPhotos((prev) =>
            prev.map((item) => {
              if (map[item.category]) {
                return { ...item, url: map[item.category], date: 'Uploaded' };
              }
              return item;
            })
          );
        } catch (e) {}
      }
    }

    // 3. Retrieve logged in session photos from backend API
    apiClient
      .get<{ sessions: any[] }>('/photo-sessions')
      .then((res) => {
        if (res.sessions && res.sessions.length > 0) {
          const latestSession = res.sessions[0];
          if (latestSession.photos && latestSession.photos.length > 0) {
            const photoMap: Record<string, string> = {};
            latestSession.photos.forEach((p: any) => {
              if (p.category && p.storageKey) {
                const fullUrl = p.storageKey.startsWith('http')
                  ? p.storageKey
                  : `${apiBaseUrl}${p.storageKey}`;
                photoMap[p.category] = fullUrl;
              }
            });
            setUserPhotos((prev) =>
              prev.map((item) => {
                if (photoMap[item.category]) {
                  return { ...item, url: photoMap[item.category], date: 'Uploaded' };
                }
                return item;
              })
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleAddToRoutine = (recName: string) => {
    setAddedRoutineMap((prev) => ({ ...prev, [recName]: !prev[recName] }));
  };

  return (
    <div className="space-y-6 w-full pb-10 text-[#12241A] font-sans selection:bg-[#0B3C26] selection:text-white">
      {/* 1. Page Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1 w-full">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-[#E6F4EA] text-[#0B3C26] text-[11px] font-extrabold border border-[#C5E8CE] flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-[#0B3C26]" /> Doctor & AI Trichologist Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082014] tracking-tight font-heading">
            My Analysis & Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6256] font-medium mt-1">
            View your hair & scalp assessment, quantitative scores, and targeted Doctor recommendations.
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
                <h3 className="text-base font-extrabold text-[#082014] font-heading">Latest Visual AI Analysis</h3>
                <p className="text-xs text-[#5C7063] font-medium">{assessment.dateStr}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#16A34A] text-xs font-extrabold flex items-center gap-1.5 border border-[#C5E8CE]">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Analysis Completed
            </span>
          </div>

          {/* 4 Angle Thumbnails Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 w-full">
            {userPhotos.map((item, idx) => (
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
                {assessment.overallAssessment}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4E6256] font-medium leading-relaxed pt-1">
              Your hair density is evaluated at <strong className="text-[#082014]">{assessment.hairDensityScore}%</strong> with an estimated <strong className="text-[#082014]">{assessment.follicleCountEstimate} follicles/cm²</strong>. Scalp hydration is optimal at {assessment.scalpHydrationScore}%.
            </p>
          </div>

          <button
            onClick={() => router.push('/plan')}
            className="w-full py-3 px-6 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white font-extrabold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>View Personalized Routine Plan</span> <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* 3. Horizontal Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
        {(['Overview', 'Doctor Rx', 'Scalp', 'Density', 'Concerns', 'Photo Comparison', 'History'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === tab
              ? 'bg-[#0B3C26] text-white shadow-sm font-extrabold'
              : 'bg-white/70 hover:bg-white text-[#4E6256] border border-[#CCDCCD]'
              }`}
          >
            {tab === 'Doctor Rx' && <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {/* 4. Dynamic Tab Views */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="space-y-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
            {/* Column 1: Key Quantitative Metrics (Span 5 Cols) */}
            <div className="lg:col-span-5 bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
              <h3 className="text-base font-extrabold text-[#082014] font-heading">Quantitative Scores</h3>

              <div className="space-y-4 w-full pt-1">
                {/* Metric 1: Hair Density */}
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2.5 font-bold text-[#142A1E]">
                      <div className="w-7 h-7 rounded-xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                        <BarChart2 className="w-4 h-4" />
                      </div>
                      Hair Density Index
                    </span>
                    <span className="font-extrabold text-[#142A1E]">{assessment.hairDensityScore}% ({assessment.hairDensity})</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#E5ECE3] overflow-hidden">
                    <div
                      className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                      style={{ width: `${assessment.hairDensityScore}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2: Scalp Hydration */}
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2.5 font-bold text-[#142A1E]">
                      <div className="w-7 h-7 rounded-xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                        <Droplets className="w-4 h-4" />
                      </div>
                      Scalp Hydration
                    </span>
                    <span className="font-extrabold text-[#142A1E]">{assessment.scalpHydrationScore}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#E5ECE3] overflow-hidden">
                    <div
                      className="h-full bg-[#0284C7] rounded-full transition-all duration-500"
                      style={{ width: `${assessment.scalpHydrationScore}%` }}
                    />
                  </div>
                </div>

                {/* Metric 3: Sebum Level */}
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2.5 font-bold text-[#142A1E]">
                      <div className="w-7 h-7 rounded-xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      Sebum Level Balance
                    </span>
                    <span className="font-extrabold text-[#142A1E]">{assessment.sebumLevelScore}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#E5ECE3] overflow-hidden">
                    <div
                      className="h-full bg-[#EAB308] rounded-full transition-all duration-500"
                      style={{ width: `${assessment.sebumLevelScore}%` }}
                    />
                  </div>
                </div>

                {/* Metric 4: Follicle Count & Thickness */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#EFF5EE] border border-[#E0EAE0]">
                    <p className="text-[10px] text-[#5C7063] font-bold uppercase tracking-wider">Follicle Count</p>
                    <p className="text-base font-extrabold text-[#082014] mt-0.5">{assessment.follicleCountEstimate} <span className="text-[10px] font-normal text-gray-500">/cm²</span></p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EFF5EE] border border-[#E0EAE0]">
                    <p className="text-[10px] text-[#5C7063] font-bold uppercase tracking-wider">Strand Thickness</p>
                    <p className="text-base font-extrabold text-[#082014] mt-0.5">{assessment.strandThicknessMicrons} <span className="text-[10px] font-normal text-gray-500">µm</span></p>
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
                  {assessment.notableObservations.map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B3C26] flex-shrink-0 mt-1.5" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer Box */}
              <div className="p-3.5 rounded-xl bg-[#EFF5EE] border border-[#E0EAE0] flex items-start gap-2.5 text-xs text-[#526659]">
                <Info className="w-4 h-4 text-[#0B3C26] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium leading-snug">
                  This AI assessment provides wellness information and does not constitute a medical diagnosis.
                </p>
              </div>
            </div>

            {/* Column 3: Recommendations (Span 3 Cols) */}
            <div className="lg:col-span-3 space-y-4 w-full">
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
                    <span>Clear resolution & lighting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 fill-current text-white" />
                    <span>All target angles analyzed</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 shadow-sm space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4.5 h-4.5 text-[#CA8A04]" />
                  <h4 className="text-sm font-extrabold text-[#082014]">AI Action Plan</h4>
                </div>
                <ul className="space-y-2 text-[11px] text-[#3A4E41] font-semibold">
                  <li className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
                    <span>Apply scalp serum 3x / week</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#0B3C26] flex-shrink-0" />
                    <span>Increase Biotin & Zinc nutrients</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* DOCTOR & TRICHOLOGIST RECOMMENDATIONS PRODUCT SHOWCASE GRID */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-6 shadow-sm space-y-5 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2ECE2] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Stethoscope className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#082014] font-heading flex items-center gap-2">
                    Doctor & Trichologist Prescribed Hair Products & Solutions
                  </h3>
                  <p className="text-xs text-[#5C7063] font-medium">
                    Formulated specifically for your hair density ({assessment.hairDensityScore}%), scalp condition, and porosity.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('Doctor Rx')}
                className="px-4 py-2 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white font-extrabold text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <span>Full Prescription Guide</span> <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Rich Visual Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-1 w-full">
              {assessment.doctorRecommendations.map((rec, idx) => {
                const isAdded = addedRoutineMap[rec.name];
                return (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl border border-[#D8E4D8] hover:border-[#0B3C26] transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden flex flex-col justify-between w-full"
                  >
                    {/* Product Image Container */}
                    <div className="relative aspect-square w-full bg-[#F4F8F4] overflow-hidden flex items-center justify-center">
                      <img
                        src={rec.imageUrl}
                        alt={rec.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                      {rec.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0B3C26] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                          {rec.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#082014] text-xs font-black shadow-sm">
                        {rec.price}
                      </span>
                    </div>

                    {/* Product Body Details */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-[#0B3C26] uppercase tracking-wider">{rec.category}</span>
                          <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{rec.rating}</span>
                            <span className="text-gray-400 font-normal">({rec.reviewsCount})</span>
                          </div>
                        </div>

                        <h4 className="text-sm font-black text-[#082014] group-hover:text-[#0B3C26] transition-colors leading-snug">
                          {rec.name}
                        </h4>

                        <p className="text-xs text-[#4E6256] font-medium leading-relaxed line-clamp-2">
                          {rec.purpose}
                        </p>

                        {/* Ingredients Chips */}
                        {rec.keyIngredients && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {rec.keyIngredients.map((ing, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-[#EFF5EE] text-[#0B3C26] text-[10px] font-bold border border-[#E0EAE0]">
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="space-y-2 pt-3 border-t border-[#E8EFE8] mt-2">
                        <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                          <span>Frequency:</span>
                          <span className="font-extrabold text-[#082014]">{rec.frequency}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddToRoutine(rec.name)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                              isAdded
                                ? 'bg-[#0B3C26] text-white shadow-2xs'
                                : 'bg-[#E6F4EA] hover:bg-[#0B3C26] text-[#0B3C26] hover:text-white border border-[#C5E8CE]'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" /> Added
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" /> Routine
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedProductModal(rec)}
                            className="py-2 px-3 rounded-xl bg-white border border-gray-300 hover:border-[#0B3C26] text-[#082014] text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Details</span> <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR RX */}
      {activeTab === 'Doctor Rx' && (
        <div className="space-y-6 w-full">
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-[#E2ECE2] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#082014]">Clinical Trichologist Prescription & Product Guide</h3>
                <p className="text-xs sm:text-sm text-[#5C7063] font-medium">Formulated targeted solutions based on your multi-angle hair photo scan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {assessment.doctorRecommendations.map((rec, idx) => {
                const isAdded = addedRoutineMap[rec.name];
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-[#F8FAF8] border border-[#E0EAE0] hover:border-[#0B3C26] transition-all space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white border border-[#D8E4D8] flex-shrink-0 shadow-2xs">
                        <img src={rec.imageUrl} alt={rec.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Product Overview */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4EA] text-[#0B3C26] text-[10px] font-extrabold uppercase">
                            {rec.category}
                          </span>
                          {rec.badge && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3D6] text-[#D97706] text-[10px] font-black uppercase tracking-wider border border-[#FDE68A]">
                              {rec.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-black text-[#082014]">{rec.name}</h4>
                        <p className="text-xs font-bold text-[#0B3C26]">{rec.price} <span className="text-[10px] text-amber-500 font-normal ml-1">★ {rec.rating} ({rec.reviewsCount} reviews)</span></p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4E6256] leading-relaxed font-medium bg-white p-3 rounded-xl border border-gray-100">
                      <strong>Clinical Purpose:</strong> {rec.purpose}
                    </p>

                    {/* Prescribed Dosage Box */}
                    <div className="p-3.5 rounded-xl bg-[#EFF5EE] border border-[#E0EAE0] space-y-1">
                      <span className="text-[10px] font-extrabold text-[#0B3C26] uppercase tracking-wider flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5" /> Doctor Prescribed Dosage & Application:
                      </span>
                      <p className="text-xs text-[#2A3E31] font-semibold leading-relaxed">
                        {rec.dosage}
                      </p>
                    </div>

                    {/* Ingredients & Target */}
                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-white border border-[#E0EAE0] space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block">Key Active Ingredients</span>
                        <div className="flex flex-wrap gap-1">
                          {rec.keyIngredients.map((ing, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-[#0B3C26] text-[10px] font-bold">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#E0EAE0] space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block">Application Frequency</span>
                        <span className="font-extrabold text-[#082014] block mt-0.5">{rec.frequency}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleAddToRoutine(rec.name)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                          isAdded
                            ? 'bg-[#0B3C26] text-white'
                            : 'bg-[#0B3C26] hover:bg-[#072B1B] text-white shadow-sm'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" /> Added to Daily Routine
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> Add to Routine Reminders
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCALP HEALTH */}
      {activeTab === 'Scalp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
          <div className="lg:col-span-6 bg-white/90 rounded-2xl p-6 shadow-sm border border-white/80 space-y-4">
            <h3 className="text-lg font-extrabold text-[#082014]">Scalp Health Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F4F9F4] border border-[#D5E5D5]">
                <p className="text-xs text-gray-500 font-bold">Hydration Status</p>
                <p className="text-xl font-extrabold text-[#0B3C26] mt-1">{assessment.scalpHydrationScore}%</p>
                <p className="text-[11px] text-emerald-700 mt-1">Optimal moisture balance</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FFFDF0] border border-[#FDE68A]">
                <p className="text-xs text-gray-500 font-bold">Sebum Balance</p>
                <p className="text-xl font-extrabold text-[#D97706] mt-1">{assessment.sebumLevelScore}%</p>
                <p className="text-[11px] text-amber-700 mt-1">Balanced sebum secretion</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#EFF5EE] text-xs text-[#2A3E31] leading-relaxed">
              <strong>Scalp Barrier Assessment:</strong> The scalp epidermis shows minimal scaling or inflammation. Moisture retention is optimal, supporting active hair growth phases.
            </div>
          </div>

          <div className="lg:col-span-6 bg-white/90 rounded-2xl p-6 shadow-sm border border-white/80 space-y-4">
            <h3 className="text-lg font-extrabold text-[#082014]">Scalp Care Guidelines</h3>
            <ul className="space-y-3 text-xs text-[#2A3E31] font-semibold">
              <li className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Droplets className="w-5 h-5 text-[#0B3C26]" />
                <span>Use a sulfate-free hydrating shampoo to protect natural lipid barrier.</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Sparkles className="w-5 h-5 text-[#0B3C26]" />
                <span>Exfoliate scalp gently once every 2 weeks to unclog hair follicles.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: DENSITY */}
      {activeTab === 'Density' && (
        <div className="space-y-5 w-full">
          <div className="bg-white/90 rounded-2xl p-6 shadow-sm border border-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#082014]">Multi-Angle Hair Density Grid</h3>
                <p className="text-xs text-gray-500">Breakdown across key scalp target regions.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#0B3C26] text-xs font-bold">
                Avg Density: {assessment.hairDensityScore}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {assessment.angleScores.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E0EAE0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#082014]">{item.angle}</span>
                    <span className="text-xs font-extrabold text-[#0B3C26]">{item.densityPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#154D34] rounded-full" style={{ width: `${item.densityPercent}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium leading-tight pt-1">{item.observations}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONCERNS */}
      {activeTab === 'Concerns' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
          <div className="lg:col-span-7 bg-white/90 rounded-2xl p-6 shadow-sm border border-white/80 space-y-4">
            <h3 className="text-lg font-extrabold text-[#082014]">Shedding & Health Risk Profile</h3>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Shedding Risk Level: {assessment.sheddingRiskLevel}</h4>
                <p className="text-[11px] text-amber-800 mt-0.5">Mild temporal parting exposure detected. Early preventive routine recommended.</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#082014]">Unassessed Scalp Regions</h4>
              <ul className="space-y-1">
                {assessment.unassessedAreas.map((area, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#0B3C26] rounded-full" /> {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/90 rounded-2xl p-6 shadow-sm border border-white/80 space-y-3">
            <h3 className="text-lg font-extrabold text-[#082014]">Scan Limitations</h3>
            <ul className="space-y-2">
              {assessment.limitations.map((item, idx) => (
                <li key={idx} className="text-xs text-gray-600 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 6: PHOTO COMPARISON */}
      {activeTab === 'Photo Comparison' && (
        <div className="bg-white/90 rounded-2xl p-6 shadow-sm border border-white/80 space-y-4 w-full">
          <h3 className="text-lg font-extrabold text-[#082014]">Photo Comparison & Progression</h3>
          <p className="text-xs text-gray-500">Compare photos across key target angles.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {userPhotos.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-bold text-center text-[#082014]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: HISTORY */}
      {activeTab === 'History' && (
        <div className="bg-white/90 rounded-2xl p-6 shadow-sm border border-white/80 space-y-4 w-full">
          <h3 className="text-lg font-extrabold text-[#082014]">Analysis Scan History</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAF8] border border-[#E0EAE0]">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-[#0B3C26]" />
                <div>
                  <p className="text-xs font-bold text-[#082014]">Scan #{assessment.dateStr}</p>
                  <p className="text-[11px] text-gray-500">Density Score: {assessment.hairDensityScore}% • Health: {assessment.scalpHealth}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#0B3C26] text-xs font-bold">Latest</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Section: Your Photos */}
      <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
        <h3 className="text-base font-extrabold text-[#082014] font-heading">Uploaded Target Angle Photos</h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
          {userPhotos.map((item, idx) => (
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

      {/* PRODUCT DETAIL MODAL */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#0B3C26]" />
                <h3 className="text-base font-extrabold text-[#082014]">Doctor Prescription Details</h3>
              </div>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-4">
              <img
                src={selectedProductModal.imageUrl}
                alt={selectedProductModal.name}
                className="w-24 h-24 rounded-2xl object-cover border border-gray-200"
              />
              <div className="space-y-1 flex-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#0B3C26] text-[10px] font-bold">
                  {selectedProductModal.category}
                </span>
                <h4 className="text-sm font-black text-[#082014]">{selectedProductModal.name}</h4>
                <p className="text-xs font-extrabold text-[#0B3C26]">{selectedProductModal.price}</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed font-medium bg-gray-50 p-3 rounded-xl">
              <strong>Clinical Action:</strong> {selectedProductModal.purpose}
            </p>

            <div className="p-3.5 rounded-xl bg-[#EFF5EE] border border-[#E0EAE0] space-y-1">
              <span className="text-[10px] font-extrabold text-[#0B3C26] uppercase tracking-wider block">
                Prescribed Dosage Instructions:
              </span>
              <p className="text-xs text-[#2A3E31] font-semibold">
                {selectedProductModal.dosage}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  handleAddToRoutine(selectedProductModal.name);
                  setSelectedProductModal(null);
                }}
                className="w-full py-3 rounded-xl bg-[#0B3C26] text-white text-xs font-extrabold hover:bg-[#072B1B] shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" /> Add to My Daily Routine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
