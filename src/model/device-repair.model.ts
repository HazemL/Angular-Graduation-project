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