import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { API_KEY } from './index';

const CloudSync = () => {
  const { useCloud, setUseCloud, syncToCloud, loadFromCloud } = useApp();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncToCloud();
      alert('✅ Data synced to cloud successfully!');
    } catch (error) {
      alert('❌ Sync failed: ' + error.message);
    }
    setSyncing(false);
  };

  const handleLoad = async () => {
    setSyncing(true);
    try {
      await loadFromCloud();
      alert('✅ Data loaded from cloud successfully!');
    } catch (error) {
      alert('❌ Load failed: ' + error.message);
    }
    setSyncing(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 p-4 rounded-xl">
      <h3 className="text-lg font-semibold text-yellow-300 mb-4">☁️ Cloud Database</h3>
      
      <div className="space-y-4">
        {!API_KEY && (
          <div className="bg-red-500/20 border border-red-500 p-3 rounded-lg">
            <p className="text-red-200 text-sm">⚠️ API Key not configured. Add your key in src/api/index.js</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-white">Enable Cloud Sync</span>
          <button
            onClick={() => setUseCloud(!useCloud)}
            disabled={!API_KEY}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              useCloud 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {useCloud ? 'ON' : 'OFF'}
          </button>
        </div>

        {useCloud && API_KEY && (
          <div className="flex gap-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {syncing ? '⏳' : '⬆️'} Sync to Cloud
            </button>
            <button
              onClick={handleLoad}
              disabled={syncing}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {syncing ? '⏳' : '⬇️'} Load from Cloud
            </button>
          </div>
        )}

        <p className="text-sm text-blue-200">
          {useCloud && API_KEY
            ? '✅ Data is automatically syncing to cloud database' 
            : '⚠️ Data is stored locally only'}
        </p>
      </div>
    </div>
  );
};

export default CloudSync;
