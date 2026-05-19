import React, { useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useLanguage } from '../../lib/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Fuel, Globe, Zap, ShieldCheck, Grid, Activity, Mail, Lock, Phone, Fingerprint, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

type AuthView = 'initial' | 'email-login' | 'email-signup' | 'forgot-password' | 'phone-login';

export function LoginPage() {
  const { language, setLanguage, t } = useLanguage();
  const [view, setView] = useState<AuthView>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (view === 'email-signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        setError(language === 'en' 
          ? 'No account found with these details. Try creating an account!' 
          : language === 'ur' 
            ? 'ان تفصیلات کے ساتھ کوئی اکاؤنٹ نہیں ملا۔ اکاؤنٹ بنانے کی کوشش کریں!' 
            : 'انهن تفصيلن سان ڪو به اڪائونٽ نه مليو. اڪائونٽ ٺاهڻ جي ڪوشش ڪريو!');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Reset link sent to your email!');
      setView('email-login');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsScanning(true);
    setError('');
    
    // Simulate a high-tech biometric scan
    setTimeout(async () => {
      try {
        // In a real app, we would use WebAuthn (navigator.credentials.get)
        // For this demo context, we'll simulate a successful "Neural Link" match
        // and log in with a demo account if no session exists, 
        // or just show a success message if it's just for the UI feel.
        
        // If we wanted real auth, we'd need to store a token in localStorage 
        // after a real login and use that here.
        const savedToken = localStorage.getItem('fuelx_biometric_token');
        if (savedToken) {
          // Logic for token-based login would go here
          setIsScanning(false);
          alert('Biometric Identity Verified. Accessing Neural Core...');
        } else {
          setIsScanning(false);
          setError('Biometric data not registered on this node. Please login with Email/Google first to link your profile.');
        }
      } catch (err) {
        setIsScanning(false);
        setError('Biometric scan failed. Clean sensor or use alternative method.');
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-transparent text-white overflow-hidden relative font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 min-h-[100dvh] flex flex-col md:grid md:grid-cols-2 relative z-10 py-8 md:py-0 overflow-x-hidden">
        {/* Scanning Overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-brand-bg/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
            >
              <div className="relative">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-32 h-32 bg-brand-accent/20 rounded-full flex items-center justify-center border-2 border-brand-accent/30"
                >
                  <Fingerprint className="w-16 h-16 text-brand-accent" />
                </motion.div>
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-1 bg-brand-accent shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                />
              </div>
              <h3 className="mt-8 text-2xl font-black italic uppercase tracking-tighter text-brand-text">Neural Scan In Progress</h3>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-text-dim animate-pulse">Authenticating Identity Grid...</p>
              
              <button 
                onClick={() => setIsScanning(false)}
                className="mt-12 text-[10px] font-black uppercase tracking-widest text-brand-text-dim hover:text-white transition-colors"
              >
                Cancel Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left w-full h-full">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center justify-between w-full mb-8 md:mb-16"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white font-extrabold text-lg md:text-xl shadow-lg shadow-brand-accent/20 shrink-0">
                F
              </div>
              <span className="text-xl md:text-2xl font-extrabold tracking-tighter uppercase text-brand-accent">FuelX</span>
            </div>

            <div className="flex bg-brand-sidebar/50 rounded-lg p-1 border border-brand-border shrink-0 scale-90 md:scale-100">
              {(['en', 'ur', 'sd'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-2 md:px-3 py-1 rounded text-[10px] font-black uppercase tracking-tight transition-all",
                    language === lang ? "bg-brand-accent text-white" : "text-brand-text-dim hover:text-white"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {view === 'initial' ? (
              <motion.div
                key="initial"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <h1 className={cn(
                  "text-5xl sm:text-6xl md:text-8xl font-black leading-none uppercase mb-6 md:mb-8 italic tracking-tighter",
                  language !== 'en' && "font-urdu"
                )}>
                  {t('tagline').split(' ')[0]} <br />
                  <span className="text-brand-accent">{t('tagline').split(' ')[1]}</span>
                </h1>
                <p className="text-brand-text-dim text-base md:text-lg max-w-md mb-10 md:mb-12 leading-relaxed">
                  {t('desc')}
                </p>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-4 px-6 md:px-8 py-3.5 md:py-4 bg-brand-text text-brand-bg font-black rounded-xl hover:bg-brand-accent hover:text-white transition-all transform active:scale-95 shadow-xl text-[10px] md:text-xs uppercase tracking-widest flex-1 md:flex-none justify-center"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    {t('login')}
                  </button>
                  <button
                    onClick={() => setView('email-login')}
                    className="flex items-center gap-4 px-6 md:px-8 py-3.5 md:py-4 glass border-brand-border hover:border-brand-accent text-brand-text font-black rounded-xl transition-all transform active:scale-95 text-[10px] md:text-xs uppercase tracking-widest flex-1 md:flex-none justify-center"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setView('phone-login')}
                      className="flex-1 md:flex-none flex items-center justify-center p-3.5 md:p-4 glass border-brand-border hover:border-brand-accent text-brand-text rounded-xl transition-all"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleBiometricLogin}
                      className="flex-1 md:flex-none flex items-center justify-center p-3.5 md:p-4 glass border-brand-border hover:border-brand-accent text-brand-text rounded-xl transition-all"
                    >
                      <Fingerprint className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="forms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md w-full"
              >
                <button 
                  onClick={() => { setView('initial'); setError(''); }}
                  className="flex items-center gap-2 text-brand-text-dim hover:text-brand-accent mb-8 transition-colors uppercase text-[10px] font-black tracking-widest"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('back_to_login')}
                </button>

                <h2 className={cn("text-4xl font-black italic uppercase italic tracking-tighter mb-8", language !== 'en' && "font-urdu")}>
                  {view === 'email-login' && t('login_btn')}
                  {view === 'email-signup' && t('create_account')}
                  {view === 'forgot-password' && t('forgot_password')}
                  {view === 'phone-login' && t('phone_login')}
                </h2>

                <form onSubmit={view === 'forgot-password' ? handleResetPassword : handleEmailAuth} className="space-y-6">
                  {view !== 'phone-login' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim">{t('email')}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full bg-brand-sidebar border border-brand-border rounded-xl px-12 py-4 outline-none focus:border-brand-accent transition-colors text-brand-text"
                          placeholder="johndoe@fuelx.com"
                        />
                      </div>
                    </div>
                  )}

                  {view === 'phone-login' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim">{t('phone_login')}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                        <input 
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full bg-brand-sidebar border border-brand-border rounded-xl px-12 py-4 outline-none focus:border-brand-accent transition-colors text-brand-text"
                          placeholder="+92 3XX XXXXXXX"
                        />
                      </div>
                    </div>
                  )}

                  {(view === 'email-login' || view === 'email-signup') && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim">{t('password')}</label>
                        {view === 'email-login' && (
                          <button 
                            type="button"
                            onClick={() => setView('forgot-password')}
                            className="text-[10px] font-black uppercase tracking-widest text-brand-accent"
                          >
                            {t('forgot_password')}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-dim" />
                        <input 
                          type="password"
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full bg-brand-sidebar border border-brand-border rounded-xl px-12 py-4 outline-none focus:border-brand-accent transition-colors text-brand-text"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  )}

                  {error && <p className="text-red-500 text-xs font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-brand-accent text-white rounded-xl font-black uppercase tracking-widest italic hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (
                      view === 'email-login' ? t('login_btn') : 
                      view === 'email-signup' ? t('create_account') : 
                      view === 'forgot-password' ? t('reset_link') :
                      'Send OTP'
                    )}
                  </button>

                  <div className="text-center pt-4">
                    {view === 'email-login' && (
                      <button 
                        type="button"
                        onClick={() => setView('email-signup')}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim hover:text-brand-text transition-colors"
                      >
                        {t('no_account')} <span className="text-brand-accent ml-1">{t('create_account')}</span>
                      </button>
                    )}
                    {(view === 'email-signup' || view === 'forgot-password' || view === 'phone-login') && (
                      <button 
                        type="button"
                        onClick={() => setView('email-login')}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim hover:text-brand-text transition-colors"
                      >
                        {t('have_account')} <span className="text-brand-accent ml-1">{t('login_btn')}</span>
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="hidden md:flex flex-col justify-center relative pl-20">
           <div className="grid grid-cols-2 gap-6 scale-110">
              <FeatureCard 
                icon={<Grid className="w-8 h-8 text-brand-accent" />}
                title="Universal Map"
                desc="Real-time rush status and stock across 5K+ hubs."
                delay={0.5}
              />
              <FeatureCard 
                icon={<Activity className="w-8 h-8 text-green-500" />}
                title="AI Diagnostics"
                desc="Gemini-powered health scans and mileage alerts."
                delay={0.6}
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-8 h-8 text-red-500" />}
                title="Anti-Theft"
                desc="Live nozzle stream monitoring for hub owners."
                delay={0.7}
              />
              <div className="glass p-10 rounded-[2.5rem] flex items-center justify-center">
                 <div className="text-center">
                    <div className="text-[10px] font-black text-brand-text-dim uppercase tracking-[0.4em] mb-2">Live Node</div>
                    <div className="text-5xl font-black text-brand-accent italic">PH-1</div>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{desc}</p>
    </motion.div>
  );
}

