import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // Generate a tracking number
    const trackingNumber = `TRK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate estimated delivery (30-45 minutes from now)
    const estimatedDelivery = new Date(Date.now() + 30 * 60 * 1000);

    // Update order with tracking info
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        estimated_delivery: estimatedDelivery.toISOString(),
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    // Create initial tracking entry
    const { error: trackingError } = await supabaseClient
      .from('order_tracking')
      .insert([
        {
          order_id: orderId,
          status: 'confirmed',
          status_message: 'Your order has been confirmed and is being prepared.',
        },
      ]);

    if (trackingError) throw trackingError;

    return new Response(
      JSON.stringify({
        success: true,
        trackingNumber,
        estimatedDelivery,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
