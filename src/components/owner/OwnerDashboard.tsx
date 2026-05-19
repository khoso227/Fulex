import React, { useState } from 'react';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Calculator, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { ProfitCalculator } from './ProfitCalculator';

// Screens
import { Overview } from './screens/Overview';
import { Analytics } from './screens/Analytics';
import { KhataView } from './screens/KhataView';
import { SettingsView } from './screens/SettingsView';

function NavIcon({ to, icon: Icon, label }: { to: string, icon: any, label: string, key?: React.Key }) {
  const { theme } = useAuth();
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => cn(
        "px-4 py-4 md:px-0 md:p-4 rounded-2xl transition-all relative group shrink-0",
        isActive 
          ? (theme === 'dark' ? "bg-white text-black scale-110" : "bg-brand-accent text-white scale-110") 
          : "text-brand-text-dim hover:text-brand-text"
      )}
    >
      <Icon className="w-6 h-6" />
      <div className="absolute left-16 bg-brand-sidebar border border-brand-border text-brand-text px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none md:block hidden z-60">
        {label}
      </div>
    </NavLink>
  );
}

export function OwnerDashboard() {
  const [showCalculator, setShowCalculator] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/owner/overview", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/owner/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/owner/khata", icon: Users, label: "Khata" },
    { to: "/owner/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="flex h-[100dvh] bg-brand-bg text-brand-text font-sans transition-colors relative overflow-hidden">
      {/* Profit Calculator Modal Overlay */}
      <AnimatePresence>
        {showCalculator && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md my-auto"
            >
              <ProfitCalculator onClose={() => setShowCalculator(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop Only */}
      <nav className="hidden lg:flex w-24 bg-brand-sidebar border-r border-brand-border flex-col items-center py-8 gap-8 z-50 transition-colors shrink-0">
        <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center mb-10 shrink-0 text-white font-black text-xl">
          F
        </div>
        
        <div className="flex flex-col gap-6 items-center flex-1">
          {navItems.map(item => (
            <NavIcon key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
          <button 
            onClick={() => setShowCalculator(true)}
            className={cn(
              "p-4 rounded-2xl transition-all relative group shrink-0",
              showCalculator ? "bg-brand-accent text-white scale-110" : "text-brand-text-dim hover:text-brand-text"
            )}
          >
            <Calculator className="w-6 h-6" />
            <div className="absolute left-16 bg-brand-sidebar border border-brand-border text-brand-text px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-60">
              Profit Calculator
            </div>
          </button>
        </div>

        <button 
          onClick={() => auth.signOut()}
          className="p-4 text-brand-text-dim hover:text-red-500 transition-colors mt-auto shrink-0"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-brand-sidebar/90 backdrop-blur-2xl border-t border-brand-border px-2 py-3 flex justify-around items-center z-50 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              isActive ? "text-brand-accent scale-105" : "text-brand-text-dim"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
        <button 
          onClick={() => setShowCalculator(true)}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
            showCalculator ? "text-brand-accent scale-105" : "text-brand-text-dim"
          )}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-wider">Calc</span>
        </button>
        <button 
          onClick={() => auth.signOut()}
          className="flex flex-col items-center gap-1 p-2 text-brand-text-dim"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-wider">Exit</span>
        </button>
      </div>

      {/* Main Panel */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-6 md:py-10 custom-scrollbar pb-24 lg:pb-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route path="overview" element={<Overview onOpenCalculator={() => setShowCalculator(true)} />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="khata" element={<KhataView />} />
                <Route path="settings" element={<SettingsView />} />
                <Route path="/" element={<Navigate to="overview" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
