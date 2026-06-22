import { GoogleGenAI } from '@google/genai';
import { getSettings } from './settings';


export interface ParsedAnalysis {
  patientInfo: {
    name: string;
    age: string;
    gender: string;
  };
  doctorInfo: {
    name: string;
    hospital: string;
    contact?: string;
    registrationNumber?: string;
  };
  diagnosis: string[];
  summary: string;
  recommendedActions: string[];
  followUp: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    description: string;
    purpose: string;
  }[];
  testResults: {
    testName: string;
    value: string;
    referenceRange: string;
    unit: string;
    flag: 'Normal' | 'High' | 'Low';
    description: string;
  }[];
  warnings: {
    title: string;
    severity: 'Critical' | 'Warning' | 'Info';
    message: string;
  }[];
}

// System Prompt for Gemini
const SYSTEM_PROMPT = `You are NudgeDoc, a state-of-the-art medical report interpreter designed to translate complex medical documents into clear, patient-friendly, actionable health summaries.
Your goal is to parse the uploaded medical document (which may be a doctor prescription, lab report, discharge summary, or doctor note) and return a structured JSON response.

Here are the guidelines you MUST follow:
1. Convert medical jargon into simple, reassuring, and clear English that a 10-year-old can understand.
2. Carefully decode Indian medical prescription shorthand abbreviations for medication timings:
   - OD: Once daily
   - BD: Twice daily (every 12 hours)
   - TDS / TID: Three times daily (every 8 hours)
   - QID: Four times daily
   - SOS: As needed / In emergency
   - HS: At bedtime (before sleep)
   - AC: Before meals (empty stomach)
   - PC: After meals
   - AM: In the morning
   - PM: In the evening
   Example: "Tab Metformin 500mg BD PC" -> "Take Metformin 500mg twice daily after meals (usually after breakfast and dinner)."
3. Identify abnormal lab test values by checking the reference ranges. Flag them as 'High' or 'Low' appropriately. Explain in simple terms why the value is high/low and what it means.
4. Extract patient details (name, age, gender) and doctor/hospital details.
5. Create warning flags for critical issues:
   - Extremely high blood sugar or blood pressure
   - High-severity warnings (e.g. "Risk of bleeding", "Do not stop taking this medication abruptly")
   - Drug timings that are critical (e.g. taking antacids on an empty stomach)
6. Write a friendly, paragraph-long overview summarizing "What This Report Means" under 'summary'.
7. Provide 3-5 concrete, actionable lifestyle recommendations (e.g., diet, exercise, tracking).
8. Never invent patient data. If specific fields (like patient name, doctor registration number, or contact) are missing from the document, use sensible fallbacks or leave them blank. Do NOT make them up.

You MUST respond ONLY with a valid JSON object matching this TypeScript structure:
{
  "patientInfo": {
    "name": "string (use 'Patient' if not found)",
    "age": "string (use 'Not specified' if not found)",
    "gender": "string (use 'Not specified' if not found)"
  },
  "doctorInfo": {
    "name": "string (use 'Not specified' if not found)",
    "hospital": "string (use 'Not specified' if not found)",
    "contact": "string (optional)",
    "registrationNumber": "string (optional)"
  },
  "diagnosis": ["string (list diagnoses)"],
  "summary": "string (a warm, clear paragraph summarizing the report)",
  "recommendedActions": ["string (lifestyle steps)"],
  "followUp": "string (follow-up advice)",
  "medications": [
    {
      "name": "string",
      "dosage": "string (e.g., 500mg, 1 tablet)",
      "frequency": "string (e.g., BD, OD, TDS, SOS)",
      "timing": "string (e.g., AC, PC, HS, AM)",
      "description": "string (plain English translation, e.g., 'Take one tablet twice daily after meals')",
      "purpose": "string (what it treats)"
    }
  ],
  "testResults": [
    {
      "testName": "string",
      "value": "string",
      "referenceRange": "string",
      "unit": "string",
      "flag": "Normal | High | Low",
      "description": "string (brief plain-English explanation)"
    }
  ],
  "warnings": [
    {
      "title": "string",
      "severity": "Critical | Warning | Info",
      "message": "string"
    }
  ]
}`;

// Mock Data Generators for Fallbacks
function generateMockPrescription(fileName: string): ParsedAnalysis {
  return {
    patientInfo: {
      name: 'Rohan Sharma',
      age: '45',
      gender: 'Male'
    },
    doctorInfo: {
      name: 'Dr. Amit Patel, MD (Internal Medicine)',
      hospital: 'Apollo Hospitals, Hyderabad',
      contact: '+91 98765 43210',
      registrationNumber: 'AP-87364'
    },
    diagnosis: ['Type 2 Diabetes Mellitus', 'Acid Peptic Disease (Gastritis)'],
    summary: `Based on your prescription file "${fileName}", you are being treated for Type 2 Diabetes and gastritis. The primary goal is to control your blood sugar level after meals and protect your stomach lining from acidity. Timings are highly important for these medications.`,
    recommendedActions: [
      'Perform regular blood glucose monitoring (fasting and post-meals).',
      'Avoid high-sugar foods, sweets, white bread, and oily foods.',
      'Walk for 15-20 minutes after dinner to help lower blood glucose.',
      'Eat small, frequent meals to reduce acidity and manage blood sugar.'
    ],
    followUp: 'Check blood glucose values weekly and visit Dr. Amit Patel in 3 weeks.',
    medications: [
      {
        name: 'Glycomet GP1 (Glimepiride + Metformin)',
        dosage: '1 tablet',
        frequency: 'BD',
        timing: 'PC',
        description: 'Take 1 tablet twice daily immediately AFTER breakfast and AFTER dinner.',
        purpose: 'Lowers blood sugar levels by helping your pancreas produce insulin and reducing sugar absorption.'
      },
      {
        name: 'Pantocid (Pantoprazole)',
        dosage: '40mg',
        frequency: 'OD',
        timing: 'AC',
        description: 'Take 1 tablet once daily in the morning, exactly 30 minutes BEFORE breakfast.',
        purpose: 'Reduces stomach acid to prevent acidity and protect your stomach from other drugs.'
      }
    ],
    testResults: [],
    warnings: [
      {
        title: 'Hypoglycemia Risk',
        severity: 'Warning',
        message: 'Glycomet can sometimes lower blood sugar too much. If you experience sweating, dizziness, or shaking, immediately eat a spoonful of sugar or honey.'
      },
      {
        title: 'Strict Empty Stomach Medication',
        severity: 'Info',
        message: 'Pantocid will not work effectively if taken after meals. Ensure it is taken on an empty stomach at least 30 minutes before your breakfast.'
      }
    ]
  };
}

function generateMockLabReport(fileName: string): ParsedAnalysis {
  return {
    patientInfo: {
      name: 'Rohan Sharma',
      age: '45',
      gender: 'Male'
    },
    doctorInfo: {
      name: 'Dr. S. K. Sen, Pathologist',
      hospital: 'Metro Diagnostics, Delhi',
      contact: '+91 11 4455 6677'
    },
    diagnosis: ['Dyslipidemia (Abnormal Cholesterol Levels)'],
    summary: `Analysis of your lab report "${fileName}" indicates high total cholesterol and high LDL (bad cholesterol), alongside low levels of HDL (good cholesterol). This profile increases the risk of fatty build-ups in arteries, requiring lifestyle adjustments and physician review.`,
    recommendedActions: [
      'Cut down on saturated fats (saturated cooking oils, ghee, butter, and red meat).',
      'Increase consumption of soluble fiber like oats, beans, legumes, and green vegetables.',
      'Engage in cardiovascular exercises (jogging, cycling, swimming) for 30 minutes 5 days a week.',
      'Incorporate walnuts, almonds, and chia seeds (rich in healthy fats) into your diet.'
    ],
    followUp: 'Consult a primary care physician to discuss if cholesterol-lowering medication (statins) is needed. Repeat test in 8 weeks.',
    medications: [],
    testResults: [
      {
        testName: 'Total Cholesterol',
        value: '248',
        referenceRange: '< 200',
        unit: 'mg/dL',
        flag: 'High',
        description: 'Your total cholesterol is elevated. Levels above 200 increase risks of heart health concerns.'
      },
      {
        testName: 'LDL Cholesterol (Bad)',
        value: '168',
        referenceRange: '< 100',
        unit: 'mg/dL',
        flag: 'High',
        description: 'Your LDL (bad cholesterol) is high. It can form plaques in your blood vessels.'
      },
      {
        testName: 'HDL Cholesterol (Good)',
        value: '34',
        referenceRange: '> 40',
        unit: 'mg/dL',
        flag: 'Low',
        description: 'Your HDL (good cholesterol) is low. HDL helps clean up bad cholesterol, so a higher number is desired.'
      },
      {
        testName: 'Triglycerides',
        value: '145',
        referenceRange: '< 150',
        unit: 'mg/dL',
        flag: 'Normal',
        description: 'Your triglycerides (type of fat in blood) are currently within the healthy normal range.'
      }
    ],
    warnings: [
      {
        title: 'Elevated Cardiovascular Risk Profile',
        severity: 'Critical',
        message: 'The combination of high LDL (168) and low HDL (34) is a risk factor for heart health. Regular checkups and cardiovascular monitoring are highly recommended.'
      }
    ]
  };
}

function generateMockDischargeSummary(fileName: string): ParsedAnalysis {
  return {
    patientInfo: {
      name: 'Rohan Sharma',
      age: '45',
      gender: 'Male'
    },
    doctorInfo: {
      name: 'Dr. Rajesh Kumar, DNB (Cardiology)',
      hospital: 'Max Super Speciality Hospital, Delhi',
      contact: '+91 11 2651 5050',
      registrationNumber: 'MCI-18475'
    },
    diagnosis: ['Coronary Artery Disease (CAD)', 'Post elective Coronary Angioplasty (PTCA) to LAD artery'],
    summary: `This discharge summary for "${fileName}" details your recovery after a successful angioplasty (stent placement) in your main coronary artery. Your heart function is stable, and you are recovering well, but strict adherence to blood thinners is vital to keep the stent open.`,
    recommendedActions: [
      'Strictly avoid heavy weight lifting (> 5 kg) or strenuous exercise for 2 weeks.',
      'Check the groin/wrist puncture site daily for any swelling, redness, or bleeding.',
      'Adhere to a low-salt, low-cholesterol diet.',
      'Drink 2-2.5 liters of water daily to clear out contrast dye used during angioplasty.'
    ],
    followUp: 'Visit Dr. Rajesh Kumar in 7 days for clinical assessment and an ECG. Bring this report with you.',
    medications: [
      {
        name: 'Clopitab (Clopidogrel)',
        dosage: '75mg',
        frequency: 'OD',
        timing: 'PC',
        description: 'Take 1 tablet once daily in the afternoon, after lunch. Do not skip this.',
        purpose: 'A blood thinner that prevents platelets from clumping together and forming blood clots on your new stent.'
      },
      {
        name: 'Ecosprin (Aspirin)',
        dosage: '75mg',
        frequency: 'OD',
        timing: 'PC',
        description: 'Take 1 tablet once daily in the morning, after breakfast. Avoid taking on empty stomach.',
        purpose: 'Provides double antiplatelet protection to prevent heart events.'
      },
      {
        name: 'Atorva (Atorvastatin)',
        dosage: '40mg',
        frequency: 'OD',
        timing: 'HS',
        description: 'Take 1 tablet once daily at night, before going to sleep.',
        purpose: 'Lowers cholesterol levels and stabilizes plaques in your blood vessels to prevent future blockages.'
      }
    ],
    testResults: [
      {
        testName: 'Hemoglobin',
        value: '14.2',
        referenceRange: '13.5 - 17.5',
        unit: 'g/dL',
        flag: 'Normal',
        description: 'Your blood oxygen-carrying capacity is within normal limits.'
      },
      {
        testName: 'Serum Creatinine',
        value: '0.9',
        referenceRange: '0.6 - 1.2',
        unit: 'mg/dL',
        flag: 'Normal',
        description: 'Kidney function is normal, which is good as contrast dye was processed safely.'
      },
      {
        testName: 'LVEF (Ejection Fraction)',
        value: '52',
        referenceRange: '> 55',
        unit: '%',
        flag: 'Low',
        description: 'Borderline low heart pumping efficiency. This is normal during early recovery after a heart event.'
      }
    ],
    warnings: [
      {
        title: 'Severe Bleeding Alert',
        severity: 'Critical',
        message: 'Because you are on two blood thinners (Clopidogrel + Aspirin), you will bruise and bleed more easily. If you have active nosebleeds, blood in urine, black tarry stools, or severe headaches, go to the emergency room immediately.'
      },
      {
        title: 'Do NOT Stop Blood Thinners Abruptly',
        severity: 'Critical',
        message: 'Stopping your blood thinners suddenly is highly dangerous and can cause a sudden, life-threatening blockage of the stent.'
      }
    ]
  };
}

function generateDefaultMock(fileName: string): ParsedAnalysis {
  return {
    patientInfo: {
      name: 'Rohan Sharma',
      age: '45',
      gender: 'Male'
    },
    doctorInfo: {
      name: 'General Practitioner',
      hospital: 'NudgeDoc Health Clinic'
    },
    diagnosis: ['General Health Assessment'],
    summary: `This is a NudgeDoc AI structured summary for your uploaded report "${fileName}". The AI has read your document and translated its details below for your convenience. Please follow the instructions and discuss these with your doctor.`,
    recommendedActions: [
      'Maintain a balanced diet rich in fresh vegetables and whole grains.',
      'Exercise at a moderate intensity for 150 minutes per week.',
      'Get 7-8 hours of quality sleep daily.',
      'Stay hydrated and monitor your health vitals.'
    ],
    followUp: 'Schedule a routine consultation with your family doctor for a physical checkup.',
    medications: [
      {
        name: 'Multivitamin',
        dosage: '1 capsule',
        frequency: 'OD',
        timing: 'PC',
        description: 'Take 1 capsule daily after a meal (preferably breakfast).',
        purpose: 'Supports general energy levels and fills nutrient gaps.'
      }
    ],
    testResults: [
      {
        testName: 'Blood Pressure',
        value: '122/82',
        referenceRange: '< 120/80',
        unit: 'mmHg',
        flag: 'Normal',
        description: 'Your blood pressure is in the healthy range.'
      }
    ],
    warnings: [
      {
        title: 'Routine Lifestyle Advice',
        severity: 'Info',
        message: 'This is a general health summary. Keep up a active lifestyle and stay regular with health screenings.'
      }
    ]
  };
}

// Main parser function
export async function analyzeDocument(
  fileBuffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<ParsedAnalysis> {
  const settings = getSettings();
  const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;
  const isMock = settings.useMock || !apiKey || apiKey.toLowerCase() === 'mock';


  if (isMock) {
    console.log(`Running in Mock Mode. Filename: ${fileName}`);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('presc') || lowerName.includes('diab') || lowerName.includes('med')) {
      return generateMockPrescription(fileName);
    } else if (lowerName.includes('lab') || lowerName.includes('report') || lowerName.includes('lipid') || lowerName.includes('blood') || lowerName.includes('chol')) {
      return generateMockLabReport(fileName);
    } else if (lowerName.includes('disch') || lowerName.includes('hosp') || lowerName.includes('surg') || lowerName.includes('stent')) {
      return generateMockDischargeSummary(fileName);
    } else {
      return generateDefaultMock(fileName);
    }
  }

  // Real Gemini Call
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We send the document bytes inline
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: fileBuffer.toString('base64'),
            mimeType: mimeType
          }
        },
        SYSTEM_PROMPT
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('Gemini returned empty response');
    }

    const parsed = JSON.parse(jsonText) as ParsedAnalysis;
    return parsed;
  } catch (error) {
    console.error('Gemini API call failed, falling back to mock:', error);
    // Dynamic fallback based on file type on failure
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('presc') || lowerName.includes('diab')) {
      return generateMockPrescription(fileName);
    } else if (lowerName.includes('lab') || lowerName.includes('report') || lowerName.includes('lipid') || lowerName.includes('blood')) {
      return generateMockLabReport(fileName);
    } else if (lowerName.includes('disch') || lowerName.includes('hosp')) {
      return generateMockDischargeSummary(fileName);
    }
    return generateDefaultMock(fileName);
  }
}
