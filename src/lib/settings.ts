import fs from 'fs';
import path from 'path';

const SETTINGS_DIR = process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'nudgedoc', 'data')
  : path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'settings.json');

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
    const originalSettingsPath = path.join(process.cwd(), 'src', 'data', 'settings.json');
    if (originalSettingsPath !== SETTINGS_FILE && fs.existsSync(originalSettingsPath)) {
      try {
        const originalContent = fs.readFileSync(originalSettingsPath, 'utf-8');
        fs.writeFileSync(SETTINGS_FILE, originalContent, 'utf-8');
        return JSON.parse(originalContent) as AppSettings;
      } catch (e) {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
        return defaultSettings;
      }
    }
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
