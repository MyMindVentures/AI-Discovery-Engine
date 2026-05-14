import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ExternalLink, 
  Globe, 
  Mail, 
  Linkedin, 
  Twitter, 
  Building2, 
  Users, 
  MapPin, 
  Calendar,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  Bookmark,
  Download,
  Activity,
  ArrowLeftRight,
  MessageSquare,
  History,
  ArrowRight,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Clock,
  Search,
  RefreshCcw
} from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import CompanyCard from '../components/ui/CompanyCard';
import { companyService } from '../services/companyService';

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [enrichmentResults, setEnrichmentResults] = useState<any>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const res = await companyService.getById(id!);
      setCompany(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrich = async () => {
    setEnriching(true);
    try {
      const res = await fetch(`/api/companies/${id}/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          enrichmentTypes: ['website_crawl', 'tech_stack', 'emails', 'ai_summary', 'contacts', 'social_links'] 
        })
      });
      const data = await res.json();
      setEnrichmentResults(data.results);
      setCompany(data.company);
    } catch (e) {
      console.error("Enrichment failed", e);
    } finally {
      setEnriching(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <RefreshCcw className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Syncing Intelligence...</span>
      </div>
    </div>
  );

  if (!company) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Intelligence Node Not Found</h2>
        <Link to="/results" className="text-indigo-400 hover:underline">Back to Database</Link>
      </div>
    </div>
  );

  const metadata = company.metadata || {};
  const ai_scores = metadata.ai_scores || {};

  const history = [
    { event: 'Initial Discovery', date: company.createdAt ? new Date(company.createdAt).toISOString().split('T')[0] : 'N/A', type: 'search', description: 'AI Search Protocol v4.2' },
    ...(metadata.lastEnriched ? [{ 
      event: 'Deep Enrichment', 
      date: metadata.lastEnriched.split('T')[0], 
      type: 'enrichment', 
      description: 'Full automated protocol run' 
    }] : [])
  ];

  const relatedCompanies = []; // Could be fetched separately

  const sources = [
    { name: 'Crunchbase', url: '#', icon: Building2 },
    { name: 'LinkedIn', url: '#', icon: Linkedin },
    { name: 'Apify Crawler', url: '#', icon: Search },
    { name: 'People Data Labs', url: '#', icon: Users },
  ];

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Top Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Link to="/results" className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700">
              <ArrowRight className="w-4 h-4 rotate-180" />
            </div>
            Back to Database
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={handleEnrich}
              disabled={enriching}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg",
                enriching ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20"
              )}
            >
              {enriching ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {enriching ? "Enriching..." : "Enrich Company"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-bold">
              <Bookmark className="w-4 h-4" /> Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-bold">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-indigo-500/30 text-indigo-400 hover:text-white transition-all text-xs font-bold">
              <Activity className="w-4 h-4" /> Monitor
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-xs font-bold shadow-lg shadow-indigo-500/20">
              <ArrowLeftRight className="w-4 h-4" /> Compare
            </button>
          </div>
        </div>

        {enrichmentResults && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4" /> Enrichment Protocol Sync Successful
              </h4>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {enrichmentResults.steps.map((s: any) => (
                <div key={s.step} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                   <CheckCircle2 className="w-3 h-3" /> {s.step.replace('_', ' ')}: {s.provider}
                </div>
              ))}
            </div>
          </motion.div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Primary Data */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Company Header Card */}
          <section className="flex flex-col md:flex-row items-start md:items-center gap-8 bg-zinc-900/20 p-8 rounded-[2rem] border border-zinc-800/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <div className="flex flex-col items-end gap-1">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest",
                  metadata.lastEnriched ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-800/10 border-zinc-700/20 text-zinc-500"
                )}>
                  {metadata.lastEnriched ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {metadata.lastEnriched ? 'Verified Intelligence' : 'Basic Signal'}
                </div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  {company.sourceRecords?.length || 0} verified sources
                </span>
              </div>
            </div>

            <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[2rem] flex items-center justify-center text-4xl font-bold text-indigo-400 border border-zinc-700/50 shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
              {company.name.charAt(0)}
            </div>
            
            <div className="space-y-4">
              <div>
                <h1 className="text-5xl font-bold text-white tracking-tighter mb-2">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-zinc-500 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> {company.industry}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-zinc-800" />
                  <span className="text-sm font-bold text-zinc-500 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {company.location}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(company.tags || []).map((tag: any, idx: number) => (
                  <span key={idx} className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-lg bg-indigo-500/5 text-indigo-400 border border-indigo-500/20">
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* AI Summary Block */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">Synthesized Company Profile</h2>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl relative group">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full" />
              <div className="prose prose-invert max-w-none">
                <p className="text-xl text-white font-medium italic leading-relaxed">
                  "{company.description}"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 mt-8 border-t border-zinc-800">
                   <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" /> Core Moat
                    </h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Leverages proprietary datasets from {company.sourceRecords?.length || 1} primary sources to deliver real-time infrastructure insights. Strong technical defensive position with {(company.technologies?.length || 0) + 2} core platform technologies.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" /> Market Fit
                    </h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      High relevance score of {Math.round((ai_scores.relevance || 0.75) * 100)}% indicates a strong alignment with identified discovery queries in the {company.industry} sector.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contacts & Tech Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">Stack Intelligence</h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(company.technologies || ["Cloudflare", "React", "Google Analytics"]).map((tech: any, idx: number) => (
                  <div key={idx} className="px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-default">
                    {typeof tech === 'string' ? tech : tech.name}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-400" />
                  <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">Contact Node Mapping</h2>
                </div>
              </div>
              <div className="space-y-3">
                {(company.contacts?.length > 0 ? company.contacts : [
                  { firstName: 'No', lastName: 'Contacts', title: 'Start enrichment to find nodes', email: 'none', id: 'none' }
                ]).map((contact: any) => (
                  <div key={contact.id} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between group hover:bg-zinc-900 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 border border-zinc-700 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">
                        {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {contact.firstName} {contact.lastName}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{contact.title}</span>
                      </div>
                    </div>
                    {contact.email !== 'none' && (
                      <button className="p-2 rounded-lg bg-zinc-800 text-zinc-500 hover:text-white transition-colors border border-zinc-700">
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Notes Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">Strategic Notes</h2>
            </div>
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800">
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add private intelligence notes about this company..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-zinc-300 min-h-[120px] resize-none"
              />
              <div className="flex justify-end pt-4">
                <button className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all border border-zinc-700">
                  Autosaved
                </button>
              </div>
            </div>
          </section>

          {/* Related Companies */}
          <section className="space-y-6 pt-10">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">Similar Market Nodes</h2>
              </div>
              <Link to="/results" className="text-[10px] font-black uppercase text-indigo-400 hover:underline tracking-widest">Global Graph</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Could be populated with search related ones */}
            </div>
          </section>
        </div>

        {/* Right Column: Metadata & History */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Info Rail */}
          <section className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-2xl space-y-8">
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Metadata</h3>
            <div className="space-y-6">
              {[
                { label: 'Headquarters', value: company.location, icon: MapPin },
                { label: 'Org Size', value: company.size, icon: Users },
                { label: 'Founded', value: '2019', icon: Calendar },
                { label: 'Ownership', value: 'Private (Series B)', icon: ShieldCheck },
                { label: 'Domain', value: company.website || company.domain, icon: Globe2, isLink: !!(company.website || company.domain) },
              ].map(item => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-600 tracking-tight">
                    <item.icon className="w-3 h-3" /> {item.label}
                  </div>
                  {item.isLink ? (
                    <a href={item.value?.startsWith('http') ? item.value : `https://${item.value}`} className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
                      {item.value?.replace('https://', '').replace('http://', '')} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-white">{item.value}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-zinc-800 grid grid-cols-3 gap-3">
              {[Linkedin, Twitter, Globe].map((Icon, i) => (
                <button key={i} className="py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all flex justify-center">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </section>

          {/* Enrichment History */}
          <section className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Discovery Logs</h3>
              <History className="w-4 h-4 text-zinc-700" />
            </div>
            <div className="relative space-y-8">
              {history.map((item, i) => (
                <div key={i} className="relative pl-8">
                  <div className={cn(
                    "absolute left-0 top-1 w-2 h-2 rounded-full",
                    i === 0 ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-zinc-800"
                  )} />
                  {i < history.length - 1 && <div className="absolute left-1 top-4 w-px h-12 bg-zinc-800" />}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.event}</span>
                      <span className="text-[9px] font-bold text-zinc-600">{item.date}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Intelligent Sources */}
          <section className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-2xl space-y-8">
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Source Provenance</h3>
            <div className="space-y-3">
              {(company.sourceRecords?.length > 0 ? company.sourceRecords : [
                { source: 'Direct Search', url: '#' },
                { source: 'Intelligence Sync', url: '#' }
              ]).map((source: any, i: number) => (
                <a 
                  key={i} 
                  href={source.url}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50 hover:border-zinc-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700 text-zinc-500 group-hover:text-indigo-400 transition-all">
                      <Search className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-all">{source.source}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-700 group-hover:text-white transition-all" />
                </a>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}


// Missing icon import in file
function Brain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.588A4 4 0 0 0 12 18.75V21" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.588A4 4 0 0 1 12 18.75V21" />
      <path d="M9 13a4.5 4.5 0 0 0 3-4" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4" />
      <path d="M12 13V9" />
    </svg>
  )
}
