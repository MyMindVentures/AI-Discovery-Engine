import React from 'react';
import { ExternalLink, Globe, Database, ShieldCheck, Star } from 'lucide-react';
import { Company } from '../../lib/mock-data';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface ResultsTableProps {
  companies: Company[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
}

export default function ResultsTable({ companies, selectedIds, onToggleSelect, onToggleAll }: ResultsTableProps) {
  const allSelected = companies.length > 0 && selectedIds.length === companies.length;

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="pl-6 py-4 w-10">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 transition-all cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Company</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Location</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Tech Stack</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Signals</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Score</th>
              <th className="pr-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {companies.map((company) => {
              const isSelected = selectedIds.includes(company.id);
              return (
                <tr 
                  key={company.id} 
                  className={cn(
                    "hover:bg-zinc-800/30 transition-all group cursor-default",
                    isSelected ? "bg-indigo-600/5" : ""
                  )}
                >
                  <td className="pl-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => onToggleSelect(company.id)}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 transition-all cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 min-w-[240px]">
                    <div className="flex items-center gap-4">
                      <Link to={`/companies/${company.id}`} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all border border-zinc-700">
                        {company.name.charAt(0)}
                      </Link>
                      <div className="flex flex-col">
                        <Link to={`/companies/${company.id}`} className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                          {company.name}
                        </Link>
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-zinc-500 hover:text-indigo-400 flex items-center gap-1 mt-0.5"
                        >
                          {company.website.replace('https://', '')} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 min-w-[180px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-white">{company.city}</span>
                      <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                        {company.country}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 min-w-[200px]">
                    <div className="flex flex-wrap gap-1.5">
                      {company.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[9px] font-bold text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">
                          {tech}
                        </span>
                      ))}
                      {company.technologies.length > 3 && (
                        <span className="text-[9px] font-bold text-zinc-600 px-1">+ {company.technologies.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <Database className="w-3.5 h-3.5 text-indigo-400 mb-0.5" />
                        <span className="text-[9px] font-black text-zinc-500">{company.sourceCount}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
                        <span className="text-[9px] font-black text-zinc-500">{company.confidenceScore}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                      <span className="text-sm font-black text-indigo-400 tracking-tighter">
                        {(company.metadata as any)?.ai_scores?.relevance 
                          ? Math.round((company.metadata as any).ai_scores.relevance * 100) 
                          : company.score}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map(i => {
                          const score = (company.metadata as any)?.ai_scores?.relevance 
                            ? Math.round((company.metadata as any).ai_scores.relevance * 100) 
                            : company.score;
                          return (
                            <Star key={i} className={cn("w-2 h-2", i * 33 <= score ? "text-indigo-400 fill-indigo-400" : "text-zinc-800 fill-zinc-800")} />
                          );
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="pr-6 py-4 text-right">
                    <button className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <Globe className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
