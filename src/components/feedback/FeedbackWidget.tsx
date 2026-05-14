import React, { useState } from 'react';
import { MessageSquare, X, Send, Command, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { feedbackAiService } from '../../lib/ai/feedbackAiService';
import { cn } from '../../lib/utils';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Transform feedback with AI (Client-side)
      const aiInsights = await feedbackAiService.transformFeedback(feedback);

      // 2. Submit to Backend
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawFeedback: feedback,
          pageUrl: window.location.href,
          ...aiInsights
        })
      });

      if (!res.ok) throw new Error('Submission failed');

      setIsSuccess(true);
      setFeedback('');
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">System Feedback</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isSuccess ? (
                <div className="py-8 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </motion.div>
                  <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-tight">Signal Received</h4>
                  <p className="text-zinc-500 text-[10px] font-medium leading-relaxed">
                    Our AI core is processing your input for system optimization.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-[10px] font-medium text-zinc-500 mb-4 leading-relaxed">
                    Signal your thoughts. Our AI will translate them into professional system protocols.
                  </p>
                  
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="The dashboard feels a bit cluttered on mobile..."
                    className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-all resize-none mb-4 font-medium"
                    disabled={isSubmitting}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting || !feedback.trim()}
                    className={cn(
                      "w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 h-11",
                      isSubmitting 
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                        : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        Transmit Signal
                      </>
                    )}
                  </button>
                  
                  <div className="mt-4 flex items-center justify-center gap-1.5 opacity-20">
                    <Command className="w-2.5 h-2.5 text-white" />
                    <span className="text-[8px] font-black uppercase text-white tracking-[0.2em]">Neural Feedback Bridge</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90 border",
          isOpen 
            ? "bg-zinc-950 border-zinc-800 text-zinc-400 rotate-90" 
            : "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-indigo-500/30"
        )}
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
