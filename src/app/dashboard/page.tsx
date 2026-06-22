'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Activity, 
  Pill, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Plus,
  RefreshCw,
  Info
} from 'lucide-react';

interface Stats {
  totalReports: number;
  analyzedReports: number;
  processingReports: number;
  failedReports: number;
  criticalAlertsCount: number;
  abnormalTestsCount: number;
  totalMedications: number;
}

interface RecentReport {
  id: string;
  name: string;
  type: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Consultation Notes';
  status: 'Processing' | 'Analyzed' | 'Failed';
  uploadedAt: string;
  fileUrl: string;
}

interface ActiveWarning {
  id: string;
  documentId: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [activeWarnings, setActiveWarnings] = useState<ActiveWarning[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setDiagnoses(data.diagnoses);
        setRecentReports(data.recentReports);
        setActiveWarnings(data.activeWarnings);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading your health dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome header banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Health Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-semibold">
            Welcome back, Rohan. Review your extracted clinical actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchDashboardData}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 p-3 rounded-xl transition-all shadow-sm"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link 
            href="/dashboard/upload" 
            className="bg-primary hover:bg-blue-600 text-white font-bold px-5 py-3 rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Analyze New Report
          </Link>
        </div>
      </div>

      {/* Grid of Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Uploads */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-50 text-primary p-3.5 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Reports</span>
            <span className="text-2xl font-black text-slate-800">{stats?.totalReports || 0}</span>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-rose-50 text-rose-500 p-3.5 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Critical Risks</span>
            <span className="text-2xl font-black text-rose-600">{stats?.criticalAlertsCount || 0}</span>
          </div>
        </div>

        {/* Active Medications */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-teal-50 text-teal-600 p-3.5 rounded-xl">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Medications</span>
            <span className="text-2xl font-black text-slate-800">{stats?.totalMedications || 0}</span>
          </div>
        </div>

        {/* Abnormal Lab Tests */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-amber-50 text-amber-600 p-3.5 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Abnormal Lab values</span>
            <span className="text-2xl font-black text-amber-600">{stats?.abnormalTestsCount || 0}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports Listing (Left Side) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent Documents Analyzed
            </h2>
            
            {recentReports.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-semibold">No medical reports analyzed yet.</p>
                <Link href="/dashboard/upload" className="text-primary text-sm font-bold hover:underline">
                  Analyze your first file now
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Uploaded</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report) => (
                      <tr key={report.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pr-3 font-bold text-slate-800 text-sm max-w-[200px] truncate">
                          {report.name}
                        </td>
                        <td className="py-4 pr-3">
                          <span className={`
                            text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider
                            ${report.type === 'Prescription' && 'bg-blue-50 text-blue-600 border border-blue-100'}
                            ${report.type === 'Lab Report' && 'bg-teal-50 text-teal-600 border border-teal-100'}
                            ${report.type === 'Discharge Summary' && 'bg-emerald-50 text-emerald-600 border border-emerald-100'}
                            ${report.type === 'Consultation Notes' && 'bg-indigo-50 text-indigo-600 border border-indigo-100'}
                          `}>
                            {report.type}
                          </span>
                        </td>
                        <td className="py-4 pr-3 text-xs text-slate-400 font-semibold">
                          {new Date(report.uploadedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 pr-3">
                          <span className={`
                            text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit
                            ${report.status === 'Analyzed' && 'bg-green-50 text-green-600 border border-green-100'}
                            ${report.status === 'Processing' && 'bg-yellow-50 text-yellow-600 border border-yellow-100 animate-pulse'}
                            ${report.status === 'Failed' && 'bg-red-50 text-red-600 border border-red-100'}
                          `}>
                            {report.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
                            {report.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {report.status === 'Analyzed' ? (
                            <Link 
                              href={`/dashboard/results/${report.id}`}
                              className="text-primary hover:text-blue-700 text-xs font-bold flex items-center gap-1 justify-end group"
                            >
                              View Report
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          ) : report.status === 'Processing' ? (
                            <span className="text-slate-400 text-xs font-semibold">Processing...</span>
                          ) : (
                            <span className="text-red-500 text-xs font-semibold">Error</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Health Insights (Diagnoses Box) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              Identified Diagnoses Profile
            </h2>
            {diagnoses.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold italic">No active diagnoses found in records.</p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {diagnoses.map((diag, index) => (
                  <span 
                    key={index}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    {diag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Warning Alerts Drawer (Right Side) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm h-full">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Important Safety Warnings
            </h2>
            
            {activeWarnings.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Info className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400 italic">No health warnings currently active.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeWarnings.map((warn) => (
                  <div 
                    key={warn.id}
                    className={`
                      p-4 rounded-2xl border text-left
                      ${warn.severity === 'Critical' && 'bg-rose-50/50 border-red-100 text-red-900'}
                      ${warn.severity === 'Warning' && 'bg-amber-50/50 border-amber-100 text-amber-900'}
                      ${warn.severity === 'Info' && 'bg-blue-50/50 border-blue-100 text-blue-900'}
                    `}
                  >
                    <h3 className={`
                      text-xs font-bold flex items-center gap-1.5
                      ${warn.severity === 'Critical' && 'text-red-700'}
                      ${warn.severity === 'Warning' && 'text-amber-700'}
                      ${warn.severity === 'Info' && 'text-blue-700'}
                    `}>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {warn.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed font-medium">
                      {warn.message}
                    </p>
                    <Link 
                      href={`/dashboard/results/${warn.documentId}`}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 mt-3 block underline"
                    >
                      View Linked Report
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
