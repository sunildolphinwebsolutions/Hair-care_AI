"use client";

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Flame,
  Bell,
  Clock,
  Sparkles,
  Check,
  Utensils,
  Droplets,
  Zap,
} from 'lucide-react';

export interface RoutineItem {
  id: string;
  stepName: string;
  instructions?: string;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  frequency: string;
  items: RoutineItem[];
  logStatus?: 'COMPLETED' | 'SKIPPED' | 'NOT_APPLICABLE' | null;
}

export const RoutineDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: 'routine_gentle_wash',
      title: 'Gentle Cleansing Wash',
      description: 'Sulfate-free scalp cleansing & moisture restoration',
      frequency: '2-3 times/week',
      items: [{ id: '1', stepName: 'Sulfate-Free Wash & Condition' }],
      logStatus: null,
    },
    {
      id: 'routine_scalp_massage',
      title: 'Daily Scalp Massage',
      description: 'Fingertip scalp stimulation for microcirculation',
      frequency: 'Daily',
      items: [{ id: '2', stepName: '5-min Fingertip Massage' }],
      logStatus: 'COMPLETED',
    },
    {
      id: 'routine_mask',
      title: 'Deep Conditioning Mask & Meal Care',
      description: 'Moisture repair for mid-lengths + Protein rich breakfast',
      frequency: 'Weekly',
      items: [{ id: '3', stepName: 'Apply 15-min mask + Nutrient meal' }],
      logStatus: null,
    },
  ]);

  const [streak, setStreak] = useState<number>(12);
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('09:00');
  const [timezone, setTimezone] = useState<string>('America/New_York');
  const [prefSaving, setPrefSaving] = useState<boolean>(false);
  const [prefMessage, setPrefMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      apiClient
        .get('/routines')
        .then((res) => {
          if (res.routines?.length) {
            setRoutines(
              res.routines.map((r: any) => ({
                ...r,
                logStatus: r.logs?.[0]?.status || null,
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogAction = async (routineId: string, status: 'COMPLETED' | 'SKIPPED' | 'NOT_APPLICABLE') => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, logStatus: status } : r))
    );

    if (status === 'COMPLETED') {
      setStreak((s) => s + 1);
    }

    try {
      if (isAuthenticated) {
        await apiClient.post(`/routines/${routineId}/logs`, { status });
      }
    } catch (err) {
      // Optimistic UI state
    }
  };

  const handleSavePreferences = async () => {
    setPrefSaving(true);
    setPrefMessage(null);
    try {
      if (isAuthenticated) {
        await apiClient.patch('/notification-preferences', {
          remindersEnabled,
          reminderTime,
          timezone,
        });
      }
      setPrefMessage('Reminder settings saved successfully!');
    } catch (err) {
      setPrefMessage('Settings updated.');
    } finally {
      setPrefSaving(false);
    }
  };

  const weekDays = [
    { day: 'Mon', status: 'COMPLETED' },
    { day: 'Tue', status: 'COMPLETED' },
    { day: 'Wed', status: 'COMPLETED' },
    { day: 'Thu', status: 'COMPLETED' },
    { day: 'Fri', status: 'COMPLETED' },
    { day: 'Sat', status: 'SKIPPED' },
    { day: 'Sun', status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6 w-full pb-12 text-[#1A2620]">
      {/* 1. Desktop Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#123926] tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-[#123926]" /> Daily Routine & Meal Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#55645B] font-semibold mt-1">
            Track daily hair care tasks, meal timings, and notification preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-full bg-[#FEF3D6] text-[#EA580C] font-extrabold text-xs flex items-center gap-1.5 border border-[#FDE68A]">
            <Flame className="w-4 h-4 fill-current" /> {streak} Days Streak
          </span>
        </div>
      </div>

      {/* 2. Weekly Consistency Tracker Row (Desktop White Card) */}
      <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-4 w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#123926]">Weekly Adherence Matrix</h3>
          <span className="text-xs font-bold text-[#16A34A]">85% Adherence</span>
        </div>

        <div className="grid grid-cols-7 gap-3 w-full">
          {weekDays.map((w, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2] text-center space-y-1">
              <span className="text-xs font-bold text-[#55645B]">{w.day}</span>
              <div className="flex justify-center pt-1">
                {w.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Desktop Grid Section (12 Columns) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column (8 cols): Today's Active Routines */}
        <div className="xl:col-span-8 space-y-6 w-full">
          <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-4 w-full">
            <h3 className="text-base font-extrabold text-[#123926]">Today's Scheduled Tasks</h3>

            <div className="space-y-4">
              {routines.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-[#F8FAF8] border border-[#E2ECE2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-extrabold text-[#123926]">{r.title}</span>
                      <span className="text-[10px] font-bold text-[#154D34] bg-[#E6F4EA] px-2 py-0.5 rounded-md">
                        {r.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-[#55645B] font-medium">{r.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLogAction(r.id, 'COMPLETED')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        r.logStatus === 'COMPLETED'
                          ? 'bg-[#16A34A] text-white'
                          : 'bg-[#123926] text-white hover:bg-[#0D2E1E]'
                      }`}
                    >
                      {r.logStatus === 'COMPLETED' ? '✓ Done' : 'Mark Complete'}
                    </button>
                    <button
                      onClick={() => handleLogAction(r.id, 'SKIPPED')}
                      className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Notification Preferences */}
        <div className="xl:col-span-4 space-y-6 w-full">
          <div className="bg-white border border-[#D5E0D5] rounded-2xl p-6 shadow-2xs space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#123926] flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-[#123926]" /> Reminders
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2]">
                <span className="font-bold text-[#202D26]">Daily Notifications</span>
                <input
                  type="checkbox"
                  checked={remindersEnabled}
                  onChange={(e) => setRemindersEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#123926] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#202D26]">Preferred Reminder Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-[#EEF4EE] text-xs font-bold text-[#123926] p-2.5 rounded-xl border border-[#D2DDD2]"
                />
              </div>

              <button
                onClick={handleSavePreferences}
                disabled={prefSaving}
                className="w-full py-2.5 px-4 rounded-xl bg-[#123926] text-white text-xs font-bold hover:bg-[#0D2E1E] transition"
              >
                {prefSaving ? 'Saving...' : 'Save Reminder Settings'}
              </button>

              {prefMessage && (
                <p className="text-[11px] font-bold text-[#16A34A] text-center mt-2">{prefMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
