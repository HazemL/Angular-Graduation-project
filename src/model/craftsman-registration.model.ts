export interface BasicInfoFormData {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  password: string;
  profilePhoto?: string;
  termsAccepted: boolean;
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
