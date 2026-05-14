import React from 'react';
import { HTMLMotionProps, motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface Card3DProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'admin' | 'danger' | 'success' | 'premium';
  depth?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  interactive?: boolean;
  className?: string;
}

export const Card3D = ({
  children,
  variant = 'default',
  depth = 'md',
  glow = false,
  interactive = true,
  className,
  ...props
}: Card3DProps) => {
  const depthStyles = {
    sm: "shadow-md hover:shadow-lg",
    md: "shadow-lg hover:shadow-xl",
    lg: "shadow-xl hover:shadow-2xl"
  };

  const variantStyles = {
    default: "bg-zinc-900/40 border-zinc-800",
    glass: "bg-white/5 backdrop-blur-xl border-white/10",
    gradient: "bg-gradient-to-br from-zinc-900 to-black border-zinc-800",
    admin: "bg-zinc-950 border-zinc-800",
    danger: "bg-rose-500/5 border-rose-500/20",
    success: "bg-emerald-500/5 border-emerald-500/20",
    premium: "bg-gradient-to-br from-indigo-600/10 via-zinc-900 to-black border-indigo-500/20"
  };

  return (
    <motion.div
      whileHover={interactive ? { 
        y: -4,
        scale: 1.01,
        transition: { duration: 0.2, ease: "easeOut" }
      } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      className={cn(
        "relative rounded-2xl md:rounded-3xl border transition-all duration-300 overflow-hidden",
        variantStyles[variant],
        depthStyles[depth],
        glow && "after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[0_0_20px_-10px_rgba(99,102,241,0.5)] after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        className
      )}
      {...props}
    >
      {/* Inner highlight for depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      
      {children}
    </motion.div>
  );
};

export default Card3D;
