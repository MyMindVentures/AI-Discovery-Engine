import React, { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { 
  Key, 
  Terminal, 
  Code, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Shield, 
  Lock, 
  Globe, 
  Database, 
  Activity,
  ChevronRight,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { userService } from '../services/userService';

export default function DeveloperPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['read:companies']);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const data = await userService.getApiKeys('org_1');
      setKeys(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch keys", err);
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const createKey = async () => {
    try {
      const data = await userService.createApiKey({ 
        organizationId: 'org_1',
        name: newKeyName, 
        scopes: newKeyScopes 
      });
      setGeneratedKey(data.rawKey);
      fetchKeys();
    } catch (err) {
      console.error("Failed to create key", err);
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Are you sure? This action is irreversible.")) return;
    try {
      await userService.deleteApiKey(id);
      fetchKeys();
    } catch (err) {
      console.error("Failed to delete key", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const availableScopes = [
    { id: 'read:companies', name: 'Read Companies', desc: 'Allows access to company data' },
    { id: 'read:contacts', name: 'Read Contacts', desc: 'Allows access to filtered contact info' },
    { id: 'search:run', name: 'Run Search', desc: 'Trigger AI discovery protocols' },
    { id: 'export:create', name: 'Create Export', desc: 'Initiate dataset generation' },
    { id: 'admin:read', name: 'Admin Read', desc: 'Read internal job status and stats' }
  ];

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-12">
      <PageHeader 
        title="Developer Console" 
        description="Integrate AI Discovery protocols into your own systems via REST and GraphQL."
        actions={
          <button 
            onClick={() => {
              setGeneratedKey(null);
              setShowCreateModal(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> Create API Key
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Keys Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-600/20">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Access Tokens</h3>
              </div>
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                {keys.length} Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-900/30">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Key Name</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Scope Node</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Last Burst</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <Activity className="w-8 h-8 text-zinc-800 animate-pulse mx-auto mb-2" />
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest leading-none">Syncing keys...</span>
                      </td>
                    </tr>
                  ) : keys.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <Lock className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-none">No access tokens established.</p>
                      </td>
                    </tr>
                  ) : keys.map(key => (
                    <tr key={key.id} className="hover:bg-zinc-800/20 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white leading-tight">{key.name}</span>
                          <span className="text-[10px] font-mono text-zinc-600 tracking-tighter">{key.keyHint || `${key.key?.substring(0, 4)}...`}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-1">
                          {(key.scopes || []).map((sc: string) => (
                            <span key={sc} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[8px] font-black uppercase tracking-widest border border-zinc-700/50">
                              {sc.includes(':') ? sc.split(':')[1] : sc}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-mono text-zinc-500 italic">
                          {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => deleteKey(key.id)}
                          className="p-2 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quickstart Documentation */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center gap-3">
              <Terminal className="w-4 h-4" /> Protocol Integration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4 hover:border-zinc-700 transition-all cursor-pointer group">
                 <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform">
                   <Globe className="w-5 h-5" />
                 </div>
                 <h4 className="text-md font-bold text-white">REST API v1</h4>
                 <p className="text-xs text-zinc-500 leading-relaxed italic">Standard HTTP endpoints for crud operations and discovery triggers.</p>
                 <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 tracking-widest group-hover:translate-x-1 transition-transform">
                   Explore Endpoints <ChevronRight className="w-3 h-3" />
                 </div>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4 hover:border-zinc-700 transition-all cursor-pointer group">
                 <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                   <ChevronRight className="w-5 h-5" />
                 </div>
                 <h4 className="text-md font-bold text-white">GraphQL Hub</h4>
                 <p className="text-xs text-zinc-500 leading-relaxed italic">Powerful query language to fetch exactly what you need in one request.</p>
                 <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase text-indigo-500 tracking-widest group-hover:translate-x-1 transition-transform">
                   View Schema <ChevronRight className="w-3 h-3" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Code Samples */}
        <div className="space-y-6">
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur-md space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Protocol Node: cURL</span>
                <button className="text-[10px] font-black uppercase text-indigo-400 hover:underline tracking-widest">Node.js</button>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-zinc-800 font-mono text-[10px] text-zinc-400 relative group overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                <pre className="whitespace-pre-wrap break-all leading-relaxed">
                  {`curl -X GET "https://api.discovery.ai/v1/companies" \\
  -H "Authorization: Bearer YOUR_SK_KEY" \\
  -H "Content-Type: application/json"`}
                </pre>
                <button 
                  onClick={() => copyToClipboard(`curl -X GET "https://api.discovery.ai/v1/companies" -H "Authorization: Bearer YOUR_SK_KEY"`)}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 opacity-0 group-hover:opacity-100 transition-all hover:text-white"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Protocol Node: GraphQL</span>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-zinc-800 font-mono text-[10px] text-zinc-400 relative group overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {`query {
  companies(limit: 5) {
    name
    industry
    tags { name }
  }
}`}
                </pre>
                <button 
                  onClick={() => copyToClipboard(`query { companies(limit: 5) { name industry tags { name } } }`)}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 opacity-0 group-hover:opacity-100 transition-all hover:text-white"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Connection Diagnostics</h4>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-xs font-bold italic">
                   <span className="text-zinc-600">Rate Limit Status</span>
                   <span className="text-emerald-400">Stable (1000/hr)</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold italic">
                   <span className="text-zinc-600">Uptime Latency</span>
                   <span className="text-zinc-400">142ms</span>
                 </div>
                 <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden flex gap-0.5">
                   {Array.from({ length: 40 }).map((_, i) => (
                     <div key={i} className={cn("flex-1 h-full", Math.random() > 0.1 ? "bg-emerald-500/20" : "bg-zinc-800")} />
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="px-10 py-10 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Initiate Access Fragment</h3>
                  <p className="text-sm text-zinc-500 italic">Define scope and identity for this protocol node.</p>
                </div>

                {generatedKey ? (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-600/20 space-y-4">
                       <div className="flex items-center gap-2 text-amber-500">
                         <Shield className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest leading-none">Security Warning</span>
                       </div>
                       <p className="text-xs text-zinc-400 italic">This key will only be shown ONCE. Store it in a secure hardware module or vault.</p>
                       <div className="p-4 rounded-2xl bg-black border border-zinc-800 font-mono text-sm text-indigo-400 break-all select-all flex items-center justify-between">
                         {generatedKey}
                         <button 
                           onClick={() => copyToClipboard(generatedKey)}
                           className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500"
                         >
                           <Copy className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowCreateModal(false)}
                      className="w-full py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-all shadow-xl"
                    >
                      Protocol Locked
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest px-1">Identifier</label>
                      <input 
                        type="text" 
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g. CI/CD Enforcer"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest px-1">Capability Matrix</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                        {availableScopes.map(scope => (
                          <label 
                            key={scope.id}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
                              newKeyScopes.includes(scope.id) 
                                ? "bg-indigo-600/10 border-indigo-600/30 ring-1 ring-indigo-500/20" 
                                : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                            )}
                          >
                            <input 
                              type="checkbox"
                              className="hidden"
                              checked={newKeyScopes.includes(scope.id)}
                              onChange={(e) => {
                                if (e.target.checked) setNewKeyScopes([...newKeyScopes, scope.id]);
                                else setNewKeyScopes(newKeyScopes.filter(s => s !== scope.id));
                              }}
                            />
                            <div className="flex-1">
                              <div className="text-xs font-bold text-white">{scope.name}</div>
                              <div className="text-[10px] text-zinc-600 italic tracking-tight">{scope.desc}</div>
                            </div>
                            <div className={cn(
                              "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                              newKeyScopes.includes(scope.id) ? "bg-indigo-500 border-indigo-500 text-white" : "border-zinc-700 text-transparent"
                            )}>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={createKey}
                      disabled={!newKeyName}
                      className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-2xl shadow-indigo-500/40 active:scale-[0.98]"
                    >
                      Establish Connection
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

