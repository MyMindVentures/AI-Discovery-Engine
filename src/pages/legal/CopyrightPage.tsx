import { Shield, Lock, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LegalFooter from '../../components/legal/LegalFooter';

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <PageHeader 
          title="Copyright Notice" 
          description="Legal ownership and intellectual property documentation for Parallax Studio."
        />

        <div className="space-y-12 mb-20 mt-12">
          {/* Ownership Statement */}
          <section className="p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              Ownership Statement
            </h2>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                All materials contained within the AI Discovery Engine, including but not limited to source code, algorithms, 
                user interface designs, UX patterns, architectural blueprints, system schemas, and technical documentation, 
                are the exclusive property of **Kevin De Vlieger** under **Parallax Studio**.
              </p>
              <p className="font-bold text-white">
                © 2026 Parallax Studio. All rights reserved.
              </p>
              <p>
                No part of this system may be reproduced, distributed, or transmitted in any form or by any means, 
                including photocopying, recording, or other electronic or mechanical methods, without the prior 
                written permission of the publisher.
              </p>
            </div>
          </section>

          {/* Protected Materials */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Protected Assets</h3>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li className="flex items-center gap-2 italic">• Source Code & Neural Protocols</li>
                <li className="flex items-center gap-2 italic">• AI Custom Prompts & Workflows</li>
                <li className="flex items-center gap-2 italic">• Proprietary Database Schemas</li>
                <li className="flex items-center gap-2 italic">• UX/UI Interaction Design Patterns</li>
                <li className="flex items-center gap-2 italic">• Branding & Visual Identity</li>
              </ul>
            </div>
            <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Prohibited Uses</h3>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li className="flex items-center gap-2 font-medium text-red-500/70">• Unauthorized Commercial Resale</li>
                <li className="flex items-center gap-2 font-medium text-red-500/70">• LLM Training on Source Code</li>
                <li className="flex items-center gap-2 font-medium text-red-500/70">• Redistribution of Proprietary Assets</li>
                <li className="flex items-center gap-2 font-medium text-red-500/70">• Branding Infringement</li>
                <li className="flex items-center gap-2 font-medium text-red-500/70">• Derivative Works Fabrication</li>
              </ul>
            </div>
          </section>

          {/* Attribution */}
          <section className="p-10 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/20">
            <h2 className="text-lg font-bold text-white mb-6">Attribution Requirements</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              In specific cases where written authorization is granted, the following attribution must be displayed 
              prominently next to any derivative use or implementation:
            </p>
            <div className="p-6 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-indigo-300">
              "Originally developed by Parallax Studio (Kevin De Vlieger). © 2026 All Rights Reserved."
            </div>
          </section>

          {/* Contact */}
          <section className="text-center space-y-4">
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Enforcements & Inquiries</h3>
            <p className="text-xs text-zinc-600">
              For any legal inquiries, licensing requests, or reported violations, please contact<br />
              <span className="text-indigo-400 font-bold underline cursor-pointer">legal@parallax-studio.ai</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-800 font-black uppercase mt-8">
              <AlertTriangle className="w-3 h-3" />
              Not Legal Advice
            </div>
            <p className="text-[10px] text-zinc-800 max-w-xs mx-auto italic">
              This document serves as a copyright notice. Final legal status should be reviewed by a professional.
            </p>
          </section>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
}
