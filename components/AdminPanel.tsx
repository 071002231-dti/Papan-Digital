import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Activity, Facility } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'facilities'>('activities');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setActivities(storageService.getActivities());
    setFacilities(storageService.getFacilities());
  }, []);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveActivities = () => {
    storageService.saveActivities(activities);
    showNotify('Kegiatan berhasil disimpan!');
  };

  const handleSaveFacilities = () => {
    storageService.saveFacilities(facilities);
    showNotify('Sarana berhasil disimpan!');
  };

  // --- Activity Logic ---
  const updateActivity = (id: string, field: keyof Activity, val: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));
  };

  const addActivity = () => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: 'Kegiatan Baru',
      date: '2023-12-01',
      time: '09:00',
      description: 'Deskripsi kegiatan...',
      status: 'upcoming'
    };
    setActivities([newActivity, ...activities]);
  };

  const deleteActivity = (id: string) => {
    if (confirm('Hapus kegiatan ini?')) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  // --- Facility Logic ---
  const updateFacility = (id: string, field: keyof Facility, val: string) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));
  };

  const addFacility = () => {
    const newFacility: Facility = {
      id: Date.now().toString(),
      name: 'Sarana Baru',
      status: 'available',
      specs: 'Spesifikasi...'
    };
    setFacilities([newFacility, ...facilities]);
  };

  const deleteFacility = (id: string) => {
    if (confirm('Hapus sarana ini?')) {
      setFacilities(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-8 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Content Management</h2>
            <p className="text-slate-400 text-sm">Double click pojok kanan bawah layar utama untuk akses kembali.</p>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition"
          >
            Close
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'activities' ? 'text-neon-blue border-b-2 border-neon-blue' : 'text-slate-400'}`}
            onClick={() => setActiveTab('activities')}
          >
            Activities
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'facilities' ? 'text-neon-blue border-b-2 border-neon-blue' : 'text-slate-400'}`}
            onClick={() => setActiveTab('facilities')}
          >
            Facilities
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                 <button onClick={addActivity} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                   <span>+</span> Tambah Kegiatan
                 </button>
              </div>
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 relative group">
                  <button 
                    onClick={() => deleteActivity(activity.id)} 
                    className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-2 rounded hover:bg-slate-700 transition"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-2 pr-8">
                    <input 
                      value={activity.title} 
                      onChange={(e) => updateActivity(activity.id, 'title', e.target.value)}
                      className="bg-slate-800 p-2 rounded text-white border border-slate-600 focus:border-neon-blue outline-none"
                      placeholder="Nama Kegiatan"
                    />
                    <select 
                      value={activity.status}
                      onChange={(e) => updateActivity(activity.id, 'status', e.target.value as any)}
                      className="bg-slate-800 p-2 rounded text-white border border-slate-600 focus:border-neon-blue outline-none"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <input 
                      value={activity.date} 
                      onChange={(e) => updateActivity(activity.id, 'date', e.target.value)}
                      className="bg-slate-800 p-2 rounded text-slate-300 border border-slate-600 focus:border-neon-blue outline-none"
                      placeholder="Tanggal"
                    />
                    <input 
                      value={activity.time} 
                      onChange={(e) => updateActivity(activity.id, 'time', e.target.value)}
                      className="bg-slate-800 p-2 rounded text-slate-300 border border-slate-600 focus:border-neon-blue outline-none"
                      placeholder="Waktu"
                    />
                  </div>
                  <textarea 
                    value={activity.description} 
                    onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                    className="bg-slate-800 p-2 rounded text-slate-300 border border-slate-600 w-full h-20 focus:border-neon-blue outline-none"
                    placeholder="Deskripsi"
                  />
                </div>
              ))}
              <button onClick={handleSaveActivities} className="w-full py-3 bg-neon-blue text-slate-900 font-bold rounded hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                Simpan Kegiatan
              </button>
            </div>
          )}

          {activeTab === 'facilities' && (
            <div className="space-y-6">
               <div className="flex justify-end">
                 <button onClick={addFacility} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                   <span>+</span> Tambah Sarana
                 </button>
              </div>
              {facilities.map((fac) => (
                <div key={fac.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 flex items-start gap-4 relative group">
                   <button 
                    onClick={() => deleteFacility(fac.id)} 
                    className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-2 rounded hover:bg-slate-700 transition z-10"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                  <div className="flex-1 space-y-2 pr-8">
                    <input
                      value={fac.name}
                      onChange={(e) => updateFacility(fac.id, 'name', e.target.value)}
                      className="w-full bg-slate-800 p-2 rounded text-white border border-slate-600 font-bold focus:border-neon-blue outline-none"
                      placeholder="Nama Sarana"
                    />
                    <input
                      value={fac.specs}
                      onChange={(e) => updateFacility(fac.id, 'specs', e.target.value)}
                      className="w-full bg-slate-800 p-2 rounded text-slate-400 text-xs border border-slate-600 focus:border-neon-blue outline-none"
                      placeholder="Spesifikasi (ex: Processor, RAM, dll)"
                    />
                  </div>
                  <div className="pt-1">
                    <select 
                        value={fac.status}
                        onChange={(e) => updateFacility(fac.id, 'status', e.target.value as any)}
                        className={`p-2 rounded border border-slate-600 font-bold w-32 focus:border-neon-blue outline-none ${
                          fac.status === 'available' ? 'bg-green-900/30 text-green-400' :
                          fac.status === 'occupied' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                  </div>
                </div>
              ))}
               <button onClick={handleSaveFacilities} className="w-full py-3 bg-neon-blue text-slate-900 font-bold rounded hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                Simpan Sarana
              </button>
            </div>
          )}
        </div>

        {notification && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in z-50 font-bold">
                {notification}
            </div>
        )}
      </div>
    </div>
  );
};