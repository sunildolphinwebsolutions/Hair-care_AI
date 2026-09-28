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
  Plus,
  Trash2,
  Filter,
  Volume2,
  Pill,
  Scissors,
  Sliders,
  AlertCircle,
  RotateCcw,
  CheckSquare
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
  time?: string;
  category?: 'Scalp Care' | 'Wash Routine' | 'Supplements' | 'Meals' | 'Custom';
  items?: RoutineItem[];
  logStatus?: 'COMPLETED' | 'SKIPPED' | 'NOT_APPLICABLE' | null;
  isAI?: boolean;
}

const DEFAULT_INITIAL_ROUTINES: Routine[] = [
  {
    id: 'routine_gentle_wash',
    title: 'Sulfate-Free Scalp Wash & Condition',
    description: 'Deep cleansing with lukewarm water followed by moisture locking conditioner.',
    frequency: '2-3 times/week',
    time: '08:30 AM',
    category: 'Wash Routine',
    logStatus: null,
    isAI: true,
  },
  {
    id: 'routine_scalp_massage',
    title: '5-Minute Stimulating Scalp Massage',
    description: 'Use fingertips in circular motion with 2 drops of jojoba or rosemary oil to boost micro-circulation.',
    frequency: 'Daily',
    time: '09:00 PM',
    category: 'Scalp Care',
    logStatus: 'COMPLETED',
    isAI: true,
  },
  {
    id: 'routine_biotin_snack',
    title: 'Biotin & Omega-3 Snack Intake',
    description: 'Consume a handful of walnuts, pumpkin seeds, and green tea for hair follicle nourishment.',
    frequency: 'Daily',
    time: '04:30 PM',
    category: 'Supplements',
    logStatus: null,
    isAI: true,
  },
  {
    id: 'routine_hydration_goal',
    title: 'Hydration Target (2.5 Liters)',
    description: 'Ensure 8 full glasses of water throughout the day to keep scalp sebum balance optimal.',
    frequency: 'Daily',
    time: '02:00 PM',
    category: 'Meals',
    logStatus: 'COMPLETED',
    isAI: false,
  },
];

export const RoutineDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [routines, setRoutines] = useState<Routine[]>(DEFAULT_INITIAL_ROUTINES);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [streak, setStreak] = useState<number>(14);

  // New Routine Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newFrequency, setNewFrequency] = useState<string>('Daily');
  const [newTime, setNewTime] = useState<string>('09:00 AM');
  const [newCategory, setNewCategory] = useState<'Scalp Care' | 'Wash Routine' | 'Supplements' | 'Meals' | 'Custom'>('Scalp Care');
  const [addingTask, setAddingTask] = useState<boolean>(false);

  // Reminders Settings State
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(true);
  const [morningReminderTime, setMorningReminderTime] = useState<string>('09:00');
  const [eveningReminderTime, setEveningReminderTime] = useState<string>('21:00');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [prefSaving, setPrefSaving] = useState<boolean>(false);
  const [prefMessage, setPrefMessage] = useState<string | null>(null);
  const [testNotificationSent, setTestNotificationSent] = useState<boolean>(false);

  // Load Routines from Backend Database API
  useEffect(() => {
    loadRoutines();
  }, [isAuthenticated]);

  const loadRoutines = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await apiClient.get<{ routines: any[] }>('/routines');
        if (res.routines && Array.isArray(res.routines)) {
          const mapped: Routine[] = res.routines.map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description || '',
            frequency: r.frequency || 'Daily',
            time: r.time || '09:00 AM',
            category: r.category || 'Scalp Care',
            isAI: r.isAI || false,
            logStatus: r.logs?.[0]?.status || null,
          }));
          setRoutines(mapped);
        }
      }
    } catch (err) {
      // Fallback state handled gracefully
    } finally {
      setLoading(false);
    }
  };

  // Toggle Complete / Skip Task via API
  const handleLogAction = async (routineId: string, status: 'COMPLETED' | 'SKIPPED' | 'NOT_APPLICABLE') => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === routineId) {
          const nextStatus = r.logStatus === status ? null : status;
          return { ...r, logStatus: nextStatus };
        }
        return r;
      })
    );

    if (status === 'COMPLETED') {
      setStreak((prev) => prev + 1);
    }

    try {
      if (isAuthenticated) {
        await apiClient.post(`/routines/${routineId}/logs`, { status });
      }
    } catch (err) {
      // Retain optimistic UI update
    }
  };

  // Add New Custom Routine Task via API
  const handleAddNewRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setAddingTask(true);
    try {
      if (isAuthenticated) {
        const res = await apiClient.post<{ routine: any }>('/routines', {
          title: newTitle.trim(),
          description: newDescription.trim() || 'Custom scheduled task',
          frequency: newFrequency,
          time: newTime,
          category: newCategory,
        });

        if (res.routine) {
          const created: Routine = {
            id: res.routine.id,
            title: res.routine.title,
            description: res.routine.description || '',
            frequency: res.routine.frequency || newFrequency,
            time: res.routine.time || newTime,
            category: res.routine.category || newCategory,
            logStatus: null,
            isAI: false,
          };
          setRoutines((prev) => [created, ...prev]);
        }
      }
    } catch (err) {
      // Local optimistic fallback
      const tempId = `routine_${Date.now()}`;
      setRoutines((prev) => [
        {
          id: tempId,
          title: newTitle.trim(),
          description: newDescription.trim() || 'Custom scheduled task',
          frequency: newFrequency,
          time: newTime,
          category: newCategory,
          logStatus: null,
          isAI: false,
        },
        ...prev,
      ]);
    } finally {
      setAddingTask(false);
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewDescription('');
    }
  };

  // Delete Routine Task via Database API
  const handleDeleteRoutine = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRoutines((prev) => prev.filter((r) => r.id !== id));

    try {
      if (isAuthenticated) {
        await apiClient.delete(`/routines/${id}`);
      }
    } catch (err) {}
  };

  // Save Notification Preferences
  const handleSavePreferences = async () => {
    setPrefSaving(true);
    setPrefMessage(null);
    try {
      if (isAuthenticated) {
        await apiClient.patch('/notification-preferences', {
          remindersEnabled,
          reminderTime: morningReminderTime,
        });
      }
      setPrefMessage('Notification preferences updated!');
    } catch (err) {
      setPrefMessage('Reminder settings saved locally.');
    } finally {
      setPrefSaving(false);
      setTimeout(() => setPrefMessage(null), 3500);
    }
  };

  // Trigger Browser Test Notification Alarm
  const handleTestNotification = () => {
    setTestNotificationSent(true);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('HairCare AI Reminder 🌿', {
          body: 'Time for your 5-minute scalp stimulation massage & Biotin intake!',
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('HairCare AI Reminder 🌿', {
              body: 'Time for your 5-minute scalp stimulation massage & Biotin intake!',
            });
          }
        });
      }
    }
    setTimeout(() => setTestNotificationSent(false), 4000);
  };

  // Filter routines by selected category
  const filteredRoutines = selectedCategory === 'All'
    ? routines
    : routines.filter((r) => r.category === selectedCategory);

  const completedCount = routines.filter((r) => r.logStatus === 'COMPLETED').length;
  const totalCount = routines.length;
  const adherenceRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categories = ['All', 'Scalp Care', 'Wash Routine', 'Supplements', 'Meals', 'Custom'];

  // Dynamic 7-Day Matrix Calculations
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const currentJsDayIndex = new Date().getDay(); // 0=Sun, 1=Mon, 2=Tue...
  const todayIndex = (currentJsDayIndex + 6) % 7; // Convert to Mon-Sun (0=Mon...6=Sun)
  const currentTodayName = dayNames[todayIndex];

  const [selectedDay, setSelectedDay] = useState<string>(currentTodayName);

  const weekMatrix = dayNames.map((day, idx) => {
    const isToday = day === currentTodayName;
    let status: 'COMPLETED' | 'SKIPPED' | 'PENDING' = 'COMPLETED';
    if (isToday) {
      status = completedCount > 0 ? 'COMPLETED' : 'PENDING';
    } else if (idx > todayIndex) {
      status = 'PENDING';
    } else if (idx === 5) {
      status = 'SKIPPED';
    }
    return { day, isToday, status };
  });

  return (
    <div className="space-y-6 w-full pb-12 text-[#12241A] font-sans selection:bg-[#0B3C26] selection:text-white">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-4 border-b border-[#D8E4D8] w-full">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#16A34A] text-xs font-extrabold flex items-center gap-1.5 border border-[#C5E8CE]">
              <Bell className="w-3.5 h-3.5 text-[#16A34A]" /> Smart Reminders & Routine
            </span>
            <span className="px-3 py-1 rounded-full bg-[#0B3C26] text-white text-[11px] font-extrabold font-mono uppercase tracking-wider">
              {completedCount} / {totalCount} Tasks Done
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082014] tracking-tight font-heading flex items-center gap-2.5">
            Daily Hair Care & Reminder Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6256] font-medium mt-1 max-w-3xl leading-relaxed">
            Manage your daily scalp routines, wash schedules, nutrient reminders, and push notifications dynamically.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-[#FEF3D6] text-[#EA580C] font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-[#FDE68A] shadow-2xs">
            <Flame className="w-4.5 h-4.5 fill-current" />
            <span>{streak} Day Streak!</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white font-extrabold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Reminder Task</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Cards Row (4 Grid Columns - Full Screen Width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        {/* KPI 1: Adherence Rate */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] text-[#16A34A] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <CheckCircle2 className="w-6 h-6 fill-current text-[#16A34A]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166] uppercase font-mono tracking-wider">Weekly Adherence</p>
            <p className="text-base font-extrabold text-[#082014]">{adherenceRate}% Consistency</p>
            <span className="text-[10px] text-[#16A34A] font-extrabold">Optimal Trichology Growth</span>
          </div>
        </div>

        {/* KPI 2: Scheduled Tasks */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Clock className="w-6 h-6 text-[#4F46E5]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166] uppercase font-mono tracking-wider">Today&apos;s Schedule</p>
            <p className="text-base font-extrabold text-[#082014]">{totalCount} Active Reminders</p>
            <span className="text-[10px] text-[#4F46E5] font-extrabold">{completedCount} Completed Today</span>
          </div>
        </div>

        {/* KPI 3: Next Reminder */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3D6] text-[#EA580C] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Bell className="w-6 h-6 text-[#EA580C]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166] uppercase font-mono tracking-wider">Next Push Alarm</p>
            <p className="text-base font-extrabold text-[#082014]">{morningReminderTime} AM</p>
            <span className="text-[10px] text-[#EA580C] font-extrabold">Scalp Massage & Hydration</span>
          </div>
        </div>

        {/* KPI 4: Active Streak */}
        <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#FCE8E6] text-[#DC2626] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Flame className="w-6 h-6 fill-current text-[#DC2626]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5F7166] uppercase font-mono tracking-wider">Active Retention</p>
            <p className="text-base font-extrabold text-[#082014]">{streak} Days Continuous</p>
            <span className="text-[10px] text-[#DC2626] font-extrabold">Follicle Repair Phase</span>
          </div>
        </div>
      </div>

      {/* 3. 7-Day Adherence Matrix (Highlight Today & Day-wise Selection) */}
      <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2ECE2] pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-extrabold text-[#082014] font-heading flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-[#0B3C26]" /> 7-Day Adherence Matrix
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300">
              Today is {currentTodayName}
            </span>
          </div>
          <span className="text-xs font-bold text-[#16A34A] bg-[#E6F4EA] px-3 py-1 rounded-full border border-[#C5E8CE]">
            {adherenceRate}% Weekly Score
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3.5 w-full">
          {weekMatrix.map((w, idx) => {
            const isToday = w.isToday;
            const isSelected = selectedDay === w.day;
            const isDone = w.status === 'COMPLETED';

            return (
              <div
                key={idx}
                onClick={() => setSelectedDay(w.day)}
                className={`py-3 px-2 rounded-2xl border text-center space-y-1 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-between ${
                  isToday
                    ? 'bg-[#FFFDF0] border-2 border-amber-400 shadow-md ring-2 ring-amber-300/40 scale-[1.03]'
                    : isSelected
                    ? 'bg-[#EFF5EE] border-2 border-[#0B3C26] shadow-2xs'
                    : isDone
                    ? 'bg-[#F4FAF4] border-[#CCE0CC] hover:border-[#0B3C26]/40'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`text-[11px] font-black uppercase font-mono tracking-wider ${
                  isToday ? 'text-amber-900 font-extrabold' : isSelected ? 'text-[#0B3C26]' : 'text-[#4F6256]'
                }`}>
                  {isToday ? 'TODAY' : w.day}
                </span>

                <div className="flex justify-center pt-1">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                  ) : isToday ? (
                    <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Main 12-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        {/* Left Section: Active Reminders List & Filter (Span 8 Cols) */}
        <div className="lg:col-span-8 space-y-4 w-full">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full bg-white/90 backdrop-blur-xs border border-white/80 p-2.5 rounded-2xl shadow-2xs">
            <Filter className="w-4 h-4 text-[#0B3C26] ml-2 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#0B3C26] text-white shadow-2xs'
                    : 'bg-[#F4FAF4] hover:bg-[#E2ECE2] text-[#4F6256] border border-[#CCDCCD]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Reminders List */}
          <div className="space-y-4 w-full">
            {filteredRoutines.length === 0 ? (
              <div className="bg-white/90 border border-white/80 rounded-2xl p-8 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-[#5C7063] mx-auto" />
                <p className="text-sm font-bold text-[#082014]">No reminder tasks found in this category.</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#0B3C26] text-white text-xs font-extrabold cursor-pointer"
                >
                  Add New Task
                </button>
              </div>
            ) : (
              filteredRoutines.map((r) => {
                const isCompleted = r.logStatus === 'COMPLETED';
                const isSkipped = r.logStatus === 'SKIPPED';

                return (
                  <div
                    key={r.id}
                    className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full ${
                      isCompleted
                        ? 'bg-[#F2F7F2] border-[#C5D9C5] opacity-90'
                        : isSkipped
                        ? 'bg-[#FFFBEB] border-[#FDE68A] opacity-80'
                        : 'bg-white/90 border-white/80 hover:border-[#0B3C26]/40'
                    }`}
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#0B3C26] text-white text-[10px] font-extrabold uppercase font-mono">
                          {r.time || '09:00 AM'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#E6F4EA] text-[#0B3C26] text-[10px] font-extrabold border border-[#C5E8CE]">
                          {r.category || 'Scalp Care'}
                        </span>
                        <span className="text-[10px] font-bold text-[#55695C] bg-[#F4FAF4] px-2 py-0.5 rounded-md border border-[#E0ECE0]">
                          {r.frequency}
                        </span>
                        {r.isAI && (
                          <span className="text-[10px] font-extrabold text-[#16A34A] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#16A34A]" /> AI Recommended
                          </span>
                        )}
                      </div>

                      <h4 className={`text-base font-extrabold font-heading ${isCompleted ? 'line-through text-[#5C7063]' : 'text-[#082014]'}`}>
                        {r.title}
                      </h4>
                      <p className="text-xs text-[#4E6256] font-medium leading-relaxed">
                        {r.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleLogAction(r.id, 'COMPLETED')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                          isCompleted
                            ? 'bg-[#16A34A] text-white shadow-2xs'
                            : 'bg-[#0B3C26] hover:bg-[#072B1B] text-white'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'fill-current text-white' : ''}`} />
                        <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                      </button>

                      <button
                        onClick={() => handleLogAction(r.id, 'SKIPPED')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isSkipped
                            ? 'bg-amber-500 text-white'
                            : 'bg-[#F4FAF4] text-[#4E6256] hover:bg-[#E2ECE2] border border-[#CCDCCD]'
                        }`}
                      >
                        {isSkipped ? 'Skipped' : 'Skip'}
                      </button>

                      <button
                        onClick={(e) => handleDeleteRoutine(r.id, e)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Section: Notification Settings & Alarm Tester (Span 4 Cols) */}
        <div className="lg:col-span-4 space-y-5 w-full">
          {/* Card 1: Notification & Alarm Preferences */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center justify-between border-b border-[#E2ECE2] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#0B3C26] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Bell className="w-5 h-5 text-[#0B3C26]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#082014] font-heading">Alarm Preferences</h3>
                  <p className="text-xs text-[#5C7063] font-medium">Configure push & browser alerts</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {/* Toggle Daily Notifications */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2]">
                <span className="text-xs font-extrabold text-[#082014]">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={remindersEnabled}
                  onChange={(e) => setRemindersEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#0B3C26] cursor-pointer"
                />
              </div>

              {/* Sound Effect Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF8] border border-[#E2ECE2]">
                <span className="text-xs font-extrabold text-[#082014] flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#0B3C26]" /> Sound Chime Alert
                </span>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#0B3C26] cursor-pointer"
                />
              </div>

              {/* Morning Reminder Time */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[#082014]">Morning Wash & Scalp Care Time</label>
                <input
                  type="time"
                  value={morningReminderTime}
                  onChange={(e) => setMorningReminderTime(e.target.value)}
                  className="w-full bg-[#F4FAF4] text-xs font-bold text-[#082014] p-2.5 rounded-xl border border-[#CCDCCD] focus:outline-none focus:border-[#0B3C26]"
                />
              </div>

              {/* Evening Reminder Time */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[#082014]">Evening Massage & Supplement Time</label>
                <input
                  type="time"
                  value={eveningReminderTime}
                  onChange={(e) => setEveningReminderTime(e.target.value)}
                  className="w-full bg-[#F4FAF4] text-xs font-bold text-[#082014] p-2.5 rounded-xl border border-[#CCDCCD] focus:outline-none focus:border-[#0B3C26]"
                />
              </div>

              <button
                onClick={handleSavePreferences}
                disabled={prefSaving}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white text-xs font-extrabold transition shadow-xs cursor-pointer"
              >
                {prefSaving ? 'Saving Settings...' : 'Save Notification Preferences'}
              </button>

              {prefMessage && (
                <p className="text-[11px] font-bold text-[#16A34A] text-center mt-1">{prefMessage}</p>
              )}
            </div>
          </div>

          {/* Card 2: Test Browser Notification Alarm */}
          <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF3D6] text-[#EA580C] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Volume2 className="w-5 h-5 text-[#EA580C]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#082014] font-heading">Test Live Reminder</h3>
                <p className="text-xs text-[#5C7063] font-medium">Send test notification to browser</p>
              </div>
            </div>

            <p className="text-xs text-[#4E6256] font-medium leading-relaxed">
              Click below to verify browser notifications and ensure you never miss your daily scalp stimulation task.
            </p>

            <button
              onClick={handleTestNotification}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-[#082014] border border-[#CCDCCD] font-extrabold text-xs transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#0B3C26]" />
              <span>{testNotificationSent ? 'Notification Triggered!' : 'Send Test Notification'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Add New Custom Routine Task */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-white/80">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-[#082014] font-heading flex items-center gap-2">
                <Plus className="w-4.5 h-4.5 text-[#0B3C26]" /> Add Custom Reminder Task
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-gray-500 hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewRoutine} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#082014]">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rosemary Oil Scalp Drops"
                  className="w-full bg-[#F4FAF4] text-xs font-bold text-[#082014] p-3 rounded-xl border border-[#CCDCCD] mt-1 focus:outline-none focus:border-[#0B3C26]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#082014]">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#F4FAF4] text-xs font-bold text-[#082014] p-3 rounded-xl border border-[#CCDCCD] mt-1 focus:outline-none cursor-pointer"
                >
                  <option value="Scalp Care">Scalp Care</option>
                  <option value="Wash Routine">Wash Routine</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Meals">Meals</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#082014]">Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    className="w-full bg-[#F4FAF4] text-xs font-bold text-[#082014] p-2.5 rounded-xl border border-[#CCDCCD] mt-1 focus:outline-none cursor-pointer"
                  >
                    <option value="Daily">Daily</option>
                    <option value="2-3 times/week">2-3 times/week</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#082014]">Reminder Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full bg-[#F4FAF4] text-xs font-bold text-[#082014] p-2.5 rounded-xl border border-[#CCDCCD] mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#082014]">Instructions & Notes</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Optional instructions..."
                  className="w-full bg-[#F4FAF4] text-xs font-medium text-[#082014] p-3 rounded-xl border border-[#CCDCCD] mt-1 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-extrabold text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingTask}
                  className="w-1/2 py-2.5 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white text-xs font-extrabold cursor-pointer"
                >
                  {addingTask ? 'Saving...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

