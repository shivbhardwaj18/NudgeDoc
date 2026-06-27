import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDb, writeDb, Document } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if not exists
    const uploadDir = process.env.NODE_ENV === 'production'
      ? path.join('/tmp', 'nudgedoc', 'uploads')
      : path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file with unique name
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${uniqueId}_${sanitizedName}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    // Infer document type from file name
    const lowerName = file.name.toLowerCase();
    let docType: Document['type'] = 'Consultation Notes';
    if (lowerName.includes('presc') || lowerName.includes('diab') || lowerName.includes('med')) {
      docType = 'Prescription';
    } else if (lowerName.includes('lab') || lowerName.includes('report') || lowerName.includes('lipid') || lowerName.includes('blood')) {
      docType = 'Lab Report';
    } else if (lowerName.includes('disch') || lowerName.includes('hosp')) {
      docType = 'Discharge Summary';
    }

    // Create DB entry
    const docId = `doc_${uniqueId}`;
    const newDoc: Document = {
      id: docId,
      name: file.name,
      type: docType,
      status: 'Processing',
      uploadedAt: new Date().toISOString(),
      fileUrl: `/uploads/${filename}`
    };

    const db = getDb();
    db.documents.unshift(newDoc); // add to top
    writeDb(db);

    return NextResponse.json({
      success: true,
      document: newDoc
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
