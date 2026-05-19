import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Navigation, Zap } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { EditableText } from '../../common/EditableText';
import { StationList } from './StationList';

export function MainMapView() {
  const [stationFilter, setStationFilter] = useState('All');

  return (
    <div className="p-6 lg:p-0 pb-24 lg:pb-0">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-brand-sidebar rounded-[2rem] aspect-video relative overflow-hidden border border-brand-border shadow-2xl flex items-center justify-center min-h-[300px]">
            {/* Placeholder for real Map integration */}
            <div className="absolute inset-0 opacity-10">
               <svg width="100%" height="100%" viewBox="0 0 800 600">
                  <path d="M0,100 L800,500 M200,0 L600,600 M0,300 L800,100" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="400" cy="300" r="200" stroke="currentColor" strokeWidth="1" fill="none"/>
               </svg>
            </div>
              <div className="text-brand-text-dim flex flex-col items-center z-10">
                <Navigation className="w-12 h-12 mb-2 animate-pulse text-brand-accent" />
                <EditableText 
                  value="Universal Energy Grid" 
                  onSave={(v) => console.log('Saving Map Title:', v)} 
                  className="font-bold uppercase tracking-widest text-[10px]" 
                />
              </div>

              {/* EV Station Indicators on Map */}
              <div className="absolute top-1/4 left-1/3 group cursor-pointer">
                <div className="p-2 bg-brand-accent rounded-full text-white shadow-xl animate-bounce">
                   <Zap className="w-4 h-4" />
                </div>
                <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-brand-sidebar border border-brand-border p-2 rounded-lg text-[9px] font-bold z-50">
                   Centaurus Supercharger (250kW)
                </div>
              </div>

              <div className="absolute bottom-1/3 right-1/4 group cursor-pointer">
                <div className="p-2 bg-brand-accent rounded-full text-white shadow-xl">
                   <Zap className="w-4 h-4" />
                </div>
                <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-brand-sidebar border border-brand-border p-2 rounded-lg text-[9px] font-bold z-50">
                   E-11 Energy Hub (350kW)
                </div>
              </div>

            {/* UI Map Overlays */}
            <div className="absolute top-6 left-6 glass px-3 py-1.5 rounded-lg flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest">Active Search Coverage</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 glass p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0">
               <div className="flex-1 text-center md:border-r border-white/10 md:pr-4">
                  <div className="text-[8px] md:text-[9px] text-brand-text-dim font-black uppercase mb-1">Nearest Hub</div>
                  <EditableText 
                    value="Shell F-7 Markaz" 
                    onSave={(v) => console.log('Saving Map Hub Label:', v)} 
                    className="text-xs md:text-sm font-bold truncate block" 
                  />
               </div>
               <div className="flex-1 text-center md:border-r border-white/10 md:px-4 flex md:block justify-between items-center md:justify-normal">
                  <div className="text-[8px] md:text-[9px] text-brand-text-dim font-black uppercase mb-0 md:mb-1">Live Rush</div>
                  <EditableText 
                    value="Low (2 min)" 
                    onSave={(v) => console.log('Saving Map Rush Label:', v)} 
                    className="text-xs md:text-sm font-bold text-green-500" 
                  />
               </div>
               <div className="flex-1 text-center md:pl-4 flex md:block justify-between items-center md:justify-normal">
                  <div className="text-[8px] md:text-[9px] text-brand-text-dim font-black uppercase mb-0 md:mb-1">Inventory</div>
                  <EditableText 
                    value="9000L Available" 
                    onSave={(v) => console.log('Saving Map Stock Label:', v)} 
                    className="text-xs md:text-sm font-bold" 
                  />
               </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {['All', 'Petrol (base)', 'Diesel', 'CNG-Live', 'EV-Hyper', 'Hydrogen-Ready'].map(f => (
              <button 
                key={f} 
                onClick={() => setStationFilter(f)}
                className={cn(
                  "shrink-0 px-4 py-2 glass rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  stationFilter === f ? "bg-brand-accent text-white" : "hover:border-brand-accent text-brand-text-dim"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-brand-text-dim italic">Live Hub Feed</h2>
              <button className="text-brand-accent text-[10px] font-black uppercase tracking-widest hover:underline">Full Directory</button>
           </div>
           <StationList filter={stationFilter} />
        </div>
      </div>
    </div>
  );
}
