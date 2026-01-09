
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface TreatmentStep {
  step: string;
  description: string;
  materials: string[];
}

export interface DashboardStats {
  totalScans: number;
  healthyCount: number;
  diseasedCount: number;
  riskAlerts: number;
}

export interface PlantAnalysisResult {
  id: string;
  timestamp: number;
  plantName: string;
  diseaseName: string;
  confidenceScore: number;
  description: string;
  biologicalCause: string;
  environmentalTriggers: string[];
  treatmentPlan: TreatmentStep[];
  neighborRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskReasoning: string;
  preventionStrategies: string[];
  location?: {
    lat: number;
    lng: number;
  };
  translation?: {
    language: string;
    advice: string;
  };
}

export interface OutbreakPoint {
  id: string;
  lat: number;
  lng: number;
  diseaseName: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  timestamp: number;
}

export interface FarmAlert {
  id: string;
  type: 'Risk' | 'Outbreak' | 'System';
  message: string;
  timestamp: number;
  severity: 'Info' | 'Warning' | 'Urgent';
}

export interface Cure {
  id: string;
  title: string;
  targetPathogen: string;
  materials: string[];
  preparation: string;
  application: string;
  category: 'Fungal' | 'Bacterial' | 'Pest' | 'Nutrient';
}

export interface AnalysisState {
  loading: boolean;
  error: string | null;
  result: PlantAnalysisResult | null;
  imageUrl: string | null;
  history: PlantAnalysisResult[];
  alerts: FarmAlert[];
  user: User | null;
  currentView: 'auth' | 'dashboard' | 'scan' | 'radar' | 'library' | 'portal' | 'voice' | 'result';
}
