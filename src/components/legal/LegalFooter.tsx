import { Link } from 'react-router-dom';
import { Shield, Lock, Scale, FileText } from 'lucide-react';

export default function LegalFooter() {
  return (
    <footer className="mt-20 py-20 px-6 border-t border-zinc-900 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white tracking-tighter uppercase">Parallax Studio</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              A high-integrity production by Parallax Studio. Built with purpose. Protected with integrity.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                IP Integrity Protocol Active
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-zinc-300">
              <Shield className="w-4 h-4" />
              <h5 className="text-[10px] font-black uppercase tracking-widest">Legal Protection</h5>
            </div>
            <nav className="flex flex-col gap-3">
              <Link to="/legal/copyright" className="text-sm text-zinc-500 hover:text-white transition-colors">Copyright Notice</Link>
              <Link to="/legal/ip-protection" className="text-sm text-zinc-500 hover:text-white transition-colors">IP Strategy</Link>
              <Link to="/legal/terms" className="text-sm text-zinc-500 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/legal/privacy" className="text-sm text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link>
            </nav>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-zinc-300">
              <Lock className="w-4 h-4" />
              <h5 className="text-[10px] font-black uppercase tracking-widest">Ownership</h5>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 font-bold">Principal Entity</p>
                <p className="text-sm text-zinc-500 font-medium">Parallax Studio</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 font-bold">Author</p>
                <p className="text-sm text-zinc-500 font-medium">Kevin De Vlieger</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 font-bold">Registration</p>
                <p className="text-sm text-zinc-500 font-medium">Madrid, ES-2026</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-zinc-300">
              <Scale className="w-4 h-4" />
              <h5 className="text-[10px] font-black uppercase tracking-widest">Compliance</h5>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed italic">
              "Original. Documented. Timestamped. Protected."<br />
              All activity logged and archived for development history evidence.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-zinc-900">
          <p className="text-xs text-zinc-600 font-medium">
            © 2026 Parallax Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em]">
              Security by Design
            </p>
            <div className="w-1 h-8 bg-zinc-900 md:block hidden" />
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em]">
              Privacy by Default
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
