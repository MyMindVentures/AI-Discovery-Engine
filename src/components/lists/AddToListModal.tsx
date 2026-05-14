import React, { useState } from 'react';
import { X, ListPlus, CheckCircle2, ChevronRight, Lock, Globe } from 'lucide-react';
import { mockLists } from '../../lib/mock-data';
import { cn } from '../../lib/utils';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (listId: string) => void;
  count: number;
}

export default function AddToListModal({ isOpen, onClose, onAdd, count }: AddToListModalProps) {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <ListPlus className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Assign Intelligence</h2>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">Moving {count} Entities</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {mockLists.map(list => (
              <button
                key={list.id}
                onClick={() => setSelectedListId(list.id)}
                className={cn(
                  "w-full p-4 rounded-2xl border transition-all flex items-center justify-between group text-left",
                  selectedListId === list.id 
                    ? "bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20" 
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    selectedListId === list.id ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-500"
                  )}>
                    {list.isShared ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={cn("text-sm font-bold", selectedListId === list.id ? "text-white" : "text-zinc-300")}>
                      {list.name}
                    </p>
                    <p className={cn("text-[10px] font-medium", selectedListId === list.id ? "text-white/60" : "text-zinc-500")}>
                      {list.count} existing entities • {list.tags[0] || 'Uncategorized'}
                    </p>
                  </div>
                </div>
                {selectedListId === list.id ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-all translate-x-0 group-hover:translate-x-1" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              onClick={() => {
                if (selectedListId) {
                  onAdd(selectedListId);
                  onClose();
                }
              }}
              disabled={!selectedListId}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
              Commit Assignment <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
