import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, RotateCcw } from 'lucide-react';

interface HeroProps {
  onExploreProduct: (productId: string) => void;
  onFilterCategory: (category: string) => void;
}

export default function Hero({ onExploreProduct, onFilterCategory }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: 'AUDIO REDEFINED',
      title: 'The AeroSound Max Luxury Series',
      subtitle: 'Active Noise Cancelling. Hi-Res Sound. Plush Comfort.',
      description: 'Dive deep into sound with hybrid noise isolation, customized sound stages, and premium Italian leather ear-cups.',
      price: 'Only $249',
      originalPrice: '$299',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      cta: 'Shop AeroSound',
      productId: 'prod-1',
      category: 'Electronics',
      bgColor: 'from-neutral-900 via-zinc-900 to-neutral-900'
    },
    {
      badge: 'STREETWEAR 2026',
      title: 'Apex Knit Performance Sneakers',
      subtitle: 'Engineered Breathability. Cloud Cushioned Soles.',
      description: 'A seamless fusion of street-smart aesthetics and professional-grade running tech. Durable, flexible, and ultra-light.',
      price: 'Special Offer $120',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      cta: 'Explore Performance',
      productId: 'prod-2',
      category: 'Apparel',
      bgColor: 'from-zinc-950 via-neutral-900 to-stone-900'
    },
    {
      badge: 'ORGANIC MORNINGS',
      title: 'TerraCotta Ceramic Stoneware French Press',
      subtitle: 'Matte Exterior. Sediment-Free Triple Mesh Filter.',
      description: 'A gorgeous earthy aesthetic combined with ultra heat retention to keep your morning coffee hot and rich.',
      price: 'Get it for $48',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80',
      cta: 'Browse Home Decor',
      productId: 'prod-6',
      category: 'Home & Living',
      bgColor: 'from-amber-950 via-neutral-900 to-zinc-900'
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Main Slide Content Container */}
      <div className="relative h-[480px] sm:h-[520px] md:h-[580px] w-full flex items-center transition-all duration-700 ease-in-out">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full flex items-center transition-opacity duration-700 ease-in-out bg-gradient-to-r ${slide.bgColor} ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-35 mix-blend-overlay object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
              </div>

              {/* Grid Content */}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-20">
                <div className="max-w-lg space-y-4 md:space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest text-amber-400 uppercase">
                    <Sparkles className="w-3 h-3" />
                    {slide.badge}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg font-medium text-neutral-200">
                    {slide.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {slide.description}
                  </p>

                  {/* Price & CTA */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div>
                      <span className="text-2xl font-bold text-amber-400 font-mono">
                        {slide.price}
                      </span>
                      {slide.originalPrice && (
                        <span className="text-sm text-neutral-500 line-through ml-2 font-mono">
                          {slide.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onExploreProduct(slide.productId)}
                        className="px-5 py-2.5 bg-white text-neutral-950 font-extrabold text-xs tracking-wider uppercase rounded-lg hover:bg-amber-400 hover:text-neutral-950 shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{slide.cta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onFilterCategory(slide.category)}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs tracking-wider uppercase rounded-lg transition-all cursor-pointer"
                      >
                        Category
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Navigation Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentSlide ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Curated Trust Indicators Footbar */}
      <div className="border-t border-neutral-800 bg-neutral-950 py-4 text-neutral-400 text-xs font-semibold hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>100% Secure Checkout & Authenticity Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>30-Day Money Back Guarantee & Hassle-Free Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Accumulate Loyalty Points with Every Purchase</span>
          </div>
        </div>
      </div>
    </section>
  );
}
