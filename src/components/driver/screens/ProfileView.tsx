import React, { useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { Settings, Settings2, CheckCircle2 } from 'lucide-react';
import { EditableText } from '../../common/EditableText';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../../lib/firebase';
import { cn } from '../../../lib/utils';

export function ProfileView() {
  const { user, userData } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Jan Mohammad',
    salary: 4500,
    cnic: '42201-7654321-3',
    phone: '+92 312 9876543',
    address: 'House 12, Street 4, G-11/2, Islamabad'
  });

  const [fuelPrefs, setFuelPrefs] = useState<string[]>(userData?.fuelPreferences || ['petrol', 'diesel', 'ev', 'hydrogen']);

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
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
      window.location.reload();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  const availableFuels = [
    { id: 'petrol', label: 'Petrol', icon: '⛽' },
    { id: 'diesel', label: 'Diesel', icon: '🚛' },
    { id: 'ev', label: 'Charging', icon: '⚡' },
    { id: 'hydrogen', label: 'Hydrogen', icon: '💧' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-6 lg:p-0 pb-24 lg:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Personal Bio Data</h2>
        <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-500/20">
          Verified Profile
        </div>
      </div>

      {/* Resource Preferences */}
      <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-brand-accent/20 bg-brand-accent/5">
        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-6 md:mb-8 flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Application Experience
        </h3>
        <p className="text-[10px] text-brand-text-dim uppercase font-bold tracking-widest mb-6">Which energy types do you use regularly? This hides irrelevant stations and records.</p>
        
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

      <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden border-brand-border/10">
        <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5">
           <Settings className="w-48 h-48 md:w-64 md:h-64" />
        </div>
        
        <div className="relative z-10 space-y-10 md:space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8 text-center sm:text-left">
             <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-brand-accent/20 flex items-center justify-center text-2xl md:text-3xl font-black text-brand-accent shadow-2xl shadow-brand-accent/20 shrink-0">
                {profile.name.charAt(0)}
             </div>
             <div>
                <EditableText 
                   value={profile.name} 
                   onSave={(v) => updateProfile('name', v)} 
                   className="text-3xl md:text-4xl font-extrabold italic tracking-tight text-brand-text mb-2 block"
                />
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-brand-text-dim flex flex-wrap justify-center sm:justify-start items-center gap-2">
                   Employee ID: {user?.uid.slice(0, 8)} <span className="hidden sm:inline">•</span> <span>Driver Grade A</span>
                </div>
             </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
             <div className="space-y-2 md:space-y-3">
               <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent px-1">CNIC / Identification</label>
               <EditableText 
                  value={profile.cnic} 
                  onSave={(v) => updateProfile('cnic', v)} 
                  className="w-full glass-light p-4 md:p-5 rounded-2xl text-lg md:text-xl font-mono block transition-all"
               />
             </div>
             <div className="space-y-2 md:space-y-3">
               <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent px-1">Active Mobile No.</label>
               <EditableText 
                  value={profile.phone} 
                  onSave={(v) => updateProfile('phone', v)} 
                  className="w-full glass-light p-4 md:p-5 rounded-2xl text-lg md:text-xl font-mono block transition-all"
               />
             </div>
             <div className="space-y-2 md:space-y-3">
               <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent px-1">Base Salary / Credit</label>
               <div className="flex items-baseline gap-2 glass-light p-4 md:p-5 rounded-2xl">
                  <span className="text-[10px] font-bold text-brand-text-dim uppercase">PKR</span>
                  <EditableText 
                    value={profile.salary.toString()} 
                    onSave={(v) => updateProfile('salary', v)} 
                    className="text-xl md:text-2xl font-black italic tracking-tighter text-brand-text"
                  />
               </div>
             </div>
             <div className="space-y-2 md:space-y-3">
               <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent px-1">Current Residential Address</label>
               <EditableText 
                  value={profile.address} 
                  onSave={(v) => updateProfile('address', v)} 
                  className="w-full glass-light p-4 md:p-5 rounded-2xl text-sm md:text-base font-medium block leading-relaxed"
               />
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <button 
               onClick={saveSettings}
               disabled={saving}
               className="flex-1 py-4 bg-brand-accent text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-2xl shadow-xl shadow-brand-accent/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
             >
                {saving ? 'Synchronizing Node...' : 'Update Cloud Backup'}
             </button>
             <button className="flex-1 py-4 glass border-brand-border/30 text-brand-text-dim font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-2xl hover:text-brand-text transition-all">
                Report Discrepancy
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
