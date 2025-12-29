// src/model/device-repair.model.ts
export interface DeviceRepair {
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
  deviceTypes?: string[];
  brands?: string[];
  services?: string[];
  warranty: boolean;
  warrantyPeriod?: string;
  // New fields from API
  governorate?: string;
  city?: string;
  bio?: string;
  minPrice?: number;
  maxPrice?: number;
  isVerified?: boolean;
  verificationDate?: string | null;
}

export interface DeviceRepairRegistration {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
  deviceTypes?: string[];
  warranty: boolean;
}