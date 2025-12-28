// src/model/electrician.model.ts
export interface Electrician {
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
  certifications?: string[];
  // New fields from API
  governorate?: string;
  city?: string;
  bio?: string;
  minPrice?: number;
  maxPrice?: number;
  isVerified?: boolean;
  verificationDate?: string | null;
}

export interface ElectricianRegistration {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
  certifications?: string[];
}