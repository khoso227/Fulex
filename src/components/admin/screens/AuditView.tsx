import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Search, 
  Activity, 
  X,
  FileDown,
  Calendar
} from 'lucide-react';
import { db } from '../../../lib/firebase';
import { 
  doc, 
  collection, 
  getDocs, 
  query, 
  where,
  deleteDoc,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { logAdminAction, AuditAction } from '../../../lib/auditService';
import { cn } from '../../../lib/utils';

export function AuditView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  
  // Date Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Real-time synchronization
    const q = query(
      collection(db, 'auditLogs'), 
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logData: any[] = [];
      snapshot.forEach((doc) => {
        logData.push({ id: doc.id, ...doc.data() });
      });
      setLogs(logData);
      setLoading(false);
    }, (error) => {
      console.error("Audit Stream Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePurge = async () => {
    if (!confirm('STATION PROTOCOL: Are you sure you want to purge all neural logs? This action is irreversible.')) return;
    try {
      const q = query(collection(db, 'auditLogs'));
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, 'auditLogs', d.id));
      }
      await logAdminAction(AuditAction.PURGE_AUDIT_LOGS, 'audit_system', {}, { status: 'purged' });
      alert('Logs purged successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to purge logs.');
    }
  };

  const downloadCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = ['Timestamp', 'Admin Email', 'Action', 'Target ID', 'Previous Value', 'New Value'];
    const rows = filteredLogs.map(log => [
      log.timestamp?.toDate ? log.timestamp.toDate().toISOString() : '',
      log.adminEmail,
      log.action,
      log.targetId,
      JSON.stringify(log.previousValue).replace(/"/g, '""'),
      JSON.stringify(log.newValue).replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fuelx_audit_trail_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.targetId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    
    let matchesDate = true;
    if (startDate || endDate) {
      const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : null;
      if (logDate) {
        if (startDate && logDate < new Date(startDate)) matchesDate = false;
        if (endDate) {
          const endDateTime = new Date(endDate);
          endDateTime.setHours(23, 59, 59, 999);
          if (logDate > endDateTime) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesAction && matchesDate;
  });

  if (loading) return <div className="text-center py-20 text-brand-text-dim font-black uppercase tracking-widest animate-pulse">Retrieving Encrypted Logs...</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Search and Filters */}
      <div className="flex flex-col gap-6 glass p-8 rounded-[2.5rem]">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
              <input 
                type="text" 
                placeholder="Search Admins or Targets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-accent outline-none text-xs font-bold"
              />
            </div>
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-accent text-[10px] font-black uppercase tracking-widest"
            >
              <option value="ALL">All Actions</option>
              <option value={AuditAction.UPDATE_USER_ROLE}>User Roles</option>
              <option value={AuditAction.UPDATE_GLOBAL_SETTINGS}>Global Config</option>
              <option value={AuditAction.PURGE_AUDIT_LOGS}>System Purge</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button 
              onClick={downloadCSV}
              className="flex-1 lg:flex-none px-6 py-3 glass hover:bg-brand-accent/10 border-brand-accent/20 text-brand-accent rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={handlePurge}
              className="flex-1 lg:flex-none px-6 py-3 border border-red-500/30 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Purge
            </button>
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-brand-text-dim tracking-widest">
              <Calendar className="w-4 h-4" />
              Temporal Range:
            </div>
            <div className="flex flex-1 gap-3 w-full">
               <input 
                 type="date"
                 value={startDate}
                 onChange={(e) => setStartDate(e.target.value)}
                 className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-brand-accent text-[10px] font-bold text-brand-text"
               />
               <span className="text-brand-text-dim font-black self-center">TO</span>
               <input 
                 type="date"
                 value={endDate}
                 onChange={(e) => setEndDate(e.target.value)}
                 className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-brand-accent text-[10px] font-bold text-brand-text"
               />
               {(startDate || endDate) && (
                 <button 
                   onClick={() => { setStartDate(''); setEndDate(''); }}
                   className="p-2 hover:bg-white/10 rounded-lg text-brand-text-dim"
                 >
                   <X className="w-4 h-4" />
                 </button>
               )}
            </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-extrabold flex items-center gap-3 text-brand-text italic tracking-tighter uppercase text-xl">
            <Activity className="w-6 h-6 text-brand-accent" />
            Neural Audit Trail
          </h3>
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-accent animate-pulse">
            Live Stream Active
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-brand-text-dim">
                <th className="px-10 py-6">Admin Identity</th>
                <th className="px-10 py-6">Protocol Action</th>
                <th className="px-10 py-6">Target Node</th>
                <th className="px-10 py-6">State Delta</th>
                <th className="px-10 py-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedLog(log)}>
                  <td className="px-10 py-6">
                    <div className="font-bold text-brand-text">{log.adminEmail}</div>
                    <div className="text-[9px] text-brand-text-dim uppercase tracking-tighter">{log.adminId}</div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={cn(
                      "px-2 py-1 rounded border font-bold uppercase tracking-tighter text-[9px]",
                      log.action.includes('PURGE') ? "border-red-500/30 text-red-500 bg-red-500/5" : "border-white/10 text-brand-text bg-white/5"
                    )}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-10 py-6 font-mono text-brand-accent font-bold truncate max-w-[150px]">{log.targetId}</td>
                  <td className="px-10 py-6">
                    <button className="text-[9px] font-black uppercase text-brand-text-dim group-hover:text-brand-accent transition-colors flex items-center gap-2">
                      Analyze Data <Activity className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-10 py-6 text-right font-mono text-brand-text-dim whitespace-nowrap">
                    {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending...'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-20 text-center text-brand-text-dim font-black uppercase tracking-widest italic">
              No resonance detected in logs.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-bg/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass max-w-4xl w-full rounded-[3rem] p-10 lg:p-14 border-brand-accent/20 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Delta Log Detail</h3>
                  <p className="text-[10px] font-black uppercase text-brand-text-dim tracking-widest">Trace ID: {selectedLog.id}</p>
                </div>
                <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-8 h-8 text-brand-text-dim" />
                </button>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 glass rounded-2xl bg-white/5 space-y-3">
                    <div className="text-[9px] font-black uppercase text-brand-text-dim tracking-widest border-b border-white/5 pb-2">Protocol Action</div>
                    <div className="font-bold text-xs tracking-widest bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-lg border border-brand-accent/20 w-fit">
                      {selectedLog.action}
                    </div>
                  </div>
                  <div className="p-6 glass rounded-2xl bg-white/5 space-y-3">
                    <div className="text-[9px] font-black uppercase text-brand-text-dim tracking-widest border-b border-white/5 pb-2">Origin Admin</div>
                    <div className="font-bold text-sm text-brand-text">{selectedLog.adminEmail}</div>
                    <div className="text-[8px] font-mono text-brand-text-dim truncate">{selectedLog.adminId}</div>
                  </div>
                  <div className="p-6 glass rounded-2xl bg-white/5 space-y-3">
                    <div className="text-[9px] font-black uppercase text-brand-text-dim tracking-widest border-b border-white/5 pb-2">Target Node</div>
                    <div className="font-bold text-sm text-brand-accent font-mono truncate">{selectedLog.targetId}</div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <div className="text-xs font-black uppercase text-brand-text tracking-widest">Neural State Delta Analysis</div>
                     <div className="text-[9px] font-black uppercase text-brand-text-dim bg-white/5 px-3 py-1 rounded-full border border-white/10">Type: Schema Change</div>
                   </div>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                           <div className="text-[9px] font-bold uppercase text-red-500/80 tracking-widest">Historical State (-1)</div>
                        </div>
                        <pre className="p-6 bg-red-500/[0.03] rounded-3xl border border-red-500/10 text-xs font-mono whitespace-pre-wrap overflow-x-auto text-red-100/40 max-h-72 overflow-y-auto leading-relaxed scrollbar-hide">
                          {JSON.stringify(selectedLog.previousValue, null, 2)}
                        </pre>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                           <div className="text-[9px] font-bold uppercase text-green-500/80 tracking-widest">Updated State (+1)</div>
                        </div>
                        <pre className="p-6 bg-green-500/[0.03] rounded-3xl border border-green-500/10 text-xs font-mono whitespace-pre-wrap overflow-x-auto text-green-200/80 max-h-72 overflow-y-auto leading-relaxed scrollbar-hide">
                          {JSON.stringify(selectedLog.newValue, null, 2)}
                        </pre>
                      </div>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedLog(null)}
                className="w-full mt-14 py-6 bg-brand-accent text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-[1.5rem] shadow-2xl shadow-brand-accent/30 hover:brightness-110 active:scale-95 transition-all"
              >
                Terminate Trace Session
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
