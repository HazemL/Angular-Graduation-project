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
}

export interface PlumberRegistration {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience: number;
}