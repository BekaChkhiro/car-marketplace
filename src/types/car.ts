import { LucideIcon } from 'lucide-react';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  specifications: {
    fuelType: string;
    transmission: string;
    mileage: number;
  };
  location: {
    city: string;
    region: string;
  };
  isVip: boolean;
}

export interface Category {
  id: string;
  name: string;
  transportType: string;
}

export interface TransportType {
  id: string;
  name: string;
  icon: LucideIcon;
}