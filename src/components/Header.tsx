import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  cartItemCount: number;
}

export const Header = ({ cartItemCount }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
              <span className="text-primary font-bold">📦</span>
            </div>
            <span>QuickShip</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              Home
            </Link>
            <Link to="/catalog" className="hover:opacity-80 transition-opacity">
              Menu
            </Link>
            <Link to="/tracking" className="hover:opacity-80 transition-opacity">
              Track Order
            </Link>
          </nav>

          {/* Cart Button */}
          <div className="flex items-center gap-4">
            <Link to="/cart">
              <Button
                variant="secondary"
                size="sm"
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-primary-foreground/20 pt-4">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              Home
            </Link>
            <Link to="/catalog" className="hover:opacity-80 transition-opacity">
              Menu
            </Link>
            <Link to="/tracking" className="hover:opacity-80 transition-opacity">
              Track Order
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
