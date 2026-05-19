import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Sun, Moon, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export function DashboardControls() {
  const { theme, toggleTheme, clearRole } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(text);
        handleVoiceCommand(text);
        setIsListening(false);
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log("Voice Command Received:", command);
    // Add logic for specific commands
    if (command.includes('light mode') || command.includes('day mode')) {
        if (theme === 'dark') toggleTheme();
    } else if (command.includes('dark mode') || command.includes('night mode')) {
        if (theme === 'light') toggleTheme();
    } else if (command.includes('reset') || command.includes('go back')) {
        clearRole();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Search / Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden md:block glass px-4 py-2 rounded-xl text-xs font-bold text-brand-accent italic uppercase tracking-wider"
          >
            "{transcript}"
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => clearRole()}
        className="p-3 glass border-white/5 rounded-xl text-brand-text-dim hover:text-red-500 hover:border-red-500/50 transition-all active:scale-95 flex items-center gap-2 group"
        title="Switch Protocol (Back)"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="hidden sm:block text-[10px] uppercase font-black tracking-widest">Switch Role</span>
      </button>

      <div className="w-px h-6 bg-white/5 mx-1" />

      <button
        onClick={toggleListening}
        className={`p-3 rounded-xl border transition-all active:scale-90 ${
          isListening 
            ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' 
            : 'glass border-white/5 text-brand-text-dim hover:text-brand-accent hover:border-brand-accent'
        }`}
        title="Voice Command"
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      <button
        onClick={toggleTheme}
        className="p-3 glass border-white/5 rounded-xl text-brand-text-dim hover:text-brand-accent hover:border-brand-accent transition-all active:scale-90"
        title="Day/Night Mode"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}
