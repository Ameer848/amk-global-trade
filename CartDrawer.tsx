import { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Gift, ArrowRight } from 'lucide-react';
import { CartItem, PromoCode } from '../types';
import { promoCodes } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  onRemoveItem: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  appliedPromo: PromoCode | null;
  onApplyPromo: (promo: PromoCode | null) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  onApplyPromo,
  onCheckout
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping threshold: $150
  const shippingThreshold = 150;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingLeft = shippingThreshold - subtotal;
  const shippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);

  // Discount calculation
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.minPurchase && subtotal < appliedPromo.minPurchase) {
      // Automatically deactivate if subtotal fell below minPurchase
      onApplyPromo(null);
    } else {
      discount = Math.round(subtotal * (appliedPromo.discountPercent / 100));
    }
  }

  // Costs
  const shippingCost = subtotal > 0 ? (isFreeShipping ? 0 : 15) : 0;
  const taxCost = Math.round((subtotal - discount) * 0.07);
  const grandTotal = subtotal - discount + shippingCost + taxCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = promoInput.trim().toUpperCase();
    
    if (!trimmed) return;

    const found = promoCodes.find((p) => p.code === trimmed);
    if (!found) {
      setPromoError('Invalid promo code. Try WELCOME10 or FLASH20.');
      setPromoSuccess('');
      return;
    }

    if (found.minPurchase && subtotal < found.minPurchase) {
      setPromoError(`This code requires a minimum purchase of $${found.minPurchase}.`);
      setPromoSuccess('');
      return;
    }

    onApplyPromo(found);
    setPromoSuccess(`Promo "${found.code}" (${found.discountPercent}% off) applied!`);
    setPromoError('');
    setPromoInput('');
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
    setPromoSuccess('');
    setPromoError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/80 backdrop-blur-sm">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer container */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-950" />
            <h2 className="text-lg font-black text-neutral-900">Shopping Cart</h2>
            <span className="bg-neutral-100 text-neutral-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Free Shipping Progress Bar */}
          {subtotal > 0 && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-neutral-700">
                  <Gift className="w-4 h-4 text-amber-500" />
                  {isFreeShipping ? 'Free Shipping Unlocked!' : 'Free Shipping Goal'}
                </span>
                <span className="text-neutral-900">
                  {isFreeShipping ? '$0' : `$${shippingLeft.toFixed(0)} away`}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isFreeShipping ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-400">
                {isFreeShipping
                  ? 'Your order qualifies for complimentary premium courier delivery.'
                  : 'Add more premium items to unlock free shipping and save $15.'}
              </p>
            </div>
          )}

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100">
                <ShoppingBag className="w-8 h-8 text-neutral-300" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-800">Your Cart is Empty</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Explore our collections to discover premium products.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-900 text-white text-xs font-extrabold uppercase rounded-xl transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}-${idx}`}
                  className="flex gap-4 p-3 border border-neutral-200 rounded-2xl hover:bg-neutral-50/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-neutral-900 truncate hover:text-amber-600">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-medium mt-0.5 uppercase">
                        {item.product.category}
                      </p>
                      {/* Options details */}
                      {(item.selectedSize || item.selectedColor) && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.selectedColor && (
                            <span className="text-[9px] bg-neutral-100 text-neutral-600 font-semibold px-2 py-0.5 rounded">
                              Color: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[9px] bg-neutral-100 text-neutral-600 font-semibold px-2 py-0.5 rounded">
                              Size: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price & Quantity selector */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-neutral-950 font-mono">
                        ${item.product.price}
                      </span>

                      <div className="flex items-center gap-3">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-white">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            className="p-1 text-neutral-500 hover:text-neutral-950 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            className="p-1 text-neutral-500 hover:text-neutral-950 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() =>
                            onRemoveItem(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Pricing Summary) */}
        {cartItems.length > 0 && (
          <div className="border-t border-neutral-100 p-6 bg-neutral-50 space-y-4">
            {/* Promo Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo: e.g. FLASH20"
                className="flex-1 px-3 py-1.5 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950 font-mono uppercase"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Promo messages */}
            {promoError && (
              <p className="text-[10px] text-rose-600 font-bold">{promoError}</p>
            )}
            {promoSuccess && (
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl p-2 text-[10px] font-bold">
                <span>{promoSuccess}</span>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-emerald-600 hover:text-emerald-900 underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Cost breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span className="font-mono">-${discount}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-mono">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Sales Tax (7%)</span>
                <span className="font-mono">${taxCost}</span>
              </div>
              <div className="border-t border-neutral-200 my-2" />
              <div className="flex justify-between text-neutral-950 text-sm font-black">
                <span>Total Amount</span>
                <span className="font-mono text-base">${grandTotal}</span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={onCheckout}
              className="w-full bg-neutral-950 hover:bg-amber-500 hover:text-neutral-900 text-white text-xs font-extrabold tracking-wider uppercase py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
