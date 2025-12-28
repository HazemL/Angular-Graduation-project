// src/model/api-response.model.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CraftsmanApi {
  id: number;
  userId: number;
  fullName: string;
  phone: string; // ✅ Now provided by API
  profileImageUrl: string | null; // ✅ Now provided by API
  governorateName: string;
  cityName: string;
  professionId: number;
  bio: string;
  experienceYears: number;
  minPrice: number;
  maxPrice: number;
  isVerified: boolean;
  verificationDate: string | null;
}

export interface ProfessionApi {
  id: number;
  name: string;
  arabicName: string;
  description: string;
}