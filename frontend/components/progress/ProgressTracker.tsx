"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  ArrowRight,
  Camera,
  CheckCircle2,
  Sliders,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export interface TimelineSession {
  id: string;
  date: string;
  label: string;
  angle: string;
  photoUrl: string;
}

export interface PlanProgressMetrics {
  nutritionPlanPercent: number;
  hairCareRoutinePercent: number;
  lifestyleHabitsPercent: number;
  nextCheckInDate: string;
  overallAdherenceRate: number;
  streakDays: number;
  userReportedChanges: string[];
}

const DEFAULT_TIMELINE: TimelineSession[] = [
  { id: 'sess_jun', date: '12 Jun 2025', label: 'Baseline', angle: 'Top View', photoUrl: '/hair-progress.jpg' },
  { id: 'sess_jul', date: '12 Jul 2025', label: 'Month 1', angle: 'Top View', photoUrl: '/hair-progress.jpg' },
  { id: 'sess_aug', date: '12 Aug 2025', label: 'Month 2', angle: 'Top View', photoUrl: '/hair-progress.jpg' },
  { id: 'sess_sep', date: '12 Sep 2025', label: 'Month 3 (Latest)', angle: 'Top View', photoUrl: '/hair-progress.jpg' },
];

const DEFAULT_METRICS: PlanProgressMetrics = {
  nutritionPlanPercent: 80,
  hairCareRoutinePercent: 60,
  lifestyleHabitsPercent: 70,
  nextCheckInDate: '05 Oct 2025',
  overallAdherenceRate: 85.0,
  streakDays: 12,
  userReportedChanges: [
    'Reduced hair shedding during wash days',
    'Increased scalp hydration and comfort',
    'Noticeable improvement in hair strand shine',
  ],
};

export const ProgressTracker: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [angleFilter, setAngleFilter] = useState<string>('Top View');
  const [timeline, setTimeline] = useState<TimelineSession[]>(DEFAULT_TIMELINE);
  const [metrics, setMetrics] = useState<PlanProgressMetrics>(DEFAULT_METRICS);

  const [compareBaseline, setCompareBaseline] = useState<string>('sess_jun');
  const [compareTarget, setCompareTarget] = useState<string>('sess_sep');
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      apiClient
        .get('/progress')
        .then((res) => {
          if (res.timeline?.length) {
            setTimeline(res.timeline);
          }
          if (res.planProgress) {
            setMetrics(res.planProgress);
          }
        })
        .catch(() => { });
    }
  }, [isAuthenticated]);

  const handleGenerateComparison = async () => {
    setReportLoading(true);
    try {
      if (isAuthenticated) {
        const res = await apiClient.post('/progress/reports', {
          baselineSessionId: compareBaseline,
          comparisonSessionId: compareTarget,
        });
        setGeneratedReport(res.report);
      } else {
        setGeneratedReport({
          summary: 'Visual comparison between 12 Jun 2025 and 12 Sep 2025.',
          cautiousObservations: [
            'Strand alignment and scalp coverage appear stable under consistent top lighting.',
            'No major increase in scalp redness or irritation detected in top-angle framing.',
            'Photo conditions vary slightly in warmth; visual differences should be interpreted cautiously.',
          ],
          disclaimer: 'This progress summary identifies visual photograph differences and does not constitute a clinical medical diagnosis.',
        });
      }
    } catch (err) {
      // Fallback
    } finally {
      setReportLoading(false);
    }
  };

  const baselineSession = timeline.find((t) => t.id === compareBaseline) || timeline[0];
  const targetSession = timeline.find((t) => t.id === compareTarget) || timeline[timeline.length - 1];

  return (
    <div className="space-y-6 w-full pb-12 text-[#1A2620]">
      {/* 1. Desktop Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#123926] tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-[#123926]" /> Hair Progress Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#55645B] font-semibold mt-1">
            See the difference over time with side-by-side photo history and consistency analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-full bg-white border border-[#D5E0D5] text-[#123926] font-extrabold text-xs shadow-2xs">
            Overall Adherence: {metrics.overallAdherenceRate}%
          </span>
          <button
            onClick={() => router.push('/upload-photos')}
            className="px-5 py-2 rounded-xl bg-[#123926] text-white text-xs font-bold hover:bg-[#0D2E1E] transition shadow-2xs flex items-center gap-2"
          >
            <Camera className="w-3.5 h-3.5" /> Upload New Photo Session
          </button>
        </div>
      </div>

      {/* 2. Timeline Gallery Section (White Card) */}
      <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-5 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#123926]">Hair Progress Timeline</h3>
            <p className="text-xs text-[#627269] font-medium mt-0.5">Chronological scalp growth sessions</p>
          </div>

          <div className="relative">
            <select
              value={angleFilter}
              onChange={(e) => setAngleFilter(e.target.value)}
              className="appearance-none bg-[#EEF4EE] text-xs font-bold text-[#123926] py-1.5 pl-3.5 pr-8 rounded-xl border border-[#D2DDD2] focus:outline-none cursor-pointer"
            >
              <option value="Top View">Top View</option>
              <option value="Crown View">Crown View</option>
              <option value="Hairline View">Hairline View</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#526158] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {timeline.map((session) => (
            <div key={session.id} className="group cursor-pointer flex flex-col items-center w-full">
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#E2ECE2] border border-[#D0DCD0] group-hover:border-[#123926] transition-all shadow-2xs">
                <img src={session.photoUrl} alt={session.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="text-center mt-2">
                <p className="text-xs font-bold text-[#1A2620]">{session.date}</p>
                <p className="text-[10px] text-[#55645B] font-medium">{session.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Desktop Grid Section (12 Columns) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column (8 cols): Side-by-Side Comparison Tool */}
        <div className="xl:col-span-8 space-y-6 w-full">
          <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-5 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAF0EA]">
              <div>
                <h3 className="text-base font-extrabold text-[#123926]">Side-by-Side Photo Comparator</h3>
                <p className="text-xs text-[#627269] font-medium mt-0.5">Compare baseline vs recent sessions</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={compareBaseline}
                  onChange={(e) => setCompareBaseline(e.target.value)}
                  className="bg-[#EEF4EE] text-xs font-bold text-[#123926] py-1.5 px-3 rounded-xl border border-[#D2DDD2]"
                >
                  {timeline.map((t) => (
                    <option key={t.id} value={t.id}>{t.date} ({t.label})</option>
                  ))}
                </select>
                <span className="text-xs font-bold text-[#55645B]">vs</span>
                <select
                  value={compareTarget}
                  onChange={(e) => setCompareTarget(e.target.value)}
                  className="bg-[#EEF4EE] text-xs font-bold text-[#123926] py-1.5 px-3 rounded-xl border border-[#D2DDD2]"
                >
                  {timeline.map((t) => (
                    <option key={t.id} value={t.id}>{t.date} ({t.label})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side by side image cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2ECE2] space-y-2 text-center">
                <span className="text-xs font-extrabold text-[#123926]">Baseline ({baselineSession.date})</span>
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={baselineSession.photoUrl} alt="Baseline" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2ECE2] space-y-2 text-center">
                <span className="text-xs font-extrabold text-[#123926]">Target ({targetSession.date})</span>
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={targetSession.photoUrl} alt="Target" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateComparison}
              disabled={reportLoading}
              className="w-full py-3 px-4 rounded-2xl bg-[#123926] text-white text-xs font-bold hover:bg-[#0D2E1E] transition shadow-2xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              {reportLoading ? 'Generating Analysis...' : 'Generate Visual Comparison Report'}
            </button>

            {generatedReport && (
              <div className="p-4 rounded-xl bg-[#EAF1EA] border border-[#CDE0CD] space-y-2 text-xs text-[#202D26]">
                <p className="font-bold">{generatedReport.summary}</p>
                {generatedReport.cautiousObservations?.map((obs: string, i: number) => (
                  <p key={i}>• {obs}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Reported Changes & Quick Actions */}
        <div className="xl:col-span-4 space-y-6 w-full">
          <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-4 w-full">
            <h3 className="text-base font-extrabold text-[#123926]">Observed Improvements</h3>

            <div className="space-y-3">
              {metrics.userReportedChanges.map((change, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2] flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                  <span className="text-xs font-bold text-[#1A2620]">{change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
