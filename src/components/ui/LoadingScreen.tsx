import { motion } from 'motion/react';
import { Fuel } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-brand-bg/60 backdrop-blur-3xl flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-24 h-24 bg-brand-accent/20 rounded-3xl flex items-center justify-center border border-brand-accent/30"
      >
        <Fuel className="w-12 h-12 text-brand-accent" />
      </motion.div>
      <motion.h1 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-8 text-3xl font-black text-white italic uppercase tracking-tighter"
      >
        FUELX
      </motion.h1>
      <p className="text-brand-text-dim mt-2 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Initializing Neural Core...</p>
    </div>
  );
}
