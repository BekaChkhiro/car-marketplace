export interface Part {
  id: string | number;
  title: string;
  price: number;
  category: string;
  condition: string;
  brand?: string;
  model?: string;
  description?: string;
  images: PartImage[];
  status: string;
  created_at: string;
  sellerId?: string | number;
  seller?: {
    id: string | number;
    username?: string;
    email?: string;
  };
  // VIP related fields
  vip_status?: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vip_expiration_date?: string;
  vip_active?: boolean;
  // Auto-renewal fields
  auto_renewal_enabled?: boolean;
  auto_renewal_expiration_date?: string;
  auto_renewal_days?: number;
  auto_renewal_remaining_days?: number;
  // Color highlighting fields
  color_highlighting_enabled?: boolean;
  color_highlighting_expiration_date?: string;
}

export interface PartImage {
  id: number;
  part_id: number;
  url: string;
  thumbnail_url?: string;
  medium_url?: string;
  large_url?: string;
  is_primary?: boolean;
}
