import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Capability } from '../../types/auth';
import { Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PermissionGuardProps {
  capability: Capability;
  children: ReactNode;
  fallback?: ReactNode;
  showLock?: boolean;
  className?: string;
}

export default function PermissionGuard({ 
  capability, 
  children, 
  fallback, 
  showLock = false,
  className 
}: PermissionGuardProps) {
  const { hasCapability } = useAuth();

  if (hasCapability(capability)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showLock) {
    return (
      <div className={cn("relative group cursor-not-allowed", className)}>
        <div className="opacity-40 grayscale pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-widest">Premium Content</span>
          <p className="text-[10px] text-zinc-400 mt-1 max-w-[150px]">Upgrade to unlock this feature</p>
        </div>
      </div>
    );
  }

  return null;
}
