
import React from 'react';
import { OutbreakPoint } from '../types';

interface RadarMapProps {
  outbreaks: OutbreakPoint[];
}

const RadarMap: React.FC<RadarMapProps> = ({ outbreaks }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Outbreak Radar</h2>
          <p className="text-slate-500 text-sm font-medium">Synced with Firebase Cloud Messaging & Google Maps</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm self-start">
          <button className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl">Satellite</button>
          <button className="px-5 py-2 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-slate-50 transition">Topographic</button>
        </div>
      </div>

      <div className="relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl bg-slate-100 group">
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/0,0,1,0,0/800x400?access_token=none')] bg-cover bg-center grayscale opacity-60 group-hover:grayscale-0 transition-all duration-1000"></div>
        
        {/* Radar Scanning Line */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-400/30 blur-sm animate-[scan_4s_linear_infinite]"></div>
        <style>{`
          @keyframes scan {
            from { transform: translateX(0); }
            to { transform: translateX(1000px); }
          }
        `}</style>
        
        {/* Outbreak Heat Zones */}
        {outbreaks.map((p) => (
          <div 
            key={p.id} 
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
            style={{ left: `${(p.lng + 180) % 100}%`, top: `${(p.lat + 90) % 100}%` }}
          >
             <div className="relative">
                <div className={`absolute inset-0 w-12 h-12 rounded-full -translate-x-1/4 -translate-y-1/4 animate-ping opacity-20 ${
                  p.severity === 'Critical' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}></div>
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center border-2 border-white shadow-xl transition-all group-hover/pin:scale-125 ${
                  p.severity === 'Critical' ? 'bg-rose-600' : p.severity === 'High' ? 'bg-orange-500' : 'bg-emerald-600'
                }`}>
                  <i className="fas fa-biohazard text-white text-xs"></i>
                </div>
             </div>
            
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-slate-900 text-white p-4 rounded-3xl text-[10px] w-48 shadow-2xl opacity-0 group-hover/pin:opacity-100 transition-all pointer-events-none transform translate-y-2 group-hover/pin:translate-y-0 z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-emerald-400 uppercase tracking-widest">{p.diseaseName}</span>
                <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded">Real-time</span>
              </div>
              <p className="opacity-70 mb-2 font-medium">Confirmed by AI Leaf Scanner • {p.severity} Severity</p>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${p.severity === 'Critical' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center space-x-3">
          <div className="flex space-x-1">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse delay-150"></div>
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">Firebase Live Data Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 col-span-1">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Regional Threat</h4>
          <p className="text-3xl font-black text-slate-900">Moderate</p>
          <p className="text-[10px] font-bold text-emerald-600 mt-2">Decreasing by 4%</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Community Interceptions</h4>
            <span className="text-[9px] font-bold text-slate-300">Last 24 Hours</span>
          </div>
          <div className="flex gap-4">
             {['Soy Rust', 'Locusts', 'Late Blight', 'Mosaic Virus'].map(t => (
               <div key={t} className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center group hover:bg-emerald-50 hover:border-emerald-100 transition-all cursor-default">
                 <p className="text-[10px] font-black text-slate-800">{t}</p>
                 <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.random()*80+20}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarMap;
