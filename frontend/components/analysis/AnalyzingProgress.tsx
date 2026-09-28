"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export const AnalyzingProgress: React.FC<{ sessionId?: string }> = ({ sessionId }) => {
  const router = useRouter();

  const [progress, setProgress] = useState<number>(72); // 72% matching reference UI
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', label: 'Checking image quality', completed: true },
    { id: '2', label: 'Analyzing hair density', completed: true },
    { id: '3', label: 'Looking for scalp conditions', completed: false },
    { id: '4', label: 'Generating insights', completed: false },
    { id: '5', label: 'Preparing your personalized plan', completed: false },
  ]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const activeSessionId =
      sessionId ||
      (typeof window !== 'undefined' ? localStorage.getItem('haircare_photo_session_id') : null);

    if (activeSessionId) {
      apiClient
        .post(`/photo-sessions/${activeSessionId}/analyze`)
        .catch((err) => {
          console.warn('AI analysis API notice:', err.message);
        });
    }

    // Animate checklist progress over time
    const t1 = setTimeout(() => {
      setChecklist((prev) =>
        prev.map((item) => (item.id === '3' ? { ...item, completed: true } : item))
      );
      setProgress(85);
    }, 1500);

    const t2 = setTimeout(() => {
      setChecklist((prev) =>
        prev.map((item) => (item.id === '4' ? { ...item, completed: true } : item))
      );
      setProgress(94);
    }, 3000);

    const t3 = setTimeout(() => {
      setChecklist((prev) =>
        prev.map((item) => (item.id === '5' ? { ...item, completed: true } : item))
      );
      setProgress(100);
    }, 4500);

    const t4 = setTimeout(() => {
      // Auto advance to Screen 4/4 (Your Hair Analysis)
      router.push('/analysis');
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [router, sessionId]);

  return (
    <div className="max-w-md mx-auto bg-[#F8FAF8] text-[#1F2937] rounded-3xl shadow-xl border border-emerald-900/10 overflow-hidden font-sans my-4">
      {/* Step Progress Header 3/4 matching reference UI */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => router.push('/onboarding')}
          className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
          title="Back to Questionnaire"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#154D34] w-[75%] rounded-full transition-all duration-300" />
          </div>
          <span className="text-xs font-semibold text-gray-500 font-mono">3/4</span>
        </div>
      </div>

      {/* Screen Title & Subtitle */}
      <div className="px-6 pt-6 pb-2 text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-heading">
          Analyzing Your Photos
        </h1>
        <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
          Our AI is carefully analyzing your hair and scalp images. This may take a minute...
        </p>
      </div>

      {/* Circular Progress Meter (72%) matching reference UI */}
      <div className="flex justify-center py-6">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#154D34"
              strokeWidth="8"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <Sparkles className="w-5 h-5 text-[#154D34] mb-0.5 animate-pulse" />
            <span className="text-2xl font-extrabold text-gray-900 font-heading">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Animated Checklist Steps matching reference UI */}
      <div className="px-8 py-2 space-y-3 max-w-xs mx-auto">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${item.completed
                  ? 'bg-[#154D34] text-white'
                  : 'border border-gray-300 bg-white text-gray-400'
                }`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              )}
            </div>
            <span
              className={`text-xs ${item.completed ? 'font-semibold text-gray-900' : 'text-gray-400 font-medium'
                }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Data Security Privacy Card matching reference UI */}
      <div className="px-6 py-6 mt-4">
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center space-y-1">
          <div className="w-7 h-7 rounded-full bg-[#154D34] text-white flex items-center justify-center mx-auto mb-1">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs font-bold text-gray-900">Your data is secure</p>
          <p className="text-[11px] text-gray-500">
            and never shared without your permission.
          </p>
        </div>
      </div>
    </div>
  );
};
