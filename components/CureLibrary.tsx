
import React, { useState } from 'react';
import { Cure } from '../types';

const MOCK_CURES: Cure[] = [
  {
    id: 'c1',
    title: 'Neem-Soap Emulsion',
    targetPathogen: 'Aphids, Whiteflies, Mites',
    materials: ['Pure Neem Oil', 'Liquid Dish Soap', 'Warm Water'],
    preparation: 'Mix 1 tsp neem oil and 1/2 tsp soap into 1 liter of warm water. Shake vigorously.',
    application: 'Spray early morning or late evening directly onto leaves, including undersides.',
    category: 'Pest'
  },
  {
    id: 'c2',
    title: 'Baking Soda Fungicide',
    targetPathogen: 'Powdery Mildew, Black Spot',
    materials: ['Baking Soda', 'Horticultural Oil', 'Water'],
    preparation: 'Dissolve 1 tbsp baking soda and 1/2 tsp oil in 4 liters of water.',
    application: 'Mist plants weekly during humid periods to prevent fungal growth.',
    category: 'Fungal'
  }
];

const CureLibrary: React.FC = () => {
  const [filter, setFilter] = useState<Cure['category'] | 'All'>('All');

  return (
    <div className="space-y-6 animate-in slide-up duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic">Organic Cure Library</h2>
          <p className="text-slate-500 text-sm font-medium">Sustainable, community-verified protocols</p>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['All', 'Fungal', 'Bacterial', 'Pest', 'Nutrient'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-6 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
              filter === cat ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:border-emerald-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {MOCK_CURES.filter(c => filter === 'All' || c.category === filter).map(cure => (
          <div key={cure.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <i className={`fas ${cure.category === 'Pest' ? 'fa-bug' : 'fa-vial'} text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{cure.title}</h3>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">Effective against: {cure.targetPathogen}</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition">
                <i className="far fa-bookmark"></i>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recipe & Prep</h4>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed italic">"{cure.preparation}"</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cure.materials.map((m, i) => (
                    <span key={i} className="bg-white px-3 py-1 rounded-full border border-slate-100 text-[10px] font-bold text-slate-500">{m}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Application Method</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{cure.application}</p>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center space-x-3">
                  <i className="fas fa-leaf text-emerald-600"></i>
                  <span className="text-[10px] font-black text-emerald-700 uppercase">100% Eco-Safe Verified</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CureLibrary;
