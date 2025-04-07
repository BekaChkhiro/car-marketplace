import { LucideIcon } from 'lucide-react';

export interface CarImage {
  original_name: string;
  thumbnail: string;
  medium: string;
  large: string;
}

export interface CarSpecifications {
  fuelType: string;
  transmission: string;
  mileage: number;
  color?: string;
  drive?: string;
  drive_type?: string;  // Added this property
  engine?: string;
  engine_type?: string; // Added this for consistency
}

export interface Car {
  id: string;
  brand_id?: number;
  category_id?: number;
  make: string;
  model: string;
  year: number;
  price: number;
  description?: string;
  images: string[];
  specifications: CarSpecifications;
  location: {
    city: string;
    region: string;
  };
  isVip: boolean;
  seller?: {
    id?: string;
    name: string;
    phone: string;
    email?: string;
    verified?: boolean;
    rating?: number;
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface TransportType {
  id: string;
  name: string;
  icon: LucideIcon;
}