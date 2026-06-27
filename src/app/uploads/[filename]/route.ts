import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // Define possible paths
  const tmpPath = path.join('/tmp', 'nudgedoc', 'uploads', filename);
  const publicPath = path.join(process.cwd(), 'public', 'uploads', filename);
  
  let filePath = '';
  if (fs.existsSync(tmpPath)) {
    filePath = tmpPath;
  } else if (fs.existsSync(publicPath)) {
    filePath = publicPath;
  } else {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
  
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.pdf') contentType = 'application/pdf';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.webp') contentType = 'image/webp';
  
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
