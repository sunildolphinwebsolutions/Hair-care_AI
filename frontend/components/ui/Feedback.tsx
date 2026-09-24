import React from 'react';
import { Loader2, AlertCircle, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Analyzing hair profile & loading data...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-2xl glass-card text-center ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin" />
        <Sparkles className="w-5 h-5 text-gold-400 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-300">{message}</p>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-6 rounded-2xl glass-card border-red-500/20 bg-red-500/5 text-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Request
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-2xl glass-card text-center border-dashed border-slate-700/60 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mb-3">
        <Sparkles className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-rose-500 text-slate-950 font-semibold text-xs hover:opacity-90 transition-opacity shadow-glow"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

interface SuccessStateProps {
  title: string;
  message: string;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  message,
  className = '',
}) => {
  return (
    <div className={`p-6 rounded-2xl glass-card border-emerald-500/30 bg-emerald-500/5 text-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-300">{message}</p>
    </div>
  );
};
