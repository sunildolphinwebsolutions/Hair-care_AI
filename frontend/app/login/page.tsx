"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  Calendar,
  TrendingUp,
  ShieldCheck,
  Sprout
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleSocialAuth = (provider: string) => {
    login('user@example.com', 'password123');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#CBD7C9] bg-gradient-to-br from-[#D9E4D7] via-[#C9D7C7] to-[#BACAB8] text-[#12241A] font-sans relative flex flex-col justify-between overflow-x-hidden selection:bg-[#0B3C26] selection:text-white">
      {/* Soft Decorative Leaves Blur Background Overlay */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-[#AEC4AB]/50 via-emerald-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#9BB598]/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-5 flex items-center justify-between z-20 relative">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#0B3C26] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 flex-shrink-0 fill-current text-white" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
              <path d="M20.6 4.3c-2.3 0-5.1 1.8-6.9 3.6-1.8-1.8-4.6-3.6-6.9-3.6C3.7 4.3 1 7 1 10.1c0 6.6 8.5 10.7 11 11.8 2.5-1.1 11-5.2 11-11.8 0-3.1-2.7-5.8-5.8-5.8zm-8.6 15c-2.1-1-8.5-4.5-8.5-9.2 0-1.8 1.4-3.2 3.2-3.2 1.6 0 4.1 1.6 5.8 3.5l.5.6.5-.6c1.7-1.9 4.2-3.5 5.8-3.5 1.8 0 3.2 1.4 3.2 3.2 0 4.7-6.4 8.2-8.5 9.2z" />
            </svg>
          </div>
          <span className="font-heading font-extrabold text-2xl text-[#0B2619] tracking-tight">
            HairCare AI
          </span>
        </Link>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1A3326] bg-white/50 hover:bg-white/80 backdrop-blur-xs px-4 py-2 rounded-xl border border-[#B3C6B1] transition shadow-2xs cursor-pointer"
          >
            <span>{selectedLang}</span>
            <ChevronDown className="w-4 h-4 text-[#2C4738]" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
              {['English', 'Spanish', 'French', 'German'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang);
                    setLangMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1A3326] hover:bg-emerald-50 transition cursor-pointer"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 2. Main Content Grid */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-2 lg:py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10 relative">
        
        {/* Left Column: Headline, Features & Hero Photography */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full pt-1">
          <div className="space-y-5">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#092216] tracking-tight leading-[1.15] font-heading">
                Healthier Hair<br />Starts Here
              </h1>
              <p className="text-xs sm:text-sm text-[#41554A] font-medium max-w-md leading-relaxed">
                AI-powered analysis, personalized plans and expert guidance for your best hair yet.
              </p>
            </div>

            {/* 4 Feature Items */}
            <div className="space-y-3 pt-1 max-w-md">
              {/* Feature 1 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D6E5D4] border border-[#C2D6C0] flex items-center justify-center shadow-xs flex-shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-[#0B3C26]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#092216]">AI Hair Analysis</h4>
                  <p className="text-[11px] text-[#52665A] font-medium">Get detailed insights</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D6E5D4] border border-[#C2D6C0] flex items-center justify-center shadow-xs flex-shrink-0">
                  <Calendar className="w-4.5 h-4.5 text-[#0B3C26]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#092216]">Personalized Plans</h4>
                  <p className="text-[11px] text-[#52665A] font-medium">Nutrition, care & lifestyle</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D6E5D4] border border-[#C2D6C0] flex items-center justify-center shadow-xs flex-shrink-0">
                  <TrendingUp className="w-4.5 h-4.5 text-[#0B3C26]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#092216]">Track Your Progress</h4>
                  <p className="text-[11px] text-[#52665A] font-medium">See real changes over time</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D6E5D4] border border-[#C2D6C0] flex items-center justify-center shadow-xs flex-shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#0B3C26]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#092216]">Expert Recommendations</h4>
                  <p className="text-[11px] text-[#52665A] font-medium">Backed by science</p>
                </div>
              </div>
            </div>
          </div>

          {/* Model Image at Bottom Left */}
          <div className="mt-5 relative max-w-[420px] rounded-3xl overflow-hidden shadow-xl border border-white/40 group">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/login_model.jpg"
                alt="HairCare AI Woman Model"
                fill
                priority
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-[460px] bg-[#E5ECE3]/85 backdrop-blur-xl border border-white/60 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-emerald-950/10 space-y-5">
            
            {/* Card Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#082014] tracking-tight font-heading">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-[#4E6256] font-medium mt-1">
                Sign in to continue your hair care journey.
              </p>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                className="w-full h-11 px-4 rounded-xl bg-white/70 hover:bg-white border border-[#CBD5CC] transition-all duration-200 flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-[#142A1E] shadow-2xs cursor-pointer"
              >
                <svg
                  style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                  viewBox="0 0 24 24"
                  className="flex-shrink-0"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('apple')}
                className="w-full h-11 px-4 rounded-xl bg-white/70 hover:bg-white border border-[#CBD5CC] transition-all duration-200 flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-[#142A1E] shadow-2xs cursor-pointer"
              >
                <svg
                  style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                  viewBox="0 0 24 24"
                  className="flex-shrink-0 fill-current text-[#142A1E]"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.57-.7 1.03-1.67.91-2.65-.9.04-1.98.6-2.62 1.35-.57.65-.98 1.63-.83 2.58 1.01.08 2.01-.52 2.54-1.28z" />
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#C8D6C7]" />
              <span className="text-xs font-extrabold text-[#74877B] tracking-wider uppercase">
                OR
              </span>
              <div className="flex-1 h-px bg-[#C8D6C7]" />
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 flex items-start gap-2.5 text-xs font-semibold animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142A1E] block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#63776B] absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-white/80 border border-[#C4D3C3] focus:border-[#0B3C26] focus:bg-white focus:ring-2 focus:ring-[#0B3C26]/10 rounded-xl py-2.5 pl-11 pr-4 text-xs sm:text-sm text-[#0B2216] placeholder-[#819487] font-medium transition-all shadow-2xs outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-600 font-bold pl-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142A1E] block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#63776B] absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full bg-white/80 border border-[#C4D3C3] focus:border-[#0B3C26] focus:bg-white focus:ring-2 focus:ring-[#0B3C26]/10 rounded-xl py-2.5 pl-11 pr-11 text-xs sm:text-sm text-[#0B2216] placeholder-[#819487] font-medium transition-all shadow-2xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-[#63776B] hover:text-[#0B3C26] p-1 rounded-lg transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-600 font-bold pl-1">{errors.password.message}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions sent to your email.');
                  }}
                  className="text-xs font-bold text-[#0B3C26] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 px-6 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#0B3C26]/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span> <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Don't have an account? Sign Up */}
            <div className="text-center text-xs sm:text-sm font-medium text-[#4B5F53] pt-1">
              Don't have an account?{' '}
              <Link href="/signup" className="font-extrabold text-[#0B3C26] hover:underline">
                Sign Up
              </Link>
            </div>

            {/* Security Badge Box */}
            <div className="p-3.5 rounded-2xl bg-[#D6E3D4]/90 border border-[#C2D4C0] flex items-center gap-3.5 relative overflow-hidden shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#0B3C26] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-300" />
              </div>
              <div className="flex-1 pr-6">
                <h5 className="text-xs font-extrabold text-[#092216]">Your data is safe with us</h5>
                <p className="text-[11px] text-[#506357] font-medium leading-snug mt-0.5">
                  We use industry-standard encryption to protect your information.
                </p>
              </div>
              {/* Botanical Leaf Graphic */}
              <div className="absolute -right-2 -bottom-2 opacity-30 pointer-events-none text-[#0B3C26]">
                <Sprout className="w-12 h-12" />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer minimal padding */}
      <footer className="w-full text-center py-3 text-[11px] font-semibold text-[#5A6D61] z-10 relative">
        © {new Date().getFullYear()} HairCare AI. All rights reserved.
      </footer>
    </div>
  );
}
