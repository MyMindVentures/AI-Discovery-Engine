import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

export default function IpProtectionBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
      <Shield className="w-3 h-3" />
      <span className="text-[10px] font-black uppercase tracking-widest">Protected by Parallax</span>
      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
    </div>
  );
}
