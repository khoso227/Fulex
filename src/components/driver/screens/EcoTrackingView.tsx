import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Droplets, Zap, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function EcoTrackingView() {
  const stats = [
    { label: 'CO2 Saved', val: '420 kg', icon: Leaf, color: 'text-green-500' },
    { label: 'Fuel Saved', val: '140 Liters', icon: Droplets, color: 'text-brand-accent' },
    { label: 'Efficiency', val: '9.2 km/kWh', icon: Zap, color: 'text-yellow-500' },
  ];

  const leaderboard = [
    { rank: 1, name: 'You', score: 98, trend: 'up' },
    { rank: 2, name: 'Hamza A.', score: 95, trend: 'up' },
    { rank: 3, name: 'Sara K.', score: 92, trend: 'down' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 p-6 lg:p-0 pb-24 lg:pb-0">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto border border-green-500/20 shadow-2xl shadow-green-500/10">
          <Leaf className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Green Miles Report</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-brand-text-dim text-[10px] font-black uppercase tracking-[0.3em]">Live Carbon Impact Matrix</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] border-brand-border/10 text-center space-y-4 hover:border-green-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <s.icon className="w-24 h-24 rotate-12" />
            </div>
            <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto transition-transform group-hover:rotate-12", s.color)}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black italic tracking-tighter text-brand-text">{s.val}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-brand-text-dim mt-1">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[3rem] border-brand-border/10 space-y-8">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-text-dim">Efficiency Milestones</h3>
          <div className="space-y-8">
             {[
               { label: 'Hyper-Miler Pro', progress: 85, badge: 'Level 4', icon: Zap },
               { label: 'Grid Guardian', progress: 40, badge: 'Level 2', icon: ShieldCheck },
             ].map((m, i) => (
               <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-accent">
                           <m.icon className="w-4 h-4" />
                        </div>
                        <div className="font-black italic text-lg">{m.label}</div>
                     </div>
                     <div className="text-[9px] font-black uppercase px-3 py-1 bg-green-500/10 text-green-500 rounded-lg border border-green-500/10">
                        {m.badge}
                     </div>
                  </div>
                  <div className="h-2 w-full bg-brand-border/20 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${m.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                     />
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border-brand-border/10">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-text-dim">Community Ranking</h3>
              <Activity className="w-4 h-4 text-brand-accent" />
           </div>
           <div className="space-y-4">
              {leaderboard.map((u, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-2xl flex items-center justify-between transition-all border",
                  u.name === 'You' ? "bg-brand-accent/5 border-brand-accent/20" : "glass-light border-transparent hover:border-white/10"
                )}>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black italic text-brand-text-dim w-4">#{u.rank}</span>
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <div className="text-sm font-bold">{u.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black italic tracking-tighter">{u.score}%</div>
                    <div className={cn("text-[8px] font-black uppercase", u.trend === 'up' ? "text-green-500" : "text-red-500")}>
                      {u.trend === 'up' ? '↑ Rising' : '↓ Falling'}
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
