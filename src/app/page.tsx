'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  Pill, 
  Sparkles, 
  Heart, 
  Brain,
  ShieldCheck
} from 'lucide-react';

export default function LandingPage() {
  const [demoInput, setDemoInput] = useState('Tab Metformin 500mg BD PC');
  const [demoResult, setDemoResult] = useState('Take Metformin 500mg twice daily after meals.');

  const handleTranslateDemo = (text: string) => {
    setDemoInput(text);
    const lower = text.toLowerCase();
    if (lower.includes('metformin') && lower.includes('bd') && lower.includes('pc')) {
      setDemoResult('Take Metformin 500mg twice daily after meals (usually after breakfast and dinner).');
    } else if (lower.includes('pantocid') || lower.includes('od') && lower.includes('ac')) {
      setDemoResult('Take Pantocid 40mg once daily in the morning, 30 minutes before your breakfast.');
    } else if (lower.includes('crocin') || lower.includes('sos')) {
      setDemoResult('Take Crocin 650mg as needed in emergency (usually for pain or fever relief).');
    } else {
      // General translator mock logic
      let result = text;
      result = result.replace(/bd/gi, 'twice daily');
      result = result.replace(/od/gi, 'once daily');
      result = result.replace(/tds/gi, 'three times daily');
      result = result.replace(/sos/gi, 'as needed in emergency');
      result = result.replace(/pc/gi, 'after meals');
      result = result.replace(/ac/gi, 'before meals');
      result = result.replace(/hs/gi, 'at bedtime');
      setDemoResult(result);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Nudge<span className="text-primary">Doc</span>
            </span>
            <span className="block text-[10px] text-slate-500 font-semibold tracking-wider uppercase -mt-1">
              Patient Intelligence
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Log In
          </Link>
          <Link 
            href="/login" 
            className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-2 group"
          >
            Enter App
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-20 px-6 overflow-hidden">
          {/* Glowing Background Elements */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 text-primary px-4 py-1.5 rounded-full text-xs font-semibold mb-8 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Empowering Patients with AI Health Literacy
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight"
            >
              Turning Complex Medical Reports <br />
              into <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Clear Health Actions</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Upload prescriptions, lab reports, or discharge summaries. 
              Our clinical AI decodes medical jargon, translates shorthand instructions, and alerts you to critical findings instantly.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link 
                href="/login" 
                className="w-full sm:w-auto bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2.5 group"
              >
                Analyze Your First Report Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </Link>
              <a 
                href="#demo" 
                className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 px-8 py-4 rounded-2xl text-base font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center"
              >
                Try Interactive Demo
              </a>
            </motion.div>

            {/* Teaser dashboard illustration */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white border border-slate-200 rounded-3xl p-4 md:p-6 shadow-2xl glow-blue max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-slate-400 ml-2 font-mono">Patient Portal Analysis Results</span>
                </div>
                <div className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-teal-100">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI Interpretation Stable
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="md:col-span-2 border-r border-slate-100 pr-6">
                  <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-primary" /> Active Prescription Interpretation
                  </h3>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-4">
                    <span className="text-xs text-slate-400 block font-semibold mb-1">DOCTOR PRESCRIPTION (RAW TEXT):</span>
                    <span className="text-sm font-semibold text-slate-700 italic">"Tab Glycomet GP1 BD PC, Tab Pantocid 40mg OD AC"</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3 bg-blue-50/50 border border-blue-100 p-3.5 rounded-2xl">
                      <div className="bg-primary text-white p-2 rounded-xl h-fit">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Glycomet GP1 (Glimepiride + Metformin)</h4>
                        <p className="text-xs text-slate-500 mt-1">Take 1 tablet twice daily <strong className="text-primary font-semibold">after meals</strong> (breakfast and dinner). Regulates your blood glucose levels.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 bg-teal-50/50 border border-teal-100 p-3.5 rounded-2xl">
                      <div className="bg-secondary text-white p-2 rounded-xl h-fit">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Pantocid 40mg (Pantoprazole)</h4>
                        <p className="text-xs text-slate-500 mt-1">Take 1 tablet once daily in the morning <strong className="text-secondary font-semibold">30 minutes before breakfast</strong>. Prevents stomach acidity.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500" /> Critical Warnings
                  </h3>
                  <div className="border border-red-100 bg-rose-50/50 rounded-2xl p-4 mb-3">
                    <h4 className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      Hypoglycemia Warning
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                      Metformin may cause sudden drops in blood sugar. Watch out for cold sweats, shaking, and dizziness. Keep a sweet candy with you.
                    </p>
                  </div>
                  <div className="border border-yellow-100 bg-amber-50/50 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      Strict AC Timing
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                      Pantocid requires active acid prevention and must be taken on an empty stomach (30 mins before food) to be effective.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="bg-slate-100 border-y border-slate-200 py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Designed for Patient Safety and Absolute Clarity
              </h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                No complex portals, no confusing portals. Get structured, simple health guidance from any medical file.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl hover:shadow-lg transition-all">
                <div className="bg-blue-100 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Indian Shorthand Decoder</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Decodes local prescription notations like BD PC, OD AC, TDS, or HS directly into plain English times of day.
                </p>
              </div>
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl hover:shadow-lg transition-all">
                <div className="bg-teal-100 text-secondary w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Lab Report Flagging</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Extracts raw laboratory values and flags indicators outside normal bounds (e.g. cholesterol, blood counts) with color-coded warnings.
                </p>
              </div>
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl hover:shadow-lg transition-all">
                <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Safety Warning Highlights</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Flags potential drug interactions, lifestyle precautions, and necessary follow-up appointment durations clearly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Translator Sandbox Section */}
        <section id="demo" className="py-20 px-6 bg-slate-50">
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-black text-slate-800 mb-2 text-center">
              Try the Prescription Abbreviation Interpreter
            </h2>
            <p className="text-sm text-slate-500 text-center mb-8">
              Click a preset or type a custom prescription to see the NudgeDoc decoder instantly translate timings.
            </p>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <button 
                onClick={() => handleTranslateDemo('Tab Metformin 500mg BD PC')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-all border border-slate-200"
              >
                Metformin BD PC
              </button>
              <button 
                onClick={() => handleTranslateDemo('Tab Pantocid 40mg OD AC')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-all border border-slate-200"
              >
                Pantocid OD AC
              </button>
              <button 
                onClick={() => handleTranslateDemo('Tab Crocin 650mg SOS')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-all border border-slate-200"
              >
                Crocin SOS
              </button>
              <button 
                onClick={() => handleTranslateDemo('Cap Amoxicillin 500mg TDS PC')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-all border border-slate-200"
              >
                Amoxicillin TDS PC
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Input Abbreviated Instruction</label>
                <input 
                  type="text" 
                  value={demoInput}
                  onChange={(e) => handleTranslateDemo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold text-slate-800"
                  placeholder="Type doctor instructions here..."
                />
              </div>

              <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
                <span className="text-xs font-bold text-primary block uppercase tracking-wider mb-2">Translated Actionable Instruction</span>
                <p className="text-sm font-bold text-slate-800">
                  {demoResult}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 px-6 text-center text-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <Heart className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-wider">
              NudgeDoc
            </span>
          </div>
          <p>© {new Date().getFullYear()} NudgeDoc Health. All Rights Reserved. Hackathon MVP Demo.</p>
        </div>
      </footer>
    </div>
  );
}
