export interface NewCarFormData {
  brand_id: string | number;
  category_id: string | number;
  model: string;
  year: number;
  price: string | number;
  description?: string;
  status?: 'available' | 'sold' | 'pending';
  featured?: boolean;
  city: string;
  state: string;
  country: string;
  
  // Optional specifications
  specifications?: {
    engine_type?: string;
    transmission?: string;
    fuel_type?: string;
    mileage?: string | number;
    engine_size?: string | number;
    horsepower?: string | number;
    doors?: string | number;
    color?: string;
    body_type?: string;
  };
}

export type FormSection = 'specifications';

export interface BrandOption {
  id: number;
  name: string;
}

export interface CategoryOption {
  id: number;
  name: string;
}

export const TRANSMISSION_OPTIONS = [
  'ავტომატიკა',
  'მექანიკა',
  'ვარიატორი (CVT)',
  'რობოტიზირებული (DCT/DSG)',
  'ნახევრად ავტომატური'
] as const;

export const FUEL_TYPE_OPTIONS = [
  'ბენზინი',
  'დიზელი',
  'ჰიბრიდი',
  'ელექტრო',
  'ბუნებრივი გაზი',
  'თხევადი გაზი'
] as const;

export const BODY_TYPE_OPTIONS = [
  'სედანი',
  'ჰეჩბექი',
  'უნივერსალი',
  'კუპე',
  'კაბრიოლეტი',
  'ჯიპი',
  'პიკაპი',
  'მინივენი',
  'ფურგონი',
  'სხვა'
] as const;

export const COLOR_OPTIONS = [
  'შავი',
  'თეთრი',
  'ვერცხლისფერი',
  'რუხი',
  'წითელი',
  'ლურჯი',
  'ყავისფერი',
  'მწვანე',
  'ყვითელი',
  'ოქროსფერი'
] as const;