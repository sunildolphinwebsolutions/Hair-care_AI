"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  Check,
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  Save,
  ArrowRight,
  Settings,
} from 'lucide-react';

export interface QuestionnaireData {
  ageRange: string;
  gender: string;
  concerns: string[];
  dietHabits: {
    waterIntake: string;
    dietType: string;
    supplements: string[];
  };
  routineHabits: {
    washFrequency: string;
    heatStyling: string;
    chemicalTreatments: string[];
  };
  medicalHistory: {
    recentIllnessOrStress: string;
    medications: string;
    familyHistoryHairLoss: boolean;
  };
}

const DEFAULT_QUESTIONNAIRE_DATA: QuestionnaireData = {
  ageRange: '25-34',
  gender: 'Male',
  concerns: ['Hair fall / shedding', 'Thinning hair'],
  dietHabits: {
    waterIntake: '2-3L',
    dietType: 'Omnivore',
    supplements: ['Biotin', 'Multi-vitamin'],
  },
  routineHabits: {
    washFrequency: '2-3 times/week',
    heatStyling: 'Occasionally',
    chemicalTreatments: [],
  },
  medicalHistory: {
    recentIllnessOrStress: 'No',
    medications: '',
    familyHistoryHairLoss: false,
  },
};

const ALL_CONCERNS = [
  'Hair fall / shedding',
  'Thinning hair',
  'Dandruff / itchy scalp',
  'Receding hairline',
  'Dry or damaged hair',
  'Scalp oiliness',
];

export const QuestionnaireForm: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<QuestionnaireData>(DEFAULT_QUESTIONNAIRE_DATA);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      apiClient
        .get('/intake/latest')
        .then((res) => {
          if (res.intake) {
            setFormData({
              ageRange: res.intake.ageRange || '25-34',
              gender: res.intake.gender || 'Male',
              concerns: res.intake.concerns || ['Hair fall / shedding', 'Thinning hair'],
              dietHabits: res.intake.dietHabits || DEFAULT_QUESTIONNAIRE_DATA.dietHabits,
              routineHabits: res.intake.routineHabits || DEFAULT_QUESTIONNAIRE_DATA.routineHabits,
              medicalHistory: res.intake.medicalHistory || DEFAULT_QUESTIONNAIRE_DATA.medicalHistory,
            });
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleConcern = (concern: string) => {
    setFormData((prev) => {
      const exists = prev.concerns.includes(concern);
      if (exists) {
        return { ...prev, concerns: prev.concerns.filter((c) => c !== concern) };
      } else {
        return { ...prev, concerns: [...prev.concerns, concern] };
      }
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isAuthenticated) {
        await apiClient.post('/intake', {
          ageRange: formData.ageRange,
          gender: formData.gender,
          concerns: formData.concerns,
          dietHabits: formData.dietHabits,
          routineHabits: formData.routineHabits,
          medicalHistory: formData.medicalHistory,
        });
      }

      setSuccessMessage('Profile and questionnaire updated successfully!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save questionnaire responses.');
    } finally {
      setSaving(false);
    }
  };

  const userName = user?.name || 'Sunil chauhan';
  const userEmail = user?.email || 'sunil@example.com';

  return (
    <div className="space-y-6 w-full pb-12 text-[#1A2620]">
      {/* 1. Desktop Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#123926] tracking-tight flex items-center gap-2.5">
            <UserIcon className="w-7 h-7 text-[#123926]" /> My Profile & Intake Questionnaire
          </h1>
          <p className="text-xs sm:text-sm text-[#55645B] font-semibold mt-1">
            Manage your personal trichology profile, scalp concerns, and health settings.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#123926] text-white text-xs font-bold hover:bg-[#0D2E1E] transition shadow-2xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving Changes...' : 'Save Profile Settings'}
        </button>
      </div>

      {/* 2. Main Desktop Grid Section (12 Columns) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column (8 cols): Form Sections */}
        <div className="xl:col-span-8 space-y-6 w-full">
          {/* Primary Concerns Card */}
          <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-4 w-full">
            <h3 className="text-base font-extrabold text-[#123926]">1. Primary Hair & Scalp Concerns</h3>
            <p className="text-xs text-[#526158] font-medium">Select all conditions you want to address:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-1">
              {ALL_CONCERNS.map((concern) => {
                const selected = formData.concerns.includes(concern);
                return (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => toggleConcern(concern)}
                    className={`p-3.5 rounded-xl text-xs font-bold text-left transition flex items-center justify-between border ${
                      selected
                        ? 'bg-[#E6F4EA] border-[#16A34A] text-[#123926]'
                        : 'bg-[#F8FAF8] border-[#E2ECE2] text-[#4A5750] hover:border-[#123926]'
                    }`}
                  >
                    <span>{concern}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diet & Routine Habits Card */}
          <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-5 w-full">
            <h3 className="text-base font-extrabold text-[#123926]">2. Dietary & Care Habits</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#123926]">Daily Water Intake</label>
                <select
                  value={formData.dietHabits.waterIntake}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietHabits: { ...formData.dietHabits, waterIntake: e.target.value },
                    })
                  }
                  className="w-full bg-[#EEF4EE] text-xs font-bold text-[#123926] p-3 rounded-xl border border-[#D2DDD2]"
                >
                  <option value="Less than 1L">Less than 1L</option>
                  <option value="1-2L">1-2L</option>
                  <option value="2-3L">2-3L</option>
                  <option value="More than 3L">More than 3L</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#123926]">Wash Frequency</label>
                <select
                  value={formData.routineHabits.washFrequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      routineHabits: { ...formData.routineHabits, washFrequency: e.target.value },
                    })
                  }
                  className="w-full bg-[#EEF4EE] text-xs font-bold text-[#123926] p-3 rounded-xl border border-[#D2DDD2]"
                >
                  <option value="Daily">Daily</option>
                  <option value="2-3 times/week">2-3 times/week</option>
                  <option value="Once a week">Once a week</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Profile Card */}
        <div className="xl:col-span-4 space-y-6 w-full">
          <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-4 w-full text-center">
            <div className="w-16 h-16 rounded-full bg-[#123926] text-white flex items-center justify-center font-black text-xl mx-auto shadow-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#123926]">{userName}</h3>
              <p className="text-xs text-[#55645B] font-medium">{userEmail}</p>
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#E6F4EA] text-[#16A34A] text-xs font-extrabold border border-[#CDE0CD]">
              Free Plan User
            </span>
          </div>

          {/* Privacy Security Box */}
          <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-2.5 w-full">
            <div className="flex items-center gap-2 text-[#123926]">
              <ShieldCheck className="w-4.5 h-4.5 text-[#123926]" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">Privacy Guaranteed</h4>
            </div>
            <p className="text-xs text-[#55645B] leading-relaxed font-medium">
              Your scalp photos and questionnaire responses are end-to-end encrypted and evaluated strictly by AI algorithm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
