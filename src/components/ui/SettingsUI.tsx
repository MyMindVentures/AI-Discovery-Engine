import React from 'react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ title, description, children, className }: SettingsSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="pb-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleRow({ label, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex flex-col gap-1 pr-4">
        <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{label}</span>
        {description && <p className="text-xs text-zinc-500">{description}</p>}
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black",
          checked ? "bg-indigo-600" : "bg-zinc-800",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

export function EmptyActionState({ title, description, actionLabel }: { title: string, description: string, actionLabel?: string }) {
  const handleComingSoon = () => {
    toast.info("Coming soon! This feature is being finalized.");
  };

  return (
    <div className="p-10 rounded-3xl border border-zinc-800 bg-zinc-900/20 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
        <div className="w-8 h-8 rounded bg-zinc-800 animate-pulse" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-8">{description}</p>
      {actionLabel && (
        <button 
          onClick={handleComingSoon}
          className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold transition-all border border-zinc-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
