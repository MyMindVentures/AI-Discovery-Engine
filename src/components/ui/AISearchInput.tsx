import { Search, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AISearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function AISearchInput({ placeholder, onSearch, className }: AISearchInputProps) {
  return (
    <div className={cn("relative group max-w-2xl w-full", className)}>
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Sparkles className="w-5 h-5 text-indigo-500/70" />
      </div>
      <input
        type="text"
        placeholder={placeholder || "Search anything with AI..."}
        className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 font-medium"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearch) {
            onSearch(e.currentTarget.value);
          }
        }}
      />
      <div className="absolute inset-y-0 right-4 flex items-center">
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-500 font-sans uppercase">
          Enter
        </kbd>
      </div>
    </div>
  );
}
