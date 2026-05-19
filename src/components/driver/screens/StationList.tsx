import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Navigation, Star, Zap, Clock, Fuel } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../../lib/firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../lib/AuthContext';

interface StationListProps {
  filter: string;
}

export function StationList({ filter }: StationListProps) {
  const { user, userData } = useAuth();
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'stations'), where('status', '==', 'active'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStations(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'stations');
    });
    return unsubscribe;
  }, []);

  // Mock stations for demo if empty
  const rawStations = stations.length > 0 ? stations : [
    { 
      id: 'EV_SUPER_1', 
      name: 'Tesla Supercharger - Centaurus', 
      location: { address: 'Blue Area, Islamabad' }, 
      rushLevel: 4, 
      stock: { ev: 8 }, 
      fuelTypes: ['EV-Super', 'Tesla-SC', 'EV-Hyper'], 
      rating: 4.9,
      evDetails: {
        speed: '250kW',
        connectors: [
          { id: 'S1-A', type: 'Tesla', status: 'Charging' },
          { id: 'S1-B', type: 'Tesla', status: 'Idle' },
          { id: 'S1-C', type: 'CCS2', status: 'Charging' },
          { id: 'S1-D', type: 'CCS2', status: 'Idle' },
          { id: 'S1-E', type: 'Tesla', status: 'Idle' },
          { id: 'S1-F', type: 'Tesla', status: 'Offline' },
          { id: 'S1-G', type: 'CCS2', status: 'Charging' },
          { id: 'S1-H', type: 'CCS2', status: 'Charging' },
        ],
        total: 8,
        available: 3
      }
    },
    { 
      id: 'PSA_E11', 
      name: 'PSA Energy Hub E-11', 
      location: { address: 'Main Road E-11' }, 
      rushLevel: 2, 
      stock: { ev: 12 }, 
      fuelTypes: ['EV-Hyper'], 
      rating: 4.7,
      evDetails: {
        speed: '350kW',
        connectors: [
          { id: 'P1', type: 'CCS2', status: 'Idle' },
          { id: 'P2', type: 'CCS2', status: 'Idle' },
          { id: 'P3', type: 'CHAdeMO', status: 'Charging' },
          { id: 'P4', type: 'CCS2', status: 'Idle' },
        ],
        total: 12,
        available: 10
      }
    },
    { 
      id: '1', 
      name: 'Shell F-7 Markaz', 
      location: { address: 'Islamabad' }, 
      rushLevel: 3, 
      stock: { petrol: 8000 }, 
      fuelTypes: ['Petrol', 'Diesel'], 
      rating: 4.8,
      evDetails: null
    },
    { 
      id: 'PSO_BLUE', 
      name: 'PSO Blue Area', 
      location: { address: 'Jinnah Ave' }, 
      rushLevel: 8, 
      stock: { ev: 4 }, 
      fuelTypes: ['EV-Hyper'], 
      rating: 4.2,
      evDetails: {
        speed: '150kW',
        connectors: [
          { id: 'B1', type: 'CCS2', status: 'Charging' },
          { id: 'B2', type: 'CCS2', status: 'Charging' },
          { id: 'B3', type: 'Type 2', status: 'Idle' },
          { id: 'B4', type: 'Type 2', status: 'Idle' },
        ],
        total: 4,
        available: 2
      }
    },
    { 
      id: '3', 
      name: 'Total Energy G-11', 
      location: { address: 'Street 4' }, 
      rushLevel: 1, 
      stock: { petrol: 9500 }, 
      fuelTypes: ['Petrol', 'CNG'], 
      rating: 4.5,
      evDetails: null
    },
    {
      id: 'HUB_E11',
      name: 'Energy Hub E-11',
      location: { address: 'Near Main Road' },
      rushLevel: 2,
      stock: { ev: 6 },
      fuelTypes: ['EV-Hyper', 'Tesla-SC'],
      rating: 4.9,
      evDetails: {
        speed: '250kW',
        connectors: [
          { id: 'H1', type: 'CCS2', status: 'Idle' },
          { id: 'H2', type: 'CCS2', status: 'Idle' },
          { id: 'H3', type: 'Tesla', status: 'Idle' },
          { id: 'H4', type: 'Tesla', status: 'Idle' },
          { id: 'H5', type: 'CCS2', status: 'Charging' },
          { id: 'H6', type: 'Tesla', status: 'Idle' },
        ],
        total: 6,
        available: 5
      }
    },
    { 
      id: 'PSO_H1', 
      name: 'PSO Future Port', 
      location: { address: 'Gwadar Deep Sea Port' }, 
      rushLevel: 1, 
      stock: { hydrogen: 500 }, 
      fuelTypes: ['Hydrogen-Ready', 'Electric'], 
      rating: 4.6,
      evDetails: null
    }
  ];

  const displayStations = rawStations.filter(station => {
    // 1. Check if station matches the manual filter from UI (All, Petrol, EV, etc)
    const matchesManualFilter = filter === 'All' || station.fuelTypes.some((ft: string) => {
      const normalizedFilter = filter.toLowerCase().split(' ')[0].split('-')[0];
      return ft.toLowerCase().includes(normalizedFilter);
    });

    // 2. Check if station matches User Preferences (Persistence)
    const matchesUserPrefs = !userData?.fuelPreferences || userData.fuelPreferences.length === 0 || 
      station.fuelTypes.some((ft: string) => {
        const type = ft.toLowerCase();
        return userData.fuelPreferences?.some(pref => type.includes(pref));
      });

    return matchesManualFilter && matchesUserPrefs;
  });

  const [reserving, setReserving] = useState<string | null>(null);

  const handleReserve = (e: React.MouseEvent, stationId: string) => {
    e.stopPropagation();
    setReserving(stationId);
    setTimeout(() => {
      setReserving(null);
      alert('Reservation Confirmed: Spot held for 15 minutes.');
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {displayStations.map((station, i) => (
        <motion.div
          key={station.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="glass p-6 rounded-[2rem] hover:border-brand-accent transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="font-bold text-lg text-brand-text mb-1 italic tracking-tight">{station.name}</div>
              <div className="flex items-center gap-2 text-brand-text-dim text-xs">
                <Navigation className="w-3 h-3" />
                {station.location.address}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-yellow-500/20">
              <Star className="w-3 h-3 fill-current" />
              {station.rating}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {station.fuelTypes.map((type: string) => (
              <span key={type} className="px-3 py-1 bg-brand-bg/50 border border-brand-border/40 rounded-full text-[9px] font-black text-brand-text-dim uppercase tracking-wider">
                {type}
              </span>
            ))}
          </div>

          {station.evDetails && (
            <div className="p-5 bg-brand-accent/5 border border-brand-accent/10 rounded-[1.5rem] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-brand-accent" />
                  </div>
                  <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Hyper-Grid Live Status</span>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                  station.evDetails.available > 0 
                    ? "bg-green-500/10 text-green-500 border-green-500/20" 
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                )}>
                  {station.evDetails.available > 0 ? `${station.evDetails.available} Plugs Available` : 'Wait List Only'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {station.evDetails.connectors.map((c: any) => (
                  <div key={c.id} className="glass-light p-3 rounded-xl border-brand-border/30 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-brand-text-dim uppercase">{c.id}</span>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]",
                        c.status === 'Idle' ? "bg-green-500 shadow-green-500/50" : 
                        c.status === 'Charging' ? "bg-blue-500 animate-pulse shadow-blue-500/50" : 
                        "bg-brand-text-dim"
                      )} />
                    </div>
                    <div className="text-[10px] font-bold text-brand-text">{c.type}</div>
                    <div className={cn(
                      "text-[8px] font-black uppercase tracking-tighter",
                      c.status === 'Idle' ? "text-green-500/80" : 
                      c.status === 'Charging' ? "text-blue-400" : "text-brand-text-dim"
                    )}>
                      {c.status}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-brand-accent/10 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[8px] text-brand-text-dim uppercase font-black tracking-widest">Max Throughput</div>
                  <div className="text-xl font-black italic tracking-tighter text-brand-text">{station.evDetails.speed}</div>
                </div>
                
                <button 
                  onClick={(e) => handleReserve(e, station.id)}
                  disabled={station.evDetails.available === 0 || reserving === station.id}
                  className={cn(
                    "px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all transform active:scale-95",
                    station.evDetails.available > 0 
                      ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20 hover:brightness-110" 
                      : "bg-brand-border/20 text-brand-text-dim cursor-not-allowed"
                  )}
                >
                  {reserving === station.id ? (
                    <span className="flex items-center gap-2">
                      <Activity className="w-3 h-3 animate-spin" />
                      Securing...
                    </span>
                  ) : 'Reserve Spot'}
                </button>
              </div>
            </div>
          )}


          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-brand-border">
            <div>
              <div className="text-[9px] text-brand-text-dim font-black uppercase mb-1.5 tracking-tighter">Rush Level</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-brand-border rounded-full overflow-hidden">
                   <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      station.rushLevel < 4 ? "bg-green-500" : station.rushLevel < 7 ? "bg-yellow-500" : "bg-red-500"
                    )} 
                    style={{ width: `${station.rushLevel * 10}%` }} 
                  />
                </div>
                <span className="text-[10px] font-bold text-brand-text-muted">{station.rushLevel}/10</span>
              </div>
            </div>
            <div className="hidden lg:block px-4 border-l border-brand-border/10">
              <div className="text-[9px] text-brand-text-dim font-black uppercase mb-1.5 tracking-tighter">Est. Wait</div>
              <div className="flex items-center gap-1.5 text-brand-accent">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-black italic tracking-tighter">{station.rushLevel * 5}m</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] text-brand-text-dim font-black uppercase mb-1.5 tracking-tighter">Live Status</div>
              <div className="text-[10px] font-bold flex items-center gap-1 text-brand-text">
                {station.evDetails ? (
                  <>
                    <Zap className="w-3 h-3 text-brand-accent" />
                    {station.evDetails.available} / {station.evDetails.total} Free
                  </>
                ) : (
                  <>
                    <Fuel className="w-3 h-3 text-brand-accent" />
                    {filter === 'Hydrogen-Ready' ? (
                      <>{station.stock?.hydrogen || 0}kg H₂</>
                    ) : filter === 'Diesel' ? (
                      <>{station.stock?.diesel || 0}L Liter</>
                    ) : (
                      <>{station.stock?.petrol || 0}L Liter</>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
