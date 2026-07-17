import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative h-48 bg-muted overflow-hidden group">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 bg-background/80 hover:bg-background rounded-full p-2 transition-colors">
          <Heart className="w-5 h-5 text-destructive" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">{product.category}</p>
          <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating) ? '★' : '☆'}>
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.rating})</span>
        </div>

        {/* Price and Actions */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center border border-border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2 py-1 text-muted-foreground hover:text-foreground"
              >
                −
              </button>
              <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2 py-1 text-muted-foreground hover:text-foreground"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="flex-1"
              variant={isAdded ? 'default' : 'outline'}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAdded ? 'Added!' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
