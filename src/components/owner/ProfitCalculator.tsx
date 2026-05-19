import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, DollarSign, TrendingUp, X } from 'lucide-react';

interface ProfitCalculatorProps {
  onClose: () => void;
}

export function ProfitCalculator({ onClose }: ProfitCalculatorProps) {
  const [liters, setLiters] = useState<string>('');
  const [purchaseRate, setPurchaseRate] = useState<string>('');
  const [markup, setMarkup] = useState<string>('');
  
  const petrolLiters = parseFloat(liters) || 0;
  const buyPrice = parseFloat(purchaseRate) || 0;
  const profitPerLiter = parseFloat(markup) || 0;
  
  const totalCost = petrolLiters * buyPrice;
  const totalProfit = petrolLiters * profitPerLiter;
  const totalRevenue = totalCost + totalProfit;

  return (
    <div 
      className="glass p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-brand-accent/30 w-full shadow-2xl overflow-y-auto max-h-[95vh] custom-scrollbar"
    >
      <div className="flex justify-between items-center mb-4 md:mb-8">
        <h3 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2 md:gap-3 text-brand-text">
          <Calculator className="w-4 h-4 md:w-6 md:h-6 text-brand-accent" />
          Profit Engine
        </h3>
        <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-full text-brand-text-dim active:scale-90 transition-transform">
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      <div className="space-y-3 md:space-y-6">
        <div>
          <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-text-dim mb-1 md:mb-2 block px-1">Total Stock (Liters)</label>
          <input 
            type="number" 
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full bg-brand-bg/50 border border-white/5 rounded-xl px-4 py-2 md:py-3 text-brand-text outline-none focus:border-brand-accent transition-all text-xs md:text-base h-10 md:h-auto"
          />
        </div>

        <div>
           <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-text-dim mb-1 md:mb-2 block px-1">Purchase Rate (per L)</label>
          <input 
            type="number" 
            value={purchaseRate}
            onChange={(e) => setPurchaseRate(e.target.value)}
            placeholder="e.g. 250"
            className="w-full bg-brand-bg/50 border border-white/5 rounded-xl px-4 py-2 md:py-3 text-brand-text outline-none focus:border-brand-accent transition-all text-xs md:text-base h-10 md:h-auto"
          />
        </div>

        <div>
           <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-text-dim mb-1 md:mb-2 block px-1">Markup / Profit (per L)</label>
          <input 
            type="number" 
            value={markup}
            onChange={(e) => setMarkup(e.target.value)}
            placeholder="e.g. 15"
            className="w-full bg-brand-bg/50 border border-white/5 rounded-xl px-4 py-2 md:py-3 text-brand-text outline-none focus:border-brand-accent transition-all text-xs md:text-base h-10 md:h-auto"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-4 mt-6 md:mt-10">
          <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl">
            <div className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-brand-text-dim mb-1">Stock Value</div>
            <div className="text-sm md:text-lg font-bold text-brand-text truncate">PKR {totalCost.toLocaleString()}</div>
          </div>
          <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl border-green-500/20 bg-green-500/5">
            <div className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-green-500 mb-1">Net Profit</div>
            <div className="text-sm md:text-lg font-bold text-green-500 truncate">PKR {totalProfit.toLocaleString()}</div>
          </div>
        </div>

        <div className="glass p-3 md:p-6 rounded-xl md:rounded-2xl border-brand-accent/20 bg-brand-accent/5">
          <div className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-brand-accent mb-1">Expected Revenue</div>
          <div className="text-xl md:text-3xl font-black italic tracking-tighter text-brand-text">PKR {totalRevenue.toLocaleString()}</div>
        </div>

        <div className="text-[8px] md:text-[10px] text-brand-text-dim italic text-center pt-2">
          *Calculated: {petrolLiters}L @ PKR {(buyPrice + profitPerLiter).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
