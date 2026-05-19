import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function StatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={isOnline ? 'online' : 'offline'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all",
          isOnline 
            ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-lg shadow-green-500/5" 
            : "bg-red-500/10 border-red-500/20 text-red-500 shadow-lg shadow-red-500/5 animate-pulse"
        )}
      >
        {isOnline ? (
          <>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <Wifi className="w-3 h-3" />
            <span>Cloud Matrix Sync</span>
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            <WifiOff className="w-3 h-3" />
            <span>Local Node Mode</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
