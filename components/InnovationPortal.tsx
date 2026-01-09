
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PORTAL_DATA = [
  { region: 'Northern', detected: 450, controlled: 380, retraining: 85 },
  { region: 'Southern', detected: 600, controlled: 410, retraining: 92 },
  { region: 'Eastern', detected: 320, controlled: 300, retraining: 78 },
  { region: 'Western', detected: 890, controlled: 210, retraining: 98 },
];

const InnovationPortal: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic">Global Ag-Innovation Portal</h2>
          <p className="text-slate-500 text-sm font-medium">Vertex AI Surveillance & Open Data Streams</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg">Surveillance</button>
          <button className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-slate-50 transition">Open API</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vertex AI Retraining Module */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm col-span-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-microchip"></i>
              </div>
              <h3 className="text-lg font-black text-slate-800">Vertex AI Core</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium">Retraining Gemini models based on regional edge-case uploads.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Model Accuracy (V2.4)</span>
                <span className="text-indigo-600">99.2%</span>
              </div>
              <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[99.2%] animate-pulse"></div>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition">Retrain Model</button>
        </div>

        {/* Global Impact Charts */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden md:col-span-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h3 className="text-xl font-black mb-6 flex items-center">
            <i className="fas fa-globe-africa mr-3 text-emerald-400"></i> Region Resilience Index
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PORTAL_DATA}>
                <XAxis dataKey="region" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#ffffff11'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="detected" fill="#334155" radius={[6, 6, 0, 0]} />
                <Bar dataKey="controlled" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>● Detected Pathogens</span>
            <span className="text-emerald-400">● Successfully Isolated</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h3 className="text-2xl font-black text-slate-900 leading-tight">Firebase Real-time Sync for NGOs</h3>
          <p className="text-sm text-slate-500 max-w-lg leading-relaxed">Push localized disease alerts directly into governmental disaster response protocols. Our low-latency Firebase integration ensures zero delay between detection and community alert.</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase">GraphQL Supported</span>
            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase">Push Notifications</span>
            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase">Edge Computing</span>
          </div>
        </div>
        <div className="w-48 h-48 bg-emerald-50 rounded-full flex items-center justify-center border-8 border-white shadow-xl flex-shrink-0">
          <i className="fas fa-rss text-5xl text-emerald-600 animate-pulse"></i>
        </div>
      </div>
    </div>
  );
};

export default InnovationPortal;
