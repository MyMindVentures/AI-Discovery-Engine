import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Database, Search, Shield, Globe, Zap } from 'lucide-react';
import LegalFooter from '../components/legal/LegalFooter';
import IpProtectionBadge from '../components/legal/IpProtectionBadge';

import { FeatureCard3D } from '../components/ui/FeatureCard3D';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(79,70,229,1)]">
              <Search className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">AI Discovery</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-medium hover:text-indigo-400 transition-colors">Login</Link>
            <Link to="/dashboard" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-black transition-all hover:bg-zinc-200 active:scale-95 shadow-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex flex-col sm:flex-row items-center gap-4 mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-black uppercase tracking-widest text-indigo-400 shadow-[0_0_15px_-5px_rgba(79,70,229,0.4)]">
                <Sparkles className="w-3 h-3" />
                <span>Next-Gen Business Intelligence</span>
              </div>
              <IpProtectionBadge />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-white"
            >
              Find anyone, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">anything, anywhere.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-zinc-400 mb-12 leading-relaxed max-w-2xl font-medium"
            >
              Turn fragmented internet research into structured business intelligence. 
              The discovery engine that enriches and monitors the global market for you.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link to="/dashboard" className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 group shadow-[0_20px_40px_-15px_rgba(79,70,229,0.5)] active:scale-95">
                Start Discovering <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a href="#demo" className="w-full sm:w-auto px-10 py-5 rounded-[2rem] font-black text-xl border border-white/10 hover:bg-white/5 transition-all text-center backdrop-blur-sm active:scale-95">
                Watch Demo
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard3D 
              title="Instant Enrichment"
              description="Connect your discovery queries to 50+ data sources. We find missing emails, social profiles, and technology stacks automatically."
              icon={<Zap className="w-6 h-6" />}
              badge="Protocol"
              variant="default"
              glow
            />
            <FeatureCard3D 
              title="Structured Datasets"
              description="No more messy spreadsheets. We export clean, JSON-ready datasets synced with your CRM or existing data warehouse."
              icon={<Database className="w-6 h-6" />}
              badge="Export"
              variant="premium"
              glow
            />
            <FeatureCard3D 
              title="Global Discovery"
              description="From stealth startups in Berlin to family-owned manufacturing in Ohio. Our scrapers cover the entire indexable web."
              icon={<Globe className="w-6 h-6" />}
              badge="Scale"
              variant="default"
              glow
            />
          </div>
        </div>
      </section>

      {/* Legal Footer */}
      <LegalFooter />
    </div>
  );
}
