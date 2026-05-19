import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Activity,
  BellRing,
  Plus,
  Fuel,
  Droplet,
  Battery,
  Flame
} from 'lucide-react';
import { DashboardControls } from '../../common/DashboardControls';
import { EditableText } from '../../common/EditableText';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../../../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc,
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';

interface InventoryTankProps {
  label: string;
  field: string;
  level: number;
  capacity: number;
  color: string;
  onLevelChange: (field: string, val: number) => any;
}

function InventoryTank({ label, field, level, capacity, color, onLevelChange }: InventoryTankProps) {
  const percentage = Math.min((level / capacity) * 100, 100);
  const isLow = level < (capacity * 0.15); // Alert at 15%
  const [tankLabel, setTankLabel] = useState(label);

  return (
    <div className={cn("glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative group overflow-hidden transition-all h-full", isLow && "border-red-500 animate-pulse bg-red-500/5")}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <EditableText 
            value={tankLabel} 
            onSave={setTankLabel} 
            className="text-brand-text-dim text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em]" 
          />
          <span className={cn("text-[8px] md:text-[10px] font-black px-1.5 md:px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1", 
            percentage > 30 ? "border-green-500/50 text-green-500 bg-green-500/10" : 
            percentage > 15 ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" :
            "border-red-500/50 text-red-500 bg-red-500/10"
          )}>
            {isLow && <BellRing className="w-2.5 h-2.5 md:w-3 md:h-3 animate-bounce" />}
            {percentage.toFixed(1)}% Full
          </span>
        </div>
        <div className="flex items-baseline gap-2 text-3xl md:text-4xl font-black text-brand-text mb-1 font-mono tracking-tighter">
          <EditableText 
            value={level.toString()} 
            onSave={(v) => onLevelChange(field, parseInt(v) || 0)} 
            className="inline-block" 
          />
          <span className="text-[10px] md:text-xs font-normal text-brand-text-dim">{field === 'ev' ? 'kWh' : 'Liters'}</span>
        </div>
        {isLow && <div className="text-[8px] md:text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1.5 md:mt-2 animate-pulse">Critical: Replenishment Required!</div>}
        <div className="text-[7px] md:text-[9px] text-brand-text-muted font-bold uppercase tracking-widest mt-1.5 md:mt-2">Maximum Capacity: {capacity.toLocaleString()}{field === 'ev' ? 'kWh' : 'L'}</div>
      </div>

      <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-30 h-full flex flex-col justify-end">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("w-full transition-all duration-1000", isLow ? "bg-red-600" : color)}
        />
      </div>
    </div>
  );
}

function AntiTheftAlerts() {
  const [isActive, setIsActive] = useState(true);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Anomalous Flow', msg: 'Suspicious flow detected at Nozzle 8', time: 'Just Now', severity: 'high' },
    { id: 2, type: 'Discrepancy', msg: 'Nozzle 4 discharge mismatch vs POS (+0.4L)', time: '12m ago', severity: 'medium' },
    { id: 3, type: 'Pressure Drop', msg: 'Tank B unexpected pressure drop detected', time: '1h ago', severity: 'high' },
  ]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      // High frequency alerts logic
      if (Math.random() > 0.92) {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'Neural Protocol',
          msg: `Anomalous discharge flow on Node-X${Math.floor(Math.random() * 99)}`,
          time: 'Just Now',
          severity: 'high'
        }, ...prev.slice(0, 5)]);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={cn("glass rounded-[2rem] p-8 border-brand-border/10 transition-all relative overflow-hidden", !isActive && "opacity-60")}>
      {/* Background Glow */}
      <div className={cn("absolute -top-10 -right-10 w-32 h-32 blur-[60px] rounded-full transition-all duration-1000", isActive ? "bg-red-500/20" : "bg-transparent")} />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <h3 className="font-black flex items-center gap-3 text-brand-text italic tracking-tighter uppercase text-sm">
          <div className="relative">
            <ShieldCheck className={cn("w-5 h-5", isActive ? "text-red-500" : "text-brand-text-dim")} />
            {isActive && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-red-500 rounded-full" />}
          </div>
          Anti-Theft AI Guard
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={cn(
              "text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all",
              isActive ? "bg-red-500 text-white border-red-500 shadow-xl shadow-red-500/30" : "bg-white/5 text-brand-text-dim border-white/10"
            )}
          >
            {isActive ? 'Active' : 'Offline'}
          </button>
        </div>
      </div>

      <div className="space-y-5 relative z-10">
        {isActive ? (
          <AnimatePresence mode="popLayout">
            {alerts.slice(0, 3).map(alert => (
              <motion.div 
                key={alert.id} 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className={cn(
                  "flex gap-5 p-5 rounded-3xl border transition-all",
                  alert.severity === 'high' ? "bg-red-500/5 border-red-500/10" : "bg-white/5 border-white/5"
                )}
              >
                <div className={cn("p-2.5 rounded-xl h-fit shrink-0", alert.severity === 'high' ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-yellow-500/20 text-yellow-500")}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-brand-text-dim mb-1.5">{alert.type} » {alert.time}</div>
                  <p className="text-sm text-brand-text-muted leading-snug font-bold italic">{alert.msg}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-12 text-center space-y-4 opacity-40">
            <ShieldCheck className="w-10 h-10 mx-auto" />
            <div className="text-[10px] font-black uppercase tracking-widest">Neural Link Disconnected</div>
          </div>
        )}
      </div>
    </div>
  );
}

function LiveNozzleFeed() {
  const [sales, setSales] = useState([
    { nozzle: 4, type: 'Petrol-92', qty: '12.5L', val: 'PKR 3,663', time: '14s ago' },
    { nozzle: 1, type: 'Diesel-LS', qty: '45.0L', val: 'PKR 13,554', time: '38s ago' },
    { nozzle: 2, type: 'EV-Fast-Ch', qty: '22kWh', val: 'PKR 1,100', time: '1m ago' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNozzle = Math.floor(Math.random() * 8) + 1;
      const newSale = {
        nozzle: newNozzle,
        type: ['Petrol-92', 'Diesel-LS', 'EV-Fast-Ch', 'Hi-Octane'][Math.floor(Math.random() * 4)],
        qty: `${(Math.random() * 50).toFixed(1)}L`,
        val: `PKR ${(Math.random() * 15000).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        time: 'Just Now'
      };
      
      setSales(prev => {
        // Find if nozzle exists, update it, or add new and sort
        const filtered = prev.filter(s => s.nozzle !== newNozzle);
        const updated = [...filtered, newSale].sort((a, b) => a.nozzle - b.nozzle);
        return updated.slice(0, 10); // Keep top 10 sorted nozzles
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sortedSales = [...sales].sort((a, b) => a.nozzle - b.nozzle);

  return (
    <div className="mt-8 md:mt-12 glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-brand-border/30">
       <div className="flex items-center gap-3 mb-6">
          <Activity className="w-4 h-4 md:w-5 md:h-5 text-brand-text-dim" />
          <h4 className="text-[8px] md:text-[10px] font-black uppercase text-brand-text-dim tracking-[0.25em]">Live Nozzle Discharge Stream</h4>
       </div>
       <div className="space-y-4 font-mono text-[10px] md:text-xs">
          <AnimatePresence>
            {sortedSales.map((sale) => (
              <motion.div 
                key={sale.nozzle}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-brand-text-muted border-b border-brand-border/30 pb-3 last:border-0 transition-colors gap-2 sm:gap-0"
              >
                <div className="flex justify-between items-center sm:block">
                  <span className="text-brand-text font-bold tracking-tight uppercase">Nozzle {sale.nozzle} » {sale.type}</span>
                  <span className="sm:hidden text-[9px] uppercase text-brand-text-dim">{sale.time}</span>
                </div>
                <div className="flex justify-between items-center sm:contents">
                  <span className="text-brand-accent font-bold">{sale.qty}</span>
                  <span className="text-brand-text">{sale.val}</span>
                  <span className="hidden sm:inline text-[10px] uppercase text-brand-text-dim">{sale.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
       </div>
    </div>
  );
}

function PriceControl({ label, current, delta, onPriceChange }: { label: string, current: number, delta: number, onPriceChange: (val: number) => void }) {
  return (
    <div className="flex items-center justify-between p-3 md:p-4 glass rounded-xl md:rounded-[1.5rem] border border-brand-border/20">
      <div>
        <div className="text-[8px] md:text-[10px] uppercase font-black text-brand-text-dim tracking-widest mb-0.5 md:mb-1">{label}</div>
        <div className="text-lg md:text-xl font-bold font-mono tracking-tight text-brand-text flex items-baseline gap-1">
          <span className="text-[8px] md:text-[10px] opacity-40">PKR</span>
          <EditableText 
            value={current.toString()} 
            onSave={(v) => onPriceChange(parseFloat(v) || 0)} 
          />
        </div>
      </div>
      <div className={cn("flex items-center gap-1 text-[8px] md:text-[10px] font-black py-0.5 md:py-1 px-2 md:px-3 rounded-lg border uppercase tracking-widest", 
        delta < 0 ? "border-green-500/30 text-green-500 bg-green-500/10" : "border-red-500/30 text-red-500 bg-red-500/10"
      )}>
        {delta < 0 ? <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3" /> : <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />}
        {delta}%
      </div>
    </div>
  );
}

export function Overview({ onOpenCalculator }: { onOpenCalculator: () => void }) {
  const { user, userData } = useAuth();
  const [station, setStation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['petrol', 'diesel', 'ev', 'hydrogen']);

  const [prices, setPrices] = useState([
    { id: 1, label: "Petrol", current: 293.4, delta: -2.5 },
    { id: 2, label: "Diesel", current: 301.2, delta: 1.2 },
  ]);

  useEffect(() => {
    if (!user) return;

    setError(null);
    const q = query(collection(db, 'stations'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setStation({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setStation(null);
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'stations');
      setError("Grid connection protocol failed. Please verify security clearance.");
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const updateLevel = (field: string, val: number) => {
    if (!station) return;
    const stationRef = doc(db, 'stations', station.id);
    updateDoc(stationRef, {
      [`stock.${field}`]: val,
      updatedAt: serverTimestamp()
    }).catch(error => handleFirestoreError(error, OperationType.UPDATE, `stations/${station.id}`));
  };

  const createInitialStation = async () => {
    if (!user) return;
    setLoading(true);
    const newStationId = `STN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const initialData = {
      ownerId: user.uid,
      name: "Standard Hub Alpha",
      location: {
        lat: 33.6844,
        lng: 73.0479,
        address: "Z-Base Sector 1"
      },
      fuelTypes: ["petrol", "diesel", "ev", "hydrogen"],
      stock: {
        petrol: 15000,
        diesel: 5000,
        ev: 200,
        hydrogen: 50
      },
      rushLevel: 1,
      rating: 5.0,
      status: "active",
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'stations', newStationId), initialData);
      // setStation handles it via onSnapshot
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'stations');
      setError("Failed to initialize node. Check network integrity.");
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = (id: number, val: number) => {
    setPrices(prices.map(p => p.id === id ? { ...p, current: val } : p));
  };

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => 
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const fuelOptions = [
    { id: 'petrol', label: 'Petrol', icon: Fuel, color: 'text-brand-accent' },
    { id: 'diesel', label: 'Diesel', icon: Droplet, color: 'text-yellow-500' },
    { id: 'ev', label: 'Electric', icon: Battery, color: 'text-cyan-500' },
    { id: 'hydrogen', label: 'Hydrogen', icon: Flame, color: 'text-green-500' },
  ];

  const inventory: { label: string, field: string, level: number, capacity: number, color: string }[] = station ? [
    { label: "Premium Petrol", field: "petrol", level: Number(station.stock?.petrol || 0), capacity: 50000, color: "bg-brand-accent" },
    { label: "Low-Sulfur Diesel", field: "diesel", level: Number(station.stock?.diesel || 0), capacity: 40000, color: "bg-yellow-500" }, 
    { label: "EV Charging Node", field: "ev", level: Number(station.stock?.ev || 0), capacity: 1000, color: "bg-cyan-500" },
    { label: "Hydrogen Hub", field: "hydrogen", level: Number(station.stock?.hydrogen || 0), capacity: 500, color: "bg-green-500" },
  ].filter(tank => activeFilters.includes(tank.field)) : [];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8 md:p-20">
        <div className="text-center">
          <div className="text-brand-text-dim text-[10px] md:text-sm font-black uppercase tracking-[0.4em] animate-pulse">Synchronizing IoT Neural Link...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 md:p-12 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 border border-red-500/20">
          <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-2 text-red-500 leading-tight">Security Access Violation</h2>
        <p className="text-sm md:text-brand-text-dim mb-6 md:mb-8 max-w-sm font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 md:px-8 py-3 bg-white/5 border border-white/10 text-brand-text font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-xl hover:bg-white/10 transition-all"
        >
          Re-authenticate Session
        </button>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 md:p-12 text-center">
        <div className="relative mb-8 md:mb-12">
           <ShieldCheck className="w-20 h-20 md:w-24 md:h-24 text-brand-text-dim opacity-10" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Plus className="w-6 h-6 md:w-8 md:h-8 text-brand-accent animate-pulse" />
           </div>
        </div>
        <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter mb-4 leading-tight">No Active Node detected</h2>
        <p className="text-sm md:text-brand-text-dim mb-10 md:mb-12 max-w-md font-medium">Your account is not currently associated with an authorized FuelX energy station.</p>
        <button 
          onClick={createInitialStation}
          className="px-8 md:px-10 py-4 md:py-5 bg-brand-accent text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-2xl shadow-xl shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
           <Activity className="w-4 h-4 md:w-5 md:h-5" />
           Initialize Grid Node
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6 md:gap-8">
        <div className="text-center md:text-left">
          <EditableText 
            value={station.name} 
            tagName="h1" 
            onSave={async (v) => {
              try {
                await updateDoc(doc(db, 'stations', station.id), { name: v });
              } catch(e) {}
            }} 
            className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight italic text-brand-text leading-tight" 
          />
          <p className="text-brand-text-dim mt-1 uppercase text-[8px] md:text-[10px] font-black tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            Active Grid Node • {station.id}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
           <div className="w-full sm:w-auto flex justify-center">
             <DashboardControls />
           </div>
           
           <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="flex-1 sm:hidden lg:flex glass px-4 md:px-6 py-2 md:py-3 rounded-2xl flex items-center justify-between sm:justify-start gap-4 md:gap-8">
                <div>
                   <div className="text-[8px] md:text-[10px] text-brand-text-dim uppercase font-black tracking-widest mb-0.5 md:mb-1">Revenue</div>
                   <div className="text-lg md:text-2xl font-mono font-bold tracking-tighter text-brand-text">PKR 1.24M</div>
                </div>
                <div className="bg-green-500/10 p-1.5 md:p-2 rounded-lg">
                   <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
                </div>
             </div>
             <button 
               onClick={onOpenCalculator}
               className="bg-brand-accent px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-brand-accent/20 hover:brightness-110 active:scale-95 transition-all text-white flex items-center justify-center gap-2 flex-1 sm:flex-none"
             >
                <Calculator className="w-4 h-4" />
                <span>Calc</span>
             </button>
           </div>
        </div>
      </header>

      {/* Performance Meter & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
        <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
           <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 shrink-0">
             <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-brand-text">Live Monitoring</span>
           </div>
           <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block" />
           {fuelOptions.map((opt) => (
             <button
               key={opt.id}
               onClick={() => toggleFilter(opt.id)}
               className={cn(
                 "flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all shrink-0 active:scale-95",
                 activeFilters.includes(opt.id) 
                  ? "bg-brand-accent/20 text-brand-accent border-brand-accent/50 shadow-lg shadow-brand-accent/10" 
                  : "bg-white/5 text-brand-text-dim border-white/10 hover:border-white/20"
               )}
             >
               <opt.icon className={cn("w-3.5 h-3.5", activeFilters.includes(opt.id) ? "text-brand-accent" : opt.color)} />
               <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
             </button>
           ))}
        </div>

        <div className="flex items-center gap-4 justify-between xl:justify-end">
           <div className="text-right">
              <div className="text-[9px] font-black uppercase text-brand-text-dim tracking-widest">Network Health</div>
              <div className="text-xs font-bold text-green-500 uppercase tracking-tighter">99.8% Optimized</div>
           </div>
           <button 
             onClick={() => window.location.reload()}
             className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-brand-text-dim hover:text-brand-accent"
             title="Synchronize Grid"
           >
             <Activity className="w-4 h-4" />
           </button>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        {/* Inventory Cluster */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
           {inventory.map((tank) => (
              <div key={tank.field}>
                <InventoryTank 
                  label={tank.label}
                  field={tank.field}
                  level={tank.level}
                  capacity={tank.capacity}
                  color={tank.color}
                  onLevelChange={updateLevel} 
                />
              </div>
           ))}
        </div>

        {/* Side Panels */}
        <div className="space-y-8 md:space-y-10">
           <AntiTheftAlerts />

           <div className="glass rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8">
             <h3 className="font-bold flex items-center gap-2 text-brand-text italic tracking-tighter uppercase mb-6 md:mb-8 text-sm md:text-base">
               <Zap className="w-4 h-4 md:w-5 md:h-5 text-brand-accent" />
               Dynamic Pricing
             </h3>
             <div className="flex flex-col gap-4 md:gap-5">
               {prices.map(price => (
                  <PriceControl 
                    key={price.id} 
                    {...price} 
                    onPriceChange={(val) => updatePrice(price.id, val)} 
                  />
               ))}
               <button className="w-full mt-2 md:mt-4 py-3.5 md:py-4 bg-brand-accent text-white font-bold uppercase rounded-xl md:rounded-2xl hover:brightness-110 transition-all text-[9px] md:text-[10px] tracking-widest">
                 Apply Discounts
               </button>
             </div>
           </div>
        </div>
      </section>

      {/* Real-time Ticker */}
      <LiveNozzleFeed />
    </div>
  );
}
