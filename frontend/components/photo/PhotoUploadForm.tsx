"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Trash2,
  UploadCloud,
  AlertCircle,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface PhotoSlot {
  category: 'FRONT_HAIRLINE' | 'TOP_SCALP' | 'LEFT_SIDE' | 'RIGHT_SIDE';
  label: string;
  required: boolean;
  file: File | null;
  previewUrl: string | null;
  uploadedPhotoId?: string;
  isUploading: boolean;
  error: string | null;
}

export const PhotoUploadForm: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [slots, setSlots] = useState<PhotoSlot[]>([
    { category: 'FRONT_HAIRLINE', label: 'Front Hairline', required: true, file: null, previewUrl: null, isUploading: false, error: null },
    { category: 'TOP_SCALP', label: 'Top of Scalp', required: true, file: null, previewUrl: null, isUploading: false, error: null },
    { category: 'LEFT_SIDE', label: 'Left Side', required: false, file: null, previewUrl: null, isUploading: false, error: null },
    { category: 'RIGHT_SIDE', label: 'Right Side', required: false, file: null, previewUrl: null, isUploading: false, error: null },
  ]);

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Hidden File Inputs for each slot
  const fileInputRefs = {
    FRONT_HAIRLINE: useRef<HTMLInputElement>(null),
    TOP_SCALP: useRef<HTMLInputElement>(null),
    LEFT_SIDE: useRef<HTMLInputElement>(null),
    RIGHT_SIDE: useRef<HTMLInputElement>(null),
  };

  // Helper: Trigger File Select
  const handleSlotClick = (category: 'FRONT_HAIRLINE' | 'TOP_SCALP' | 'LEFT_SIDE' | 'RIGHT_SIDE') => {
    fileInputRefs[category].current?.click();
  };

  // Load existing photos from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStr = localStorage.getItem('haircare_uploaded_photos');
      if (savedStr) {
        try {
          const savedMap = JSON.parse(savedStr);
          setSlots((prev) =>
            prev.map((s) => {
              if (savedMap[s.category]) {
                return { ...s, previewUrl: savedMap[s.category] };
              }
              return s;
            })
          );
        } catch (e) { }
      }
    }
  }, []);

  // Handle File Upload and Preview
  const handleFileChange = async (
    category: 'FRONT_HAIRLINE' | 'TOP_SCALP' | 'LEFT_SIDE' | 'RIGHT_SIDE',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Client File Format Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      updateSlot(category, { error: 'Invalid file format. Please upload JPEG, PNG, or WebP.' });
      return;
    }

    // 2. Client File Size Validation (Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      updateSlot(category, { error: 'File size exceeds 10MB limit.' });
      return;
    }

    // Create lightweight object URL preview
    const previewObjectUrl = URL.createObjectURL(file);
    updateSlot(category, { file, previewUrl: previewObjectUrl, error: null, isUploading: true });

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let currentSessionId = sessionId;

      if (!currentSessionId && isAuthenticated) {
        const sessionRes = await apiClient.post<{ session: { id: string } }>('/photo-sessions', {
          consentGiven: true,
        });
        currentSessionId = sessionRes.session.id;
        setSessionId(currentSessionId);
      }

      if (currentSessionId && isAuthenticated) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const uploadUrl = `${apiBaseUrl}/api/v1/photo-sessions/${currentSessionId}/confirm-upload`;
        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error?.message || 'Upload failed');
        }

        if (data.photo?.storageKey) {
          const serverUrl = data.photo.storageKey.startsWith('http')
            ? data.photo.storageKey
            : `${apiBaseUrl}${data.photo.storageKey}`;

          if (typeof window !== 'undefined') {
            try {
              const savedStr = localStorage.getItem('haircare_uploaded_photos');
              const savedMap = savedStr ? JSON.parse(savedStr) : {};
              savedMap[category] = serverUrl;
              localStorage.setItem('haircare_uploaded_photos', JSON.stringify(savedMap));
            } catch (e) {}
          }
          updateSlot(category, { previewUrl: serverUrl, uploadedPhotoId: data.photo?.id, isUploading: false });
        } else {
          updateSlot(category, { uploadedPhotoId: data.photo?.id, isUploading: false });
        }
      } else {
        // Unauthenticated demo fallback preview persistence
        if (typeof window !== 'undefined') {
          try {
            const savedStr = localStorage.getItem('haircare_uploaded_photos');
            const savedMap = savedStr ? JSON.parse(savedStr) : {};
            savedMap[category] = previewObjectUrl;
            localStorage.setItem('haircare_uploaded_photos', JSON.stringify(savedMap));
          } catch (e) {}
        }
        setTimeout(() => {
          updateSlot(category, { isUploading: false });
        }, 300);
      }
    } catch (err: any) {
      updateSlot(category, { isUploading: false, error: err.message || 'Upload failed. Tap to retry.' });
    }
  };

  // Helper to update specific slot
  const updateSlot = (category: string, patch: Partial<PhotoSlot>) => {
    setSlots((prev) =>
      prev.map((s) => (s.category === category ? { ...s, ...patch } : s))
    );
  };

  // Remove Photo Handler
  const handleRemovePhoto = async (
    category: 'FRONT_HAIRLINE' | 'TOP_SCALP' | 'LEFT_SIDE' | 'RIGHT_SIDE',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const slot = slots.find((s) => s.category === category);
    if (slot?.uploadedPhotoId && isAuthenticated) {
      try {
        await apiClient.delete(`/photos/${slot.uploadedPhotoId}`);
      } catch (err) {
        // Continue clearing local state
      }
    }
    if (typeof window !== 'undefined') {
      const savedStr = localStorage.getItem('haircare_uploaded_photos');
      if (savedStr) {
        try {
          const savedMap = JSON.parse(savedStr);
          delete savedMap[category];
          localStorage.setItem('haircare_uploaded_photos', JSON.stringify(savedMap));
        } catch (e) { }
      }
    }
    updateSlot(category, { file: null, previewUrl: null, uploadedPhotoId: undefined, error: null });
  };

  // Verify Required Photos Uploaded
  const requiredSlotsUploaded = slots
    .filter((s) => s.required)
    .every((s) => s.file !== null || s.previewUrl !== null);

  const canContinue = requiredSlotsUploaded && consentGiven && !submitting;

  const handleContinue = () => {
    if (!canContinue) return;
    setSubmitting(true);
    setTimeout(() => {
      // Proceed to Step 2/4 (Questionnaire)
      router.push('/onboarding');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#F8FAF8] text-[#1F2937] rounded-3xl shadow-xl border border-emerald-900/10 overflow-hidden font-sans my-4">
      {/* Header Progress 1/4 matching reference UI */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => router.push('/')}
          className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#154D34] w-[25%] rounded-full transition-all duration-300" />
          </div>
          <span className="text-xs font-semibold text-gray-500 font-mono">1/4</span>
        </div>
      </div>

      {/* Screen Title & Subtitle */}
      <div className="px-6 pt-6 pb-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-heading">
          Upload Your Hair Photos
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Take clear photos from different angles for the best analysis.
        </p>
      </div>

      {/* Head Target Illustration Graphic */}
      <div className="flex justify-center py-3">
        <div className="w-24 h-24 rounded-full bg-emerald-100/60 border-2 border-dashed border-[#154D34]/30 flex items-center justify-center relative shadow-inner">
          <div className="w-16 h-16 rounded-full bg-[#154D34]/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-[#154D34]" />
          </div>
          <span className="absolute -bottom-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#154D34] text-white">
            Target Angles
          </span>
        </div>
      </div>

      {/* 4 Photo Upload Slot Cards Grid */}
      <div className="px-6 py-2">
        <div className="grid grid-cols-2 gap-3">
          {slots.map((slot) => {
            const isFront = slot.category === 'FRONT_HAIRLINE';
            return (
              <div key={slot.category} className="flex flex-col items-center">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRefs[slot.category]}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChange(slot.category, e)}
                />

                {/* Upload Tile */}
                <div
                  onClick={() => handleSlotClick(slot.category)}
                  className={`w-full aspect-[4/3] rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col items-center justify-center cursor-pointer shadow-sm ${slot.previewUrl
                    ? 'border-[#154D34] bg-white'
                    : slot.error
                      ? 'border-red-300 bg-red-50'
                      : 'border-dashed border-gray-300 bg-white hover:border-[#154D34]/50 hover:bg-gray-50'
                    }`}
                >
                  {slot.previewUrl ? (
                    <>
                      <img
                        src={slot.previewUrl}
                        alt={slot.label}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleRemovePhoto(slot.category, e)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                      {slot.isUploading ? (
                        <div className="w-6 h-6 border-2 border-[#154D34]/30 border-t-[#154D34] rounded-full animate-spin" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#154D34] flex items-center justify-center">
                          <Camera className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-[11px] font-bold text-gray-800">
                        {slot.label}
                      </span>
                      <span className="text-[9px] text-gray-400 font-medium">
                        {slot.required ? '(required)' : '(optional)'}
                      </span>
                    </div>
                  )}

                  {slot.isUploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#154D34]/30 border-t-[#154D34] rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {slot.error && (
                  <p className="text-[10px] text-red-500 font-medium mt-1 text-center">
                    {slot.error}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips For Best Results Box matching reference UI */}
      <div className="px-6 py-4 space-y-4">
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#154D34] font-bold">
            <Info className="w-4 h-4" />
            <span>Tips for best results:</span>
          </div>
          <ul className="space-y-1 text-gray-700 font-medium text-[11px] pl-1">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#154D34] stroke-[3]" /> Use good natural lighting
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#154D34] stroke-[3]" /> Keep hair clean and dry
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#154D34] stroke-[3]" /> Avoid filters or heavy editing
            </li>
          </ul>
        </div>

        {/* User Explicit Consent Checkbox */}
        <div
          onClick={() => setConsentGiven(!consentGiven)}
          className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-gray-200 cursor-pointer hover:border-[#154D34]/40 transition-colors"
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${consentGiven ? 'bg-[#154D34] text-white' : 'border border-gray-300 bg-white'
              }`}
          >
            {consentGiven && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <p className="text-[11px] text-gray-600 leading-tight">
            I consent to securely uploading my photos for AI hair & scalp analysis.
          </p>
        </div>

        {/* Action Button matching reference UI */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full py-3.5 rounded-full bg-[#154D34] text-white font-bold text-sm hover:bg-[#0D3823] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Continue <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
