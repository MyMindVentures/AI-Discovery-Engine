import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Code2, 
  Settings2, 
  History as HistoryIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Terminal,
  Cpu,
  RefreshCcw,
  ExternalLink,
  ChevronRight,
  Loader2,
  Trash2,
  Copy,
  AlertTriangle,
  BrainCircuit,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface AiFunctionEditorProps {
  functionKey: string;
  onBack: () => void;
}

export default function AiFunctionEditor({ functionKey, onBack }: AiFunctionEditorProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'test' | 'runs'>('config');
  const [config, setConfig] = useState<any>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Test console state
  const [testVariables, setTestVariables] = useState<string>('{}');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [functionKey]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/ai-functions/${functionKey}`);
      const data = await res.json();
      setConfig(data.config);
      setRuns(data.runs);
      
      // Seed test variables from existing runs if available
      if (data.runs.length > 0 && data.runs[0].input) {
        setTestVariables(JSON.stringify(data.runs[0].input, null, 2));
      }
    } catch (err) {
      console.error("Failed to fetch function data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-functions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!res.ok) throw new Error('Save failed');
      const updated = await res.json();
      setConfig(updated);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const variables = JSON.parse(testVariables);
      const res = await fetch(`/api/admin/ai-functions/${functionKey}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables })
      });
      const data = await res.json();
      setTestResult(data);
      fetchData(); // Refresh runs
    } catch (err) {
      console.error("Test failed", err);
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all hover:border-zinc-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
             <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
               {config?.name}
               {config?.enabled ? (
                 <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md border border-emerald-500/20 tracking-widest font-black uppercase">Live</span>
               ) : (
                 <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-md border border-zinc-700 tracking-widest font-black uppercase">Inactive</span>
               )}
             </h2>
             <p className="text-xs text-zinc-500 font-medium">Neural function core management interface</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="group bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Protocols
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl w-fit">
        {[
          { id: 'config', label: 'Configuration', icon: Settings2 },
          { id: 'test', label: 'Neural Playground', icon: Play },
          { id: 'runs', label: 'Execution Logs', icon: HistoryIcon },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === tab.id 
                ? "bg-zinc-800 text-white shadow-lg" 
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'config' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Panel: Core Settings */}
            <div className="lg:col-span-8 space-y-8">
              <div className="p-10 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl space-y-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Prompt Architecture</h3>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex justify-between">
                    System Instruction
                    <span className="text-zinc-700 italic lowercase tracking-normal">Static context for the model</span>
                  </label>
                  <textarea
                    value={config?.systemPrompt || ''}
                    onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                    className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-sm text-zinc-300 font-medium placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                    placeholder="You are an expert PM..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex justify-between">
                    User Template
                    <span className="text-zinc-700 italic lowercase tracking-normal">Dynamic variables supported: {'{{varName}}'}</span>
                  </label>
                  <textarea
                    value={config?.userPromptTemplate || ''}
                    onChange={(e) => setConfig({ ...config, userPromptTemplate: e.target.value })}
                    className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-sm text-indigo-100/80 font-medium placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                    placeholder="Analyze these inputs: {{userInput}}"
                  />
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">Output Schema (JSON Schema)</h3>
                 </div>
                 <textarea
                    value={typeof config?.outputSchema === 'string' ? config.outputSchema : JSON.stringify(config?.outputSchema || {}, null, 2)}
                    onChange={(e) => setConfig({ ...config, outputSchema: e.target.value })}
                    className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500/50 transition-all resize-none shadow-inner"
                    placeholder="{ ... }"
                 />
              </div>
            </div>

            {/* Right Panel: Model & Logic */}
            <div className="lg:col-span-4 space-y-8">
              <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl space-y-8">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight mb-6">Execution Core</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Model Provider</label>
                      <select 
                        value={config?.provider}
                        onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                      >
                        <option value="gemini">Google Gemini</option>
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Model Engine</label>
                      <input 
                        type="text"
                        value={config?.model}
                        onChange={(e) => setConfig({ ...config, model: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Temperature</label>
                        <input 
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          value={config?.temperature}
                          onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Max Tokens</label>
                        <input 
                          type="number"
                          value={config?.maxTokens}
                          onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-800">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight mb-6">Safety & Logic</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Retry Policy (Count)</label>
                      <input 
                        type="number"
                        min="0"
                        max="10"
                        value={config?.retryCount}
                        onChange={(e) => setConfig({ ...config, retryCount: parseInt(e.target.value) })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Confidence Threshold</label>
                      <input 
                        type="number"
                        step="0.05"
                        min="0"
                        max="1"
                        value={config?.confidenceThreshold}
                        onChange={(e) => setConfig({ ...config, confidenceThreshold: parseFloat(e.target.value) })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fallback Mode</label>
                       <select 
                         value={config?.fallbackMode}
                         onChange={(e) => setConfig({ ...config, fallbackMode: e.target.value })}
                         className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                       >
                         <option value="none">None (Fail)</option>
                         <option value="static">Static Mock</option>
                         <option value="retry_different_model">Retry w/ Different Model</option>
                       </select>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                       <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Status Enabled</span>
                       <button
                         onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                         className={cn(
                           "w-10 h-6 rounded-full transition-colors relative",
                           config?.enabled ? "bg-indigo-600" : "bg-zinc-800"
                         )}
                       >
                         <div className={cn(
                           "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                           config?.enabled ? "right-1" : "left-1"
                         )} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'test' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="p-10 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col h-[700px]">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">Input Variables</h3>
                 </div>
                 <button
                   onClick={handleTest}
                   disabled={testing}
                   className="group bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                 >
                   {testing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                   Execute Neural Test
                 </button>
              </div>
              
              <textarea
                value={testVariables}
                onChange={(e) => setTestVariables(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-xs text-amber-100/70 font-mono focus:outline-none focus:border-amber-500/50 transition-all resize-none shadow-inner"
                placeholder='{ "key": "value" }'
              />
            </div>

            <div className="p-10 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col h-[700px]">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">Neural Output</h3>
                 </div>
                 {testResult && (
                   <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                     Latency: {testResult.latencyMs}ms | Tokens: {Math.round(testResult.tokensUsed)}
                   </span>
                 )}
              </div>
              
              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 overflow-auto font-mono text-xs text-zinc-300">
                {testing ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
                  </div>
                ) : testResult ? (
                  <pre>{typeof testResult.result === 'string' ? testResult.result : JSON.stringify(testResult.result, null, 2)}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 text-center space-y-4">
                    <Activity className="w-12 h-12 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-40 leading-relaxed">Awaiting Neural Execution Flow</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'runs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-10 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl min-h-[600px]"
          >
             <h3 className="text-sm font-black text-white uppercase tracking-tight mb-8">Recent Execution History</h3>
             <div className="overflow-hidden border border-zinc-800 rounded-2xl">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-zinc-950/50 border-b border-zinc-800">
                     <th className="py-4 px-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Status</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Timeline</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Latency</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Load</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase text-zinc-600 tracking-widest text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-800/50">
                    {runs.map(run => (
                      <tr key={run.id} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="py-4 px-6">
                           <div className={cn(
                             "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                             run.status === 'success' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                           )}>
                             {run.status === 'success' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                             {run.status}
                           </div>
                        </td>
                        <td className="py-4 px-6 text-[10px] font-medium text-zinc-500 italic">
                          {run.createdAt ? new Date(run.createdAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-[10px] font-bold text-white">
                          {run.latencyMs}ms
                        </td>
                        <td className="py-4 px-6 text-[10px] font-mono text-zinc-600">
                          {run.tokensUsed} tokens
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => {
                              setTestVariables(JSON.stringify(run.input, null, 2));
                              setTestResult({ result: run.output, latencyMs: run.latencyMs, tokensUsed: run.tokensUsed });
                              setActiveTab('test');
                            }}
                            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
                          >
                             <RefreshCcw className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
