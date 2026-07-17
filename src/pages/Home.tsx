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
      <section 
        className="bg-cover bg-center text-white py-12 md:py-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1555939594-58d7cb561e1e?w=1200&h=600&fit=crop)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Reliable Package Delivery
              </h1>
              <p className="text-lg opacity-90 mb-6">
                Ship your packages with confidence. Fast, secure, and affordable delivery solutions for all your shipping needs.
              </p>
              <Link to="/catalog">
                <Button size="lg" variant="secondary">
                  Ship Now
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <div className="text-8xl">📦</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-semibold text-lg mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">Multiple shipping speeds to fit your timeline</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-lg mb-2">Secure Delivery</h3>
              <p className="text-muted-foreground">Real-time tracking and insurance protection</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-semibold text-lg mb-2">Affordable Rates</h3>
              <p className="text-muted-foreground">Competitive pricing for all package sizes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Popular Shipping Services</h2>
              <p className="text-muted-foreground">Choose the right shipping option for your needs</p>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Ship?</h2>
          <p className="mb-6 text-lg opacity-90">Explore all our shipping options and send your package today</p>
          <Link to="/catalog">
            <Button size="lg" variant="secondary">
              Browse Services
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
                QuickShip is your trusted platform for reliable package delivery with real-time tracking and competitive rates.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link to="/catalog" className="text-muted-foreground hover:text-foreground">Services</Link></li>
                <li><Link to="/cart" className="text-muted-foreground hover:text-foreground">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Email: support@quickship.com<br />
                Phone: 1-800-QUICKSHIP
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 QuickShip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
