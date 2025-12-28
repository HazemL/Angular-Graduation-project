// src/model/plumber.model.ts
export interface Plumber {
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
  // New fields from API
  governorate?: string;
  city?: string;
  bio?: string;
  minPrice?: number;
  maxPrice?: number;
  isVerified?: boolean;
  verificationDate?: string | null;
  services?: string[];
}

export interface PlumberRegistration {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
}