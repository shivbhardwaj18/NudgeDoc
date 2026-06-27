import fs from 'fs';
import path from 'path';

// Define DB paths
const DATA_DIR = process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'nudgedoc', 'data')
  : path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Interface definitions
export interface Document {
  id: string;
  name: string;
  type: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Consultation Notes';
  status: 'Processing' | 'Analyzed' | 'Failed';
  uploadedAt: string;
  fileUrl: string;
}

export interface PatientInfo {
  name: string;
  age: string;
  gender: string;
}

export interface DoctorInfo {
  name: string;
  hospital: string;
  contact?: string;
  registrationNumber?: string;
}

export interface Medication {
  id: string;
  documentId: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  description: string;
  purpose: string;
}

export interface TestResult {
  id: string;
  documentId: string;
  testName: string;
  value: string;
  referenceRange: string;
  unit: string;
  flag: 'Normal' | 'High' | 'Low';
  description: string;
}

export interface Warning {
  id: string;
  documentId: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
}

export interface AnalysisResult {
  documentId: string;
  patientInfo: PatientInfo;
  doctorInfo: DoctorInfo;
  diagnosis: string[];
  summary: string;
  recommendedActions: string[];
  followUp: string;
}

export interface DatabaseSchema {
  users: { id: string; email: string; name: string }[];
  documents: Document[];
  analysisResults: AnalysisResult[];
  medications: Medication[];
  testResults: TestResult[];
  warnings: Warning[];
}

// Seed Data
const seedData: DatabaseSchema = {
  users: [
    { id: 'user_1', email: 'demo@nudgedoc.com', name: 'Rohan Sharma' }
  ],
  documents: [
    {
      id: 'doc_1',
      name: 'Prescription_Diabetes_Jun2026.pdf',
      type: 'Prescription',
      status: 'Analyzed',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      fileUrl: '/uploads/Prescription_Diabetes_Jun2026.pdf'
    },
    {
      id: 'doc_2',
      name: 'Lipid_Profile_Report.pdf',
      type: 'Lab Report',
      status: 'Analyzed',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      fileUrl: '/uploads/Lipid_Profile_Report.pdf'
    }
  ],
  analysisResults: [
    {
      documentId: 'doc_1',
      patientInfo: {
        name: 'Rohan Sharma',
        age: '45',
        gender: 'Male'
      },
      doctorInfo: {
        name: 'Dr. Amit Patel, MD',
        hospital: 'Apollo Health City, Hyderabad',
        contact: '+91 98765 43210',
        registrationNumber: 'AP-87364'
      },
      diagnosis: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
      summary: 'This prescription is for managing your Type 2 Diabetes and high blood pressure. The doctor has prescribed a combination of three medications to regulate your blood glucose levels, protect your stomach lining, and control your blood pressure. Consistent timing (especially before vs. after meals) is crucial for these medications.',
      recommendedActions: [
        'Monitor fasting and post-prandial blood sugar levels twice a week.',
        'Adopt a low-sodium, low-glycemic diet. Restrict processed sugar and salt.',
        'Incorporate 30 minutes of moderate physical activity (brisk walking) daily.',
        'Stay well hydrated throughout the day.'
      ],
      followUp: 'Return for a follow-up consultation in 4 weeks with fresh Fasting Blood Sugar (FBS) and HbA1c reports.'
    },
    {
      documentId: 'doc_2',
      patientInfo: {
        name: 'Rohan Sharma',
        age: '45',
        gender: 'Male'
      },
      doctorInfo: {
        name: 'Diagnostics Lab Specialist',
        hospital: 'Redcliffe Labs, Hyderabad'
      },
      diagnosis: ['Dyslipidemia (High Cholesterol)'],
      summary: 'Your lipid (cholesterol) profile indicates elevated levels of total cholesterol and LDL ("bad") cholesterol, alongside borderline low HDL ("good") cholesterol. This combination increases cardiovascular risks and suggests a need for dietary modifications and regular screening.',
      recommendedActions: [
        'Reduce intake of saturated fats and trans fats (oils, butter, fried foods).',
        'Increase intake of soluble fiber (oats, beans, lentils, fruits).',
        'Consume omega-3 rich foods like walnuts, flaxseeds, or fish.',
        'Re-test Lipid Profile in 8-12 weeks.'
      ],
      followUp: 'Discuss these results with your general physician to evaluate if statin therapy is required.'
    }
  ],
  medications: [
    {
      id: 'med_1',
      documentId: 'doc_1',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'BD',
      timing: 'PC',
      description: 'Take Metformin 500mg twice daily after meals (usually after breakfast and after dinner).',
      purpose: 'Helps lower blood sugar levels by improving how your body handles insulin.'
    },
    {
      id: 'med_2',
      documentId: 'doc_1',
      name: 'Telmisartan',
      dosage: '40mg',
      frequency: 'OD',
      timing: 'AM',
      description: 'Take Telmisartan 40mg once daily in the morning, with or without food. Maintain a consistent time.',
      purpose: 'Relaxes blood vessels to lower your blood pressure and protect your kidneys.'
    },
    {
      id: 'med_3',
      documentId: 'doc_1',
      name: 'Pantocid (Pantoprazole)',
      dosage: '40mg',
      frequency: 'OD',
      timing: 'AC',
      description: 'Take Pantocid 40mg once daily in the morning, 30 minutes before your first meal (breakfast).',
      purpose: 'Reduces stomach acid to prevent heartburn or gastritis potentially caused by other medicines.'
    }
  ],
  testResults: [
    {
      id: 'test_1',
      documentId: 'doc_2',
      testName: 'Total Cholesterol',
      value: '245',
      referenceRange: '< 200',
      unit: 'mg/dL',
      flag: 'High',
      description: 'Total cholesterol is elevated. High cholesterol can lead to plaque buildup in arteries.'
    },
    {
      id: 'test_2',
      documentId: 'doc_2',
      testName: 'LDL (Bad Cholesterol)',
      value: '165',
      referenceRange: '< 100',
      unit: 'mg/dL',
      flag: 'High',
      description: 'LDL cholesterol is significantly high, which increases risks of heart disease.'
    },
    {
      id: 'test_3',
      documentId: 'doc_2',
      testName: 'HDL (Good Cholesterol)',
      value: '35',
      referenceRange: '> 40',
      unit: 'mg/dL',
      flag: 'Low',
      description: 'HDL cholesterol is low. HDL helps clear bad cholesterol from your bloodstream, so higher is better.'
    },
    {
      id: 'test_4',
      documentId: 'doc_2',
      testName: 'Triglycerides',
      value: '142',
      referenceRange: '< 150',
      unit: 'mg/dL',
      flag: 'Normal',
      description: 'Your triglycerides are currently within the healthy normal range.'
    }
  ],
  warnings: [
    {
      id: 'warn_1',
      documentId: 'doc_1',
      title: 'Hypoglycemia Risk (Low Blood Sugar)',
      severity: 'Warning',
      message: 'Since you are taking Metformin, watch out for symptoms of low blood sugar such as dizziness, sweating, shaking, or sudden hunger. Keep a sweet candy handy.'
    },
    {
      id: 'warn_2',
      documentId: 'doc_1',
      title: 'Strict Timing for Pantocid',
      severity: 'Info',
      message: 'Pantocid must be taken BEFORE breakfast (AC) to work effectively. Taking it after food reduces its effectiveness.'
    },
    {
      id: 'warn_3',
      documentId: 'doc_2',
      title: 'Elevated Cardiovascular Risk',
      severity: 'Critical',
      message: 'Your high LDL (165 mg/dL) and low HDL (35 mg/dL) significantly raise cardiovascular risk factors. Consult a doctor for active lifestyle planning.'
    }
  ]
};

// Database helper functions
export function deleteDbFile(): void {
  if (fs.existsSync(DB_FILE)) {
    try {
      fs.unlinkSync(DB_FILE);
    } catch (e) {
      console.error('Failed to delete DB file:', e);
    }
  }
}

export function getDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(DB_FILE)) {
    const originalDbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
    if (originalDbPath !== DB_FILE && fs.existsSync(originalDbPath)) {
      try {
        const originalContent = fs.readFileSync(originalDbPath, 'utf-8');
        fs.writeFileSync(DB_FILE, originalContent, 'utf-8');
        return JSON.parse(originalContent) as DatabaseSchema;
      } catch (e) {
        fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), 'utf-8');
        return seedData;
      }
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), 'utf-8');
    return seedData;
  }
  
  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(fileContent) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading database file, resetting to seed data:', error);
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), 'utf-8');
    return seedData;
  }
}

export function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
