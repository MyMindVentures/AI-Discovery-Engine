import { ShieldCheck } from 'lucide-react';

export default function CopyrightNotice() {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-4 shadow-xl">
      <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1">Proprietary IP Protection</h4>
        <p className="text-xs text-zinc-500 leading-relaxed mb-3">
          © 2026 Parallax Studio. All rights reserved. All concepts, designs, architectures, and neural workflows are original works. 
          Documented. Timestamped. Protected.
        </p>
        <div className="flex gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Kevin De Vlieger</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Parallax Studio</span>
        </div>
      </div>
    </div>
  );
}

export function IpProtectionBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-tighter text-zinc-500">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      IP Protected
    </div>
  );
}
