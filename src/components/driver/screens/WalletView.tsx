import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Coins, Zap, ShieldAlert } from 'lucide-react';

export function WalletView() {
  const [balance, setBalance] = useState(42500);

  const handleRecharge = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-10 p-6 lg:p-0 pb-24 lg:pb-0">
       <div className="glass rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-brand-text relative shadow-2xl overflow-hidden self-start">
          <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5">
            <CreditCard className="w-40 h-40 md:w-56 md:h-56" />
          </div>
          <div className="relative z-10">
             <div className="flex justify-between items-center mb-10 md:mb-16">
                <div className="text-[8px] md:text-[10px] font-black uppercase text-brand-text-dim tracking-[0.4em]">Energy Credits</div>
                <div className="p-2 md:p-3 bg-brand-accent/20 rounded-xl">
                  <Coins className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />
                </div>
             </div>
             <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 tracking-tighter italic text-brand-text">
              {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
             </div>
             <div className="text-[10px] md:text-xs text-brand-text-dim mb-10 md:mb-12 uppercase tracking-widest font-black">PKR Settlement Balance</div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleRecharge(1000)}
                  className="py-4 bg-white text-brand-bg rounded-[1.25rem] font-black italic uppercase tracking-widest text-[10px] hover:bg-brand-accent hover:text-white transition-all transform active:scale-95"
                >
                  Recharge 1k
                </button>
                <button className="py-4 glass rounded-[1.25rem] font-black italic uppercase tracking-widest text-[10px] hover:border-brand-accent transition-all">
                  Export Logs
                </button>
             </div>
          </div>
       </div>

       <div className="space-y-8 flex flex-col">
          {/* Quick Recharge Section */}
          <div className="glass p-8 rounded-[2.5rem] border-brand-accent/10">
             <div className="flex items-center gap-3 mb-6">
                <Zap className="w-4 h-4 text-brand-accent" />
                <div className="text-[10px] font-black text-brand-text uppercase tracking-[0.2em]">Quick Recharge</div>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[500, 1000, 2500, 5000].map(amount => (
                   <button
                     key={amount}
                     onClick={() => handleRecharge(amount)}
                     className="flex flex-col items-center justify-center py-4 rounded-2xl glass-light border-brand-border/40 hover:border-brand-accent hover:bg-brand-accent/5 transition-all group"
                   >
                      <span className="text-[8px] font-black text-brand-text-dim uppercase mb-1">PKR</span>
                      <span className="text-lg font-black italic tracking-tighter text-brand-text group-hover:text-brand-accent">{amount}</span>
                   </button>
                ))}
             </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem]">
             <div className="flex items-center justify-between mb-6">
                <div className="text-[10px] font-black text-brand-text-dim uppercase tracking-[0.2em]">Tier Status</div>
                <span className="px-2 py-0.5 bg-brand-accent/20 text-brand-accent rounded text-[9px] font-black uppercase tracking-widest border border-brand-accent/20">Nitro Platinum</span>
             </div>
             <p className="text-brand-text-muted italic text-sm leading-relaxed">
                Your premium loyalty tier unlocks <span className="text-white font-bold">0.5% cashback</span> on all Hi-Octane refills.
             </p>
          </div>

          <div className="urgent-alert p-10 rounded-[2.5rem]">
             <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest italic">BNPL Limit Alert</div>
                <ShieldAlert className="w-5 h-5 text-red-500" />
             </div>
             <div className="text-3xl font-black text-white italic tracking-tighter mb-2">PKR 15,000</div>
             <p className="text-brand-text-muted text-[11px] leading-relaxed font-semibold uppercase tracking-wide">
                Unlock interest-free credits for refueling at any shell hub within the next 24 hours.
             </p>
          </div>
       </div>
    </div>
  );
}
