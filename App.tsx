import React, { useEffect, useState, useRef } from 'react';
import { Clock } from './components/Clock';
import { storageService } from './services/storageService';
import { ActivitiesSection, ProductsSection, FlowSection, FacilitiesSection, AISection, DelSimSection } from './components/Sections';
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
        <div className="h-full flex flex-col items-center justify-center animate-fade-in px-8">
          <div className="mb-24 text-center">
            <h1 className="text-7xl font-black text-white mb-6 tracking-tight">{LAB_INFO.name}</h1>
            <p className="text-3xl text-slate-400 tracking-[0.2em] uppercase font-light">Department of Industrial Engineering</p>
          </div>
          <Clock variant="large" />
          <div className="mt-32 text-center">
            <p className="text-3xl text-neon-blue animate-pulse font-mono bg-neon-blue/10 px-8 py-4 rounded-full inline-block">
              Touch Screen to Interact
            </p>
          </div>
        </div>
      );
    } else if (screensaverIndex === 1) {
      return (
        <div className="p-12 h-full flex flex-col justify-center">
          <h2 className="text-5xl font-bold text-slate-400 mb-12 uppercase tracking-widest border-b border-slate-700 pb-4">Upcoming Activities</h2>
          <div className="space-y-8">
            {activities.slice(0, 3).map(a => (
              <div key={a.id} className="bg-slate-800/50 border-l-8 border-neon-blue p-10 rounded-r-3xl shadow-2xl">
                <div className="text-5xl font-bold text-white mb-2">{a.title}</div>
                <div className="text-3xl text-slate-300 mt-2 font-mono">{a.date} | {a.time}</div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
       return (
        <div className="p-12 h-full flex flex-col justify-center">
          <h2 className="text-5xl font-bold text-slate-400 mb-12 uppercase tracking-widest border-b border-slate-700 pb-4">Facility Status</h2>
           <div className="grid grid-cols-1 gap-8">
             {facilities.slice(0, 6).map(f => (
               <div key={f.id} className="flex justify-between items-center bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-lg">
                 <span className="text-4xl font-bold text-white">{f.name}</span>
                 <span className={`px-6 py-3 rounded-xl font-bold uppercase text-2xl tracking-wider
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
      className={`flex flex-col items-center justify-center h-full flex-1 rounded-2xl transition-all duration-200 mx-1
        ${activeSection === section 
          ? 'bg-neon-blue/20 border-2 border-neon-blue text-neon-blue shadow-[0_0_30px_rgba(0,243,255,0.3)] scale-105 -translate-y-2' 
          : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
    >
      <span className="text-4xl mb-2 filter drop-shadow-md">{icon}</span>
      <span className="font-bold text-sm uppercase tracking-widest text-center leading-tight">{label}</span>
    </button>
  );

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 text-white select-none font-sans">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
      </div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* HEADER - Taller for 4K */}
        <header className="h-32 flex items-center justify-between px-10 border-b-2 border-slate-800 bg-slate-950/90 backdrop-blur-xl shadow-2xl z-50">
          <div className="flex flex-col">
            <span className="font-black text-3xl text-white tracking-tight leading-none">SIMLAB</span>
            <span className="text-lg text-neon-blue tracking-widest font-light">Modeling & Simulation</span>
          </div>
          <Clock />
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 overflow-hidden relative">
          
          {/* MODE: SCREENSAVER */}
          {mode === AppMode.SCREENSAVER && (
             <div className="absolute inset-0 bg-slate-900 z-40 flex flex-col">
               <div className="flex-1 relative">
                 {renderScreensaverContent()}
               </div>
               {/* Bottom info bar - Taller for 4K */}
               <div className="h-24 bg-slate-900/95 border-t-2 border-slate-800 flex items-center z-50">
                 {/* Fix: Replaced deprecated marquee with CSS animation */}
                 <div className="w-full overflow-hidden whitespace-nowrap text-3xl text-slate-300 font-light tracking-wide">
                   <style>{`
                     @keyframes marquee {
                       0% { transform: translateX(100%); }
                       100% { transform: translateX(-100%); }
                     }
                   `}</style>
                   <div style={{ animation: 'marquee 30s linear infinite', display: 'inline-block' }}>
                      Selamat Datang di Laboratorium Pemodelan Sistem & Simulasi. Sentuh layar untuk informasi. Jam Buka: {LAB_INFO.openHours}. Hubungi Koordinator: {LAB_INFO.coordinator}.
                   </div>
                 </div>
               </div>
             </div>
          )}

          {/* MODE: INTERACTIVE */}
          <div className={`h-full flex flex-col ${mode === AppMode.SCREENSAVER ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
             
             {/* Main Content Area - adjusted padding for bottom nav overlap */}
             <div className="flex-1 overflow-y-auto pb-48 pt-6">
                {activeSection === Section.HOME && (
                  <div className="p-8 grid grid-cols-2 grid-rows-3 gap-8 h-full content-start">
                    {/* Dashboard Home Tiles - Adjusted to 2 cols x 3 rows grid */}
                    
                    {/* Row 1 */}
                    <button onClick={() => setActiveSection(Section.ACTIVITIES)} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-2 border-slate-700 p-8 flex flex-col justify-between hover:border-neon-blue transition group shadow-xl">
                      <div className="flex justify-end"><span className="text-7xl group-hover:scale-110 transition drop-shadow-lg">📅</span></div>
                      <div className="text-left">
                         <span className="text-4xl font-black text-white block mb-2">Jadwal</span>
                         <span className="text-xl text-slate-400">Lihat Agenda</span>
                      </div>
                    </button>
                    
                    <button onClick={() => setActiveSection(Section.PRODUCTS)} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-2 border-slate-700 p-8 flex flex-col justify-between hover:border-neon-blue transition group shadow-xl">
                      <div className="flex justify-end"><span className="text-7xl group-hover:scale-110 transition drop-shadow-lg">🚀</span></div>
                      <div className="text-left">
                         <span className="text-4xl font-black text-white block mb-2">Produk</span>
                         <span className="text-xl text-slate-400">Hasil Riset</span>
                      </div>
                    </button>

                    {/* Row 2 */}
                    <button onClick={() => setActiveSection(Section.FLOW)} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-2 border-slate-700 p-8 flex flex-col justify-between hover:border-neon-blue transition group shadow-xl">
                      <div className="flex justify-end"><span className="text-7xl group-hover:scale-110 transition drop-shadow-lg">🔄</span></div>
                      <div className="text-left">
                         <span className="text-4xl font-black text-white block mb-2">Alur</span>
                         <span className="text-xl text-slate-400">SOP Lab</span>
                      </div>
                    </button>

                    <button onClick={() => setActiveSection(Section.FACILITIES)} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-2 border-slate-700 p-8 flex flex-col justify-between hover:border-neon-blue transition group shadow-xl">
                      <div className="flex justify-end"><span className="text-7xl group-hover:scale-110 transition drop-shadow-lg">🖥️</span></div>
                      <div className="text-left">
                         <span className="text-4xl font-black text-white block mb-2">Sarana</span>
                         <span className="text-xl text-slate-400">Cek Alat</span>
                      </div>
                    </button>

                    {/* Row 3 */}
                    <button onClick={() => setActiveSection(Section.DELSIM)} className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-3xl border-2 border-slate-700 p-8 flex flex-col justify-between hover:border-neon-blue transition group shadow-xl">
                      <div className="flex justify-end"><span className="text-7xl group-hover:scale-110 transition drop-shadow-lg">🌐</span></div>
                      <div className="text-left">
                         <span className="text-4xl font-black text-white block mb-2">Info UII</span>
                         <span className="text-xl text-slate-400">Web Update</span>
                      </div>
                    </button>

                    <button onClick={() => setActiveSection(Section.AI_ASSISTANT)} className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-3xl border-2 border-slate-700 p-8 flex flex-col justify-between hover:border-neon-blue transition group shadow-xl">
                      <div className="flex justify-end"><span className="text-7xl group-hover:scale-110 transition drop-shadow-lg">🤖</span></div>
                      <div className="text-left">
                         <span className="text-4xl font-black text-white block mb-2">AI Chat</span>
                         <span className="text-xl text-slate-400">Tanya Asisten</span>
                      </div>
                    </button>
                  </div>
                )}

                {activeSection === Section.ACTIVITIES && <ActivitiesSection activities={activities} />}
                {activeSection === Section.PRODUCTS && <ProductsSection products={products} />}
                {activeSection === Section.FLOW && <FlowSection flow={flow} />}
                {activeSection === Section.FACILITIES && <FacilitiesSection facilities={facilities} />}
                {activeSection === Section.DELSIM && <DelSimSection />}
                {activeSection === Section.AI_ASSISTANT && <AISection />}
             </div>

             {/* Bottom Navigation Dock - Much Taller for Easy Touch */}
             <div className="absolute bottom-0 left-0 right-0 h-40 bg-slate-900/95 border-t-2 border-slate-800 backdrop-blur-xl px-4 py-4 flex justify-around items-center z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <MenuButton label="Home" icon="🏠" section={Section.HOME} />
                <MenuButton label="Jadwal" icon="📅" section={Section.ACTIVITIES} />
                <MenuButton label="Produk" icon="🚀" section={Section.PRODUCTS} />
                <MenuButton label="Alur" icon="🔄" section={Section.FLOW} />
                <MenuButton label="Sarana" icon="🖥️" section={Section.FACILITIES} />
                <MenuButton label="Info Web" icon="🌐" section={Section.DELSIM} />
             </div>
          </div>

        </main>
      </div>

      {/* Admin Trigger (Hidden Corner) */}
      <div 
        className="absolute bottom-0 right-0 w-32 h-32 z-[100]"
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