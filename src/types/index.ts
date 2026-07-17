export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  postal_code: string;
  total_amount: number;
  status: string;
  created_at: string;
  estimated_delivery?: string;
  tracking_number?: string;
}

export interface OrderTracking {
  id: string;
  order_id: string;
  status: string;
  status_message: string;
  timestamp: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}
