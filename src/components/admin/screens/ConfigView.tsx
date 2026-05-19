import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Fuel, Zap, Globe } from 'lucide-react';
import { auth, db } from '../../../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc
} from 'firebase/firestore';
import { logAdminAction, AuditAction } from '../../../lib/auditService';
import { cn } from '../../../lib/utils';

export function ConfigView() {
  const [prices, setPrices] = useState({
    petrol: 293.12,
    ev: 45.50,
    diesel: 301.20,
    hydrogen: 1200.00
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.globalFuelPrices) {
          setPrices(data.globalFuelPrices);
        }
      }
    };
    fetchSettings();
  }, []);

  const handleBroadcast = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      const prevPrices = docSnap.exists() ? docSnap.data().globalFuelPrices : {};
      
      await setDoc(docRef, {
        globalFuelPrices: prices,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid
      }, { merge: true });

      await logAdminAction(
        AuditAction.UPDATE_GLOBAL_SETTINGS,
        'global',
        prevPrices,
        prices
      );
      
      alert('Tariff broadcasted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to broadcast tariff.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-[2.5rem] p-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Central Tariff Engine</h2>
          <p className="text-brand-text-dim text-sm max-w-md font-medium">Update prices across all <span className="text-brand-text">authorized hubs</span> instantly via secure IoT sync.</p>
        </div>
        <button 
          onClick={handleBroadcast}
          disabled={loading}
          className="px-8 py-3 bg-brand-accent text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand-accent/20 disabled:opacity-50"
        >
          {loading ? 'Propagating...' : 'Broadcast Tariff'}
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {[
          { icon: Fuel, label: 'Petrol (Base)', key: 'petrol', color: 'text-brand-accent' },
          { icon: Zap, label: 'EV (per kWh)', key: 'ev', color: 'text-cyan-500' },
          { icon: Fuel, label: 'Diesel-LS', key: 'diesel', color: 'text-yellow-500' },
          { icon: Globe, label: 'Hydrogen (kg)', key: 'hydrogen', color: 'text-green-500' },
        ].map(item => (
          <div key={item.label} className="p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-brand-accent transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10">
              <item.icon className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <item.icon className={cn("w-4 h-4", item.color)} />
              <span className="text-[10px] font-black uppercase text-brand-text-dim tracking-widest">Base Rate</span>
            </div>
            <div className="text-xs font-black text-brand-text-muted mb-2 uppercase tracking-tighter">{item.label}</div>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-text-dim text-xs font-black tracking-widest italic uppercase">PKR.</span>
              <input 
                type="number" 
                value={prices[item.key as keyof typeof prices]} 
                onChange={(e) => setPrices({ ...prices, [item.key]: parseFloat(e.target.value) })}
                className="w-full pl-12 py-2 bg-transparent border-b border-white/10 focus:border-brand-accent outline-none font-mono font-black text-2xl text-brand-text tracking-tighter"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
