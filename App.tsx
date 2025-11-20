import React, { useEffect, useState, useRef } from 'react';
import { Clock } from './components/Clock';
import { storageService } from './services/storageService';
import { ActivitiesSection, ProductsSection, FlowSection, FacilitiesSection, AISection } from './components/Sections';
import { AdminPanel } from './components/AdminPanel';
import { AppMode, Section } from './types';
import { LAB_INFO } from './constants';

function App() {
  // -- State --
  const [mode, setMode] = useState<AppMode>(AppMode.SCREENSAVER);
  const [activeSection, setActiveSection] = useState<Section>(Section.HOME);
  const [screensaverIndex, setScreensaverIndex] = useState(0);
  
  // -- Data State --
  const [activities, setActivities] = useState(storageService.getActivities());
  const [products, setProducts] = useState(storageService.getProducts());
  const [facilities, setFacilities] = useState(storageService.getFacilities());
  const [flow, setFlow] = useState(storageService.getFlow());

  // -- Refs --
  // Using 'any' for timer refs to avoid DOM vs Node.js type conflicts in mixed environments
  const idleTimeoutRef = useRef<any>(null);
  const screensaverIntervalRef = useRef<any>(null);

  // -- Interaction Handlers --
  const resetIdleTimer = () => {
    if (mode === AppMode.ADMIN) return; // Don't interrupt admin

    if (mode === AppMode.SCREENSAVER) {
      setMode(AppMode.INTERACTIVE);
      setActiveSection(Section.HOME);
    }

    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    
    // Return to screensaver after 60 seconds of inactivity
    idleTimeoutRef.current = setTimeout(() => {
      setMode(AppMode.SCREENSAVER);
      setActiveSection(Section.HOME);
    }, 60000);
  };

  // Listen for global interactions
  useEffect(() => {
    window.addEventListener('click', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    window.addEventListener('mousemove', resetIdleTimer);
    
    return () => {
      window.removeEventListener('click', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
    };
  }, [mode]);

  // -- Screensaver Rotation Logic --
  useEffect(() => {
    if (mode === AppMode.SCREENSAVER) {
      screensaverIntervalRef.current = setInterval(() => {
        setScreensaverIndex(prev => (prev + 1) % 3); // Rotate between 3 main views
      }, 8000); // Switch every 8 seconds
    } else {
      if (screensaverIntervalRef.current) clearInterval(screensaverIntervalRef.current);
    }
    return () => {
      if (screensaverIntervalRef.current) clearInterval(screensaverIntervalRef.current);
    };
  }, [mode]);

  // Sync data when entering specific modes or periodically
  useEffect(() => {
    // Simple polling to simulate "Remote Desktop Update" reflection
    // In a real app, AdminPanel saving updates localStorage, this interval picks it up.
    const sync = setInterval(() => {
      setActivities(storageService.getActivities());
      setProducts(storageService.getProducts());
      setFacilities(storageService.getFacilities());
      setFlow(storageService.getFlow());
    }, 5000);
    return () => clearInterval(sync);
  }, []);

  // -- Render Screensaver Content --
  const renderScreensaverContent = () => {
    // Cycle between Intro/Clock, Recent Activities, and Facility Status
    if (screensaverIndex === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center animate-fade-in">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight">{LAB_INFO.name}</h1>
            <p className="text-xl text-slate-400 tracking-widest uppercase">Department of Industrial Engineering</p>
          </div>
          <Clock variant="large" />
          <div className="mt-24 text-center">
            <p className="text-neon-blue animate-pulse font-mono">Tap Screen to Interact</p>
          </div>
        </div>
      );
    } else if (screensaverIndex === 1) {
      return (
        <div className="p-8 h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-400 mb-8 uppercase tracking-widest">Upcoming Activities</h2>
          <div className="space-y-6">
            {activities.slice(0, 3).map(a => (
              <div key={a.id} className="bg-slate-800/50 border-l-4 border-neon-blue p-6 rounded-r-xl">
                <div className="text-2xl font-bold text-white">{a.title}</div>
                <div className="text-lg text-slate-300 mt-1">{a.date} | {a.time}</div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
       return (
        <div className="p-8 h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-400 mb-8 uppercase tracking-widest">Facility Status</h2>
           <div className="grid grid-cols-1 gap-6">
             {facilities.slice(0, 5).map(f => (
               <div key={f.id} className="flex justify-between items-center bg-slate-800/80 p-6 rounded-xl">
                 <span className="text-xl font-bold text-white">{f.name}</span>
                 <span className={`px-4 py-1 rounded-full font-bold uppercase text-sm
                   ${f.status === 'available' ? 'bg-green-500 text-slate-900' : 
                     f.status === 'occupied' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-slate-900'}`}>
                   {f.status}
                 </span>
               </div>
             ))}
           </div>
        </div>
       );
    }
  };

  // -- Interactive Menu Buttons --
  const MenuButton: React.FC<{ label: string; icon: string; section: Section }> = ({ label, icon, section }) => (
    <button 
      onClick={() => setActiveSection(section)}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
        ${activeSection === section 
          ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.2)]' 
          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="font-bold text-sm uppercase tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 text-white select-none">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-blue-900/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-purple-900/20 blur-[100px] rounded-full" />
      </div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* HEADER */}
        <header className="h-24 flex items-center justify-between px-8 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="font-bold text-xl text-white tracking-tight">SIMLAB</span>
            <span className="text-xs text-slate-400">Modeling & Simulation</span>
          </div>
          <Clock />
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 overflow-hidden relative">
          
          {/* MODE: SCREENSAVER */}
          {mode === AppMode.SCREENSAVER && (
             <div className="absolute inset-0 bg-slate-900 z-20">
               {renderScreensaverContent()}
               {/* Bottom info bar */}
               <div className="absolute bottom-0 w-full bg-slate-900/90 border-t border-slate-800 p-4 flex justify-between items-center text-slate-500 text-sm">
                 {/* Fix: Replaced deprecated marquee with CSS animation */}
                 <div className="w-full overflow-hidden whitespace-nowrap">
                   <style>{`
                     @keyframes marquee {
                       0% { transform: translateX(100%); }
                       100% { transform: translateX(-100%); }
                     }
                   `}</style>
                   <div style={{ animation: 'marquee 25s linear infinite', display: 'inline-block' }}>
                      Selamat Datang di Laboratorium Pemodelan Sistem & Simulasi. Silakan sentuh layar untuk informasi lebih lanjut. Jam Buka: {LAB_INFO.openHours}.
                   </div>
                 </div>
               </div>
             </div>
          )}

          {/* MODE: INTERACTIVE */}
          <div className={`h-full flex flex-col ${mode === AppMode.SCREENSAVER ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
             
             {/* Navigation Grid (Top 1/3 or Side?) - Let's do Side + Main Content for Portrait */}
             {/* Design Choice: Bottom Nav is better for large portrait displays, reachable. */}
             
             <div className="flex-1 overflow-y-auto pb-32">
                {activeSection === Section.HOME && (
                  <div className="p-8 grid grid-cols-2 gap-6 h-full content-center">
                    {/* Dashboard Home Tiles */}
                    <button onClick={() => setActiveSection(Section.ACTIVITIES)} className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 flex flex-col justify-end hover:border-neon-blue transition group">
                      <span className="text-4xl mb-4 group-hover:scale-110 transition">📅</span>
                      <span className="text-2xl font-bold text-white">Jadwal Kegiatan</span>
                    </button>
                    <button onClick={() => setActiveSection(Section.PRODUCTS)} className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 flex flex-col justify-end hover:border-neon-blue transition group">
                      <span className="text-4xl mb-4 group-hover:scale-110 transition">🚀</span>
                      <span className="text-2xl font-bold text-white">Produk Lab</span>
                    </button>
                    <button onClick={() => setActiveSection(Section.FLOW)} className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 flex flex-col justify-end hover:border-neon-blue transition group">
                      <span className="text-4xl mb-4 group-hover:scale-110 transition">🔄</span>
                      <span className="text-2xl font-bold text-white">Alur Lab</span>
                    </button>
                    <button onClick={() => setActiveSection(Section.FACILITIES)} className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 flex flex-col justify-end hover:border-neon-blue transition group">
                      <span className="text-4xl mb-4 group-hover:scale-110 transition">🖥️</span>
                      <span className="text-2xl font-bold text-white">Sarana</span>
                    </button>
                    <button onClick={() => setActiveSection(Section.AI_ASSISTANT)} className="col-span-2 h-40 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl border border-blue-500/30 p-6 flex items-center justify-between hover:border-neon-blue transition group relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-2xl font-bold text-white mb-1">Tanya AI Assistant</div>
                        <div className="text-slate-300">Informasi instan powered by Gemini</div>
                      </div>
                      <span className="text-5xl group-hover:rotate-12 transition">🤖</span>
                    </button>
                  </div>
                )}

                {activeSection === Section.ACTIVITIES && <ActivitiesSection activities={activities} />}
                {activeSection === Section.PRODUCTS && <ProductsSection products={products} />}
                {activeSection === Section.FLOW && <FlowSection flow={flow} />}
                {activeSection === Section.FACILITIES && <FacilitiesSection facilities={facilities} />}
                {activeSection === Section.AI_ASSISTANT && <AISection />}
             </div>

             {/* Bottom Navigation Dock */}
             <div className="absolute bottom-0 left-0 right-0 h-28 bg-slate-900/90 border-t border-slate-800 backdrop-blur-lg px-4 py-2 flex justify-around items-center z-50">
                <MenuButton label="Home" icon="🏠" section={Section.HOME} />
                <MenuButton label="Jadwal" icon="📅" section={Section.ACTIVITIES} />
                <MenuButton label="Produk" icon="🚀" section={Section.PRODUCTS} />
                <MenuButton label="Alur" icon="🔄" section={Section.FLOW} />
                <MenuButton label="Sarana" icon="🖥️" section={Section.FACILITIES} />
             </div>
          </div>

        </main>
      </div>

      {/* Admin Trigger (Hidden Corner) */}
      <div 
        className="absolute bottom-0 right-0 w-20 h-20 z-[100]"
        onDoubleClick={() => setMode(AppMode.ADMIN)}
        title="Double tap for Admin"
      />

      {/* Admin Modal */}
      {mode === AppMode.ADMIN && (
        <AdminPanel onClose={() => setMode(AppMode.INTERACTIVE)} />
      )}
    </div>
  );
}

export default App;