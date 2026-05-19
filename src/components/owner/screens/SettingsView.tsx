import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Users, Settings2, CheckCircle2 } from 'lucide-react';
import { EditableText } from '../../common/EditableText';
import { useAuth } from '../../../lib/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../../lib/firebase';
import { cn } from '../../../lib/utils';

export function SettingsView() {
  const { user, userData } = useAuth();
  const [saving, setSaving] = useState(false);
  const [stationProfile, setStationProfile] = useState({
    name: 'FuelX Premium - E-11 Node',
    owner: 'Arsalan Khan',
    cnic: '42101-9876543-1',
    phone: '+92 300 8765432',
    address: 'Sector E-11/4, Main Road, Islamabad',
    license: 'OGRA-771-PSD',
    established: '2022'
  });

  const [fuelPrefs, setFuelPrefs] = useState<string[]>(userData?.fuelPreferences || ['petrol', 'diesel', 'ev', 'hydrogen']);

  const updateStation = (field: string, value: string) => {
    setStationProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleFuel = (fuel: string) => {
    setFuelPrefs(prev => 
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    );
  };

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        fuelPreferences: fuelPrefs
      });
      // Force reload or just rely on state update if AuthContext is updated
      window.location.reload(); // Simplest way to propagate through app
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  const availableFuels = [
    { id: 'petrol', label: 'Premium Petrol', icon: '⛽' },
    { id: 'diesel', label: 'Low-Sulfur Diesel', icon: '🚛' },
    { id: 'ev', label: 'EV Charging', icon: '⚡' },
    { id: 'hydrogen', label: 'Hydrogen Hub', icon: '💧' },
  ];

  return (
    <div className="max-w-4xl space-y-6 md:space-y-10 pb-20">
      <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-6 md:mb-8">Management</h2>
      
      {/* Active Resource Matrix */}
      <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-brand-accent/20 bg-brand-accent/5">
        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-6 md:mb-8 flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Active Resource Matrix
        </h3>
        <p className="text-[10px] text-brand-text-dim uppercase font-bold tracking-widest mb-6">Select fuels to display on your dashboard. Hidden values will still be tracked in background logs.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           {availableFuels.map((fuel) => {
             const isActive = fuelPrefs.includes(fuel.id);
             return (
               <button 
                key={fuel.id}
                onClick={() => toggleFuel(fuel.id)}
                className={cn(
                  "p-5 rounded-2xl border transition-all text-center space-y-3 relative group",
                  isActive ? "bg-brand-accent border-brand-accent text-white shadow-lg shadow-brand-accent/20" : "glass-light border-white/5 text-brand-text-dim hover:border-brand-accent/50"
                )}
               >
                 <div className="text-2xl">{fuel.icon}</div>
                 <div className="text-[9px] font-black uppercase tracking-widest leading-tight">{fuel.label}</div>
                 {isActive && (
                   <div className="absolute top-2 right-2">
                     <CheckCircle2 className="w-4 h-4 text-white" />
                   </div>
                 )}
               </button>
             );
           })}
        </div>
      </div>

      {/* Station Profile */}
      <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-brand-border/10">
        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-6 md:mb-8 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Station Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
           <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim px-1">Station Name</label>
              <EditableText 
                 value={stationProfile.name} 
                 onSave={(v) => updateStation('name', v)} 
                 className="text-lg md:text-xl font-bold italic tracking-tight glass-light p-3.5 md:p-4 rounded-xl md:rounded-2xl block w-full"
              />
           </div>
           <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim px-1">Registration License</label>
              <EditableText 
                 value={stationProfile.license} 
                 onSave={(v) => updateStation('license', v)} 
                 className="text-lg md:text-xl font-bold italic tracking-tight glass-light p-3.5 md:p-4 rounded-xl md:rounded-2xl block w-full"
              />
           </div>
        </div>
      </div>

      {/* Owner Bio Data */}
      <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-brand-border/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5">
           <Users className="w-24 h-24 md:w-32 md:h-32" />
        </div>
        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-6 md:mb-8 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Owner Bio Data & KYC
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
           <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim px-1">Owner Full Name</label>
              <EditableText 
                 value={stationProfile.owner} 
                 onSave={(v) => updateStation('owner', v)} 
                 className="text-base md:text-lg font-bold glass-light p-3.5 md:p-4 rounded-xl md:rounded-2xl block w-full"
              />
           </div>
           <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim px-1">CNIC / Passport</label>
              <EditableText 
                 value={stationProfile.cnic} 
                 onSave={(v) => updateStation('cnic', v)} 
                 className="text-base md:text-lg font-mono glass-light p-3.5 md:p-4 rounded-xl md:rounded-2xl block w-full"
              />
           </div>
           <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim px-1">Primary Mobile No.</label>
              <EditableText 
                 value={stationProfile.phone} 
                 onSave={(v) => updateStation('phone', v)} 
                 className="text-base md:text-lg font-mono glass-light p-3.5 md:p-4 rounded-xl md:rounded-2xl block w-full"
              />
           </div>
           <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim px-1">Business Address</label>
              <EditableText 
                 value={stationProfile.address} 
                 onSave={(v) => updateStation('address', v)} 
                 className="text-base md:text-lg glass-light p-3.5 md:p-4 rounded-xl md:rounded-2xl block w-full"
              />
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
         <button 
           onClick={() => setFuelPrefs(userData?.fuelPreferences || ['petrol', 'diesel', 'ev', 'hydrogen'])}
           className="w-full sm:w-auto px-8 py-4 glass border-brand-border/20 text-brand-text-dim font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl md:rounded-2xl hover:text-brand-text transition-all active:scale-95"
         >
           Reset Changes
         </button>
         <button 
           onClick={saveSettings}
           disabled={saving}
           className="w-full sm:w-auto px-10 py-4 bg-brand-accent text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl md:rounded-2xl shadow-lg shadow-brand-accent/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {saving ? 'Synchronizing...' : 'Secure Update'}
         </button>
      </div>
    </div>
  );
}
