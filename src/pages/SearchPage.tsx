import PageHeader from '../components/ui/PageHeader';
import AISearchInput from '../components/ui/AISearchInput';
import { Sparkles, Zap, Brain, Globe, Search, ArrowRight, Lock, Loader2, Play, Settings2, Globe2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import PermissionGuard from '../components/ui/PermissionGuard';
import { useState, useEffect } from 'react';
import SearchModeSelector, { SearchMode } from '../components/search/SearchModeSelector';
import SourceSelector, { SearchSource } from '../components/search/SourceSelector';
import SearchPlanPreview, { PlanStep } from '../components/search/SearchPlanPreview';
import { cn } from '../lib/utils';
import UpgradePrompt from '../components/UpgradePrompt';

type SearchState = 'idle' | 'planning' | 'executing' | 'limit_reached';

export default function SearchPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<SearchState>('idle');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('quick');
  const [sources, setSources] = useState<SearchSource[]>(['google', 'firecrawl', 'hunter']);
  const [enrichmentLevel, setEnrichmentLevel] = useState<'basic' | 'pro' | 'deep'>('pro');
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setState('planning');
    
    try {
      const response = await fetch('/api/search/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: searchQuery, mode, limit: 50 })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.includes('PLAN_LIMIT_EXCEEDED')) {
          setState('limit_reached');
          return;
        }
        throw new Error('Planning failed');
      }
      const plan = await response.json();

      const steps: PlanStep[] = [
        { id: '1', title: `Target: ${plan.targetCompanyType} in ${plan.targetLocation}`, status: 'completed', type: 'search' },
        { id: '2', title: `Crawl ${plan.recommendedSources.join(', ')} for primary data`, status: 'pending', type: 'scraping' },
        { id: '3', title: `Analyzing: ${plan.industryTags.slice(0, 3).join(', ')}`, status: 'pending', type: 'validation' },
        { id: '4', title: `Enrichment Plan: ${plan.enrichmentPlan?.[0] || 'Deep data extraction'}`, status: 'pending', type: 'enrichment' },
        { id: '5', title: 'Export to results dashboard', status: 'pending', type: 'search' },
      ];
      setPlanSteps(steps);
    } catch (e) {
      console.error("Planning failed", e);
      // Fallback
      const steps: PlanStep[] = [
        { id: '1', title: 'Parse query & intent extraction', status: 'completed', type: 'search' },
        { id: '2', title: `Crawl ${sources.join(', ')} for primary data`, status: 'pending', type: 'scraping' },
        { id: '3', title: 'Entity consolidation & de-duplication', status: 'pending', type: 'validation' },
        { id: '4', title: `Enrich with ${enrichmentLevel} intelligence layer`, status: 'pending', type: 'enrichment' },
        { id: '5', title: 'Export to results dashboard', status: 'pending', type: 'search' },
      ];
      setPlanSteps(steps);
    }
  };

  const handleExecute = async () => {
    setState('executing');
    
    try {
      const response = await fetch('/api/search/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          mode,
          sources,
          enrichmentLevel
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.includes('PLAN_LIMIT_EXCEEDED')) {
          setState('limit_reached');
          return;
        }
        throw new Error('Search protocol failed');
      }
      
      const results = await response.json();
      
      // We can pass results through state or just navigate to results page
      // which should ideally fetch the latest search.
      // For now, let's just complete the UI simulation and then navigate.
      
      let currentStep = 1;
      const interval = setInterval(() => {
        setPlanSteps(prev => prev.map((s, i) => {
          if (i < currentStep) return { ...s, status: 'completed' };
          if (i === currentStep) return { ...s, status: 'active' };
          return s;
        }));
        
        currentStep++;
        if (currentStep > 5) {
          clearInterval(interval);
          setTimeout(() => navigate('/results', { state: { results } }), 500);
        }
      }, 800);

    } catch (error) {
      console.error("Search failed:", error);
      setState('idle');
      alert("Intelligence protocol failed to synchronize. Please check connectivity.");
    }
  };

  const toggleSource = (id: SearchSource) => {
    setSources(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const suggestions = [
    "Find 200 AI app studios in Europe open to startup partnerships",
    "Identify manufacturing companies in Ohio using industrial IoT",
    "Find B2B SaaS marketing leaders in SF with < 50 employees",
    "Locate biotech startups in UK recently funded with Series A"
  ];

  if (state === 'limit_reached') {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-2xl">
          <UpgradePrompt feature="AI Searches" onClose={() => setState('idle')} />
        </div>
      </div>
    );
  }

  if (state !== 'idle') {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {state === 'planning' ? 'Orchestrating Search Strategy...' : 'Executing Intelligence Protocol'}
            </h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              Our AI discovery engine is configuring the optimal sequence of scrapers and enrichment models to fulfill your request.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            {planSteps.length > 0 ? (
              <>
                <SearchPlanPreview 
                  steps={planSteps} 
                  query={query} 
                  isExecuting={state === 'executing'} 
                />
                
                {state === 'planning' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6 w-full max-w-lg"
                  >
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400">
                          <Globe2 className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Efficiency</span>
                        </div>
                        <p className="text-xs font-bold text-white">Estimated Credits: 45</p>
                        <p className="text-[10px] text-zinc-500">Optimized for accuracy</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Layers className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Depth</span>
                        </div>
                        <p className="text-xs font-bold text-white">Coverage: Extensive</p>
                        <p className="text-[10px] text-zinc-500">8 redundant sources</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full">
                      <button 
                        onClick={() => setState('idle')}
                        className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800 transition-all"
                      >
                        Adjust Strategy
                      </button>
                      <button 
                        onClick={handleExecute}
                        className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 group"
                      >
                        <Play className="w-4 h-4 group-hover:scale-110 transition-transform" /> Start Extraction
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-20">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-600 animate-pulse">Brainstorming...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl text-center space-y-10"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-[10px] font-black uppercase text-indigo-400 tracking-widest">
            <Sparkles className="w-3 h-3" />
            AI Discovery Core
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            What are we <span className="text-indigo-400 italic">discovering</span> today?
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Describe the type of companies, contacts, or market intel you need in natural language.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
          <div className="w-full space-y-6">
            <AISearchInput 
              onSearch={handleSearch} 
              placeholder="e.g. Find 50 Fintech startups in London with > $10m revenue..." 
            />
            
            <div className="flex flex-col gap-8">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Search Protocol</span>
                <SearchModeSelector activeMode={mode} onModeChange={setMode} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-800/50">
                <SourceSelector 
                  selectedSources={sources} 
                  onToggleSource={toggleSource} 
                />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Enrichment Level</span>
                    <Settings2 className="w-3 h-3 text-zinc-600" />
                  </div>
                  <div className="flex gap-2">
                    {(['basic', 'pro', 'deep'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setEnrichmentLevel(level)}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          enrichmentLevel === level 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10" 
                            : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                    {enrichmentLevel === 'basic' && 'Essential firmographics only.'}
                    {enrichmentLevel === 'pro' && 'Full contact discovery & news alerts.'}
                    {enrichmentLevel === 'deep' && 'Exhaustive PII, tech-stack & financial data.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Trending Scopes</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSearch(suggestion)}
                className="text-left p-4 rounded-2xl bg-zinc-900/20 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all group flex justify-between items-center"
              >
                <span className="text-sm text-zinc-500 group-hover:text-zinc-200 transition-colors line-clamp-1">{suggestion}</span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

