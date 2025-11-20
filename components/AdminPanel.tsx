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

  const updateActivity = (id: string, field: keyof Activity, val: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));
  };

  const updateFacility = (id: string, field: keyof Facility, val: string) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-8 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Content Management</h2>
            <p className="text-slate-400 text-sm">Edit Local Storage Data</p>
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
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <input 
                      value={activity.title} 
                      onChange={(e) => updateActivity(activity.id, 'title', e.target.value)}
                      className="bg-slate-800 p-2 rounded text-white border border-slate-600"
                      placeholder="Activity Title"
                    />
                    <select 
                      value={activity.status}
                      onChange={(e) => updateActivity(activity.id, 'status', e.target.value as any)}
                      className="bg-slate-800 p-2 rounded text-white border border-slate-600"
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
                      className="bg-slate-800 p-2 rounded text-slate-300 border border-slate-600"
                      placeholder="Date"
                    />
                    <input 
                      value={activity.time} 
                      onChange={(e) => updateActivity(activity.id, 'time', e.target.value)}
                      className="bg-slate-800 p-2 rounded text-slate-300 border border-slate-600"
                      placeholder="Time"
                    />
                  </div>
                  <textarea 
                    value={activity.description} 
                    onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                    className="bg-slate-800 p-2 rounded text-slate-300 border border-slate-600 w-full h-20"
                    placeholder="Description"
                  />
                </div>
              ))}
              <button onClick={handleSaveActivities} className="w-full py-3 bg-neon-blue text-slate-900 font-bold rounded hover:bg-cyan-300 transition">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'facilities' && (
            <div className="space-y-6">
              {facilities.map((fac) => (
                <div key={fac.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-white">{fac.name}</div>
                    <div className="text-xs text-slate-400">{fac.specs}</div>
                  </div>
                  <select 
                      value={fac.status}
                      onChange={(e) => updateFacility(fac.id, 'status', e.target.value as any)}
                      className={`p-2 rounded border border-slate-600 font-bold ${
                        fac.status === 'available' ? 'bg-green-900/30 text-green-400' :
                        fac.status === 'occupied' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
                      }`}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                </div>
              ))}
               <button onClick={handleSaveFacilities} className="w-full py-3 bg-neon-blue text-slate-900 font-bold rounded hover:bg-cyan-300 transition">
                Save Changes
              </button>
            </div>
          )}
        </div>

        {notification && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
                {notification}
            </div>
        )}
      </div>
    </div>
  );
};