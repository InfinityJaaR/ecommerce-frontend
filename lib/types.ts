export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string | number;
  stock: number;
  sku: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Paginated<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
  product?: Product;
};

export type Order = {
  id: number;
  user_id: number;
  status: "pending" | "processing" | "paid" | "failed" | "cancelled" | string;
  total: string | number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
};

export type User = { id: number; name: string; email: string };

export type AuthResponse = {
  access_token: string;
  token_type: "bearer" | string;
  expires_in: number;
  user?: User;
};

export type ApiValidationError = {
  message?: string;
  errors?: Record<string, string[]>;
};
