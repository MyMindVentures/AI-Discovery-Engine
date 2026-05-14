import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DemoBadge() {
  // In a real app, this would check an env var or a health endpoint
  const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

  if (!isDemo) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 right-8 z-50 animate-bounce">
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full backdrop-blur-md">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
          Demo Mode Active
        </span>
      </div>
    </div>
  );
}
