import { Shield, Lock, FileText, CheckCircle2, Globe, Database, Cpu, History } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LegalFooter from '../../components/legal/LegalFooter';

export default function IpProtectionPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <PageHeader 
          title="IP Protection Strategy" 
          description="How we safeguard original innovation at Parallax Studio."
        />

        <div className="space-y-12 mb-20 mt-12">
          {/* Strategy Overview */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Timestamping</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Every line of code and architectural shift is recorded with immutable cryptographic timestamps.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Evidence Log</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Our development history documentation serves as an evidentiary ledger for original synthesis.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Neural Synthesis</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Workflows and prompts are protected as proprietary "Intellectual Capital" of Parallax Studio.
              </p>
            </div>
          </section>

          {/* Development History Note */}
          <section className="p-10 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Repository Documentation Notice</h2>
            <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
              <p>
                The Parallax IP Integrity Protocol ensures that every asset generated or code block implemented 
                is backed by a verifiable chain of custody. This project is hosted on a high-security repository 
                where all activity is considered timestamped development evidence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-200">Git Ledgers</p>
                    <p className="text-xs">Sequential record of development iterations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-200">Asset Fingerprinting</p>
                    <p className="text-xs">Prompts and parameters for all AI-generated assets.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-200">Design Schemas</p>
                    <p className="text-xs">Architectural blueprints for system logic.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-200">External Registry</p>
                    <p className="text-xs">Third-party timestamping of major milestones.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Zero Trust Section */}
          <section className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/20">
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Proprietary Status Notice</h3>
             <p className="text-sm text-zinc-500 leading-relaxed italic">
               "This project is proprietary unless a separate license file states otherwise. No open-source 
               permissions are implicitly granted via repository access."
             </p>
          </section>

          {/* Global Enforcement */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <Globe className="w-6 h-6 text-zinc-700" />
              <Lock className="w-6 h-6 text-zinc-700" />
              <Scale className="w-6 h-6 text-zinc-700" />
            </div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] max-w-sm mx-auto">
              Parallax Studio reserves the right to enforce its intellectual property rights globally.
            </p>
            <div className="pt-8">
              <p className="text-[10px] text-zinc-800 italic">
                This is not legal advice. Final legal review should be performed by a qualified legal professional.
              </p>
            </div>
          </div>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
}

function Scale({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  );
}
