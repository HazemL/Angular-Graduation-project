// src/model/painter.model.ts
export interface Painter {
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
  paintTypes?: string[];
  projects?: string[];
  techniques?: string[];
  // New fields from API
  governorate?: string;
  city?: string;
  bio?: string;
  minPrice?: number;
  maxPrice?: number;
  isVerified?: boolean;
  verificationDate?: string | null;
}

export interface PainterRegistration {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
  paintTypes?: string[];
  techniques?: string[];
}