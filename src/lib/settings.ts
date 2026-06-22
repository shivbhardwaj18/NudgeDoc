import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'settings.json');

export interface AppSettings {
  geminiApiKey: string;
  useMock: boolean;
}

const defaultSettings: AppSettings = {
  geminiApiKey: '',
  useMock: true,
};

export function getSettings(): AppSettings {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
    return defaultSettings;
  }

  try {
    const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(content) as AppSettings;
  } catch (error) {
    return defaultSettings;
  }
}

export function writeSettings(settings: AppSettings): void {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}
