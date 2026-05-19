import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Wrench, Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function VehicleHealthView() {
  const [stats] = useState({
    fuelLevel: 65,
    batteryHealth: 94,
    tirePressure: [32, 33, 31, 32],
    lastService: '12 Apr 2026',
    nextService: '12 Oct 2026',
    logs: [
      { id: 1, action: 'Brake Pad Replacement', date: '12 Apr 2026', tech: 'AI-Link Diagnostics' },
      { id: 2, action: 'Fluid Calibration', date: '08 Jan 2026', tech: 'Tesla-Hub Service' },
      { id: 3, action: 'TPMS Sensor Sync', date: '14 Dec 2025', tech: 'Self-Check' },
    ]
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-6 lg:p-0 pb-24 lg:pb-0">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Fleet Intelligence</h2>
          <p className="text-brand-text-dim text-[10px] font-black uppercase tracking-widest">Serial Number: V_402_PKR</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-accent/10 rounded-full border border-brand-accent/20">
          <Activity className="w-4 h-4 text-brand-accent" />
          <div className="text-[10px] font-black uppercase tracking-widest text-brand-accent">OBD-II Online</div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="glass p-10 rounded-[3rem] border-brand-border/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-text-dim mb-10">Real-Time Telemetry</h3>
            <div className="grid sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-text whitespace-nowrap">Energy Reserves</span>
                  <span className="text-3xl font-black italic tracking-tighter text-brand-accent">{stats.fuelLevel}%</span>
                </div>
                <div className="h-3 w-full bg-brand-border/20 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${stats.fuelLevel}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="h-full bg-brand-accent rounded-full"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-text whitespace-nowrap">Battery Integrity</span>
                  <span className="text-3xl font-black italic tracking-tighter text-green-500">{stats.batteryHealth}%</span>
                </div>
                <div className="h-3 w-full bg-brand-border/20 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${stats.batteryHealth}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="h-full bg-green-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-brand-border/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim mb-8">Tire Pressure Analysis (PSI)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {stats.tirePressure.map((p, i) => (
                   <div key={i} className="glass-light p-5 rounded-2xl text-center border-brand-border/20 hover:border-brand-accent transition-all">
                      <div className="text-2xl font-black italic tracking-tighter text-brand-text">{p}</div>
                      <div className="text-[8px] font-black text-brand-text-dim uppercase mt-1">AXLE_{i+1}</div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] border-brand-border/10">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-text-dim mb-8">Maintenance History</h3>
             <div className="space-y-4">
                {stats.logs.map(log => (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 glass-light rounded-2xl border-white/5 hover:border-white/10 transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-sidebar rounded-xl flex items-center justify-center text-brand-text">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{log.action}</div>
                        <div className="text-[10px] font-black uppercase text-brand-text-dim">{log.tech}</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest bg-brand-bg px-4 py-2 rounded-lg border border-brand-border/40">
                      {log.date}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border-brand-accent/20 bg-brand-accent/5">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-6 shadow-xl shadow-brand-accent/10">
               <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-brand-text mb-2">Service Due</h3>
            <p className="text-brand-text-dim text-[10px] font-bold uppercase tracking-widest mb-6">Scheduled Calibration</p>
            <div className="space-y-4 mb-8">
               <div className="flex justify-between text-[10px] font-black uppercase border-b border-brand-border/20 pb-3">
                  <span className="text-brand-text-dim tracking-widest">Last Checkup</span>
                  <span>{stats.lastService}</span>
               </div>
               <div className="flex justify-between text-[10px] font-black uppercase border-b border-brand-border/20 pb-3">
                  <span className="text-brand-text-dim tracking-widest">Next Booking</span>
                  <span className="text-brand-accent">{stats.nextService}</span>
               </div>
            </div>
            <button className="w-full py-4 bg-brand-accent text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand-accent/20">
               Secure Slot
            </button>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-brand-border/10">
             <div className="text-[9px] font-black uppercase tracking-widest text-brand-text-dim mb-4">Diagnostic Result</div>
             <div className="flex items-center gap-4 bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                <span className="text-xs font-black uppercase italic tracking-tighter">Systems Nominal</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
