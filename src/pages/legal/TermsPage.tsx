import PageHeader from '../../components/ui/PageHeader';
import LegalFooter from '../../components/legal/LegalFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <PageHeader 
          title="Terms of Service" 
          description="Guidelines and agreements for the use of AI Discovery Engine."
        />

        <div className="space-y-10 mb-20 mt-12 text-zinc-400 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">1. Agreement to Terms</h2>
            <p>
              By accessing or using the AI Discovery Engine, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you are 
              prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">2. Use License</h2>
            <p>
              Permission is granted to temporarily access the AI Discovery Engine for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
              <li>Attempt to decompile or reverse engineer any software contained on the AI Discovery Engine.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">3. Disclaimer</h2>
            <p>
              The materials on the AI Discovery Engine are provided on an 'as is' basis. Parallax Studio 
              makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
              including, without limitation, implied warranties or conditions of merchantability, fitness for a 
              particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-lg font-bold text-white uppercase tracking-tight">4. Limitations</h2>
             <p>
               In no event shall Parallax Studio or its suppliers be liable for any damages (including, 
               without limitation, damages for loss of data or profit, or due to business interruption) 
               arising out of the use or inability to use the materials on the AI Discovery Engine.
             </p>
          </section>

          <section className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 mt-12 italic text-zinc-500">
            This is not legal advice. Final legal review should be performed by a qualified legal professional.
          </section>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
}
