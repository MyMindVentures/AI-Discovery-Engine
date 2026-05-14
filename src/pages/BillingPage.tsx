import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import PageHeader from '../components/ui/PageHeader';
import { CreditCard, Check, Zap, Shield, Crown, TrendingUp, RefreshCw } from 'lucide-react';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { Card3D } from '../components/ui/Card3D';
import { billingService } from '../services/billingService';
import { cn } from '../lib/utils';

export default function BillingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBilling = async () => {
    try {
      setLoading(true);
      const usage = await billingService.getUsage('org_1'); // Correctly using org_1
      setData(usage);
    } catch (err) {
      console.error("Failed to fetch billing", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleSubscribe = async (plan: string) => {
    setUpdating(plan);
    try {
      await billingService.subscribe('org_1', plan);
      await fetchBilling();
    } catch (err) {
      console.error("Failed to update plan", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const plans = [
    { 
      id: 'free',
      name: 'Free', 
      price: '$0', 
      limit: '10 Searches', 
      features: ['Basic Search', 'Low Priority', '1 Export/mo'],
      current: data?.planType === 'free'
    },
    { 
      id: 'starter',
      name: 'Starter', 
      price: '$49', 
      limit: '100 Searches', 
      features: ['Standard Priority', '10 Exports/mo', '5 Monitoring Nodes'],
      current: data?.planType === 'starter'
    },
    { 
      id: 'pro',
      name: 'Pro', 
      price: '$149', 
      limit: '1,000 Searches', 
      features: ['High Priority', '100 Exports/mo', '50 Monitoring Nodes', 'API Access'],
      current: data?.planType === 'pro'
    },
    { 
      id: 'team',
      name: 'Team', 
      price: '$499', 
      limit: '10,000 Searches', 
      features: ['Priority Support', 'Unlimited Exports', '500 Monitoring Nodes', 'Custom Scraping'],
      current: data?.planType === 'team'
    }
  ];

  const usage = {
    searches: data?.usage?.searches || 0,
    exports: data?.usage?.exports || 0,
    monitoring: data?.usage?.monitoring || 0,
    api_calls: data?.usage?.api_calls || 0,
    scraping_records: data?.usage?.scraping_records || 0
  };

  const currentPlan = data?.plan || { 
    limits: { 
      searches: 10, 
      exports: 1, 
      scraping_records: 0, 
      api_calls: 100 
    } 
  };
  
  if (!currentPlan.limits) currentPlan.limits = { searches: 10, exports: 1, scraping_records: 0, api_calls: 100 };

  const searchPercent = Math.min(100, (usage.searches / (currentPlan.limits.searches || 1)) * 100);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader 
        title="Subscription" 
        description="Deployment of intelligence resources scales with your requirements."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {plans.map(plan => (
          <InteractiveCard 
            key={plan.id}
            depth={plan.current ? "lg" : "md"}
            variant={plan.current ? "premium" : "admin"}
            glow={plan.current}
            className={cn(
              "p-8 flex flex-col h-full relative",
              plan.current && "ring-2 ring-indigo-500/50 shadow-[0_20px_50px_-10px_rgba(79,70,229,0.4)]"
            )}
          >
            <div className="mb-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  plan.current ? "bg-white/20 border-white/30 text-white" : "bg-black/40 border-zinc-800 text-zinc-500"
                )}>
                  {plan.name}
                </span>
                {plan.current && <Crown className="w-5 h-5 text-white animate-pulse" />}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black tracking-tight text-white">{plan.price}</span>
                <span className="text-[11px] font-black opacity-40 uppercase tracking-[0.2em] text-zinc-400">/month</span>
              </div>
              <p className={cn("mt-6 text-[10px] font-black uppercase tracking-[0.2em]", plan.current ? "text-indigo-200" : "text-indigo-400")}>
                {plan.limit}
              </p>
            </div>

            <div className="flex-1 space-y-4 mb-10 relative z-10">
              {plan.features.map(feature => (
                <div key={feature} className="flex items-start gap-3">
                  <div className={cn(
                    "mt-1 p-0.5 rounded-full shrink-0",
                    plan.current ? "bg-white/20" : "bg-indigo-500/10"
                  )}>
                    <Check className={cn("w-3 h-3", plan.current ? "text-white" : "text-indigo-400")} />
                  </div>
                  <span className={cn("text-[12px] font-bold leading-snug", plan.current ? "text-white/90" : "text-zinc-500")}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => !plan.current && handleSubscribe(plan.id)}
              disabled={plan.current || !!updating}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all h-14 flex items-center justify-center relative z-10",
                plan.current 
                  ? "bg-white text-indigo-600 opacity-60 cursor-default shadow-lg" 
                  : "bg-zinc-800 text-white border border-zinc-700 hover:bg-white hover:text-black hover:border-white active:scale-95 shadow-xl"
              )}
            >
              {updating === plan.id ? <RefreshCw className="w-5 h-5 animate-spin" /> : (plan.current ? "Active Protocol" : "Deploy Plan")}
            </button>
          </InteractiveCard>
        ))}
      </div>

      <Card3D className="p-12 relative overflow-hidden" depth="lg" interactive={false}>
        {/* Decorative background pulse */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Intelligence Consumption</h2>
              <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Real-time resource utilization</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                       <span className="text-xs font-black uppercase text-zinc-500 tracking-widest block mb-1">Search Capacity</span>
                       <span className="text-2xl font-bold text-white tracking-tighter">
                         {(usage.searches || 0).toLocaleString()} <span className="text-zinc-600">/ {currentPlan.limits.searches === Infinity ? '∞' : (currentPlan.limits.searches || 0).toLocaleString()}</span>
                       </span>
                     </div>
                     <span className="text-xs font-bold text-indigo-400">{searchPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${searchPercent}%` }}
                        className={cn(
                          "h-full rounded-full transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]",
                          searchPercent > 90 ? "bg-rose-500" : searchPercent > 70 ? "bg-amber-500" : "bg-emerald-500"
                        )} 
                     />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">Next cycle begins in 14 days</p>
                    {searchPercent > 80 && (
                      <span className="text-[9px] font-black uppercase text-amber-500 animate-pulse">Running Low</span>
                    )}
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-6 pt-4">
                  {[
                    { label: 'Exfiltration', value: usage.exports, limit: currentPlan.limits.exports, color: 'text-blue-400' },
                    { label: 'Cloud Scans', value: usage.scraping_records, limit: currentPlan.limits.scraping_records, color: 'text-purple-400' },
                    { label: 'API Calls', value: usage.api_calls, limit: currentPlan.limits.api_calls, color: 'text-zinc-400' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest block mb-1">{stat.label}</span>
                      <div className="flex items-baseline gap-1">
                        <span className={cn("text-lg font-bold", stat.color)}>{(stat.value || 0).toLocaleString()}</span>
                        <span className="text-[9px] text-zinc-700 font-bold">/ {stat.limit === Infinity ? '∞' : (stat.limit || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-5">
              <InteractiveCard className="p-8 h-full flex flex-col justify-between" depth="sm">
                <div>
                   <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-8">Subscription Node</h3>
                   <div className="space-y-6">
                     <div className="flex items-center justify-between py-1 border-b border-zinc-900">
                       <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Provider</span>
                       <span className="text-xs font-bold text-white uppercase">Stripe Core</span>
                     </div>
                     <div className="flex items-center justify-between py-1 border-b border-zinc-900">
                       <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Method</span>
                       <span className="text-xs font-bold text-white flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-zinc-700" /> •••• 4242
                       </span>
                     </div>
                     <div className="flex items-center justify-between py-1 border-b border-zinc-900">
                       <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Renewal</span>
                       <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">Aug 12, 2026</span>
                     </div>
                   </div>
                </div>
                
                <button className="w-full mt-12 py-4 rounded-2xl bg-zinc-800 border border-zinc-700 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all shadow-xl">
                  Node Configuration
                </button>
              </InteractiveCard>
            </div>
          </div>
        </div>
      </Card3D>
    </div>
  );
}
