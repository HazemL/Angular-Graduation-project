export interface GasTechnician {
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
  certifications?: string[];
  emergencyService: boolean;
  licensedBy?: string;
}

export interface GasTechnicianRegistration {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
  certifications?: string[];
  emergencyService: boolean;
}