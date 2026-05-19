import React, { useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { Settings, Settings2, CheckCircle2, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';
import { EditableText } from '../../common/EditableText';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../../lib/firebase';
import { cn } from '../../../lib/utils';

export function ProfileView() {
  const { user, userData } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: userData?.displayName || 'Jan Mohammad',
    salary: userData?.salary || 4500,
    cnic: userData?.cnic || '42201-7654311-0',
    phone: userData?.phone || '+92 312 9876543',
    address: userData?.address || 'Islamabad, Pakistan',
    photoURL: userData?.photoURL || ''
  });

  const [fuelPrefs, setFuelPrefs] = useState<string[]>(userData?.fuelPreferences || ['petrol', 'diesel', 'ev', 'hydrogen']);
  const [biometricEnabled, setBiometricEnabled] = useState(localStorage.getItem('fuelx_biometric_token') === 'active');

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleBiometric = () => {
    const newState = !biometricEnabled;
    setBiometricEnabled(newState);
    if (newState) {
      localStorage.setItem('fuelx_biometric_token', 'active');
      alert('Neural ID / Biometric Registration Successful. You can now login using the Fingerprint icon.');
    } else {
      localStorage.removeItem('fuelx_biometric_token');
      alert('Biometric access revoked.');
    }
  };

  const toggleFuel = (fuel: string) => {
    setFuelPrefs(prev => 
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile('photoURL', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        fuelPreferences: fuelPrefs,
        displayName: profile.name,
        salary: profile.salary,
        cnic: profile.cnic,
        phone: profile.phone,
        address: profile.address,
        photoURL: profile.photoURL
      });
      alert('Profile updated successfully!');
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
             <div className="relative group self-center sm:self-start">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-brand-accent/10 border-2 border-brand-accent/20 flex items-center justify-center text-3xl md:text-4xl font-black text-brand-accent shadow-2xl shadow-brand-accent/10 overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile.name.charAt(0)
                  )}
               </div>
               <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:brightness-110 active:scale-90 transition-all border-4 border-brand-bg">
                 <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                 <Settings2 className="w-5 h-5 text-white" />
               </label>
             </div>
             <div className="pt-2">
                <EditableText 
                   value={profile.name} 
                   onSave={(v) => updateProfile('name', v)} 
                   className="text-3xl md:text-4xl font-black italic tracking-tighter text-brand-text mb-2 block"
                />
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-brand-text-dim flex flex-wrap justify-center sm:justify-start items-center gap-2">
                   Employee ID: {user?.uid.slice(0, 8)} <span className="hidden sm:inline">•</span> <span>Driver Grade A</span>
                </div>
             </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
             <div className="space-y-6">
               <div className="space-y-2 md:space-y-3">
                 <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent px-1">CNIC / Identification</label>
                 <EditableText 
                    value={profile.cnic} 
                    onSave={(v) => updateProfile('cnic', v)} 
                    className="w-full glass-light p-4 md:p-5 rounded-2xl text-lg md:text-xl font-mono block transition-all"
                 />
               </div>
               
               <div className="space-y-2 md:space-y-3">
                 <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent px-1">Security Configuration</label>
                 <button 
                  onClick={toggleBiometric}
                  className={cn(
                    "w-full p-5 rounded-2xl border flex items-center justify-between transition-all group",
                    biometricEnabled ? "bg-brand-accent/20 border-brand-accent/40" : "glass-light border-white/5"
                  )}
                 >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl", biometricEnabled ? "bg-brand-accent text-white" : "bg-white/5 text-brand-text-dim")}>
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-widest text-brand-text">Neural ID Login</div>
                        <div className="text-[9px] font-bold text-brand-text-dim uppercase tracking-tighter">Biometric Authentication</div>
                      </div>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full relative transition-all",
                      biometricEnabled ? "bg-brand-accent" : "bg-white/10"
                    )}>
                      <motion.div 
                        animate={{ x: biometricEnabled ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </div>
                 </button>
               </div>
             </div>

             <div className="space-y-6">
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
             </div>

             <div className="md:col-span-2 space-y-2 md:space-y-3">
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
