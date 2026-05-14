import React from 'react';
import { Card3D, Card3DProps } from './Card3D';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCard3DProps extends Omit<Card3DProps, 'children'> {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export const MetricCard3D = ({
  label,
  value,
  change,
  trend,
  icon,
  className,
  ...props
}: MetricCard3DProps) => {
  return (
    <Card3D className={cn("p-6 flex flex-col gap-1 overflow-hidden relative group", className)} {...props}>
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
        {icon || <TrendingUp className="w-12 h-12" />}
      </div>
      <div className="flex justify-between items-start mb-2 relative z-10">
        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">{label}</span>
        {icon && <div className="text-zinc-500 group-hover:text-indigo-400 transition-colors">{icon}</div>}
      </div>
      <div className="flex items-end justify-between relative z-10">
        <span className="text-3xl font-bold text-white tracking-tight leading-none group-hover:scale-105 transition-transform origin-left duration-300">{value}</span>
        {change && (
          <div className={cn(
            "flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full",
            trend === 'up' && "bg-emerald-500/10 text-emerald-500",
            trend === 'down' && "bg-rose-500/10 text-rose-500",
            trend === 'neutral' && "bg-zinc-500/10 text-zinc-500"
          )}>
            {trend === 'up' && <ArrowUpRight className="w-2.5 h-2.5" />}
            {trend === 'down' && <ArrowDownRight className="w-2.5 h-2.5" />}
            {trend === 'neutral' && <Minus className="w-2.5 h-2.5" />}
            {change}
          </div>
        )}
      </div>
    </Card3D>
  );
};
