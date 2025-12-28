// src/model/aluminum-technician.model.ts
export interface AluminumTechnician {
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
  services?: string[];
  materials?: string[];
  projects?: string[];
  warranty: boolean;
  // New fields from API
  governorate?: string;
  city?: string;
  bio?: string;
  minPrice?: number;
  maxPrice?: number;
  isVerified?: boolean;
  verificationDate?: string | null;
}

export interface AluminumTechnicianRegistration {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
  services?: string[];
  warranty: boolean;
}