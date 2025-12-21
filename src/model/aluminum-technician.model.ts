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