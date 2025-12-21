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