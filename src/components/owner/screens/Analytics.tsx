import React from 'react';
import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../../../lib/utils';

export function Analytics() {
  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Business Analytics</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 glass rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-text-dim">Last 7 Days</button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-accent">Live Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
         <div className="lg:col-span-2 glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-brand-border/10">
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-brand-text-dim mb-6 md:mb-8">Revenue vs Volume (Weekly)</h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={[
                    { name: 'Mon', rev: 4000, vol: 2400 },
                    { name: 'Tue', rev: 3000, vol: 1398 },
                    { name: 'Wed', rev: 2000, vol: 9800 },
                    { name: 'Thu', rev: 2780, vol: 3908 },
                    { name: 'Fri', rev: 1890, vol: 4800 },
                    { name: 'Sat', rev: 2390, vol: 3800 },
                    { name: 'Sun', rev: 3490, vol: 4300 },
                  ]}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--color-brand-accent)" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="var(--color-brand-accent)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} stroke="rgba(255,255,255,0.2)" />
                     <Tooltip contentStyle={{ background: '#000', border: 'none', borderRadius: '12px' }} />
                     <Area type="monotone" dataKey="rev" stroke="var(--color-brand-accent)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-brand-border/10 flex flex-col">
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-brand-text-dim mb-6 md:mb-8">Fuel Distribution</h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
               {[
                 { label: 'Petrol', val: 65, color: 'bg-brand-accent' },
                 { label: 'Diesel', val: 25, color: 'bg-yellow-500' },
                 { label: 'Electric', val: 10, color: 'bg-green-500' },
               ].map((f, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span>{f.label}</span>
                       <span className="text-brand-text-dim">{f.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-brand-border/20 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${f.val}%` }}
                         className={cn("h-full", f.color)}
                       />
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-8 pt-8 border-t border-brand-border/10 text-center">
               <div className="text-2xl font-black italic tracking-tighter">14,203L</div>
               <div className="text-[9px] uppercase font-black text-brand-text-dim">Total Volume Today</div>
            </div>
         </div>
      </div>
    </div>
  );
}
