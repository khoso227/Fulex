import React from 'react';
import { motion } from 'motion/react';

export function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-brand-bg">
      {/* Mesh Gradient Base */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-accent/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(var(--color-brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-border) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Animated Floating Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0], 
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-accent/5 rounded-full blur-[100px]"
      />
      
      <motion.div 
        animate={{ 
          x: [0, -80, 0], 
          y: [0, 60, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]"
      />

      {/* Subtle Noise Texture - Alternative without external URL if possible */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-white" />
    </div>
  );
}
