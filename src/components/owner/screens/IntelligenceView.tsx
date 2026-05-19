import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Send,
  Bot,
  Zap,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import { cn } from '../../../lib/utils';
import { db } from '../../../lib/firebase';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function IntelligenceView() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: "Hello! I am FuelX AI. I've analyzed your station's data and detected a potential efficiency gain in your Diesel replenishment cycle. Would you like to see the breakdown?" }
  ]);
  const [input, setInput] = useState('');
  const [insights, setInsights] = useState<any[]>([]);

  // Mock Prediction Data
  const predictionData = [
    { name: 'Mon', stock: 45000, predicted: 44000 },
    { name: 'Tue', stock: 42000, predicted: 41000 },
    { name: 'Wed', stock: 38000, predicted: 37500 },
    { name: 'Thu', stock: 32000, predicted: 31000 },
    { name: 'Fri', stock: 28000, predicted: 22000 }, // Big drop predicted
    { name: 'Sat', stock: 21000, predicted: 15000 },
    { name: 'Sun', stock: 15000, predicted: 8000 },
  ];

  useEffect(() => {
    // Simulate AI computing
    setTimeout(() => {
      setInsights([
        {
          id: 1,
          type: 'alert',
          title: 'Stockout Prediction',
          desc: 'High probability of High-Octane stockout in 72 hours due to local holiday traffic.',
          impact: 'Critical',
          action: 'Replenish Now'
        },
        {
          id: 4,
          type: 'alert',
          title: 'Credit Limit Violation',
          desc: 'Customer "Transport Corp" has exceeded its credit limit of PKR 1,000,000 by 12%.',
          impact: 'Critical',
          action: 'Block Fueling'
        },
        {
          id: 5,
          type: 'efficiency',
          title: 'Shift Leaderboard',
          desc: 'Attendant "Aslam Khan" is performing 15% above average volume this week.',
          impact: 'Optimal',
          action: 'View Shift'
        },
        {
          id: 2,
          type: 'opportunity',
          title: 'Price Optimization',
          desc: 'Competitors in 5km radius raised prices by 2%. You can adjust markup by +0.5% without losing volume.',
          impact: 'Medium',
          action: 'Update Rates'
        },
        {
          id: 3,
          type: 'efficiency',
          title: 'Shift Anomaly',
          desc: 'Night shift fuel variance is 0.4% higher than average. Possible calibration or leakage issue.',
          impact: 'High',
          action: 'Inspect Pumps'
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Grid offline. I'm having trouble connecting to my neural network." }]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full"
        />
        <div className="text-center">
          <h3 className="text-xl font-black italic uppercase tracking-tighter animate-pulse">Initializing Intelligence Layer</h3>
          <p className="text-brand-text-dim text-[10px] uppercase tracking-widest mt-2">Syncing with global energy grids...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-brand-accent mb-2">
            <BrainCircuit className="w-8 h-8" />
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">AI Intelligence</h2>
          </div>
          <p className="text-brand-text-dim text-xs font-bold uppercase tracking-widest">Neural Logistics & Predictive Analytics</p>
        </div>
        <div className="flex items-center gap-3 bg-brand-accent/10 border border-brand-accent/20 px-4 py-2 rounded-xl">
           <Zap className="w-4 h-4 text-brand-accent" />
           <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Engine Active</span>
        </div>
      </header>

      {/* Prediction Monitor */}
      <div className="glass p-6 md:p-8 rounded-[2rem] border-brand-accent/30 bg-gradient-to-br from-brand-accent/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <TrendingUp className="w-48 h-48" />
        </div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-accent" />
              Stock Exhaustion Forecast
            </h3>
            <p className="text-[10px] text-brand-text-dim uppercase tracking-widest mt-1">7-Day Predictive Consumption Model</p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-black italic text-brand-accent">94.2%</div>
             <div className="text-[8px] font-black uppercase tracking-widest text-brand-accent">Model Accuracy</div>
          </div>
        </div>

        <div className="h-[250px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={predictionData}>
              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{backgroundColor: '#0a0a0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                itemStyle={{fontSize: '10px', textTransform: 'uppercase', fontWeight: '900'}}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#312e81" 
                fillOpacity={1} 
                fill="transparent" 
                strokeDasharray="5 5"
                name="AI Prediction"
              />
              <Area 
                type="monotone" 
                dataKey="stock" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorStock)" 
                strokeWidth={3}
                name="Current Trend"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strategic Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <motion.div 
            key={insight.id}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-3xl border-white/5 bg-white/[0.02] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  insight.type === 'alert' ? 'bg-red-500/20 text-red-500' : 
                  insight.type === 'opportunity' ? 'bg-brand-accent/20 text-brand-accent' : 
                  'bg-yellow-500/20 text-yellow-500'
                }`}>
                   {insight.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : 
                    insight.type === 'opportunity' ? <TrendingUp className="w-5 h-5" /> : 
                    <Sparkles className="w-5 h-5" />}
                </div>
                <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                  insight.impact === 'Critical' ? 'bg-red-500 text-white' : 'bg-white/10 text-brand-text-dim'
                }`}>
                  {insight.impact}
                </div>
              </div>
              <h4 className="text-sm font-black italic uppercase tracking-tight mb-2">{insight.title}</h4>
              <p className="text-[10px] text-brand-text-dim leading-relaxed tracking-wide mb-6">{insight.desc}</p>
            </div>
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
              {insight.action}
              <ChevronRight className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Fuel Integrity Audit Hub */}
      <div className="glass p-8 md:p-10 rounded-[2.5rem] border-brand-border/10 bg-white/[0.01]">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
               <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-red-500" />
                  Fuel Integrity Audit
               </h3>
               <p className="text-[10px] text-brand-text-dim uppercase tracking-widest mt-1">Cross-referencing telemetry with refueling logs</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim">Network Status</div>
                  <div className="text-[12px] font-black uppercase italic text-brand-accent">Monitoring 4 Drivers</div>
               </div>
               <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-brand-accent animate-pulse" />
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim border-b border-white/5">
                     <hr className="pb-4" />
                     <th className="pb-4 pr-6">Driver / ID</th>
                     <th className="pb-4 px-6">Last Refill</th>
                     <th className="pb-4 px-6">Distance</th>
                     <th className="pb-4 px-6">AI Audit</th>
                     <th className="pb-4 text-right">Confidence</th>
                  </tr>
               </thead>
               <tbody className="text-xs">
                  {[
                    { id: 'D-802', name: 'Jan Mohammad', vehicle: 'V-Tesla-X', fuel: '12.5L', dist: '152 KM', status: 'Optimal', color: 'green', impact: '12.1 KM/L' },
                    { id: 'D-415', name: 'Aslam Khan', vehicle: 'V-Lorry-4', fuel: '45.0L', dist: '180 KM', status: 'Anomaly', color: 'red', impact: '4.0 KM/L (Expected 8+)' },
                    { id: 'D-291', name: 'Zeeshan Ali', vehicle: 'V-Honda-Civ', fuel: '10.0L', dist: '120 KM', status: 'Optimal', color: 'green', impact: '12.0 KM/L' },
                    { id: 'D-118', name: 'Hamza Malik', vehicle: 'V-Van-90', fuel: '20.0L', dist: '140 KM', status: 'Caution', color: 'yellow', impact: '7.0 KM/L (Low)' },
                  ].map((row, i) => (
                    <tr key={i} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                       <td className="py-6 pr-6">
                          <div className="font-bold text-brand-text">{row.name}</div>
                          <div className="text-[10px] text-brand-text-dim font-black uppercase tracking-widest">{row.id} • {row.vehicle}</div>
                       </td>
                       <td className="py-6 px-6">
                          <div className="font-bold">{row.fuel}</div>
                          <div className="text-[9px] text-brand-text-dim uppercase tracking-widest">14:20 PM Today</div>
                       </td>
                       <td className="py-6 px-6">
                          <div className="font-bold">{row.dist}</div>
                          <div className="text-[9px] text-brand-text-dim uppercase tracking-widest">Calculated Trace</div>
                       </td>
                       <td className="py-6 px-6">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            row.color === 'green' ? "bg-green-500/10 text-green-500" : 
                            row.color === 'red' ? "bg-red-500/10 text-red-500 animate-pulse border border-red-500/20" : 
                            "bg-yellow-500/10 text-yellow-500"
                          )}>
                             <div className={cn("w-1.5 h-1.5 rounded-full ring-2", 
                               row.color === 'green' ? "bg-green-500 ring-green-500/20" : 
                               row.color === 'red' ? "bg-red-500 ring-red-500/20" : 
                               "bg-yellow-500 ring-yellow-500/20"
                             )} />
                             {row.status}
                             <span className="opacity-60">• {row.impact}</span>
                          </div>
                          {row.status === 'Anomaly' && (
                            <div className="text-[8px] text-red-500 font-bold uppercase mt-1">Possible fuel siphoning detected</div>
                          )}
                       </td>
                       <td className="py-6 text-right">
                          <div className="text-lg font-black italic tracking-tighter text-brand-text">98%</div>
                          <div className="text-[8px] text-brand-text-dim uppercase font-black">Neural Confidence</div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 border border-brand-accent/20 rounded-3xl bg-brand-accent/5">
            <div className="flex items-center gap-4">
               <Bot className="w-8 h-8 text-brand-accent" />
               <p className="text-[11px] text-brand-text leading-relaxed tracking-wide">
                  <span className="font-black italic uppercase text-brand-accent">Neural Insight:</span> Driver <span className="font-bold">Aslam Khan (D-415)</span> showed a discrepancy of 12.4 Liters between station discharge and logged odometer progress. System recommends manual audit of <span className="underline decoration-red-500">Nozzle Calibration</span> or <span className="underline decoration-red-500">Route Deviations</span>.
               </p>
            </div>
            <button className="shrink-0 px-8 py-3.5 bg-brand-accent text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-brand-accent/20 hover:brightness-110 active:scale-95 transition-all">
               Generate Legal Audit
            </button>
         </div>
      </div>

      {/* Digital Shift Reports Hub */}
      <div className="glass p-8 md:p-10 rounded-[2.5rem] border-brand-border/10">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                  <Clock className="w-6 h-6 text-brand-accent" />
                  Digital Shift Ledger
               </h3>
               <p className="text-[10px] text-brand-text-dim uppercase tracking-widest mt-1">Worker throughput & Nozzle-specific activity</p>
            </div>
            <div className="flex gap-2">
               {['Morning', 'Evening', 'Night'].map(shift => (
                 <button key={shift} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all">
                   {shift}
                 </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim px-4">Active Attendants</h4>
               {[
                 { name: 'Jan Mohammad', nozzle: '01, 02', status: 'In Shift', sales: 'PKR 125k', rank: 1 },
                 { name: 'Shahid Afridi', nozzle: '03, 04', status: 'In Shift', sales: 'PKR 98k', rank: 2 },
                 { name: 'Bilal Khan', nozzle: '05, 06', status: 'Standby', sales: 'PKR 42k', rank: 3 },
               ].map((worker, i) => (
                 <div key={i} className="flex items-center justify-between p-5 glass-light rounded-2xl border-white/5 group hover:border-brand-accent/30 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-brand-sidebar rounded-xl border border-white/5 flex items-center justify-center font-black italic text-brand-accent text-lg">
                          0{worker.rank}
                       </div>
                       <div>
                          <div className="text-sm font-black italic uppercase tracking-tight">{worker.name}</div>
                          <div className="text-[9px] text-brand-text-dim font-bold uppercase">Nozzles: {worker.nozzle}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-brand-text">{worker.sales}</div>
                       <div className={`text-[8px] font-black uppercase tracking-widest ${worker.status === 'In Shift' ? 'text-green-500' : 'text-brand-text-dim'}`}>
                          {worker.status}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            <div className="glass-light p-8 rounded-3xl border-white/5 flex flex-col justify-center items-center text-center space-y-6">
               <div className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center text-brand-accent animate-pulse">
                  <Bot className="w-10 h-10" />
               </div>
               <div>
                  <h5 className="text-sm font-black italic uppercase tracking-tighter">Shift Summary AI</h5>
                  <p className="text-[10px] text-brand-text-dim mt-2 px-6">Current morning shift is performing <span className="text-green-500 font-bold">12% better</span> than yesterday. Nozzle #4 is experiencing heavy load. Consider re-routing traffic.</p>
               </div>
               <button className="w-full py-4 bg-brand-bg border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-brand-accent transition-all">
                  Export Shift Report
               </button>
            </div>
         </div>
      </div>

      {/* Floating AI Chat Assistant */}
      <div className="fixed bottom-24 lg:bottom-10 right-6 md:right-10 z-[100]">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-[85vw] md:w-96 glass-heavy border-brand-accent/20 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[60vh]"
            >
              <div className="bg-brand-accent p-6 flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h3 className="text-white font-black italic uppercase tracking-tighter text-sm">FuelX Smart Assistant</h3>
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                       <span className="text-[8px] text-white/70 uppercase font-black tracking-widest">Processing Node #0294</span>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/40">
                 {messages.map((msg, i) => (
                   <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-brand-accent text-white rounded-br-none' 
                          : 'bg-white/5 border border-white/10 text-brand-text rounded-bl-none'
                      }`}>
                         {msg.content}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-4 bg-black/60 border-t border-white/5">
                 <div className="relative">
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about your station..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-brand-text outline-none focus:border-brand-accent transition-all text-xs"
                    />
                    <button 
                      onClick={handleSend}
                      className="absolute right-2 top-1.5 p-2 text-brand-accent hover:text-white transition-colors"
                    >
                       <Send className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90 relative ${
            chatOpen ? 'bg-white text-black rotate-90' : 'bg-brand-accent text-white'
          }`}
        >
          {chatOpen ? <ChevronRight className="w-8 h-8" /> : <MessageSquare className="w-7 h-7" />}
          {!chatOpen && (
             <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-brand-bg flex items-center justify-center text-[8px] font-black">1</span>
          )}
        </button>
      </div>
    </div>
  );
}
