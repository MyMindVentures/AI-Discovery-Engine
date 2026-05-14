import { ExternalLink, MapPin, Users, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Company } from '../../lib/mock-data';
import { Link } from 'react-router-dom';
import { Card3D } from './Card3D';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

export default function CompanyCard({ company, className }: CompanyCardProps) {
  const relevance = (company.metadata as any)?.ai_scores?.relevance 
    ? Math.round((company.metadata as any).ai_scores.relevance * 100) 
    : company.score;

  return (
    <Card3D 
      className={cn("p-6 flex flex-col h-full group relative", className)}
      variant="default"
      depth="md"
      glow
    >
      <Link to={`/companies/${company.id}`} className="absolute inset-0 z-0" />
      
      <div className="flex justify-between items-start gap-4 mb-6 relative z-10 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-xl text-indigo-400 border border-zinc-700 shadow-inner group-hover:scale-105 group-hover:border-indigo-500/50 transition-all duration-500">
            {company.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
              {company.name}
            </h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">{company.industry}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]">
            {relevance}% MATCH
          </div>
        </div>
      </div>

      <div className="relative z-10 pointer-events-none flex-1 mb-6">
        <p className="text-sm text-zinc-400 line-clamp-3 italic font-medium leading-relaxed">
          "{company.description}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-y-4 mb-8 relative z-10 pointer-events-none">
        <div className="flex items-center gap-2.5 text-xs text-zinc-500 font-medium">
          <div className="w-6 h-6 rounded-lg bg-zinc-800/80 flex items-center justify-center border border-zinc-700/50">
            <MapPin className="w-3 h-3" />
          </div>
          <span>{company.location}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-zinc-500 font-medium">
          <div className="w-6 h-6 rounded-lg bg-zinc-800/80 flex items-center justify-center border border-zinc-700/50">
            <Users className="w-3 h-3" />
          </div>
          <span>{company.size}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 relative z-10 pointer-events-none">
        {company.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mt-auto relative z-10">
        <a 
          href={company.website} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 text-white text-[11px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all border border-zinc-700 hover:border-white shadow-lg"
        >
          Website <ExternalLink className="w-3 h-3" />
        </a>
        <Link 
          to={`/companies/${company.id}`}
          className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white flex items-center gap-2 transition-all group/link"
        >
          Details 
          <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover/link:bg-indigo-600 transition-colors">
            <ArrowRight className="w-3 h-3 text-indigo-400 group-hover/link:text-white" />
          </div>
        </Link>
      </div>
    </Card3D>
  );
}
