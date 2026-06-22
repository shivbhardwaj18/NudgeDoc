'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  FileCheck
} from 'lucide-react';

interface UploadStage {
  label: string;
  minProgress: number;
}

const STAGES: UploadStage[] = [
  { label: 'Uploading file securely to portal...', minProgress: 0 },
  { label: 'Performing OCR text extraction...', minProgress: 25 },
  { label: 'Running Gemini 2.5 Flash clinical interpreter...', minProgress: 50 },
  { label: 'Translating prescription abbreviations (BD, PC, SOS)...', minProgress: 75 },
  { label: 'Structuring test results & generating health recommendations...', minProgress: 90 },
];

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or an Image file (JPEG, PNG, WEBP).');
      return;
    }
    // Limit to 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }
    setFile(selectedFile);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);
    setProgress(0);
    setStageIndex(0);

    // Simulate progress bar visual movements during the API call
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 1;
      if (currentProgress > 95) {
        clearInterval(progressInterval);
      } else {
        setProgress(currentProgress);
        // Update stage text based on progress number
        const nextStage = STAGES.findIndex((s, idx) => {
          const next = STAGES[idx + 1];
          return currentProgress >= s.minProgress && (!next || currentProgress < next.minProgress);
        });
        if (nextStage !== -1) {
          setStageIndex(nextStage);
        }
      }
    }, 80);

    try {
      // 1. POST /api/upload
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('File upload failed. Please try again.');
      }

      const uploadData = await uploadRes.json();
      const documentId = uploadData.document.id;

      // 2. POST /api/analyze
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      });

      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json();
        throw new Error(errData.error || 'Clinical analysis failed.');
      }

      // Finish progress bar
      clearInterval(progressInterval);
      setProgress(100);
      setStageIndex(STAGES.length - 1);

      // Brief delay to let the user see the 100% completion
      setTimeout(() => {
        router.push(`/dashboard/results/${documentId}`);
      }, 800);

    } catch (err: any) {
      clearInterval(progressInterval);
      setAnalyzing(false);
      setError(err.message || 'An unexpected error occurred during processing.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Upload Medical Document
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-semibold">
          Select or drag any clinical document to extract, interpret, and flag warnings.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {!analyzing ? (
          <div className="space-y-6">
            {/* Drag & Drop Card */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerUpload}
              className="bg-white border-2 border-dashed border-slate-200 hover:border-primary/50 cursor-pointer rounded-3xl p-10 text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center min-h-[300px] gap-4"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <div className="bg-blue-50 text-primary p-5 rounded-2xl shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">
                  Drag & drop your file here
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Supports PDF, JPEG, PNG, or WEBP (Max 10MB)
                </p>
              </div>
              <button 
                type="button"
                className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                Browse Files
              </button>
            </div>

            {/* Selected File Card */}
            {file && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="bg-blue-50 text-primary p-2.5 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{file.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={handleAnalyze}
                  className="bg-primary hover:bg-blue-600 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md shadow-blue-500/10 transition-all flex items-center gap-2"
                >
                  Start Interpretation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-red-100 text-red-700 text-xs font-bold p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Tip Warning */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Clinical Privacy Shield</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1 font-medium">
                  Your files are stored locally and parsed securely via Google Gemini. No personal health records are shared publicly or used to train medical models.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Analyzing Animation Card */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-10 shadow-xl text-center space-y-8 glow-blue">
            <div className="relative w-20 h-20 mx-auto">
              {/* Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
              {/* Center icon changing by stage */}
              <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center text-primary">
                {progress < 50 ? (
                  <UploadCloud className="w-6 h-6 animate-pulse" />
                ) : progress < 90 ? (
                  <BrainCircuit className="w-6 h-6 animate-pulse" />
                ) : (
                  <FileCheck className="w-6 h-6 text-teal-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-800 text-lg">
                Analyzing Medical Document
              </h3>
              <p className="text-xs font-semibold text-primary animate-pulse min-h-[16px]">
                {STAGES[stageIndex].label}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Clinical OCR pipeline</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
