import { NextRequest, NextResponse } from 'next/server';
import { getSettings, writeSettings } from '@/lib/settings';
import { getDb, writeDb, DatabaseSchema } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const settings = getSettings();
    const rawKey = settings.geminiApiKey;
    
    // Mask API key for security
    let maskedKey = '';
    if (rawKey) {
      if (rawKey.length > 8) {
        maskedKey = `${rawKey.substring(0, 4)}...${rawKey.substring(rawKey.length - 4)}`;
      } else {
        maskedKey = '••••••••';
      }
    }

    return NextResponse.json({
      success: true,
      settings: {
        geminiApiKey: maskedKey,
        hasKeySaved: !!rawKey,
        useMock: settings.useMock
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { geminiApiKey, useMock, resetDatabase } = body;

    const currentSettings = getSettings();

    // If key is provided and is NOT the masked pattern, update it
    let newKey = currentSettings.geminiApiKey;
    if (geminiApiKey !== undefined) {
      if (geminiApiKey.trim() === '') {
        newKey = '';
      } else if (!geminiApiKey.includes('...')) {
        newKey = geminiApiKey.trim();
      }
    }

    const updatedSettings = {
      geminiApiKey: newKey,
      useMock: useMock !== undefined ? !!useMock : currentSettings.useMock
    };

    writeSettings(updatedSettings);

    // Optional: Reset database to seed data
    let dbReset = false;
    if (resetDatabase) {
      // Re-read seedData or just re-write db.json with seedData
      // We can delete the db.json file and call getDb() which re-creates it with seed data!
      const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
      getDb(); // Re-seed
      
      // Clean up public uploads directory if it exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        for (const file of files) {
          // Keep the seed assets if they are in uploads?
          // Wait, the seed fileUrls are '/uploads/Prescription_Diabetes_Jun2026.pdf' and '/uploads/Lipid_Profile_Report.pdf'.
          // We can delete all OTHER files but keep these if they exist, or we can just leave the files and clear db items.
          // To be safe, we can just clear files that don't match the seed list.
          const lowerFile = file.toLowerCase();
          if (!lowerFile.includes('diabetes') && !lowerFile.includes('lipid')) {
            try {
              fs.unlinkSync(path.join(uploadDir, file));
            } catch {}
          }
        }
      }
      dbReset = true;
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      dbReset
    });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 550 });
  }
}
