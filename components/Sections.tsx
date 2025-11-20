import React, { useState } from 'react';
import { Activity, Facility, LabFlowStep, Product } from '../types';
import { askLabAssistant } from '../services/geminiService';

// --- ACTIVITIES LIST ---
export const ActivitiesSection: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <div className="h-full flex flex-col gap-6 p-4 animate-fade-in">
      <h2 className="text-4xl font-bold text-white border-b border-slate-700 pb-4 mb-2">
        Jadwal Kegiatan
      </h2>
      <div className="grid gap-6">
        {activities.map((act) => (
          <div key={act.id} className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-neon-blue transition-all duration-300">
            <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase tracking-wider
              ${act.status === 'upcoming' ? 'bg-blue-600 text-white' : 
                act.status === 'ongoing' ? 'bg-green-500 text-slate-900' : 'bg-slate-600 text-slate-300'}
              rounded-bl-xl`}>
              {act.status}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{act.title}</h3>
            <div className="flex gap-4 text-slate-400 text-sm mb-3 font-mono">
              <span>📅 {act.date}</span>
              <span>⏰ {act.time}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{act.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PRODUCT SHOWCASE ---
export const ProductsSection: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="h-full flex flex-col gap-6 p-4 animate-slide-up">
      <h2 className="text-4xl font-bold text-white border-b border-slate-700 pb-4">
        Hasil Karya Lab
      </h2>
      <div className="grid grid-cols-1 gap-8">
        {products.map((prod) => (
          <div key={prod.id} className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-700 flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent h-20" />
            </div>
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-neon-blue">{prod.name}</h3>
                <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{prod.type}</span>
              </div>
              <p className="text-slate-300 text-sm mb-4">{prod.description}</p>
              <div className="text-xs text-slate-500 font-mono">By: {prod.author}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- LAB FLOW ---
export const FlowSection: React.FC<{ flow: LabFlowStep[] }> = ({ flow }) => {
  return (
    <div className="h-full flex flex-col p-4 animate-fade-in">
      <h2 className="text-4xl font-bold text-white border-b border-slate-700 pb-8 mb-4">
        Alur Penggunaan Lab
      </h2>
      <div className="relative pl-8 border-l-2 border-slate-700 space-y-12">
        {flow.map((step, idx) => (
          <div key={step.id} className="relative">
            <div className="absolute -left-[41px] top-0 w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-700 z-10">
              <span className="text-3xl font-bold text-neon-blue font-mono">{idx + 1}</span>
            </div>
            <div className="ml-8 pt-2">
              <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-300 text-lg leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- FACILITIES ---
export const FacilitiesSection: React.FC<{ facilities: Facility[] }> = ({ facilities }) => {
  return (
    <div className="h-full flex flex-col gap-6 p-4 animate-fade-in">
      <h2 className="text-4xl font-bold text-white border-b border-slate-700 pb-4">
        Informasi Sarana
      </h2>
      <div className="grid gap-4">
        {facilities.map((fac) => (
          <div key={fac.id} className="flex items-center justify-between p-6 bg-slate-800 rounded-xl border border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-white">{fac.name}</h3>
              <p className="text-sm text-slate-400 font-mono">{fac.specs}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide
              ${fac.status === 'available' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                fac.status === 'occupied' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
              {fac.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- AI ASSISTANT ---
export const AISection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer('');
    const response = await askLabAssistant(query);
    setAnswer(response);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-4 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-neon-blue to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.3)] animate-pulse-slow">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>
        <h2 className="text-3xl font-bold text-white">Virtual Lab Assistant</h2>
        <p className="text-slate-400">Powered by Gemini AI</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tanya tentang jadwal, alat, atau SOP..."
            className="w-full bg-slate-800 text-white p-4 pr-12 rounded-xl border border-slate-600 focus:border-neon-blue outline-none transition-colors"
          />
          <button type="submit" disabled={loading} className="absolute right-2 top-2 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-50">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center text-neon-blue animate-pulse">Sedang berpikir...</div>
      )}

      {answer && (
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-600 shadow-xl animate-slide-up">
          <p className="text-lg text-slate-200 leading-relaxed whitespace-pre-wrap">{answer}</p>
        </div>
      )}

      <div className="mt-auto">
        <p className="text-sm text-slate-500 text-center">
          Contoh: "Kapan lab buka?", "Apakah workstation 01 tersedia?", "Apa prosedur peminjaman alat?"
        </p>
      </div>
    </div>
  );
};