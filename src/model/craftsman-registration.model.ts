export interface BasicInfoFormData {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  password: string;
  profilePhoto?: string;
  termsAccepted: boolean;
  isCraftsman?: boolean;
}

export interface ProfessionSkillsFormData {
  profession: string;
  skills: string[];
  yearsOfExperience?: number;
  description?: string;
  previousWork: string[]; // URLs of previous work photos/videos
}

export interface ServiceAreasFormData {
  governorates: string[];
  cities: string[]; // List of all selected cities across governorates
}

export interface DocumentsFormData {
  nationalIdFront: string; // URL
  nationalIdBack: string; // URL
  criminalRecord: string; // URL
}

export interface RegistrationStep {
  stepNumber: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface RegistrationResponse {
  userId: string;
  nextStep: number;
}
