import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/supabase';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { Header } from '@/components/Header';
import { Loader2, Star, Zap } from 'lucide-react';

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { addToCart, getItemCount } = useCart();

  const featuredProducts = (products as Product[]).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={getItemCount()} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Delicious Food, Fast Delivery
              </h1>
              <p className="text-lg opacity-90 mb-6">
                Order your favorite meals and get them delivered hot and fresh to your door in 30 minutes or less.
              </p>
              <Link to="/catalog">
                <Button size="lg" variant="secondary">
                  Order Now
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <div className="text-8xl">🍕</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Get your food delivered within 30 minutes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍🍳</div>
              <h3 className="font-semibold text-lg mb-2">Fresh Quality</h3>
              <p className="text-muted-foreground">Prepared by expert chefs with premium ingredients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-semibold text-lg mb-2">Great Prices</h3>
              <p className="text-muted-foreground">Best deals and discounts on all items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Menu</h2>
              <p className="text-muted-foreground">Check out our popular items</p>
            </div>
            <Link to="/catalog">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="mb-6 text-lg opacity-90">Browse our full menu and place your order today</p>
          <Link to="/catalog">
            <Button size="lg" variant="secondary">
              Browse Menu
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-foreground">About Us</h4>
              <p className="text-sm text-muted-foreground">
                FoodHub is your go-to platform for fast, reliable food delivery with quality guaranteed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link to="/catalog" className="text-muted-foreground hover:text-foreground">Menu</Link></li>
                <li><Link to="/cart" className="text-muted-foreground hover:text-foreground">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Email: info@foodhub.com<br />
                Phone: 1-800-FOOD-HUB
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 FoodHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
