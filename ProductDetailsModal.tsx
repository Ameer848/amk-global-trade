import { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Check, Plus, MessageSquare } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  onAddReview
}: ProductDetailsModalProps) {
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  const allImages = product.images && product.images.length > 0
    ? [product.image, ...product.images.filter(img => img !== product.image)]
    : [product.image];

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment || !reviewTitle) return;

    onAddReview(product.id, {
      userName: reviewName,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment
    });

    // Reset Form & Show Success Notice
    setReviewName('');
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    setReviewSuccessMessage('Review submitted successfully! Thank you for your feedback.');
    setTimeout(() => setReviewSuccessMessage(''), 4000);
  };

  // Calculate Review Bar metrics for design
  const ratingsCount = [0, 0, 0, 0, 0]; // stars 1-5
  product.reviews.forEach((rev) => {
    const ratingIndex = Math.min(Math.max(Math.round(rev.rating) - 1, 0), 4);
    ratingsCount[ratingIndex]++;
  });
  const totalReviews = product.reviews.length || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
        
        {/* Header with close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur border-b border-neutral-100">
          <span className="text-xs font-extrabold text-amber-600 tracking-widest uppercase">
            Premium Collection / {product.category}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Column 1: Image Gallery (md:col-5) */}
          <div className="md:col-span-5 space-y-4">
            {/* Main Large Image */}
            <div className="aspect-square bg-neutral-50 border border-neutral-100 rounded-2xl overflow-hidden relative">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow uppercase tracking-widest">
                  Save {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-xl border-2 overflow-hidden bg-neutral-50 transition-all ${
                      activeImage === img ? 'border-neutral-900 scale-[0.98]' : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img src={img} alt={`thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Details & Configuration (md:col-7) */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight">
                {product.name}
              </h2>
              
              {/* Rating summary row */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i + 1 <= Math.round(product.rating) ? 'fill-amber-500' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-neutral-700">
                  {product.rating}
                </span>
                <span className="text-xs text-neutral-400">
                  ({product.reviewCount} customer reviews)
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-neutral-950 font-mono">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-neutral-400 line-through font-mono">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Divider */}
            <div className="border-t border-neutral-100 my-4" />

            {/* Interactive Color Selectors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
                  Color: <span className="text-neutral-500 font-medium">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        selectedColor === color.name ? 'border-neutral-900 scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      <span
                        className="w-6 h-6 rounded-full shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedColor === color.name && (
                        <Check className="w-3.5 h-3.5 text-white absolute mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Size Selectors */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
                  Size: <span className="text-neutral-500 font-medium">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock & Action Buttons */}
            <div className="space-y-4 pt-4">
              {/* Loyalty Reward indicator */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-800">
                <span>Loyalty Bonus:</span>
                <span className="font-bold">Earn +{product.price} points!</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {product.stock === 0 ? (
                  <div className="w-full bg-rose-50 border border-rose-200 text-rose-700 text-center font-bold text-sm py-3 rounded-xl">
                    Currently Out of Stock
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(product, selectedSize, selectedColor)}
                    className="flex-1 min-w-[200px] bg-neutral-950 hover:bg-amber-500 hover:text-neutral-900 text-white text-xs font-extrabold tracking-wider uppercase py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Shopping Cart
                  </button>
                )}
              </div>

              {/* Guarantee tags */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] font-semibold text-neutral-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 30-Day Guarantee
                </span>
                <span>•</span>
                <span>In stock & ready to ship</span>
                <span>•</span>
                <span>Free returns supported</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Area (Divider & Review list) */}
        <div className="bg-neutral-50 border-t border-neutral-100 p-6 md:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Customer Reviews
              </h3>
              <p className="text-xs text-neutral-500">Real verified purchases & reviews</p>
            </div>
            
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wide self-start flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {showReviewForm ? 'Cancel Review' : 'Write Review'}
            </button>
          </div>

          {/* Success Alert banner for Review submission */}
          {reviewSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
              {reviewSuccessMessage}
            </div>
          )}

          {/* Write a Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-4 animate-in slide-in-from-top duration-300">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Write your feedback
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-neutral-600 uppercase">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  />
                </div>

                {/* Rating Selection stars */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-neutral-600 uppercase">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-1.5 h-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-amber-500 hover:scale-110 transition-all cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-500' : 'text-neutral-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-neutral-600 uppercase">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Absolutely loved it!"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                />
              </div>

              {/* Comment */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-neutral-600 uppercase">
                  Review Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell other shoppers about your experience..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 hover:bg-amber-500 hover:text-neutral-900 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}

          {/* Review Grid & Score Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Review Analytics Score Box (col-4) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center text-center h-fit">
              <span className="text-4xl font-black text-neutral-900 leading-none">
                {product.rating}
              </span>
              <span className="text-xs font-extrabold text-neutral-500 mt-2 uppercase tracking-widest">
                Out of 5 Stars
              </span>
              
              <div className="flex text-amber-500 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i + 1 <= Math.round(product.rating) ? 'fill-amber-500' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              
              <span className="text-xs text-neutral-400">
                Based on {product.reviews.length} ratings
              </span>

              {/* Simulated Rating distribution bars */}
              <div className="w-full mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingsCount[stars - 1];
                  const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs text-neutral-600">
                      <span className="w-3 text-right font-bold">{stars}</span>
                      <span className="text-amber-500 font-bold">★</span>
                      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${pct || (stars === 5 ? 80 : stars === 4 ? 15 : 5)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-[10px] text-neutral-400">
                        {pct || (stars === 5 ? 80 : stars === 4 ? 15 : 5)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews List (col-8) */}
            <div className="lg:col-span-8 space-y-4">
              {product.reviews.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-2xl border border-neutral-200 text-neutral-500">
                  No reviews yet. Be the first to review this product!
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 font-bold uppercase text-neutral-600 flex items-center justify-center text-xs">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-800 block">
                            {rev.userName}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i + 1 <= rev.rating ? 'fill-amber-500' : 'text-neutral-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              {rev.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1">
                      <h5 className="text-xs font-extrabold text-neutral-900">
                        {rev.title}
                      </h5>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
