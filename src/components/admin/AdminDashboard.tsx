import React from 'react';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Settings, 
  BarChart3, 
  Globe, 
  Users, 
  LogOut, 
  Menu 
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { DashboardControls } from '../common/DashboardControls';

// Screens
import { SummaryView } from './screens/SummaryView';
import { IdentityView } from './screens/IdentityView';
import { AuditView } from './screens/AuditView';
import { ConfigView } from './screens/ConfigView';

function AdminNavItem({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest",
        isActive ? "bg-brand-accent text-white shadow-xl shadow-brand-accent/20" : "text-brand-text-dim hover:text-brand-text"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </NavLink>
  );
}

export function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex transition-colors relative">
      {/* Mobile Sidebar Overlay */}
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

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-brand-sidebar border-r border-brand-border flex flex-col p-8 z-[60] transition-transform duration-300 transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:relative"
      )}>
        <div className="flex items-center gap-3 mb-16">
          <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-xl font-black italic tracking-tighter text-brand-accent uppercase">Central Hub</span>
        </div>

        <nav className="flex-1 space-y-2">
           <AdminNavItem to="/admin/summary" icon={BarChart3} label="Revenue & Stats" />
           <AdminNavItem to="/admin/identity" icon={Users} label="Identity Management" />
           <AdminNavItem to="/admin/audit" icon={Globe} label="Audit Trail" />
           <AdminNavItem to="/admin/config" icon={Settings} label="Global Config" />
        </nav>

        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-3 p-4 text-brand-text-dim hover:text-red-500 transition-colors mt-auto rounded-xl hover:bg-red-500/5 text-xs font-black uppercase tracking-[0.2em]"
        >
          <LogOut className="w-4 h-4" />
          Terminate session
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 lg:mb-16 gap-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 glass rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold uppercase italic tracking-tighter">System Governance</h1>
              <p className="text-brand-text-dim text-[10px] font-black uppercase tracking-[0.3em] mt-1 border-l-2 border-brand-accent pl-3">
                Role: System Administrator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-end md:self-auto">
             <DashboardControls />
             <div className="hidden sm:flex glass px-6 py-3 rounded-2xl items-center gap-8">
                <div className="text-right">
                   <div className="text-[9px] text-brand-text-dim font-black uppercase tracking-widest mb-1">Active Grid Nodes</div>
                   <div className="text-2xl font-black italic tracking-tight">142.5K</div>
                </div>
                <Users className="w-8 h-8 text-brand-accent/50" />
             </div>
          </div>
        </header>

        <section>
          <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
               <Routes>
                 <Route path="summary" element={<SummaryView />} />
                 <Route path="identity" element={<IdentityView />} />
                 <Route path="audit" element={<AuditView />} />
                 <Route path="config" element={<ConfigView />} />
                 <Route path="/" element={<Navigate to="summary" replace />} />
               </Routes>
             </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
