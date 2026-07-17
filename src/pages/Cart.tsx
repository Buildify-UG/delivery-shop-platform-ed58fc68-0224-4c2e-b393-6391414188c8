import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal, getItemCount, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=800&fit=crop)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <Header cartItemCount={getItemCount()} />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-white mb-4 opacity-80" />
            <h1 className="text-3xl font-bold text-white mb-2">Your Cart is Empty</h1>
            <p className="text-gray-200 mb-8">Start adding items to your cart</p>
            <Link to="/catalog">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=800&fit=crop)',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <Header cartItemCount={getItemCount()} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <Link to="/catalog" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {cart.length} item{cart.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="divide-y divide-border">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.product.description}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex flex-col items-end gap-4">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 text-muted-foreground hover:text-foreground"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 text-muted-foreground hover:text-foreground"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax</span>
                  <span>${(getTotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    ${(getTotal() + 2.99 + getTotal() * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="block mb-3">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Cart;
