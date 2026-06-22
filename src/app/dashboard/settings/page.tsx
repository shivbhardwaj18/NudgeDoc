'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Database, 
  ToggleLeft, 
  ToggleRight, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [useMock, setUseMock] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setApiKey(data.settings.geminiApiKey);
        setUseMock(data.settings.useMock);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          geminiApiKey: apiKey,
          useMock: useMock
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Settings updated successfully!' });
        // Refresh to get masked key if edited
        fetchSettings();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update settings.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Are you sure you want to reset the database? This will clear all uploaded reports and restore the default seed prescriptions & lab profiles.')) {
      return;
    }

    setResetting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetDatabase: true
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Database reset to default seed data successfully!' });
        fetchSettings();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to reset database.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error resetting database.' });
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading developer panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Developer Panel & Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-semibold">
          Configure clinical Gemini API keys, toggle interactive mocks, and perform database diagnostic resets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Form (Left side) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
              <Settings className="w-5 h-5 text-slate-400" />
              Application Configurations
            </h2>

            {/* Mock Mode Toggle */}
            <div className="flex justify-between items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">Use Interactive Mock Mode</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1 font-medium">
                  When enabled, the app bypasses actual Gemini API calls and uses pre-canned clinical responses matching files names. Recommended for zero-network offline presentations.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setUseMock(!useMock)}
                className="text-primary hover:scale-105 transition-transform"
              >
                {useMock ? (
                  <ToggleRight className="w-12 h-12 text-primary fill-blue-100" />
                ) : (
                  <ToggleLeft className="w-12 h-12 text-slate-400" />
                )}
              </button>
            </div>

            {/* Gemini API Key */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Google Gemini API Key
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={useMock ? 'Interactive Mock Active (No key needed)' : 'AIzaSy... (Your Gemini Key)'}
                  disabled={useMock}
                  className={`
                    w-full bg-slate-50 border pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold text-slate-850 transition-all
                    ${useMock ? 'opacity-50 border-slate-200 cursor-not-allowed' : 'border-slate-200'}
                  `}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                Providing a key enables actual multimodal parsing on custom reports. Leaves empty to fallback to Mock.
              </p>
            </div>

            {statusMessage && (
              <div className={`
                p-4 rounded-xl text-xs font-bold border flex items-center gap-2
                ${statusMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}
              `}>
                {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                {statusMessage.text}
              </div>
            )}

            <button 
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Save Settings'
              )}
            </button>
          </form>
        </div>

        {/* Diagnostic Actions & Status (Right column) */}
        <div className="space-y-6">
          {/* Database Diagnostics */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Database className="w-5 h-5 text-slate-400" />
              Database Operations
            </h2>

            <div className="border border-red-100 bg-rose-50/50 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Destructive Action
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                Clear all active records and restore NudgeDoc to the clean, pre-seeded clinical state (2 patient records: Rohan Diabetes & Lipid profile).
              </p>
              <button 
                onClick={handleResetDatabase}
                disabled={resetting}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
              >
                {resetting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Reset Database'
                )}
              </button>
            </div>
          </div>

          {/* System Environment */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Cpu className="w-5 h-5 text-slate-400" />
              System Environment
            </h2>
            <div className="space-y-3.5 text-xs font-semibold text-slate-500">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span>Next.js Target</span>
                <span className="text-slate-805 font-bold">16.2.9 (App Router)</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span>Node Runtime</span>
                <span className="text-slate-805 font-bold">v22.17.1</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span>Local DB Type</span>
                <span className="text-slate-805 font-bold">File-based JSON</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span>Active AI Version</span>
                <span className="text-primary font-bold">{useMock ? 'Mock API Engine' : 'Gemini 2.5 Flash'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
