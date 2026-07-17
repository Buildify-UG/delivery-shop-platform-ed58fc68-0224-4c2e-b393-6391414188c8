import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createOrder = async (orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  postal_code: string;
  total_amount: number;
}) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createOrderItems = async (
  orderItems: Array<{
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
  }>
) => {
  const { data, error } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();

  if (error) throw error;
  return data;
};

export const fetchOrderById = async (id: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const fetchOrderItems = async (orderId: string) => {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;
  return data;
};

export const fetchOrderTracking = async (orderId: string) => {
  const { data, error } = await supabase
    .from('order_tracking')
    .select('*')
    .eq('order_id', orderId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
};

export const createOrderTracking = async (
  orderId: string,
  status: string,
  statusMessage: string
) => {
  const { data, error } = await supabase
    .from('order_tracking')
    .insert([
      {
        order_id: orderId,
        status,
        status_message: statusMessage,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createOrderTracking = async (
  orderId: string,
  status: string,
  statusMessage: string
) => {
  const { data, error } = await supabase
    .from('order_tracking')
    .insert([
      {
        order_id: orderId,
        status,
        status_message: statusMessage,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
