import React, { useState, useEffect } from 'react';
import { Activity, Facility, LabFlowStep, Product } from '../types';
import { askLabAssistant, getDelSimUpdates } from '../services/geminiService';

// --- ACTIVITIES LIST ---
export const ActivitiesSection: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <div className="h-full flex flex-col gap-8 p-6 animate-fade-in">
      <h2 className="text-6xl font-bold text-white border-b-2 border-slate-700 pb-6 mb-4">
        Jadwal Kegiatan
      </h2>
      <div className="grid gap-8">
        {activities.map((act) => (
          <div key={act.id} className="bg-slate-800/50 backdrop-blur border-2 border-slate-700 p-8 rounded-3xl shadow-lg relative overflow-hidden group hover:border-neon-blue transition-all duration-300">
            <div className={`absolute top-0 right-0 px-6 py-2 text-lg font-bold uppercase tracking-wider
              ${act.status === 'upcoming' ? 'bg-blue-600 text-white' : 
                act.status === 'ongoing' ? 'bg-green-500 text-slate-900' : 'bg-slate-600 text-slate-300'}
              rounded-bl-2xl shadow-lg`}>
              {act.status}
            </div>
            <h3 className="text-4xl font-bold text-white mb-3 mt-2 leading-tight">{act.title}</h3>
            <div className="flex gap-8 text-slate-300 text-xl mb-6 font-mono border-b border-slate-700/50 pb-4">
              <span className="flex items-center gap-2">📅 {act.date}</span>
              <span className="flex items-center gap-2">⏰ {act.time}</span>
            </div>
            <p className="text-slate-200 text-2xl leading-relaxed font-light">{act.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PRODUCT SHOWCASE ---
export const ProductsSection: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="h-full flex flex-col gap-8 p-6 animate-slide-up">
      <h2 className="text-6xl font-bold text-white border-b-2 border-slate-700 pb-6">
        Hasil Karya Lab
      </h2>
      <div className="grid grid-cols-1 gap-10 pb-10">
        {products.map((prod) => (
          <div key={prod.id} className="bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700 flex flex-col">
            <div className="h-64 overflow-hidden relative">
              <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent h-32" />
            </div>
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-4xl font-bold text-neon-blue">{prod.name}</h3>
                <span className="px-4 py-2 bg-slate-700 rounded-xl text-lg text-slate-300 font-semibold tracking-wide">{prod.type}</span>
              </div>
              <p className="text-slate-200 text-2xl leading-relaxed mb-6">{prod.description}</p>
              <div className="text-xl text-slate-500 font-mono border-t border-slate-700 pt-4">By: {prod.author}</div>
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
    <div className="h-full flex flex-col p-6 animate-fade-in">
      <h2 className="text-6xl font-bold text-white border-b-2 border-slate-700 pb-8 mb-8">
        Alur Penggunaan Lab
      </h2>
      <div className="relative pl-12 border-l-4 border-slate-700 space-y-16 ml-4">
        {flow.map((step, idx) => (
          <div key={step.id} className="relative">
            <div className="absolute -left-[68px] top-0 w-28 h-28 bg-slate-900 rounded-full flex items-center justify-center border-8 border-slate-700 z-10 shadow-xl">
              <span className="text-5xl font-bold text-neon-blue font-mono">{idx + 1}</span>
            </div>
            <div className="ml-10 pt-2">
              <h3 className="text-4xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-slate-200 text-2xl leading-relaxed bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 shadow-inner">
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
    <div className="h-full flex flex-col gap-8 p-6 animate-fade-in">
      <h2 className="text-6xl font-bold text-white border-b-2 border-slate-700 pb-6">
        Informasi Sarana
      </h2>
      <div className="grid gap-6">
        {facilities.map((fac) => (
          <div key={fac.id} className="flex items-center justify-between p-8 bg-slate-800 rounded-3xl border-2 border-slate-700 shadow-lg">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white">{fac.name}</h3>
              <p className="text-xl text-slate-400 font-mono">{fac.specs}</p>
            </div>
            <div className={`px-6 py-3 rounded-xl font-bold text-xl uppercase tracking-wide shadow-glow
              ${fac.status === 'available' ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30' : 
                fac.status === 'occupied' ? 'bg-red-500/20 text-red-400 border-2 border-red-500/30' : 
                'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/30'}`}>
              {fac.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- DELSIM WEB INFO ---
export const DelSimSection: React.FC = () => {
  const [info, setInfo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const targetUrl = "https://industrial.uii.ac.id/laboratorium/delsim/";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(targetUrl)}&bgcolor=0f172a&color=00f3ff`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getDelSimUpdates();
      setInfo(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in overflow-hidden">
      <h2 className="text-6xl font-bold text-white border-b-2 border-slate-700 pb-6 mb-6">
        DelSim Web Info
      </h2>
      
      <div className="flex flex-col h-full gap-8">
        <div className="flex-1 bg-slate-800/50 border border-slate-600 rounded-3xl p-8 overflow-y-auto shadow-inner relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 border-8 border-slate-700 border-t-neon-blue rounded-full animate-spin"></div>
              <p className="text-2xl text-neon-blue animate-pulse">Mengambil Data Terbaru dari UII...</p>
            </div>
          ) : (
             <div className="prose prose-invert prose-2xl max-w-none">
               {/* Using a safe way to render newlines without dangerouslySetInnerHTML if it's simple text, 
                   but since Gemini returns Markdown-like text, we'll preserve whitespace */}
               <div className="whitespace-pre-wrap leading-relaxed text-slate-200">
                 {info}
               </div>
             </div>
          )}
        </div>

        <div className="h-64 bg-slate-900 rounded-3xl border-2 border-slate-700 flex items-center p-6 gap-8 shadow-xl">
          <div className="bg-white p-4 rounded-xl h-full aspect-square flex items-center justify-center">
            {/* Using standard QR API */}
            <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <h3 className="text-4xl font-bold text-white mb-2">Kunjungi Website</h3>
            <p className="text-2xl text-slate-400 mb-2">Scan untuk info lebih lengkap</p>
            <p className="text-xl text-neon-blue font-mono truncate">{targetUrl}</p>
          </div>
        </div>
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
    <div className="h-full flex flex-col p-6 animate-fade-in">
      <div className="text-center mb-12 mt-4">
        <div className="w-32 h-32 bg-gradient-to-br from-neon-blue to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(0,243,255,0.4)] animate-pulse-slow">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>
        <h2 className="text-5xl font-bold text-white mb-2">Virtual Lab Assistant</h2>
        <p className="text-2xl text-slate-400">Powered by Gemini AI</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tanya jadwal, alat, atau SOP..."
            className="w-full bg-slate-800 text-white p-8 pr-20 rounded-3xl text-2xl border-2 border-slate-600 focus:border-neon-blue outline-none transition-colors shadow-inner"
          />
          <button type="submit" disabled={loading} className="absolute right-4 top-4 p-4 bg-slate-700 rounded-2xl hover:bg-slate-600 disabled:opacity-50">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center text-neon-blue animate-pulse text-2xl font-mono mb-8">Sedang berpikir...</div>
      )}

      {answer && (
        <div className="bg-slate-800/80 p-8 rounded-3xl border-2 border-slate-600 shadow-2xl animate-slide-up">
          <p className="text-3xl text-slate-200 leading-relaxed whitespace-pre-wrap">{answer}</p>
        </div>
      )}

      <div className="mt-auto">
        <p className="text-xl text-slate-500 text-center px-8">
          Contoh: "Kapan lab buka?", "Apakah workstation 01 tersedia?", "Apa prosedur peminjaman alat?"
        </p>
      </div>
    </div>
  );
};