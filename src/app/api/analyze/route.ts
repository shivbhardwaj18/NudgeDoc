import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDb, writeDb, Document, Medication, TestResult, Warning, AnalysisResult } from '@/lib/db';
import { analyzeDocument } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
    }

    const db = getDb();
    const docIndex = db.documents.findIndex(d => d.id === documentId);

    if (docIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const document = db.documents[docIndex];
    
    // Locate the file on disk
    const fileRelativePath = document.fileUrl.replace(/^\//, ''); // strip leading slash
    const filePath = path.join(process.cwd(), 'public', fileRelativePath);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `File not found on disk at ${filePath}` }, { status: 404 });
    }

    // Determine mimeType
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'application/pdf';
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';

    const fileBuffer = fs.readFileSync(filePath);

    // Call Gemini Analyzer (with mock fallback built-in)
    const analysis = await analyzeDocument(fileBuffer, mimeType, document.name);

    // Update document type if AI refined it
    let refinedType = document.type;
    if (analysis.medications.length > 0 && analysis.testResults.length === 0) {
      refinedType = 'Prescription';
    } else if (analysis.testResults.length > 0 && analysis.medications.length === 0) {
      refinedType = 'Lab Report';
    } else if (analysis.diagnosis.some(d => d.toLowerCase().includes('discharge')) || document.name.toLowerCase().includes('disch')) {
      refinedType = 'Discharge Summary';
    }

    // Prepare entries to write to database
    // Delete existing records for this document first (to support re-analysis if needed)
    db.analysisResults = db.analysisResults.filter(r => r.documentId !== documentId);
    db.medications = db.medications.filter(m => m.documentId !== documentId);
    db.testResults = db.testResults.filter(t => t.documentId !== documentId);
    db.warnings = db.warnings.filter(w => w.documentId !== documentId);

    // Write new analysis summary
    const newAnalysisResult: AnalysisResult = {
      documentId,
      patientInfo: analysis.patientInfo,
      doctorInfo: analysis.doctorInfo,
      diagnosis: analysis.diagnosis,
      summary: analysis.summary,
      recommendedActions: analysis.recommendedActions,
      followUp: analysis.followUp
    };
    db.analysisResults.push(newAnalysisResult);

    // Write medications
    analysis.medications.forEach((med, idx) => {
      const newMed: Medication = {
        id: `med_${documentId}_${idx}`,
        documentId,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        timing: med.timing,
        description: med.description,
        purpose: med.purpose
      };
      db.medications.push(newMed);
    });

    // Write test results
    analysis.testResults.forEach((test, idx) => {
      const newTest: TestResult = {
        id: `test_${documentId}_${idx}`,
        documentId,
        testName: test.testName,
        value: test.value,
        referenceRange: test.referenceRange,
        unit: test.unit,
        flag: test.flag,
        description: test.description
      };
      db.testResults.push(newTest);
    });

    // Write warnings
    analysis.warnings.forEach((warn, idx) => {
      const newWarn: Warning = {
        id: `warn_${documentId}_${idx}`,
        documentId,
        title: warn.title,
        severity: warn.severity,
        message: warn.message
      };
      db.warnings.push(newWarn);
    });

    // Update document status
    db.documents[docIndex].status = 'Analyzed';
    db.documents[docIndex].type = refinedType;

    writeDb(db);

    return NextResponse.json({
      success: true,
      analysis: newAnalysisResult,
      medications: analysis.medications,
      testResults: analysis.testResults,
      warnings: analysis.warnings
    });
  } catch (error: any) {
    console.error('Document analysis error:', error);
    
    // Set document status to Failed on crash
    try {
      const db = getDb();
      const body = await req.clone().json();
      const docIndex = db.documents.findIndex(d => d.id === body.documentId);
      if (docIndex !== -1) {
        db.documents[docIndex].status = 'Failed';
        writeDb(db);
      }
    } catch {}

    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
