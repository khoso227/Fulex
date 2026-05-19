import { motion } from 'motion/react';
import { Fuel } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Fuel className="w-16 h-16 text-orange-500" />
      </motion.div>
      <motion.h1 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-6 text-2xl font-bold text-white tracking-widest text-uppercase"
      >
        FUELX
      </motion.h1>
      <p className="text-slate-400 mt-2 text-sm">Fueling the future...</p>
    </div>
  );
}
