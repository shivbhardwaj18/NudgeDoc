import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    
    const totalCount = db.documents.length;
    const analyzedCount = db.documents.filter(d => d.status === 'Analyzed').length;
    const processingCount = db.documents.filter(d => d.status === 'Processing').length;
    const failedCount = db.documents.filter(d => d.status === 'Failed').length;

    // Gather all active warnings across all analyzed documents
    const allWarnings = db.warnings.slice(0, 10); // cap at 10 for dashboard alerts

    // Latest analyzed documents
    const recentReports = db.documents.slice(0, 5);

    // Dynamic stats: count of abnormal lab tests
    const highLowTests = db.testResults.filter(t => t.flag === 'High' || t.flag === 'Low').length;

    // Active Medications count
    const totalMedications = db.medications.length;

    // List of active diagnoses
    const diagnosesSet = new Set<string>();
    db.analysisResults.forEach(r => {
      r.diagnosis.forEach(d => diagnosesSet.add(d));
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalReports: totalCount,
        analyzedReports: analyzedCount,
        processingReports: processingCount,
        failedReports: failedCount,
        criticalAlertsCount: allWarnings.filter(w => w.severity === 'Critical').length,
        abnormalTestsCount: highLowTests,
        totalMedications
      },
      diagnoses: Array.from(diagnosesSet),
      recentReports,
      activeWarnings: allWarnings
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
