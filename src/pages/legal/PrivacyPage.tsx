import PageHeader from '../../components/ui/PageHeader';
import LegalFooter from '../../components/legal/LegalFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <PageHeader 
          title="Privacy Policy" 
          description="How we handle and protect your information at AI Discovery Engine."
        />

        <div className="space-y-10 mb-20 mt-12 text-zinc-400 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">1. Data Collection</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              participate in a search, or communicate with us. The types of information we may collect 
              include your name, email address, and any other information you choose to provide.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">2. Use of Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              to develop new ones, and to protect Parallax Studio and our users.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">3. Data Sharing</h2>
            <p>
              We do not share your personal information with companies, organizations, or individuals outside 
              of Parallax Studio except in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your consent.</li>
              <li>For external processing (with trusted service providers).</li>
              <li>For legal reasons (e.g., meeting any applicable law, regulation, legal process or enforceable governmental request).</li>
            </ul>
          </section>

          <section className="space-y-4">
             <h2 className="text-lg font-bold text-white uppercase tracking-tight">4. Security</h2>
             <p>
               We work hard to protect Parallax Studio and our users from unauthorized access to or 
               unauthorized alteration, disclosure or destruction of information we hold.
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
