export interface Part {
  id: string | number;
  title: string;
  price: number;
  category: string;
  condition: string;
  brand?: string;
  model?: string;
  description?: string;
  images: { url: string }[];
  status: string;
  created_at: string;
  sellerId?: string | number;
  seller?: {
    id: string | number;
    username?: string;
    email?: string;
  };
}
