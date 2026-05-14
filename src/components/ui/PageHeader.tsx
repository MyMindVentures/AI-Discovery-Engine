import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12", className)}>
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
