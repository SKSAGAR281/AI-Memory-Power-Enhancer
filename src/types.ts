export interface TestResult {
  id: string;
  date: Date;
  overallScore: number;
  workingMemoryScore: number;
  shortTermMemoryScore: number;
  longTermMemoryScore: number;
  visualMemoryScore: number;
  auditoryMemoryScore: number;
  processingSpeedScore: number;
  attentionScore: number;
  timeSpent: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProfile {
  name: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age: number;
  dateOfBirth?: string;
  occupation: string;
  education?: string;
  memoryGoals: string[];
  medicalConditions?: string[];
  currentMedications?: string;
  sleepHours?: number;
  exerciseFrequency?: string;
  stressLevel?: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  availableTimePerDay: number; // in minutes
  challengeAreas: string[];
  strengths: string[];
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  notifications?: boolean;
  dataSharing?: boolean;
  isAuthenticated?: boolean;
  createdAt?: Date;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  category: 'technique' | 'exercise' | 'lifestyle' | 'diet';
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  date: Date;
  completedAt?: Date;
  streak: number;
  targetArea: string;
}

export interface MemoryTechnique {
  id: string;
  name: string;
  description: string;
  howToUse: string;
  examples: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  effectiveFor: string[];
}

export interface NutritionTip {
  id: string;
  category: 'food' | 'supplement' | 'hydration' | 'timing';
  title: string;
  description: string;
  benefits: string[];
  implementation: string;
}

export interface ProgressMetric {
  date: Date;
  overallScore: number;
  improvementPercentage: number;
  strongestArea: string;
  weakestArea: string;
  consistencyScore: number;
}