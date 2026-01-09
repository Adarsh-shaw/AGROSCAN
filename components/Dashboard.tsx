
import React from 'react';
import { PlantAnalysisResult, DashboardStats } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  history: PlantAnalysisResult[];
  onSelectResult: (result: PlantAnalysisResult) => void;
  onNewScan: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onSelectResult, onNewScan }) => {
  const stats: DashboardStats = {
    totalScans: history.length,
    healthyCount: history.filter(h => h.diseaseName.toLowerCase().includes('healthy')).length,
    diseasedCount: history.filter(h => !h.diseaseName.toLowerCase().includes('healthy')).length,
    riskAlerts: history.filter(h => h.neighborRiskLevel === 'High' || h.neighborRiskLevel === 'Critical').length
  };

  // Generate real activity data from history for the last 7 days
  const getRealActivityData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = [];

    // Initialize the last 7 days with 0 counts
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      last7Days.push({
        name: days[d.getDay()],
        fullDate: d.toLocaleDateString(),
        scans: 0,
        timestampDay: d.setHours(0, 0, 0, 0)
      });
    }

    // Count scans for each day in history
    history.forEach(scan => {
      const scanDate = new Date(scan.timestamp);
      const scanDayStart = new Date(scanDate).setHours(0, 0, 0, 0);
      
      const dayMatch = last7Days.find(d => d.timestampDay === scanDayStart);
      if (dayMatch) {
        dayMatch.scans += 1;
      }
    });

    return last7Days;
  };

  const chartData = getRealActivityData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Farm Overview</h2>
          <p className="text-gray-400 text-sm font-medium">Real-time agricultural intelligence</p>
        </div>
        <button 
          onClick={onNewScan}
          className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition active:scale-95 flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> New Scan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <i className="fas fa-magnifying-glass"></i>
          </div>
          <div className="text-2xl font-black text-gray-900">{stats.totalScans}</div>
          <div className="text-[10px] uppercase font-bold text-gray-400">Total Scans</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="text-2xl font-black text-gray-900">{stats.healthyCount}</div>
          <div className="text-[10px] uppercase font-bold text-gray-400">Healthy Plants</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <i className="fas fa-virus"></i>
          </div>
          <div className="text-2xl font-black text-gray-900">{stats.diseasedCount}</div>
          <div className="text-[10px] uppercase font-bold text-gray-400">Pathologies</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
            <i className="fas fa-triangle-exclamation"></i>
          </div>
          <div className="text-2xl font-black text-gray-900">{stats.riskAlerts}</div>
          <div className="text-[10px] uppercase font-bold text-gray-400">Critical Alerts</div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Weekly Activity</h3>
          <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Live Data</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} 
                dy={10}
              />
              <YAxis 
                allowDecimals={false} 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#cbd5e1'}}
              />
              <Tooltip 
                cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                itemStyle={{ color: '#10b981', fontWeight: 800 }}
                labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="scans" 
                stroke="#10b981" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorScans)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent History List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold text-gray-800">Recent Diagnostics</h3>
          <button className="text-emerald-600 text-sm font-bold hover:underline">See all</button>
        </div>
        <div className="grid gap-3">
          {history.length > 0 ? (
            history.slice(0, 5).map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelectResult(item)}
                className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between cursor-pointer hover:border-emerald-200 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <i className="fas fa-leaf text-2xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.plantName}</h4>
                    <p className="text-xs text-gray-400 font-medium">
                      {item.diseaseName} • {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                    item.neighborRiskLevel === 'Low' ? 'bg-green-50 text-green-600 border-green-100' :
                    item.neighborRiskLevel === 'Moderate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {item.neighborRiskLevel} Risk
                  </div>
                  <i className="fas fa-chevron-right text-gray-200 group-hover:text-emerald-500 transition-colors"></i>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
              <i className="fas fa-folder-open text-gray-300 text-3xl mb-3"></i>
              <p className="text-gray-400 text-sm font-medium">No diagnostic history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
