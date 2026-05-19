import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Wrench, Calendar, Fuel, Gauge, History, TrendingUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';

export function VehicleHealthView() {
  const { user, userData } = useAuth();
  const [logging, setLogging] = useState(false);
  const [formData, setFormData] = useState({
    odometer: '',
    fuelAdded: '',
  });

  const stats = {
    fuelLevel: 65,
    batteryHealth: 94,
    mileage: userData?.currentOdometer || 42500,
    tirePressure: [32, 33, 31, 32],
    lastService: '12 Apr 2026',
    nextService: '12 Oct 2026',
    fuelLogs: userData?.mileageHistory || []
  };

  const calculateAverage = () => {
    if (!stats.fuelLogs || stats.fuelLogs.length < 2) return 12.5; 
    const history = [...stats.fuelLogs].sort((a: any, b: any) => b.id - a.id);
    const latest = history[0];
    const previous = history[1];
    const diffKm = latest.odometer - previous.odometer;
    const avg = diffKm / latest.fuelAdded;
    return avg > 0 ? avg.toFixed(1) : 12.5;
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.odometer || !formData.fuelAdded) return;
    
    setLogging(true);
    try {
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        odometer: parseFloat(formData.odometer),
        fuelAdded: parseFloat(formData.fuelAdded),
        type: 'Refill',
      };

      await updateDoc(doc(db, 'users', user.uid), {
        mileageHistory: arrayUnion(newLog),
        currentOdometer: parseFloat(formData.odometer)
      });

      setFormData({ odometer: '', fuelAdded: '' });
      window.location.reload(); // Refresh to show new state
    } catch (error) {
      console.error("Log error:", error);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-6 lg:p-0 pb-24 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Fleet Integrity</h2>
          <p className="text-brand-text-dim text-[10px] font-black uppercase tracking-widest">Serial Number: V_402_PKR | Current Odo: {stats.mileage} KM</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-accent/10 rounded-full border border-brand-accent/20">
            <Activity className="w-3.5 h-3.5 text-brand-accent" />
            <div className="text-[9px] font-black uppercase tracking-widest text-brand-accent">SENSORS_ON</div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <div className="text-[9px] font-black uppercase tracking-widest text-green-500">{calculateAverage()} KM/L</div>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border-brand-accent/30 bg-gradient-to-br from-brand-accent/5 to-transparent">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-6 flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Log Fuel & Trip
            </h3>
            <form onSubmit={handleLogSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-brand-text-dim">Meter Reading (KM)</label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                  <input 
                    type="number"
                    value={formData.odometer}
                    onChange={(e) => setFormData({...formData, odometer: e.target.value})}
                    placeholder={stats.mileage.toString()}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-brand-accent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-brand-text-dim">Fuel (Liters)</label>
                <div className="relative">
                  <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                  <input 
                    type="number"
                    value={formData.fuelAdded}
                    onChange={(e) => setFormData({...formData, fuelAdded: e.target.value})}
                    placeholder="e.g. 10"
                    step="0.1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-brand-accent outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={logging}
                className="py-3.5 bg-brand-accent text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-accent/20 disabled:opacity-50"
              >
                {logging ? 'SYNCING...' : 'UPDATE LEDGER'}
              </button>
            </form>
          </div>

          <div className="glass p-10 rounded-[3rem] border-brand-border/10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-text-dim">History Ledger</h3>
              <History className="w-4 h-4 text-brand-text-dim" />
            </div>
            <div className="space-y-4">
              {stats.fuelLogs.length > 0 ? (
                [...stats.fuelLogs].sort((a: any, b: any) => b.id - a.id).map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-5 glass-light rounded-2xl border-white/5 hover:border-brand-accent/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                        <Fuel className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{log.fuelAdded}L Refill</div>
                        <div className="text-[9px] font-black uppercase text-brand-text-dim">{log.odometer} KM Odo</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] font-black text-brand-accent">{new Date(log.timestamp).toLocaleDateString()}</div>
                       <div className="text-[8px] font-black uppercase text-brand-text-dim mt-1">Status: Logged</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-3 opacity-30">
                  <Fuel className="w-10 h-10 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No trip data synced</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border-brand-accent/20 bg-brand-accent/5">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-6 shadow-xl shadow-brand-accent/10">
               <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-brand-text mb-2">Service Node</h3>
            <p className="text-brand-text-dim text-[10px] font-bold uppercase tracking-widest mb-6">Scheduled Maintenance</p>
            <div className="space-y-4 mb-8">
               <div className="flex justify-between text-[10px] font-black uppercase border-b border-brand-border/20 pb-3">
                  <span className="text-brand-text-dim tracking-widest">Last Check</span>
                  <span>12 Apr 2026</span>
               </div>
               <div className="flex justify-between text-[10px] font-black uppercase border-b border-brand-border/20 pb-3">
                  <span className="text-brand-text-dim tracking-widest">Next Booking</span>
                  <span className="text-brand-accent">12 Oct 2026</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

