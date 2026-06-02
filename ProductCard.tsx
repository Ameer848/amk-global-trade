import { Heart, Eye, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  isInWishlist,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart
}: ProductCardProps) {
  // Calculate discount percentage if originalPrice is present
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100 flex items-center justify-center">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay Tags (Sale, New, etc.) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
              Save {discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-teal-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
              New
            </span>
          )}
          {product.tags && product.tags.map((tag) => {
            if (tag === 'Sale' || tag === 'New Release') return null; // Already covered
            let bgClass = 'bg-neutral-900/85 text-white';
            if (tag === 'Best Seller') bgClass = 'bg-amber-500 text-neutral-950';
            if (tag === 'Premium Choice') bgClass = 'bg-indigo-600 text-white';
            if (tag === 'Low Stock') bgClass = 'bg-rose-600 text-white';

            return (
              <span
                key={tag}
                className={`${bgClass} text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide`}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-md text-neutral-600 hover:text-rose-500 hover:scale-110 transition-all z-10 cursor-pointer"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isInWishlist ? 'fill-rose-500 text-rose-500' : 'text-neutral-600'
            }`}
          />
        </button>

        {/* Quick View Center Overlay Button */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-0">
          <button
            onClick={() => onSelectProduct(product)}
            className="px-4 py-2 bg-white/95 backdrop-blur-sm hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg scale-90 group-hover:scale-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 mb-1">
          {product.category}
        </span>

        {/* Title */}
        <h3
          onClick={() => onSelectProduct(product)}
          className="text-sm font-bold text-neutral-900 line-clamp-1 hover:text-amber-600 cursor-pointer transition-colors mb-1"
        >
          {product.name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => {
              const starVal = i + 1;
              return (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    starVal <= Math.round(product.rating) ? 'fill-amber-500' : 'text-neutral-300'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-xs font-bold text-neutral-500">
            {product.rating}
          </span>
          <span className="text-[10px] text-neutral-400 font-medium">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] text-neutral-400 line-through font-mono leading-none">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-base font-black text-neutral-950 font-mono leading-tight">
              ${product.price}
            </span>
          </div>

          {isOutOfStock ? (
            <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg uppercase border border-rose-200">
              Sold Out
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              disabled={isOutOfStock}
              className="p-2.5 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-900 text-white rounded-xl transition-all cursor-pointer"
              title="Quick Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Low Stock Warning Alert banner */}
        {isLowStock && (
          <div className="mt-2 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-center">
            Hurry, only {product.stock} left in stock!
          </div>
        )}
      </div>
    </div>
  );
}
