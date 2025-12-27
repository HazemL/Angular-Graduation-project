// src/model/carpenter.model.ts
export interface Carpenter {
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
  portfolio?: string[];
  // New fields from API
  governorate?: string;
  city?: string;
  bio?: string;
  minPrice?: number;
  maxPrice?: number;
  isVerified?: boolean;
  verificationDate?: string | null;
}

export interface CarpenterRegistration {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
  services?: string[];
}