import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    
    const document = db.documents.find(d => d.id === id);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const analysis = db.analysisResults.find(r => r.documentId === id) || null;
    const medications = db.medications.filter(m => m.documentId === id);
    const testResults = db.testResults.filter(t => t.documentId === id);
    const warnings = db.warnings.filter(w => w.documentId === id);

    return NextResponse.json({
      success: true,
      document,
      analysis,
      medications,
      testResults,
      warnings
    });
  } catch (error: any) {
    console.error('Error fetching document detail:', error);
    return NextResponse.json({ error: 'Failed to fetch document details' }, { status: 500 });
  }
}
