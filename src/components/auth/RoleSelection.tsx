import { useAuth } from '../../lib/AuthContext';
import { motion } from 'motion/react';
import { Car, Store, Sun, Moon, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export function RoleSelection() {
  const { user, setRole, theme, toggleTheme } = useAuth();
  const [selecting, setSelecting] = useState<string | null>(null);
  
  const isAdmin = user?.email === 'khososarang816@gmail.com';

  const handleSelect = async (role: 'driver' | 'owner' | 'admin') => {
    setSelecting(role);
    try {
      await setRole(role as any);
      // Navigation is handled by App.tsx redirecting based on userData
    } catch (error) {
      console.error("Role Select Failure:", error);
      setSelecting(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 md:p-10 text-brand-text text-center font-sans transition-colors overflow-x-hidden">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl w-full py-12"
      >
        <div className="flex justify-center mb-8 gap-4 items-center">
           <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-xl shadow-brand-accent/20">
            F
           </div>
           <button 
             onClick={toggleTheme}
             id="theme-toggle"
             className="p-3 glass rounded-xl text-brand-text-dim hover:text-brand-accent transition-all active:scale-90"
           >
             {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
        </div>
        <span className="text-brand-accent font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px]">Portal Gateway</span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mt-4 mb-4 md:mb-8 uppercase tracking-tighter italic text-brand-text leading-none">Identify Mode</h1>
        <p className="text-brand-text-dim mb-10 md:mb-16 text-base md:text-lg max-w-xl mx-auto italic font-medium px-4">Please select your primary interaction protocol to synchronize with the FuelX network.</p>

        <div className={cn("grid gap-6 md:gap-10", isAdmin ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2")}>
          {isAdmin && (
            <button
              onClick={() => handleSelect('admin')}
              id="role-admin"
              disabled={selecting !== null}
              className={cn(
                "group relative p-8 md:p-10 glass rounded-[2.5rem] md:rounded-[3rem] border-brand-accent/30 hover:border-brand-accent transition-all text-left overflow-hidden flex flex-col items-start min-h-[220px] md:min-h-0",
                selecting === 'admin' ? "ring-2 ring-brand-accent" : ""
              )}
            >
              <div className="absolute -right-10 -bottom-10 text-brand-accent/5 transition-transform group-hover:scale-110 group-hover:text-brand-accent/10 duration-500">
                <ShieldCheck className="w-48 h-48 md:w-64 md:h-64" />
              </div>
              <div className="p-3 md:p-4 bg-brand-accent/10 border border-brand-accent/20 w-fit rounded-2xl mb-6 md:mb-8 group-hover:scale-110 transition-transform shrink-0">
                {selecting === 'admin' ? <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-brand-accent animate-spin" /> : <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-brand-accent" />}
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-2 md:mb-4 italic uppercase tracking-tighter text-brand-text">Admin Layer</h3>
              <p className="text-brand-text-muted text-xs md:text-sm leading-relaxed mb-8 md:mb-10 opacity-70">Execute network governance, moderate hubs, and monitor global energy throughput.</p>
              
              <div className="mt-auto flex items-center gap-2 text-brand-accent font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px]">
                {selecting === 'admin' ? "Synchronizing..." : "Proceed to Grid"} <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          )}

          <button
            onClick={() => handleSelect('driver')}
            id="role-driver"
            disabled={selecting !== null}
            className={cn(
              "group relative p-8 md:p-10 glass rounded-[2.5rem] md:rounded-[3rem] border-brand-border/40 hover:border-brand-accent transition-all text-left overflow-hidden flex flex-col items-start min-h-[220px] md:min-h-0",
              selecting === 'driver' ? "ring-2 ring-brand-accent" : ""
            )}
          >
            <div className="absolute -right-10 -bottom-10 text-brand-accent/5 transition-transform group-hover:scale-110 group-hover:text-brand-accent/10 duration-500">
              <Car className="w-48 h-48 md:w-64 md:h-64" />
            </div>
            <div className="p-3 md:p-4 bg-brand-accent/10 border border-brand-accent/20 w-fit rounded-2xl mb-6 md:mb-8 group-hover:scale-110 transition-transform shrink-0">
              {selecting === 'driver' ? <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-brand-accent animate-spin" /> : <Car className="w-8 h-8 md:w-10 md:h-10 text-brand-accent" />}
            </div>
            <h3 className="text-3xl md:text-4xl font-black mb-2 md:mb-4 italic uppercase tracking-tighter text-brand-text">Driver Mode</h3>
            <p className="text-brand-text-muted text-xs md:text-sm leading-relaxed mb-8 md:mb-10 opacity-70">Real-time hub locating, AI-optimized refueling, and unified digital payment settlement.</p>
            
            <div className="mt-auto flex items-center gap-2 text-brand-accent font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px]">
              {selecting === 'driver' ? "Linking..." : "Access Dashboard"} <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => handleSelect('owner')}
            id="role-owner"
            disabled={selecting !== null}
            className={cn(
              "group relative p-8 md:p-10 glass rounded-[2.5rem] md:rounded-[3rem] border-brand-border/40 hover:border-green-500 transition-all text-left overflow-hidden flex flex-col items-start min-h-[220px] md:min-h-0",
              selecting === 'owner' ? "ring-2 ring-green-500" : ""
            )}
          >
            <div className="absolute -right-10 -bottom-10 text-green-500/5 transition-transform group-hover:scale-110 group-hover:text-green-500/10 duration-500">
              <Store className="w-48 h-48 md:w-64 md:h-64" />
            </div>
            <div className="p-3 md:p-4 bg-green-500/10 border border-green-500/20 w-fit rounded-2xl mb-6 md:mb-8 group-hover:scale-110 transition-transform shrink-0">
              {selecting === 'owner' ? <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-green-500 animate-spin" /> : <Store className="w-8 h-8 md:w-10 md:h-10 text-green-500" />}
            </div>
            <h3 className="text-3xl md:text-4xl font-black mb-2 md:mb-4 italic uppercase tracking-tighter text-brand-text">Business Mode</h3>
            <p className="text-brand-text-muted text-xs md:text-sm leading-relaxed mb-8 md:mb-10 opacity-70">Automate station monitoring, audit live inventory flow, and track staff khata metrics.</p>
            
            <div className="mt-auto flex items-center gap-2 text-green-500 font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px]">
              {selecting === 'owner' ? "Vesting..." : "Manage Energy Node"} <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
