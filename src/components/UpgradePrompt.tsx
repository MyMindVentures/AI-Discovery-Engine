import { AlertCircle, Zap, Shield, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  feature: string;
  onClose?: () => void;
}

export default function UpgradePrompt({ feature, onClose }: UpgradePromptProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 text-center">
      <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-rose-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Plan Limit Reached</h3>
      <p className="text-zinc-400 text-sm mb-8 max-w-sm mx-auto">
        Your current plan has reached its capacity for <span className="text-white font-bold">{feature}</span>. 
        Expand your intelligence capabilities by upgrading your sub-system node.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          onClick={onClose}
          className="px-6 py-3 rounded-xl bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 transition-all"
        >
          Dismiss Request
        </button>
        <button 
          onClick={() => navigate('/billing')}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-3 h-3" />
          Expand Capacity
        </button>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-10">
        <div className="flex flex-col items-center">
          <Shield className="w-4 h-4 text-indigo-400 mb-2 opacity-50" />
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Priority</span>
        </div>
        <div className="flex flex-col items-center">
          <Crown className="w-4 h-4 text-amber-400 mb-2 opacity-50" />
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Unlimited</span>
        </div>
      </div>
    </div>
  );
}
