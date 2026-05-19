import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EditableText } from '../../common/EditableText';

export function KhataView() {
  const [khataUsers, setKhataUsers] = useState([
    { id: 1, name: 'Sarfaraz Ahmed', balance: 12400, cnic: '42101-1234567-1', phone: '+92 300 1234567', address: 'Plot 42, Block 6, PECHS, Karachi', type: 'Customer' },
    { id: 2, name: 'Jan Mohammad', balance: 4500, cnic: '42201-7654321-3', phone: '+92 312 9876543', address: 'House 12, Street 4, G-11/2, Islamabad', type: 'Customer' },
    { id: 3, name: 'Ali Raza', balance: 45000, cnic: '42301-1112223-5', phone: '+92 333 4445556', address: 'Staff Quarters, FuelX Station E-11', type: 'Staff' },
  ]);

  const updateKhataUser = (id: number, field: string, value: any) => {
    setKhataUsers(khataUsers.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const addUser = () => {
    const newUser = {
      id: Date.now(),
      name: 'New Profile',
      balance: 0,
      cnic: '00000-0000000-0',
      phone: '+92 3xx xxxxxxx',
      address: 'Update Address',
      type: 'Customer'
    };
    setKhataUsers([newUser, ...khataUsers]);
  };

  return (
    <div className="max-w-5xl space-y-6 md:space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Staff & Khata</h2>
        <button 
          onClick={addUser}
          className="w-full sm:w-auto px-6 py-3 bg-brand-accent text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl hover:brightness-110 transition-all active:scale-95"
        >
          + Register Member
        </button>
      </div>
      
      <div className="grid gap-4 md:gap-6">
        {khataUsers.map((u) => (
          <div key={u.id} className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-brand-border/10 flex flex-col md:flex-row gap-6 md:gap-8 justify-between hover:border-brand-accent/30 transition-all">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 md:gap-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent font-black text-sm md:text-base">
                    {u.name.charAt(0)}
                 </div>
                 <div>
                    <EditableText 
                       value={u.name} 
                       onSave={(v) => updateKhataUser(u.id, 'name', v)} 
                       className="text-lg md:text-xl font-bold italic tracking-tight"
                    />
                    <div className="text-[8px] md:text-[10px] uppercase font-black text-brand-text-dim tracking-widest mt-0.5 md:mt-1 opacity-60">
                       UID: {u.id} • {u.type}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-brand-border/10">
                 <div>
                    <span className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim block mb-1">Identification</span>
                    <EditableText 
                       value={u.cnic} 
                       onSave={(v) => updateKhataUser(u.id, 'cnic', v)} 
                       className="font-mono text-xs md:text-sm"
                    />
                 </div>
                 <div>
                    <span className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim block mb-1">Active Mobile</span>
                    <EditableText 
                       value={u.phone} 
                       onSave={(v) => updateKhataUser(u.id, 'phone', v)} 
                       className="font-mono text-xs md:text-sm"
                    />
                 </div>
                 <div className="sm:col-span-2">
                    <span className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim block mb-1">Residential Address</span>
                    <EditableText 
                       value={u.address} 
                       onSave={(v) => updateKhataUser(u.id, 'address', v)} 
                       className="text-xs md:text-sm opacity-80"
                    />
                 </div>
              </div>
            </div>

            <div className="w-full md:w-48 flex flex-col justify-between items-start md:items-end gap-6 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-brand-border/10 md:pl-8">
               <div className="text-left md:text-right w-full">
                 <span className="text-[8px] md:text-[9px] uppercase font-black text-brand-text-dim block mb-1">Current Ledger</span>
                 <div className="text-xl md:text-2xl font-black italic tracking-tighter text-brand-accent flex items-baseline gap-1 md:justify-end">
                    <span className="text-[8px] md:text-[10px] font-bold not-italic">PKR</span>
                    <EditableText 
                       value={u.balance.toLocaleString()} 
                       onSave={(v) => updateKhataUser(u.id, 'balance', parseFloat(v) || 0)} 
                    />
                 </div>
               </div>
               <div className="flex gap-2 w-full">
                  <button className="flex-1 py-3 bg-red-500/10 text-red-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-all active:scale-95">
                    Report
                  </button>
                  <button className="flex-1 py-3 bg-brand-accent text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 transition-all active:scale-95">
                    Settle
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
