'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Printer, 
  FileText, 
  User, 
  Clock, 
  Activity, 
  Pill, 
  ShieldAlert, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Sun,
  Sunset,
  Moon,
  CalendarDays
} from 'lucide-react';

interface PatientInfo {
  name: string;
  age: string;
  gender: string;
}

interface DoctorInfo {
  name: string;
  hospital: string;
  contact?: string;
  registrationNumber?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  description: string;
  purpose: string;
}

interface TestResult {
  id: string;
  testName: string;
  value: string;
  referenceRange: string;
  unit: string;
  flag: 'Normal' | 'High' | 'Low';
  description: string;
}

interface Warning {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
}

interface AnalysisData {
  document: {
    id: string;
    name: string;
    type: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Consultation Notes';
    status: string;
    uploadedAt: string;
    fileUrl: string;
  };
  analysis: {
    patientInfo: PatientInfo;
    doctorInfo: DoctorInfo;
    diagnosis: string[];
    summary: string;
    recommendedActions: string[];
    followUp: string;
  } | null;
  medications: Medication[];
  testResults: TestResult[];
  warnings: Warning[];
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedMeds, setCheckedMeds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    params.then(setUnwrappedParams);
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;

    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/documents/${unwrappedParams.id}`);
        const result = await res.json();
        if (result.success) {
          setData(result);
        } else {
          console.error(result.error);
        }
      } catch (err) {
        console.error('Failed to load analysis details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [unwrappedParams]);

  const toggleMedChecked = (medId: string) => {
    setCheckedMeds(prev => ({
      ...prev,
      [medId]: !prev[medId]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Compiling your structured results...</p>
      </div>
    );
  }

  const { document, analysis, medications, testResults, warnings } = data;

  return (
    <div className="space-y-8 print:p-0 print:space-y-6">
      {/* Header controls (Hidden during print) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Link 
          href="/dashboard" 
          className="text-slate-500 hover:text-slate-900 text-sm font-bold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a 
            href={document.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl text-center shadow-sm"
          >
            View Original Upload
          </a>
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none bg-primary hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Summary
          </button>
        </div>
      </div>

      {/* Main Results Portal Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm print:border-0 print:shadow-none print:p-0">
        
        {/* Document Metadata banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 mb-8 gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 text-primary p-3 rounded-2xl print:bg-slate-100">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight">
                  {document.name}
                </h1>
                <span className={`
                  text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider
                  ${document.type === 'Prescription' && 'bg-blue-50 text-blue-600 border border-blue-100'}
                  ${document.type === 'Lab Report' && 'bg-teal-50 text-teal-600 border border-teal-100'}
                  ${document.type === 'Discharge Summary' && 'bg-emerald-50 text-emerald-600 border border-emerald-100'}
                  ${document.type === 'Consultation Notes' && 'bg-indigo-50 text-indigo-600 border border-indigo-100'}
                `}>
                  {document.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Interpreted on {new Date(document.uploadedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full border border-teal-100 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> AI Interpretation Complete
          </div>
        </div>

        {/* Patient & Doctor Profile info */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 print:bg-white print:border-slate-200">
            {/* Patient Info */}
            <div className="flex gap-3">
              <User className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Details</span>
                <div className="font-bold text-slate-800 text-sm mt-0.5 flex gap-2">
                  <span>{analysis.patientInfo.name}</span>
                  <span className="text-slate-300">|</span>
                  <span>{analysis.patientInfo.age} Yrs</span>
                  <span className="text-slate-300">|</span>
                  <span>{analysis.patientInfo.gender}</span>
                </div>
              </div>
            </div>
            {/* Doctor Info */}
            <div className="flex gap-3">
              <Stethoscope className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prescribing Authority</span>
                <h4 className="font-bold text-slate-800 text-sm mt-0.5">{analysis.doctorInfo.name}</h4>
                <p className="text-xs text-slate-400 font-semibold">{analysis.doctorInfo.hospital}</p>
                {analysis.doctorInfo.registrationNumber && (
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Reg No: {analysis.doctorInfo.registrationNumber}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Clinical Data (Left Columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Clinical Summary */}
            {analysis && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  What This Report Means
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {analysis.summary}
                </p>
                
                {/* Diagnoses list */}
                {analysis.diagnosis && analysis.diagnosis.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Primary Clinical Diagnoses:</span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.diagnosis.map((diag, index) => (
                        <span 
                          key={index}
                          className="bg-blue-50 border border-blue-100 text-primary text-xs font-bold px-3 py-1.5 rounded-xl"
                        >
                          {diag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Medications Section */}
            {medications.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                    Prescribed Medications Schedule
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Carefully translated from prescriptions instructions. Maintain strict timings.
                  </p>
                </div>

                <div className="space-y-4">
                  {medications.map((med) => {
                    const isChecked = !!checkedMeds[med.id];
                    // Parse timings to show visual schedule pills (Morning, Afternoon, Night)
                    const lowerFreq = med.frequency.toLowerCase();
                    const lowerTiming = med.timing.toLowerCase();
                    
                    const isMorning = lowerFreq.includes('bd') || lowerFreq.includes('tds') || lowerFreq.includes('qid') || lowerFreq.includes('od') && (lowerTiming.includes('am') || lowerTiming.includes('ac'));
                    const isAfternoon = lowerFreq.includes('tds') || lowerFreq.includes('qid') || (lowerFreq.includes('bd') && lowerTiming.includes('pc') && !lowerFreq.includes('od'));
                    const isNight = lowerFreq.includes('bd') || lowerFreq.includes('tds') || lowerFreq.includes('qid') || lowerFreq.includes('hs') || (lowerFreq.includes('od') && (lowerTiming.includes('pm') || lowerTiming.includes('pc') || lowerTiming.includes('hs')));

                    return (
                      <div 
                        key={med.id} 
                        onClick={() => toggleMedChecked(med.id)}
                        className={`
                          p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4
                          ${isChecked 
                            ? 'bg-slate-50/70 border-slate-200 opacity-65' 
                            : 'bg-white border-slate-200/80 hover:shadow-sm'}
                        `}
                      >
                        <div className="flex gap-3.5 overflow-hidden">
                          {/* Checked box */}
                          <div className={`
                            w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors
                            ${isChecked 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'border-slate-300 bg-white'}
                          `}>
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3px]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`font-bold text-sm text-slate-800 ${isChecked && 'line-through'}`}>{med.name}</h4>
                              <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">{med.dosage}</span>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border
                                ${med.timing.toLowerCase().includes('ac') ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}
                              `}>
                                {med.timing === 'AC' ? 'Empty Stomach (AC)' : 'After Food (PC)'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">
                              {med.description}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              Purpose: {med.purpose}
                            </p>
                          </div>
                        </div>

                        {/* Schedule Timeline Pills */}
                        <div className="flex gap-1.5 shrink-0 self-end md:self-center">
                          <div className={`p-1.5 rounded-lg border text-center flex flex-col items-center justify-center w-12 h-12 transition-all
                            ${isMorning ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-300'}
                          `}>
                            <Sun className="w-4 h-4" />
                            <span className="text-[8px] font-extrabold uppercase mt-0.5">Morn</span>
                          </div>
                          <div className={`p-1.5 rounded-lg border text-center flex flex-col items-center justify-center w-12 h-12 transition-all
                            ${isAfternoon ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-50 border-slate-100 text-slate-300'}
                          `}>
                            <Sunset className="w-4 h-4" />
                            <span className="text-[8px] font-extrabold uppercase mt-0.5">Noon</span>
                          </div>
                          <div className={`p-1.5 rounded-lg border text-center flex flex-col items-center justify-center w-12 h-12 transition-all
                            ${isNight ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-300'}
                          `}>
                            <Moon className="w-4 h-4" />
                            <span className="text-[8px] font-extrabold uppercase mt-0.5">Night</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Lab Test Results Section */}
            {testResults.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    Biomarkers & Lab Results
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Visual scale comparing your values to clinical reference limits.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {testResults.map((test) => {
                    const isHigh = test.flag === 'High';
                    const isLow = test.flag === 'Low';
                    const isNormal = test.flag === 'Normal';

                    return (
                      <div key={test.id} className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-3">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h4 className="font-bold text-slate-850 text-sm">{test.testName}</h4>
                            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Reference limits: {test.referenceRange} {test.unit}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-800 font-black text-base">{test.value} <span className="text-xs font-bold text-slate-400">{test.unit}</span></span>
                            <span className={`
                              text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider border
                              ${isNormal && 'bg-green-50 text-green-700 border-green-200'}
                              ${isHigh && 'bg-rose-50 text-rose-700 border-rose-200'}
                              ${isLow && 'bg-blue-50 text-blue-700 border-blue-200'}
                            `}>
                              {test.flag}
                            </span>
                          </div>
                        </div>

                        {/* Visual Range bar */}
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full bg-slate-200 rounded-full flex overflow-hidden">
                            {/* Low section */}
                            <div className="w-[30%] h-full bg-blue-300/40 border-r border-white/60" />
                            {/* Normal section */}
                            <div className="w-[40%] h-full bg-green-300/40 border-r border-white/60" />
                            {/* High section */}
                            <div className="w-[30%] h-full bg-rose-300/40" />
                          </div>
                          
                          {/* Pointer representing value */}
                          <div className="flex justify-between text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                            <span className={isLow ? 'text-blue-600 font-bold' : ''}>Low</span>
                            <span className={isNormal ? 'text-green-600 font-bold' : ''}>Optimal Range</span>
                            <span className={isHigh ? 'text-rose-600 font-bold' : ''}>High</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          {test.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Warnings Drawer & Recommendations (Right Column) */}
          <div className="space-y-8">
            
            {/* Warnings Risk Highlights */}
            {warnings.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider block">
                  Safety Cautions ({warnings.length})
                </h3>
                <div className="space-y-4">
                  {warnings.map((warn) => (
                    <div 
                      key={warn.id}
                      className={`
                        p-4 rounded-2xl border text-left
                        ${warn.severity === 'Critical' && 'bg-rose-50/50 border-red-100 text-red-900'}
                        ${warn.severity === 'Warning' && 'bg-amber-50/50 border-amber-100 text-amber-900'}
                        ${warn.severity === 'Info' && 'bg-blue-50/50 border-blue-100 text-blue-900'}
                      `}
                    >
                      <h4 className={`
                        text-xs font-bold flex items-center gap-1.5
                        ${warn.severity === 'Critical' && 'text-red-700'}
                        ${warn.severity === 'Warning' && 'text-amber-700'}
                        ${warn.severity === 'Info' && 'text-blue-700'}
                      `}>
                        <ShieldAlert className="w-4 h-4" />
                        {warn.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-2 leading-relaxed font-medium">
                        {warn.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations checklist */}
            {analysis && analysis.recommendedActions.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Recommended Actions
                </h3>
                <div className="space-y-3">
                  {analysis.recommendedActions.map((action, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow up Card */}
            {analysis && analysis.followUp && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 space-y-3">
                <h3 className="font-bold text-slate-850 text-sm flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  Follow-Up Advice
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {analysis.followUp}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
