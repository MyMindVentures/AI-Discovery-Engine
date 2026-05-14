import React from 'react';
import { Card3D, Card3DProps } from './Card3D';
import { cn } from '../../lib/utils';

interface AdminCard3DProps extends Card3DProps {
  title?: string;
  icon?: React.ReactNode;
}

export const AdminCard3D = ({ title, icon, children, className, ...props }: AdminCard3DProps) => {
  return (
    <Card3D variant="admin" className={cn("p-8", className)} {...props}>
      {title && (
        <div className="flex items-center gap-4 mb-8">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 text-indigo-400 group-hover:text-white group-hover:border-indigo-500 transition-all">
              {icon}
            </div>
          )}
          <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">{title}</h3>
        </div>
      )}
      {children}
    </Card3D>
  );
};

export default AdminCard3D;
