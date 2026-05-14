import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'archived' | 'completed' | 'processing' | 'failed';
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    failed: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    archived: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      styles[status] || styles.pending,
      className
    )}>
      {status}
    </span>
  );
}
