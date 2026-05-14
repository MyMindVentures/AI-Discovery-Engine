import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import DemoBadge from '../ui/DemoBadge';
import FeedbackWidget from '../feedback/FeedbackWidget';
import LegalFooter from '../legal/LegalFooter';
import { Toaster } from 'sonner';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-black text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Toaster position="top-right" theme="dark" closeButton />
      <Sidebar />
      <main className="flex-1 relative pb-20 md:pb-0 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
            <LegalFooter />
          </motion.div>
        </AnimatePresence>
        <DemoBadge />
        <FeedbackWidget />
      </main>
      <BottomNav />
    </div>
  );
}
