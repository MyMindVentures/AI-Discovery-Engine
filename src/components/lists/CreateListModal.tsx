import React, { useState } from 'react';
import { X, Layout, Type, AlignLeft, Shield, Send } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (list: { name: string; description: string; isShared: boolean }) => void;
}

export default function CreateListModal({ isOpen, onClose, onCreate }: CreateListModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isShared, setIsShared] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Layout className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Create Intelligence List</h2>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Initialize New Segment</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] px-1">
                <Type className="w-3 h-3" /> List Identity
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Q2 Strategic Targets"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] px-1">
                <AlignLeft className="w-3 h-3" /> Strategic Context
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Define the purpose of this collection..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-700 min-h-[120px] resize-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                  isShared ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                )}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Collaboration Protocol</p>
                  <p className="text-[10px] text-zinc-500">Enable shared access for team nodes</p>
                </div>
              </div>
              <button 
                onClick={() => setIsShared(!isShared)}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none",
                  isShared ? "bg-indigo-600" : "bg-zinc-800"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200",
                  isShared ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs hover:border-zinc-700 hover:text-white transition-all uppercase tracking-[0.2em]"
            >
              Abort
            </button>
            <button 
              onClick={() => {
                if (name) onCreate({ name, description, isShared });
              }}
              className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
            >
              Initialize Node <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
