import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Users } from 'lucide-react';
import { EditableText } from '../../common/EditableText';

export function SettingsView() {
  const [stationProfile, setStationProfile] = useState({
    name: 'FuelX Premium - E-11 Node',
    owner: 'Arsalan Khan',
    cnic: '42101-9876543-1',
    phone: '+92 300 8765432',
    address: 'Sector E-11/4, Main Road, Islamabad',
    license: 'OGRA-771-PSD',
    established: '2022'
  });

  const updateStation = (field: string, value: string) => {
    setStationProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl space-y-6 md:space-y-10 pb-20">
      <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-6 md:mb-8">Management</h2>
      
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
         <button className="w-full sm:w-auto px-8 py-4 glass border-brand-border/20 text-brand-text-dim font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl md:rounded-2xl hover:text-brand-text transition-all active:scale-95">
           Reset Changes
         </button>
         <button className="w-full sm:w-auto px-10 py-4 bg-brand-accent text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl md:rounded-2xl shadow-lg shadow-brand-accent/20 hover:brightness-110 active:scale-95 transition-all">
           Secure Update
         </button>
      </div>
    </div>
  );
}
