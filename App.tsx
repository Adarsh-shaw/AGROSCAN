
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import AnalysisDisplay from './components/AnalysisDisplay';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import RadarMap from './components/RadarMap';
import CureLibrary from './components/CureLibrary';
import InnovationPortal from './components/InnovationPortal';
import VoiceAssistant from './components/VoiceAssistant';
import { AnalysisState, PlantAnalysisResult, User, OutbreakPoint, FarmAlert } from './types';
import { analyzePlantImage } from './geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>(() => {
    const savedUser = localStorage.getItem('agrosan_current_user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    
    let history: PlantAnalysisResult[] = [];
    let alerts: FarmAlert[] = [
      { id: 'a1', type: 'System', message: 'Vertex AI Model Training Complete (V2.4)', timestamp: Date.now() - 3600000, severity: 'Info' }
    ];

    if (user) {
      const savedHistory = localStorage.getItem(`agrosan_history_${user.uid}`);
      history = savedHistory ? JSON.parse(savedHistory) : [];
    }

    return {
      loading: false,
      error: null,
      result: null,
      imageUrl: null,
      history: history,
      alerts: alerts,
      user: user,
      currentView: user ? 'dashboard' : 'auth',
    };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const outbreaks: OutbreakPoint[] = [
    { id: '1', lat: 37.7749, lng: -122.4194, diseaseName: 'Corn Rust', severity: 'High', timestamp: Date.now() - 86400000 },
    { id: '2', lat: 34.0522, lng: -118.2437, diseaseName: 'Leaf Spot', severity: 'Moderate', timestamp: Date.now() - 172800000 },
    { id: '3', lat: 40.7128, lng: -74.0060, diseaseName: 'Powdery Mildew', severity: 'Critical', timestamp: Date.now() - 3600000 },
  ];

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('agrosan_current_user', JSON.stringify(state.user));
      localStorage.setItem(`agrosan_history_${state.user.uid}`, JSON.stringify(state.history));
    }
  }, [state.history, state.user]);

  const addAlert = (alert: FarmAlert) => {
    setState(prev => ({ ...prev, alerts: [alert, ...prev.alerts].slice(0, 5) }));
  };

  const handleLogin = (user: User) => {
    const savedHistory = localStorage.getItem(`agrosan_history_${user.uid}`);
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    setState(prev => ({ ...prev, user, history, currentView: 'dashboard' }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null, currentView: 'auth', history: [] }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setState(prev => ({ ...prev, loading: true, imageUrl: reader.result as string, currentView: 'scan' }));

      try {
        const result = await analyzePlantImage(base64);
        
        // Preventative Alert Logic: If high risk, notify community (Firebase simulation)
        if (result.neighborRiskLevel === 'High' || result.neighborRiskLevel === 'Critical') {
          addAlert({
            id: Date.now().toString(),
            type: 'Outbreak',
            message: `URGENT: ${result.diseaseName} detected nearby. Prevention protocols activated.`,
            timestamp: Date.now(),
            severity: 'Urgent'
          });
        }

        setState(prev => ({ 
          ...prev, 
          loading: false, 
          result, 
          currentView: 'result',
          history: [result, ...prev.history].slice(0, 50)
        }));
      } catch (err: any) {
        setState(prev => ({ ...prev, loading: false, error: err.message }));
      }
    };
    reader.readAsDataURL(file);
  };

  const navigateTo = (view: AnalysisState['currentView']) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f8fafc] selection:bg-emerald-100">
      {state.user && (
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => navigateTo('dashboard')}>
              <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
                <i className="fas fa-leaf text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">AgroScan <span className="text-emerald-600 italic">Pro</span></h1>
            </div>
            
            <div className="hidden lg:flex items-center space-x-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
               {['dashboard', 'radar', 'library', 'portal', 'voice'].map(v => (
                 <button 
                  key={v}
                  onClick={() => navigateTo(v as any)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${state.currentView === v ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {v}
                 </button>
               ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative group">
                <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all relative">
                  <i className="fas fa-bell"></i>
                  {state.alerts.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>}
                </button>
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all z-50 origin-top-right">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Early Warnings (Firebase Sync)</h4>
                  <div className="space-y-3">
                    {state.alerts.map(a => (
                      <div key={a.id} className={`p-3 rounded-2xl border text-[11px] leading-tight ${a.severity === 'Urgent' ? 'bg-rose-50 border-rose-100 text-rose-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                        {a.message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {state.currentView === 'auth' && <Auth onLogin={handleLogin} />}
        
        {state.currentView === 'dashboard' && (
          <Dashboard 
            history={state.history} 
            onSelectResult={(res) => setState(prev => ({ ...prev, result: res, currentView: 'result' }))}
            onNewScan={() => fileInputRef.current?.click()}
          />
        )}

        {state.currentView === 'radar' && <RadarMap outbreaks={outbreaks} />}
        {state.currentView === 'library' && <CureLibrary />}
        {state.currentView === 'portal' && <InnovationPortal />}
        {state.currentView === 'voice' && <VoiceAssistant />}

        {state.currentView === 'scan' && state.loading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center animate-pulse">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-8 border-emerald-100 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-brain text-2xl text-emerald-600"></i>
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Gemini 2.0 Flash Active</h3>
            <p className="text-slate-400 text-center max-w-xs font-medium italic">Synchronizing with Firebase Outbreak Radar...</p>
          </div>
        )}

        {state.currentView === 'result' && state.result && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => navigateTo('dashboard')} 
              className="mb-6 flex items-center text-slate-400 hover:text-emerald-600 font-bold text-sm group"
            >
              <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> Back to Dashboard
            </button>
            <AnalysisDisplay result={state.result} />
          </div>
        )}

        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
      </main>

      {state.user && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 shadow-2xl flex items-center justify-around z-50 md:hidden">
          <button onClick={() => navigateTo('dashboard')} className={`p-4 rounded-2xl transition-all ${state.currentView === 'dashboard' ? 'text-emerald-400 bg-white/5 shadow-inner' : 'text-slate-500'}`}><i className="fas fa-chart-pie text-xl"></i></button>
          <button onClick={() => navigateTo('radar')} className={`p-4 rounded-2xl transition-all ${state.currentView === 'radar' ? 'text-emerald-400 bg-white/5' : 'text-slate-500'}`}><i className="fas fa-satellite-dish text-xl"></i></button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center bg-emerald-600 text-white w-16 h-16 rounded-[1.8rem] shadow-2xl shadow-emerald-500/40 -mt-10 border-[6px] border-slate-900 active:scale-90 transition-transform"><i className="fas fa-camera text-2xl"></i></button>
          <button onClick={() => navigateTo('library')} className={`p-4 rounded-2xl transition-all ${state.currentView === 'library' ? 'text-emerald-400 bg-white/5' : 'text-slate-500'}`}><i className="fas fa-book-medical text-xl"></i></button>
          <button onClick={() => navigateTo('voice')} className={`p-4 rounded-2xl transition-all ${state.currentView === 'voice' ? 'text-emerald-400 bg-white/5' : 'text-slate-500'}`}><i className="fas fa-microphone text-xl"></i></button>
        </nav>
      )}
    </div>
  );
};

export default App;
