import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { createOrder, createOrderItems, createOrderTracking } from '@/lib/supabase';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().min(10, 'Phone must be at least 10 characters'),
  delivery_address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postal_code: z.string().min(3, 'Postal code must be at least 3 characters'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart, getItemCount } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={getItemCount()} />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => navigate('/catalog')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);

      // Create order
      const order = await createOrder({
        ...data,
        total_amount: total,
      });

      // Create order items
      await createOrderItems(
        cart.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        }))
      );

      // Create initial tracking entry
      await createOrderTracking(
        order.id,
        'confirmed',
        'Your order has been confirmed and is being prepared.'
      );

      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={getItemCount()} />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. Your food will be delivered soon.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-muted-foreground mb-2">Order ID</p>
              <p className="font-mono text-sm text-foreground break-all">{orderId}</p>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              You can track your order using the order ID above.
            </p>

            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to={`/tracking?id=${orderId}`}>
                  Track Order
                </Link>
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Back to Home
              </Button>
              <Button onClick={() => navigate('/catalog')} variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={getItemCount()} />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h1 className="text-2xl font-bold text-foreground mb-6">Delivery Information</h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Personal Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Full Name *
                      </label>
                      <Input
                        {...register('customer_name')}
                        placeholder="John Doe"
                        className={errors.customer_name ? 'border-destructive' : ''}
                      />
                      {errors.customer_name && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.customer_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Email *
                      </label>
                      <Input
                        {...register('customer_email')}
                        type="email"
                        placeholder="john@example.com"
                        className={errors.customer_email ? 'border-destructive' : ''}
                      />
                      {errors.customer_email && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.customer_email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Phone Number *
                      </label>
                      <Input
                        {...register('customer_phone')}
                        placeholder="+1 (555) 000-0000"
                        className={errors.customer_phone ? 'border-destructive' : ''}
                      />
                      {errors.customer_phone && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.customer_phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Delivery Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Street Address *
                      </label>
                      <Input
                        {...register('delivery_address')}
                        placeholder="123 Main Street, Apt 4B"
                        className={errors.delivery_address ? 'border-destructive' : ''}
                      />
                      {errors.delivery_address && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.delivery_address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          City *
                        </label>
                        <Input
                          {...register('city')}
                          placeholder="New York"
                          className={errors.city ? 'border-destructive' : ''}
                        />
                        {errors.city && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Postal Code *
                        </label>
                        <Input
                          {...register('postal_code')}
                          placeholder="10001"
                          className={errors.postal_code ? 'border-destructive' : ''}
                        />
                        {errors.postal_code && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.postal_code.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
