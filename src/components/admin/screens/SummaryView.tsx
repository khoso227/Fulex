import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  DollarSign, 
  Zap, 
  ShieldAlert,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export function SummaryView() {
  return (
    <div className="space-y-10">
      <div className="grid lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Energy Volume', value: '4.2M-L', trend: '+12%', icon: BarChart3 },
          { label: 'Network Royalty', value: 'Rs. 18.5M', trend: '+4%', icon: DollarSign },
          { label: 'Grid Slot Load', value: '1,204', trend: '-2%', icon: Zap },
          { label: 'Regulatory Grade', value: '99.4%', trend: '+0.1%', icon: ShieldAlert },
        ].map(stat => (
          <div key={stat.label} className="glass p-6 rounded-3xl relative overflow-hidden group hover:border-brand-accent/50 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-16 h-16 text-brand-text" />
            </div>
            <div className="text-[9px] text-brand-text-dim font-black uppercase tracking-[0.2em] mb-2">{stat.label}</div>
            <div className="text-2xl font-black italic tracking-tighter uppercase mb-3 text-brand-text">{stat.value}</div>
            <div className={cn("text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest", 
              stat.trend.startsWith('+') ? "border-green-500/20 text-green-500 bg-green-500/5" : "border-red-500/20 text-red-500 bg-red-500/5"
            )}>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden">
        <div className="px-10 py-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-extrabold flex items-center gap-3 text-brand-text italic tracking-tighter uppercase text-xl">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              Security Moderation
            </h3>
            <p className="text-brand-text-dim text-xs font-medium mt-1">Reviewing tagged anomalies in the national energy grid.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-brand-text-dim">
                <th className="px-10 py-6">Identity</th>
                <th className="px-10 py-6">Energy Hub</th>
                <th className="px-10 py-6">Protocol Layer</th>
                <th className="px-10 py-6">Integrity Status</th>
                <th className="px-10 py-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: 'FP-881', name: 'Al-Farooq Petrol', email: 'owner@farooq.com', grade: 'C-', flagged: true },
                { id: 'FP-219', name: 'Standard Fuel Plus', email: 'hello@fuelplus.pk', grade: 'B', flagged: false },
                { id: 'FP-012', name: 'Apex Energy Hub', email: 'admin@apex.com', grade: 'A+', flagged: false },
              ].map(hub => (
                <tr key={hub.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-10 py-6 font-mono text-[11px] text-brand-text-dim font-bold">{hub.id}</td>
                  <td className="px-10 py-6">
                     <div className="font-black text-brand-text italic tracking-tighter uppercase text-lg">{hub.name}</div>
                     <div className="text-[10px] text-brand-text-dim font-bold uppercase mt-1 tracking-widest italic">{hub.email}</div>
                  </td>
                  <td className="px-10 py-6">
                     <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                         <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">v4.22-SEC</span>
                     </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border",
                      hub.grade.startsWith('A') ? "border-green-500/20 text-green-500 bg-green-500/5" : 
                      hub.grade.startsWith('B') ? "border-brand-accent/20 text-brand-accent bg-brand-accent/5" : "border-red-500/20 text-red-500 bg-red-500/5"
                    )}>
                      Grade {hub.grade}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 glass hover:bg-green-500/10 rounded-xl text-green-500 transition-all active:scale-90"><CheckCircle className="w-5 h-5" /></button>
                      <button className="p-2.5 glass hover:bg-red-500/10 rounded-xl text-red-500 transition-all active:scale-90"><XCircle className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
