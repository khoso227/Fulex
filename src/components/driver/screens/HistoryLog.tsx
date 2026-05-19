import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { useLanguage } from '../../../lib/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../../../lib/firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { Filter, Search, Fuel, Zap } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function HistoryLog() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    fuelType: 'all',
    dateRange: 'all', // all, today, week, month
    paymentMethod: 'all',
    stationType: 'all'
  });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'transactions');
    });
    return unsubscribe;
  }, [user]);

  // Seeder for demo
  const seedTransaction = async () => {
    if (!user) return;
    const paymentMethods = ['Wallet', 'Credit Card', 'BNPL'];
    const stationTypes = ['Fuel', 'EV Hub', 'Hydrogen Basis'];
    const fuelTypes = ['Petrol-95', 'EV-Charge-250kW', 'Diesel-LS', 'H2-Green'];
    
    try {
       await addDoc(collection(db, 'transactions'), {
          status: 'Completed',
          station: 'Energy Hub G-11',
          type: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
          stationType: stationTypes[Math.floor(Math.random() * stationTypes.length)],
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          amount: Math.floor(Math.random() * 5000) + 1000,
          date: new Date().toLocaleDateString(),
          timestamp: Date.now(),
          userId: user.uid,
          createdAt: serverTimestamp()
       });
    } catch (err) {
       console.error(err);
    }
  };

  const filteredLogs = transactions.filter(log => {
    const matchesSearch = log.station?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesFuel = filters.fuelType === 'all' || 
      (filters.fuelType === 'petrol' && log.type?.toLowerCase().includes('petrol')) ||
      (filters.fuelType === 'ev' && log.type?.toLowerCase().includes('ev')) ||
      (filters.fuelType === 'diesel' && log.type?.toLowerCase().includes('diesel')) ||
      (filters.fuelType === 'hydrogen' && log.type?.toLowerCase().includes('h2'));

    const matchesPayment = filters.paymentMethod === 'all' || 
      log.paymentMethod?.toLowerCase() === filters.paymentMethod.toLowerCase();

    const matchesStationType = filters.stationType === 'all' || 
      (filters.stationType === 'fuel' && log.stationType?.toLowerCase().includes('fuel')) ||
      (filters.stationType === 'ev' && log.stationType?.toLowerCase().includes('ev')) ||
      (filters.stationType === 'hydrogen' && log.stationType?.toLowerCase().includes('hydrogen'));

    return matchesSearch && matchesFuel && matchesPayment && matchesStationType;
  });

  const displayLogs = transactions.length > 0 ? filteredLogs : [
    { id: '1', status: 'Completed', station: 'Shell F-7 Markaz', type: 'Petrol-92', stationType: 'Fuel', paymentMethod: 'Wallet', amount: 4500, date: '2 hours ago' },
    { id: '2', status: 'Completed', station: 'Hub Charging E-11', type: 'EV-Fast-Charge', stationType: 'EV Hub', paymentMethod: 'Credit Card', amount: 1200, date: 'Yesterday' },
    { id: '3', status: 'Processing', station: 'PSO Blue Area', type: 'Diesel-LS', stationType: 'Fuel', paymentMethod: 'BNPL', amount: 8900, date: '3 days ago' },
  ].filter(log => {
     const matchesSearch = log.station.toLowerCase().includes(filters.search.toLowerCase());
     const matchesFuel = filters.fuelType === 'all' || 
      (filters.fuelType === 'petrol' && log.type.toLowerCase().includes('petrol')) ||
      (filters.fuelType === 'ev' && log.type.toLowerCase().includes('ev')) ||
      (filters.fuelType === 'diesel' && log.type.toLowerCase().includes('diesel')) ||
      (filters.fuelType === 'hydrogen' && log.type.toLowerCase().includes('h2'));

     const matchesPayment = filters.paymentMethod === 'all' || 
      log.paymentMethod?.toLowerCase() === filters.paymentMethod.toLowerCase();

     const matchesStationType = filters.stationType === 'all' || 
      (filters.stationType === 'fuel' && log.stationType?.toLowerCase().includes('fuel')) ||
      (filters.stationType === 'ev' && log.stationType?.toLowerCase().includes('ev')) ||
      (filters.stationType === 'hydrogen' && log.stationType?.toLowerCase().includes('hydrogen'));

     return matchesSearch && matchesFuel && matchesPayment && matchesStationType;
  });

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-0 pb-24 lg:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className={cn("text-3xl font-black italic tracking-tighter uppercase", language !== 'en' && "font-urdu")}>
          {t('history')}
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
           <button 
              onClick={seedTransaction}
              className="px-4 py-2 bg-brand-accent/10 text-brand-accent text-[8px] font-black uppercase rounded-lg border border-brand-accent/20 hover:bg-brand-accent hover:text-white transition-all flex-1 md:flex-none"
           >
              Seed History
           </button>
           <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2.5 glass rounded-xl transition-colors",
                showFilters ? "bg-brand-accent text-white" : "text-brand-text-dim hover:text-brand-text"
              )}
            >
              <Filter className="w-5 h-5" />
           </button>
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
              <input 
                type="text"
                placeholder="Search Station..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full bg-brand-sidebar border border-brand-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-brand-accent transition-colors"
              />
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="glass p-6 rounded-2xl border-brand-accent/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim px-1">Resource Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'petrol', 'diesel', 'ev', 'hydrogen'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFilters(prev => ({ ...prev, fuelType: f }))}
                        className={cn(
                          "px-3 py-2 text-[9px] font-black uppercase rounded-lg transition-all",
                          filters.fuelType === f ? "bg-brand-accent text-white" : "bg-brand-bg/50 text-brand-text-dim border border-brand-border hover:border-brand-accent/50"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim px-1">Payment Protocol</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'Wallet', 'Credit Card', 'BNPL'].map(p => (
                      <button
                        key={p}
                        onClick={() => setFilters(prev => ({ ...prev, paymentMethod: p }))}
                        className={cn(
                          "px-3 py-2 text-[9px] font-black uppercase rounded-lg transition-all",
                          filters.paymentMethod === p ? "bg-cyan-500 text-white" : "bg-brand-bg/50 text-brand-text-dim border border-brand-border hover:border-cyan-500/50"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim px-1">Hub Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'fuel', 'ev', 'hydrogen'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFilters(prev => ({ ...prev, stationType: s }))}
                        className={cn(
                          "px-3 py-2 text-[9px] font-black uppercase rounded-lg transition-all",
                          filters.stationType === s ? "bg-purple-500 text-white" : "bg-brand-bg/50 text-brand-text-dim border border-brand-border hover:border-purple-500/50"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim px-1">Temporal Window</label>
                  <select 
                     value={filters.dateRange}
                     onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                     className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2 text-xs outline-none focus:border-brand-accent appearance-none font-bold"
                  >
                    <option value="all">Full History</option>
                    <option value="today">Current Cycle (Today)</option>
                    <option value="week">Weekly Rollup</option>
                    <option value="month">Monthly Audit</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col justify-end gap-3">
                <button 
                  onClick={() => setFilters({ search: '', fuelType: 'all', dateRange: 'all', paymentMethod: 'all', stationType: 'all' })}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-dim hover:text-brand-accent hover:border-brand-accent/30 transition-all"
                >
                  Reset Diagnostics
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass rounded-[2rem] overflow-hidden border-brand-border/40">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-sidebar border-b border-brand-border text-[10px] uppercase font-black tracking-widest text-brand-text-dim">
                <th className="px-8 py-6">{t('status')}</th>
                <th className="px-8 py-6">{t('station_label')}</th>
                <th className="px-8 py-6">{t('resource')}</th>
                <th className="px-8 py-6 text-right">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {displayLogs.map((log, i) => (
                <motion.tr 
                  key={log.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-brand-accent/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                      log.status === 'Completed' || log.status === 'مکمل' 
                        ? "border-green-500/20 text-green-500 bg-green-500/5 group-hover:bg-green-500/10" 
                        : "border-brand-accent/20 text-brand-accent bg-brand-accent/5 group-hover:bg-brand-accent/10"
                    )}>
                      {log.status === 'Completed' ? t('completed') : (log.status === 'Processing' ? t('processing') : log.status)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-brand-text text-base tracking-tight">{log.station}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="text-[10px] text-brand-text-dim font-bold uppercase tracking-wider">{log.date}</div>
                      {log.paymentMethod && (
                        <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-black uppercase text-brand-text-dim whitespace-nowrap">
                          {log.paymentMethod}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2 text-brand-text-muted text-sm font-semibold">
                        {log.type?.toLowerCase().includes('petrol') ? <Fuel className="w-4 h-4 text-brand-accent" /> : <Zap className="w-4 h-4 text-brand-accent" />}
                        {log.type}
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right font-mono font-bold text-brand-text text-lg">
                    <span className="text-[10px] text-brand-text-dim mr-1">PKR</span>
                    {log.amount.toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-brand-border/30">
          {displayLogs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 space-y-4 active:bg-brand-accent/5 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-brand-text text-lg tracking-tight leading-tight mb-1">{log.station}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-[9px] text-brand-text-dim font-black uppercase tracking-widest">{log.date}</div>
                    {log.paymentMethod && (
                      <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[7px] font-black uppercase text-brand-text-dim">
                        {log.paymentMethod}
                      </div>
                    )}
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border",
                  log.status === 'Completed' || log.status === 'مکمل' 
                    ? "border-green-500/20 text-green-500 bg-green-500/5" 
                    : "border-brand-accent/20 text-brand-accent bg-brand-accent/5"
                )}>
                  {log.status === 'Completed' ? t('completed') : t('processing')}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-black/10 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-brand-text-muted text-xs font-bold uppercase tracking-wider">
                  {log.type?.toLowerCase().includes('petrol') ? <Fuel className="w-3.5 h-3.5 text-brand-accent" /> : <Zap className="w-3.5 h-3.5 text-brand-accent" />}
                  {log.type}
                </div>
                <div className="font-mono font-black text-brand-text">
                  <span className="text-[8px] text-brand-text-dim mr-1 font-sans">PKR</span>
                  {log.amount.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {(displayLogs.length === 0 && !loading) && (
          <div className="p-20 text-center text-brand-text-dim italic font-medium">
             No transactions match your current filters.
          </div>
        )}
      </div>
    </div>
  );
}
