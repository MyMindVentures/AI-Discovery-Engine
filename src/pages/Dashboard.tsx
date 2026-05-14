import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import { 
  Plus, 
  Database, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Activity, 
  ListOrdered, 
  Zap,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import CompanyCard from '../components/ui/CompanyCard';
import StatusBadge from '../components/ui/StatusBadge';
import { Link, useNavigate } from 'react-router-dom';
import AISearchInput from '../components/ui/AISearchInput';
import CopyrightNotice, { IpProtectionBadge } from '../components/legal/CopyrightNotice';
import { companyService } from '../services/companyService';
import { searchService } from '../services/searchService';
import { savedListService } from '../services/savedListService';
import { mockStats, mockAlerts } from '../lib/mock-data';

import { Card3D } from '../components/ui/Card3D';
import { InteractiveCard } from '../components/ui/InteractiveCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [searches, setSearches] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const demoOrgId = 'org_1';
        const [c, s, l] = await Promise.all([
          companyService.getAll(demoOrgId),
          searchService.getAll(demoOrgId),
          savedListService.getAll(demoOrgId)
        ]);
        setCompanies(c);
        setSearches(s);
        setLists(l);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (query: string) => {
    console.log('Quick search:', query);
    navigate('/results');
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-zinc-900">
        <div className="flex flex-col gap-4">
          <PageHeader 
            title="Intelligence Hub" 
            description="High-frequency discovery and market enrichment monitoring."
            className="mb-0"
          />
          <IpProtectionBadge />
        </div>
        <div className="w-full lg:max-w-md">
          <AISearchInput 
            onSearch={handleSearch} 
            placeholder="Quick AI Discovery..." 
            className="py-1"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map(stat => (
          <StatCard 
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend as 'up' | 'down' | 'neutral'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Recent Searches / Jobs */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_-5px_rgba(79,70,229,0.5)]">
                  <Search className="w-4 h-4 text-indigo-400" />
                </div>
                <h2 className="text-sm font-black uppercase text-white tracking-[0.2em]">Latest Discovery Jobs</h2>
              </div>
              <Link to="/results" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">View All Archive</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searches.slice(0, 4).map(job => (
                <InteractiveCard key={job.id} className="p-6" depth="sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 truncate">{job.query}</p>
                      <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">
                        {job.type || 'search'} • {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'recent'}
                      </span>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-4 border-t border-zinc-800/50">
                    <span className="text-zinc-500 font-medium">{job.resultsCount || job._count?.results || 0} entities found</span>
                    <button className="text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </InteractiveCard>
              ))}
            </div>
          </section>

          {/* Recent Discoveries (Companies) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)]">
                  <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-sm font-black uppercase text-white tracking-[0.2em]">Market Intelligence</h2>
              </div>
              <Link to="/results" className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors">Enrichment Layer</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.slice(0, 4).map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Saved Lists */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <ListOrdered className="w-4 h-4 text-purple-400" />
                <h2 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Target Portfolios</h2>
              </div>
              <Link to="/lists" className="text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors">Manage</Link>
            </div>
            <div className="space-y-4">
              {lists.slice(0, 5).map(list => (
                <InteractiveCard key={list.id} className="p-5" depth="sm">
                  <Link to={`/lists/${list.id}`} className="flex justify-between items-center group">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{list.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10">{list.count}</span>
                      <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                </InteractiveCard>
              ))}
            </div>
          </section>

          {/* Monitoring Alerts */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-rose-400" />
                <h2 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Neural Monitoring</h2>
              </div>
              <Link to="/monitoring" className="text-[10px] font-black uppercase text-rose-400 hover:text-white transition-colors">Live Feeds</Link>
            </div>
            <Card3D className="p-6 space-y-6" depth="md">
              <div className="space-y-5">
                {mockAlerts.map(alert => (
                  <div key={alert.id} className="flex gap-4 group cursor-default">
                    <div className="mt-1 shrink-0">
                      {alert.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      {alert.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      {alert.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-[11px] font-bold text-white group-hover:text-rose-400 transition-colors uppercase tracking-tight">{alert.title}</p>
                      <p className="text-[10px] text-zinc-500 leading-relaxed italic line-clamp-2">{alert.description}</p>
                      <span className="text-[9px] font-black text-zinc-700 uppercase tracking-tighter block mt-1">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card3D>
          </section>

          {/* Credits Widget */}
          <Card3D variant="premium" className="p-8 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group" depth="lg" glow>
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-12 h-12" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.6)]">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm uppercase tracking-widest leading-none mb-2">Computation</h3>
                  <p className="text-[11px] text-indigo-300 font-bold uppercase tracking-widest opacity-80">85% Capacity</p>
                </div>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-8">
                <div className="h-full bg-white w-[85%] shadow-[0_0_10px_white]" />
              </div>
              <button className="w-full py-4 rounded-2xl bg-white text-indigo-600 text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-100 transition-all shadow-xl active:scale-95 leading-none">
                Boost Intelligence
              </button>
            </div>
          </Card3D>

          <CopyrightNotice />
        </div>
      </div>
    </div>
  );
}

