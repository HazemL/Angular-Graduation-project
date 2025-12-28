// src/model/ac-technician.model.ts
export interface AcTechnician {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: boolean;
  imageUrl?: string;
  brands?: string[];
  services?: string[];
  emergencyService: boolean;
  // New fields from API
  governorate?: string;
  city?: string;
  bio?: string;
  minPrice?: number;
  maxPrice?: number;
  isVerified?: boolean;
  verificationDate?: string | null;
}

export interface AcTechnicianRegistration {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
  brands?: string[];
  emergencyService: boolean;
}