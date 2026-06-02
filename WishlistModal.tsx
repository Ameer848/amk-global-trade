import { X, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistModal({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart
}: WishlistModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-100">
          <h2 className="text-base font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> My Wishlist
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100">
                <Heart className="w-8 h-8 text-rose-300" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-800">Wishlist is Empty</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Browse products and tap the heart icon to save favorites.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-900 text-white text-xs font-extrabold uppercase rounded-xl transition-all"
              >
                Explore Shop Catalog
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {wishlistItems.map((product) => (
                <div key={product.id} className="py-3.5 flex items-center justify-between gap-4">
                  {/* Info with image */}
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-neutral-900 truncate max-w-[180px] sm:max-w-[240px]">
                        {product.name}
                      </h4>
                      <span className="text-[9px] bg-neutral-100 text-neutral-600 font-bold px-2 py-0.5 rounded mt-1 inline-block uppercase">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & actions */}
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-extrabold text-neutral-950 font-mono">
                      ${product.price}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveFromWishlist(product.id);
                        }}
                        disabled={product.stock === 0}
                        className="p-2 bg-neutral-950 hover:bg-amber-500 hover:text-neutral-900 text-white disabled:bg-neutral-100 disabled:text-neutral-300 rounded-xl transition-all cursor-pointer"
                        title="Add to Cart & remove from wishlist"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
