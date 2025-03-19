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
    bodyType?: 'სედანი' | 'ჯიპი' | 'კუპე' | 'ჰეტჩბეკი' | 'უნივერსალი' | 'კაბრიოლეტი' | 'პიკაპი' | 'მინივენი' | 'ლიმუზინი' | 'კროსოვერი';
    color?: string;
    drive?: string;
    engine?: string;
    drive_type?: string;
    engine_type?: string;
  };
  location: {
    city: string;
    region: string;
  };
  isVip: boolean;
}