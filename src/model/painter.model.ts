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