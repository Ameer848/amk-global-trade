import { useState } from 'react';
import { X, CreditCard, CheckCircle, MapPin, Shield, ArrowRight, ArrowLeft, Truck } from 'lucide-react';
import { CartItem, PromoCode, Order, UserProfile } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedPromo: PromoCode | null;
  userProfile: UserProfile;
  onOrderSuccess: (order: Order) => void;
  onAddPoints: (points: number) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  appliedPromo,
  userProfile,
  onOrderSuccess,
  onAddPoints
}: CheckoutModalProps) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Success

  // Form Shipping States
  const [fullName, setFullName] = useState(userProfile.address.fullName);
  const [addressLine, setAddressLine] = useState(userProfile.address.addressLine);
  const [city, setCity] = useState(userProfile.address.city);
  const [state, setState] = useState(userProfile.address.state);
  const [zipCode, setZipCode] = useState(userProfile.address.zipCode);
  const [phone, setPhone] = useState(userProfile.address.phone);

  // Form Payment States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardFocused, setCardFocused] = useState(false); // true when focused on CVC to flip card

  // Final Generated Order State
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedPromo ? Math.round(subtotal * (appliedPromo.discountPercent / 100)) : 0;
  const isFreeShipping = subtotal >= 150;
  const shippingCost = subtotal > 0 ? (isFreeShipping ? 0 : 15) : 0;
  const taxCost = Math.round((subtotal - discount) * 0.07);
  const grandTotal = subtotal - discount + shippingCost + taxCost;

  const handleUseProfileAddress = () => {
    setFullName(userProfile.address.fullName);
    setAddressLine(userProfile.address.addressLine);
    setCity(userProfile.address.city);
    setState(userProfile.address.state);
    setZipCode(userProfile.address.zipCode);
    setPhone(userProfile.address.phone);
  };

  // Format card number: 1234 5678 1234 5678
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s?/g, '');
    if (isNaN(Number(raw)) || raw.length > 16) return;
    let formatted = '';
    for (let i = 0; i < raw.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += raw[i];
    }
    setCardNumber(formatted);
  };

  // Format Expiry: MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\//g, '');
    if (isNaN(Number(raw)) || raw.length > 4) return;
    let formatted = '';
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    } else {
      formatted = raw;
    }
    setExpiry(formatted);
  };

  // Detect Card Network
  const getCardType = () => {
    const firstChar = cardNumber.charAt(0);
    if (firstChar === '4') return 'VISA';
    if (firstChar === '5') return 'MASTERCARD';
    if (firstChar === '3') return 'AMEX';
    return 'CREDIT CARD';
  };

  const getCardBg = () => {
    const type = getCardType();
    if (type === 'VISA') return 'from-neutral-900 to-indigo-950';
    if (type === 'MASTERCARD') return 'from-zinc-900 to-red-950';
    if (type === 'AMEX') return 'from-neutral-900 to-amber-950';
    return 'from-neutral-900 via-neutral-800 to-stone-900';
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && addressLine && city && state && zipCode && phone) {
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length >= 16 && cardName && expiry.length >= 5 && cvc.length >= 3) {
      setStep(3);
    }
  };

  const handlePlaceOrder = () => {
    const trackingNum = 'TRK-' + Math.floor(10000000 + Math.random() * 90000000);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: [...cartItems],
      subtotal,
      discount,
      shipping: shippingCost,
      tax: taxCost,
      total: grandTotal,
      status: 'Pending',
      shippingAddress: {
        fullName,
        addressLine,
        city,
        state,
        zipCode,
        phone
      },
      paymentMethod: {
        cardLast4: last4,
        cardType: getCardType()
      },
      trackingNumber: trackingNum
    };

    setPlacedOrder(newOrder);
    onOrderSuccess(newOrder);
    // Add points: 1 point per dollar
    onAddPoints(grandTotal);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-neutral-950/85 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-100">
          <div>
            <h2 className="text-base font-black text-neutral-950 uppercase tracking-wider">
              Checkout Process
            </h2>
            {step < 4 && (
              <span className="text-xs font-semibold text-neutral-400">
                Step {step} of 3: {step === 1 ? 'Shipping Details' : step === 2 ? 'Payment Info' : 'Final Review'}
              </span>
            )}
          </div>
          {step < 4 && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step tracker dots */}
        {step < 4 && (
          <div className="bg-neutral-50 border-b border-neutral-100 px-6 py-3 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? 'bg-neutral-950 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>1</span>
              <span className={`text-xs font-bold ${step >= 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>Shipping</span>
            </div>
            <div className="h-px w-10 bg-neutral-200" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-neutral-950 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>2</span>
              <span className={`text-xs font-bold ${step >= 2 ? 'text-neutral-900' : 'text-neutral-400'}`}>Payment</span>
            </div>
            <div className="h-px w-10 bg-neutral-200" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 3 ? 'bg-neutral-950 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>3</span>
              <span className={`text-xs font-bold ${step >= 3 ? 'text-neutral-900' : 'text-neutral-400'}`}>Review</span>
            </div>
          </div>
        )}

        {/* Main Content Form Area */}
        <div className="overflow-y-auto p-6 flex-1">
          
          {/* STEP 1: SHIPPING DETAILS FORM */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  Shipping Destination Address
                </h3>
                <button
                  type="button"
                  onClick={handleUseProfileAddress}
                  className="text-[11px] text-amber-600 hover:text-amber-700 font-bold hover:underline cursor-pointer"
                >
                  Autofill Profile Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                    placeholder="Jane Doe"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                    placeholder="123 Luxury Drive"
                  />
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                    placeholder="Beverly Hills"
                  />
                </div>

                {/* State, Zip, Phone */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-neutral-600 uppercase">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                      placeholder="CA"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-neutral-600 uppercase">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                      placeholder="90210"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                    placeholder="(555) 019-2834"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-4 border-t border-neutral-100">
                <button
                  type="submit"
                  className="px-6 py-3 bg-neutral-950 hover:bg-amber-500 hover:text-neutral-900 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT INFO FORM & VIRTUAL CARD MOCKUP */}
          {step === 2 && (
            <div className="space-y-8">
              {/* Interactive Virtual Credit Card */}
              <div className="flex justify-center">
                <div className="perspective w-full max-w-sm h-48 rounded-2xl relative transition-transform duration-500 preserve-3d">
                  {/* Card Front */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCardBg()} text-white p-6 rounded-2xl flex flex-col justify-between shadow-xl border border-white/10 transition-all duration-500 backface-hidden ${
                    cardFocused ? 'rotate-y-180 opacity-0' : 'opacity-100'
                  }`}>
                    <div className="flex justify-between items-start">
                      <CreditCard className="w-8 h-8 text-white/70" />
                      <span className="text-xs font-black tracking-widest font-mono text-amber-400">
                        {getCardType()}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {/* Card Number */}
                      <span className="block text-base sm:text-lg font-mono tracking-widest text-center">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </span>
                      {/* Holder Name & Expiry */}
                      <div className="flex justify-between text-[10px] font-mono uppercase text-white/70">
                        <div>
                          <span className="block text-[8px] text-white/40">Card Holder</span>
                          <span className="truncate block max-w-[180px] font-bold">
                            {cardName || 'Jane Doe'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-white/40">Expires</span>
                          <span className="font-bold">{expiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCardBg()} text-white p-6 rounded-2xl flex flex-col justify-between shadow-xl border border-white/10 transition-all duration-500 backface-hidden rotate-y-180 ${
                    cardFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}>
                    <div className="w-full h-8 bg-black -mx-6 mt-1" />
                    <div className="space-y-3">
                      <div className="flex justify-end">
                        <div className="bg-white/20 text-right px-3 py-1 text-xs font-mono rounded w-16">
                          {cvc || '•••'}
                        </div>
                      </div>
                      <p className="text-[7px] text-white/30 leading-tight">
                        This simulated transaction is fully secured. Authorized digital signature required. Loyalty rewards automatically credited.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4 max-w-md mx-auto">
                {/* Cardholder Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
                    placeholder="Jane Doe"
                    onFocus={() => setCardFocused(false)}
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 font-mono"
                    placeholder="4242 4242 4242 4242"
                    onFocus={() => setCardFocused(false)}
                  />
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-neutral-600 uppercase">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 font-mono"
                      placeholder="MM/YY"
                      onFocus={() => setCardFocused(false)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-neutral-600 uppercase">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 font-mono"
                      placeholder="•••"
                      onFocus={() => setCardFocused(true)}
                      onBlur={() => setCardFocused(false)}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold uppercase rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-neutral-950 hover:bg-amber-500 hover:text-neutral-900 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    Review Order
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: FINAL REVIEW */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                Please review your details before placing order
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Review */}
                <div className="border border-neutral-200 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> Shipping Address
                  </h4>
                  <div className="text-xs text-neutral-600 space-y-0.5">
                    <p className="font-bold text-neutral-800">{fullName}</p>
                    <p>{addressLine}</p>
                    <p>{city}, {state} {zipCode}</p>
                    <p>Phone: {phone}</p>
                  </div>
                </div>

                {/* Payment Review */}
                <div className="border border-neutral-200 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wide flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-amber-500" /> Payment Method
                  </h4>
                  <div className="text-xs text-neutral-600 space-y-0.5">
                    <p className="font-bold text-neutral-800 uppercase">
                      {getCardType()}
                    </p>
                    <p>Ending in: •••• {cardNumber.replace(/\s/g, '').slice(-4) || '4242'}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">
                      Security Verified & Insured
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Review */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 text-[10px] font-black uppercase text-neutral-600">
                  Item List
                </div>
                <div className="divide-y divide-neutral-100 px-4 py-2">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-neutral-900 truncate max-w-[200px]">
                            {item.product.name}
                          </h5>
                          <div className="flex gap-2 text-[9px] text-neutral-400">
                            <span>Qty: {item.quantity}</span>
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-neutral-900 font-mono">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl space-y-2 text-xs">
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
                  <span className="font-mono">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Sales Tax (7%)</span>
                  <span className="font-mono">${taxCost}</span>
                </div>
                <div className="border-t border-neutral-200 my-2" />
                <div className="flex justify-between text-neutral-950 text-sm font-black">
                  <span>Grand Total</span>
                  <span className="font-mono text-base">${grandTotal}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold uppercase rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Payment
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  Place Order
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS CONFIRMATION */}
          {step === 4 && placedOrder && (
            <div className="space-y-8 py-4 text-center">
              
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-2 border-emerald-100 animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                  Purchase Placed Successfully!
                </h3>
                <p className="text-xs text-neutral-500">
                  Order ID: <strong className="font-mono text-neutral-800 font-extrabold">{placedOrder.id}</strong>
                </p>
                <p className="text-xs text-emerald-600 font-bold">
                  Loyalty Account Credited: +{grandTotal} points earned!
                </p>
              </div>

              {/* Package Tracker */}
              <div className="border border-neutral-200 p-5 rounded-2xl text-left space-y-5">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-500" />
                  Live Logistics Package Tracker
                </h4>

                {/* Timeline Tracker steps */}
                <div className="relative flex justify-between items-center max-w-md mx-auto">
                  {/* line background */}
                  <div className="absolute left-0 right-0 top-3 h-1 bg-neutral-200 z-0" />
                  <div className="absolute left-0 right-1/2 top-3 h-1 bg-amber-500 z-0" />

                  {/* step 1 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-neutral-900 flex items-center justify-center text-[10px] font-extrabold border border-white">
                      ✓
                    </div>
                    <span className="text-[10px] font-extrabold text-neutral-900">Ordered</span>
                  </div>

                  {/* step 2 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-neutral-900 flex items-center justify-center text-[10px] font-extrabold border border-white animate-pulse">
                      2
                    </div>
                    <span className="text-[10px] font-extrabold text-neutral-900">Processing</span>
                  </div>

                  {/* step 3 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-[10px] font-bold border border-white">
                      3
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400">Shipped</span>
                  </div>

                  {/* step 4 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-[10px] font-bold border border-white">
                      4
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400">Delivered</span>
                  </div>
                </div>

                <div className="pt-3 text-center border-t border-neutral-100 text-xs text-neutral-600 space-y-1 bg-neutral-50 p-3 rounded-xl">
                  <p>Tracking Code: <strong className="font-mono text-neutral-800 font-extrabold">{placedOrder.trackingNumber}</strong></p>
                  <p className="text-[10px] text-neutral-400">
                    Your order status is currently <strong className="text-amber-600 uppercase">{placedOrder.status}</strong>. Our sorting warehouse is preparing the package.
                  </p>
                </div>
              </div>

              {/* Security seal */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold">
                <Shield className="w-3.5 h-3.5 text-neutral-300" />
                Authorized Demo Transaction - No money will be charged.
              </div>

              {/* Actions */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
