import React, { useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { Settings } from 'lucide-react';
import { EditableText } from '../../common/EditableText';

export function ProfileView() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: 'Jan Mohammad',
    salary: 4500,
    cnic: '42201-7654321-3',
    phone: '+92 312 9876543',
    address: 'House 12, Street 4, G-11/2, Islamabad'
  });

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-6 lg:p-0 pb-24 lg:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Personal Bio Data</h2>
        <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-500/20">
          Verified Profile
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
             <button className="flex-1 py-4 bg-brand-accent text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-2xl shadow-xl shadow-brand-accent/20 hover:brightness-110 active:scale-95 transition-all">
                Update Cloud Backup
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
