import React from 'react';
import { Card3D, Card3DProps } from './Card3D';
import { cn } from '../../lib/utils';

interface FeatureCard3DProps extends Card3DProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
}

export const FeatureCard3D = ({
  title,
  description,
  icon,
  badge,
  className,
  children,
  ...props
}: FeatureCard3DProps) => {
  return (
    <Card3D className={cn("p-8 group", className)} {...props}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          {icon && (
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <div className="text-black">{icon}</div>
            </div>
          )}
          {badge && (
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {badge}
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">
            {description}
          </p>
        </div>
        
        {children}
      </div>
    </Card3D>
  );
};
