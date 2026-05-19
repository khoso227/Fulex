import React, { useState } from 'react';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { useLanguage } from '../../lib/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../../lib/firebase';
import { 
  Map as MapIcon, 
  Activity, 
  History, 
  CreditCard, 
  Settings, 
  Leaf, 
  ChevronRight, 
  LogOut, 
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { StatusIndicator } from '../common/StatusIndicator';
import { EditableText } from '../common/EditableText';
import { DashboardControls } from '../common/DashboardControls';

// Screens
import { MainMapView } from './screens/MainMapView';
import { VehicleHealthView } from './screens/VehicleHealthView';
import { HistoryLog } from './screens/HistoryLog';
import { WalletView } from './screens/WalletView';
import { ProfileView } from './screens/ProfileView';
import { EcoTrackingView } from './screens/EcoTrackingView';

function BottomNavbar() {
  const { t } = useLanguage();
  const navItems = [
    { to: '/driver/map', icon: MapIcon, label: t('map') },
    { to: '/driver/vehicles', icon: Activity, label: 'Vehicle' },
    { to: '/driver/wallet', icon: CreditCard, label: 'Wallet' },
    { to: '/driver/profile', icon: Settings, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-sidebar/80 backdrop-blur-2xl border-t border-brand-border px-4 py-3 flex justify-around items-center z-50 lg:hidden pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1.5 transition-all py-1 px-3 rounded-xl",
            isActive ? "text-brand-accent transform -translate-y-0.5" : "text-brand-text-dim"
          )}
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.1em] transition-all", isActive ? "opacity-100" : "opacity-70")}>{item.label}</span>
              {isActive && <motion.div layoutId="bottom-nav-active" className="w-1 h-1 bg-brand-accent rounded-full mt-0.5" />}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (b: boolean) => void }) {
  const { t } = useLanguage();
  const tabs = [
    { to: '/driver/map', icon: MapIcon, label: t('map') },
    { to: '/driver/vehicles', icon: Activity, label: t('vehicle_health') },
    { to: '/driver/history', icon: History, label: t('history') },
    { to: '/driver/wallet', icon: CreditCard, label: t('wallet'), badge: 'New' },
    { to: '/driver/profile', icon: Settings, label: 'Profile' },
    { to: '/driver/eco', icon: Leaf, label: t('eco') },
  ];

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-[60] bg-brand-sidebar/40 backdrop-blur-xl border-r border-brand-border/10 flex flex-col transition-all duration-300 lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
      isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
    )}>
      <div className="p-6 flex items-center justify-between border-b border-brand-border lg:border-none">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white font-bold shrink-0">
            F
          </div>
          <span className={cn("text-xl font-extrabold tracking-tighter text-brand-accent uppercase transition-opacity", !isOpen && "lg:opacity-0")}>FuelX</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto overflow-x-hidden">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            onClick={() => {
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className={({ isActive }) => cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm group relative",
              isActive 
                ? "bg-brand-accent/20 text-brand-accent border border-brand-accent/10 shadow-[0_0_20px_-5px_rgba(var(--color-brand-accent),0.1)]" 
                : "text-brand-text-muted hover:bg-brand-accent/5 hover:text-brand-accent"
            )}
          >
            <tab.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110")} />
            <span className={cn("font-semibold overflow-hidden whitespace-nowrap transition-all", !isOpen && "lg:w-0 lg:opacity-0")}>
              {tab.label}
            </span>
            {!isOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-brand-sidebar border border-brand-border rounded text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden lg:block z-[60]">
                {tab.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-border">
        <button 
          onClick={() => auth.signOut()}
          className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-semibold group"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span className={cn("overflow-hidden whitespace-nowrap transition-all", !isOpen && "lg:w-0 lg:opacity-0")}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export function DriverDashboard() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-transparent text-brand-text font-sans transition-colors relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto relative pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 bg-brand-bg/40 backdrop-blur-md border-b border-brand-border/10 px-4 md:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 glass rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <EditableText 
                value={t('dashboard')} 
                tagName="h1" 
                onSave={(v) => console.log('Saving:', v)} 
                className="text-xl md:text-2xl font-bold tracking-tight" 
              />
              <p className="hidden md:block text-brand-text-dim text-xs mt-1">Status: <span className="text-green-500 font-bold uppercase tracking-widest ml-1">● System Hybrid-Live</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Language Switcher */}
            <div className="flex bg-brand-sidebar rounded-lg p-1 border border-brand-border shrink-0">
              {(['en', 'ur', 'sd'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-2 sm:px-3 py-1 rounded text-[10px] font-black uppercase tracking-tight transition-all",
                    language === lang ? "bg-brand-accent text-white" : "text-brand-text-dim hover:text-white"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
            
            <DashboardControls />
            <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-brand-border">
              <div className="mr-3 hidden sm:block">
                <StatusIndicator />
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-brand-text leading-none mb-1">{user?.displayName || 'Jan Mohammad'}</div>
                <div className="text-[10px] text-brand-text-dim font-bold uppercase tracking-wider">Premium Member</div>
              </div>
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border border-brand-border"
              />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
           <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.2 }}
             >
               <Routes>
                 <Route path="map" element={<MainMapView />} />
                 <Route path="vehicles" element={<VehicleHealthView />} />
                 <Route path="history" element={<HistoryLog />} />
                 <Route path="wallet" element={<WalletView />} />
                 <Route path="profile" element={<ProfileView />} />
                 <Route path="eco" element={<EcoTrackingView />} />
                 <Route path="/" element={<Navigate to="map" replace />} />
               </Routes>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Global SOS FAB */}
        <div className="fixed bottom-24 lg:bottom-8 right-8 z-50">
           <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSosActive(true)}
              className="w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center group relative"
           >
              <AlertCircle className="w-8 h-8" />
              <span className="absolute right-20 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Emergency SOS
              </span>
           </motion.button>
        </div>

        <BottomNavbar />

        {/* SOS Alert Overlay */}
        <AnimatePresence>
          {isSosActive && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-2xl flex items-center justify-center p-8 text-center"
            >
               <div className="max-w-md w-full space-y-12">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      boxShadow: ["0 0 0px rgba(220, 38, 38, 0)", "0 0 50px rgba(220, 38, 38, 0.5)", "0 0 0px rgba(220, 38, 38, 0)"]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-32 h-32 bg-red-600 rounded-full mx-auto flex items-center justify-center text-white"
                  >
                    <AlertCircle className="w-16 h-16" />
                  </motion.div>

                  <div className="space-y-4">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Emergency Mode Active</h2>
                    <p className="text-red-200/80 font-bold uppercase text-[10px] tracking-[0.2em] leading-relaxed">
                      Your high-precision coordinates have been broadcasted to the nearest FuelX Hub and emergency responders.
                    </p>
                  </div>

                  <div className="glass border-white/10 p-8 rounded-[2rem] space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-red-300">
                      <span>Nearest Support</span>
                      <span className="text-white">Centaurus Hub (~1.2km)</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '100%' }}
                         transition={{ duration: 10 }}
                         className="h-full bg-red-500"
                       />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-400">Response estimated in 4:20 mins</p>
                  </div>

                  <button 
                    onClick={() => setIsSosActive(false)}
                    className="w-full py-5 bg-white text-red-900 font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    Cancel Alert
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
