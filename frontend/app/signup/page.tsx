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
  User,
  Mail,
  Phone,
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
  Check
} from 'lucide-react';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agreeTerms: true,
    },
  });

  const agreeTermsValue = watch('agreeTerms');

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    try {
      await signup(data.email, data.password, data.name);
      router.push('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Failed to create account. Please try again.');
    }
  };

  const handleSocialAuth = (provider: string) => {
    signup('newuser@example.com', 'password123', 'New User');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#CBD7C9] bg-gradient-to-br from-[#D9E4D7] via-[#C9D7C7] to-[#BACAB8] text-[#12241A] font-sans relative flex flex-col justify-between overflow-x-hidden selection:bg-[#0B3C26] selection:text-white">
      {/* Background Decorative Foliage Blur */}
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
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-2 lg:py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10 relative">
        
        {/* Left Column: Headline, Features & Hero Photography */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full pt-1">
          <div className="space-y-5">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#092216] tracking-tight leading-[1.15] font-heading">
                Join the Journey<br />to Healthier Hair
              </h1>
              <p className="text-xs sm:text-sm text-[#41554A] font-medium max-w-md leading-relaxed">
                Create your account and get personalized hair care plans with AI powered insights.
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
                  <h4 className="text-xs sm:text-sm font-bold text-[#092216]">Personalized Analysis</h4>
                  <p className="text-[11px] text-[#52665A] font-medium">Understand your hair better</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D6E5D4] border border-[#C2D6C0] flex items-center justify-center shadow-xs flex-shrink-0">
                  <Calendar className="w-4.5 h-4.5 text-[#0B3C26]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#092216]">Custom Plans</h4>
                  <p className="text-[11px] text-[#52665A] font-medium">Nutrition, care & lifestyle</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D6E5D4] border border-[#C2D6C0] flex items-center justify-center shadow-xs flex-shrink-0">
                  <TrendingUp className="w-4.5 h-4.5 text-[#0B3C26]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#092216]">Track Progress</h4>
                  <p className="text-[11px] text-[#52665A] font-medium">Visible results over time</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D6E5D4] border border-[#C2D6C0] flex items-center justify-center shadow-xs flex-shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#0B3C26]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#092216]">Expert Support</h4>
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

        {/* Right Column: Create Your Account Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-[460px] bg-[#E5ECE3]/85 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-emerald-950/10 space-y-4">
            
            {/* Card Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#082014] tracking-tight font-heading">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-[#4E6256] font-medium mt-1">
                Start your personalized hair care journey today.
              </p>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
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
                <span>Sign up with Google</span>
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
                <span>Sign up with Apple</span>
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

            {/* Signup Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#142A1E] block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#63776B] absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full bg-white/80 border border-[#C4D3C3] focus:border-[#0B3C26] focus:bg-white focus:ring-2 focus:ring-[#0B3C26]/10 rounded-xl py-2.5 pl-11 pr-4 text-xs sm:text-sm text-[#0B2216] placeholder-[#819487] font-medium transition-all shadow-2xs outline-none"
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-600 font-bold pl-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
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

              {/* Phone Number (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#142A1E] block">
                  Phone Number <span className="text-[#55695D] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#63776B] absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/80 border border-[#C4D3C3] focus:border-[#0B3C26] focus:bg-white focus:ring-2 focus:ring-[#0B3C26]/10 rounded-xl py-2.5 pl-11 pr-4 text-xs sm:text-sm text-[#0B2216] placeholder-[#819487] font-medium transition-all shadow-2xs outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#142A1E] block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#63776B] absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#142A1E] block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#63776B] absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full bg-white/80 border border-[#C4D3C3] focus:border-[#0B3C26] focus:bg-white focus:ring-2 focus:ring-[#0B3C26]/10 rounded-xl py-2.5 pl-11 pr-11 text-xs sm:text-sm text-[#0B2216] placeholder-[#819487] font-medium transition-all shadow-2xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-2.5 text-[#63776B] hover:text-[#0B3C26] p-1 rounded-lg transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-600 font-bold pl-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Checkbox: Terms of Service & Privacy Policy */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setValue('agreeTerms', !agreeTermsValue, { shouldValidate: true })}
                    className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all mt-0.5 flex-shrink-0 ${
                      agreeTermsValue
                        ? 'bg-[#0B3C26] border-[#0B3C26] text-white shadow-xs'
                        : 'border-[#A3B8A1] bg-white/70 hover:border-[#0B3C26]'
                    }`}
                  >
                    {agreeTermsValue && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  <span className="text-[11px] font-semibold text-[#3D5246] leading-snug">
                    I agree to the{' '}
                    <a href="#" className="font-bold text-[#0B3C26] hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-bold text-[#0B3C26] hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-[11px] text-red-600 font-bold pl-1 mt-1">{errors.agreeTerms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 px-6 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#0B3C26]/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span> <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Already have an account? Sign In */}
            <div className="text-center text-xs sm:text-sm font-medium text-[#4B5F53] pt-1">
              Already have an account?{' '}
              <Link href="/login" className="font-extrabold text-[#0B3C26] hover:underline">
                Sign In
              </Link>
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
