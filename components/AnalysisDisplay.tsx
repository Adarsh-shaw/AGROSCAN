
import React from 'react';
import { PlantAnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  result: PlantAnalysisResult;
}

const AnalysisDisplay: React.FC<Props> = ({ result }) => {
  // Normalize confidence score (handle both 0-1 and 0-100 ranges)
  const normalizedScore = result.confidenceScore <= 1 ? result.confidenceScore * 100 : result.confidenceScore;
  const displayScore = Math.round(normalizedScore);

  const chartData = [
    { name: 'Confidence', value: displayScore },
    { name: 'Uncertainty', value: Math.max(0, 100 - displayScore) },
  ];

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Primary Identification */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Verified Species</span>
            <span className="text-gray-400 text-[10px]">{new Date(result.timestamp).toLocaleString()}</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">{result.plantName}</h2>
          <div className="flex flex-col">
            <span className="text-rose-600 text-xs font-bold uppercase tracking-wider">Pathology</span>
            <h3 className="text-xl font-semibold text-gray-800">{result.diseaseName}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">{result.description}</p>
        </div>
        
        <div className="w-36 h-36 flex flex-col items-center justify-center relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={45}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
              >
                <Cell fill="#10b981" />
                <Cell fill="#f3f4f6" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-gray-800">{displayScore}%</span>
            <span className="text-[9px] text-gray-400 uppercase font-bold">Accuracy</span>
          </div>
        </div>
      </section>

      {/* Pathogen Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center">
            <i className="fas fa-microscope mr-2 text-emerald-500"></i> Biological Cause
          </h4>
          <p className="text-gray-700 text-sm italic leading-relaxed">{result.biologicalCause}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center">
            <i className="fas fa-cloud-sun mr-2 text-amber-500"></i> Environmental Triggers
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.environmentalTriggers.map((t, i) => (
              <span key={i} className="bg-amber-50 text-amber-700 text-[10px] px-2 py-1 rounded-md font-medium border border-amber-100">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <i className="fas fa-satellite-dish text-emerald-600"></i>
            <h4 className="text-lg font-bold text-gray-900">Regional Impact Analysis</h4>
          </div>
          {result.location && (
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">
              <i className="fas fa-location-dot mr-1"></i> 
              {result.location.lat.toFixed(4)}, {result.location.lng.toFixed(4)}
            </span>
          )}
        </div>
        <div className={`inline-flex items-center px-4 py-1.5 rounded-xl border text-sm font-bold mb-4 shadow-sm ${getRiskColor(result.neighborRiskLevel)}`}>
          {result.neighborRiskLevel} Risk to Neighboring Farms
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{result.riskReasoning}</p>
      </section>

      {/* Treatment Plan */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
            <i className="fas fa-kit-medical text-white"></i>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-gray-900">Precision Treatment Plan</h4>
            <p className="text-xs text-gray-400">Step-by-step restoration using local materials</p>
          </div>
        </div>
        <div className="space-y-4">
          {result.treatmentPlan.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-5 hover:border-emerald-200 transition-colors group">
              <div className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 rounded-full flex items-center justify-center font-black flex-shrink-0 transition-colors text-lg">
                0{idx + 1}
              </div>
              <div className="space-y-2">
                <h5 className="font-bold text-gray-900 text-lg leading-tight">{item.step}</h5>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.materials.map((m, mIdx) => (
                    <span key={mIdx} className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prevention */}
      <section className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <h4 className="text-xl font-bold mb-6 flex items-center relative z-10">
          <i className="fas fa-shield-halved mr-3 text-emerald-400"></i> Farm Protection Protocol
        </h4>
        <div className="grid gap-4 relative z-10">
          {result.preventionStrategies.map((strategy, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
              <i className="fas fa-check text-emerald-400 mt-1 text-sm"></i>
              <span className="text-slate-200 text-sm leading-relaxed">{strategy}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnalysisDisplay;
