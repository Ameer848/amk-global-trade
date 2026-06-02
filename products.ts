import { Product, PromoCode } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'AeroSound Max ANC Headphones',
    price: 249,
    originalPrice: 299,
    description: 'Immerse yourself in pure acoustic luxury. Featuring hybrid active noise cancellation, 45-hour battery life, hi-res audio certification, and plush memory-foam cups designed for all-day listening comfort.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 124,
    reviews: [
      {
        id: 'rev-1-1',
        userName: 'Marcus Sterling',
        rating: 5,
        title: 'Studio quality sound!',
        comment: 'The ANC is absolutely outstanding. It blocks out aircraft engine noise completely, and the sub-bass has a wonderful, warm rumble without muddiness. Highly recommend.',
        date: '2026-01-15'
      },
      {
        id: 'rev-1-2',
        userName: 'Aisha Patel',
        rating: 4,
        title: 'Super comfortable, minor app bugs',
        comment: 'The physical headphones are 10/10 for comfort. The companion app took two tries to connect to my Android phone, but once paired, it worked perfectly.',
        date: '2026-01-10'
      }
    ],
    stock: 18,
    colors: [
      { name: 'Carbon Black', hex: '#1A1A1A' },
      { name: 'Platinum Silver', hex: '#E3E4E5' },
      { name: 'Midnight Navy', hex: '#1E293B' }
    ],
    tags: ['Best Seller', 'Sale', 'Free Shipping'],
    isFeatured: true,
    isNew: false
  },
  {
    id: 'prod-2',
    name: 'Apex Knit Performance Sneakers',
    price: 120,
    originalPrice: 150,
    description: 'Engineered with our proprietary AeroKnit mesh for ultimate breathability and responsive cloud-bounce cushioning. Designed for runners seeking endurance and street-ready styling alike.',
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 85,
    reviews: [
      {
        id: 'rev-2-1',
        userName: 'Daniel K.',
        rating: 5,
        title: 'Feels like walking on air',
        comment: 'I use these for my 5K runs and standard daily wear. The knit holds its shape perfectly and breathes exceptionally well. Will definitely buy another color.',
        date: '2025-12-12'
      }
    ],
    stock: 25,
    sizes: ['8', '9', '10', '11', '12'],
    colors: [
      { name: 'Crimson Red', hex: '#DC2626' },
      { name: 'Stealth Gray', hex: '#4B5563' },
      { name: 'Volt Yellow', hex: '#A3E635' }
    ],
    tags: ['Popular', 'New Release'],
    isFeatured: true,
    isNew: true
  },
  {
    id: 'prod-3',
    name: 'VoltCharge 3-in-1 Wireless Dock',
    price: 59,
    description: 'Declutter your nightstand with the ultimate power hub. Simultaneously charges your Qi-enabled smartphone, smartwatch, and wireless earbuds at blazing fast speeds up to 15W, wrapped in a sleek aluminum housing.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.5,
    reviewCount: 43,
    reviews: [
      {
        id: 'rev-3-1',
        userName: 'Sarah Jenkins',
        rating: 4,
        title: 'Sleek design, works perfectly',
        comment: 'Charges my iPhone 15, Apple Watch, and AirPods Pro with just one cord plugged into the wall. Safe, neat, and very high build quality.',
        date: '2026-01-02'
      }
    ],
    stock: 4,
    tags: ['Low Stock', 'Hot Item'],
    isFeatured: true,
    isNew: false
  },
  {
    id: 'prod-4',
    name: 'ChronoLux Mechanical Watch',
    price: 380,
    originalPrice: 450,
    description: 'A tribute to horological craftsmanship. The ChronoLux features an open skeleton dial showcasing the intricate 21-jewel automatic movement. Styled with a premium hand-stitched Italian leather band and scratch-resistant sapphire crystal.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 62,
    reviews: [
      {
        id: 'rev-4-1',
        userName: 'Thomas H.',
        rating: 5,
        title: 'An absolute masterpiece',
        comment: 'I get compliments every single day I wear this watch. Watching the tiny gearwheels turn is mesmerising. The leather band is thick and smells wonderful.',
        date: '2026-01-08'
      }
    ],
    stock: 7,
    colors: [
      { name: 'Cognac Gold', hex: '#D97706' },
      { name: 'Silver Onyx', hex: '#374151' }
    ],
    tags: ['Premium Choice'],
    isFeatured: true,
    isNew: false
  },
  {
    id: 'prod-5',
    name: 'Minimalist Top-Grain Leather Sleeve',
    price: 75,
    originalPrice: 89,
    description: 'Crafted with raw, vegetable-tanned leather and soft merino wool felt lining. Gently grips your laptop, safeguarding it from scratches and impacts while sliding elegantly into any bag.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1555538995-7ccc762523e9?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555538995-7ccc762523e9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.6,
    reviewCount: 29,
    reviews: [
      {
        id: 'rev-5-1',
        userName: 'Lucas V.',
        rating: 5,
        title: 'Gorgeous patina after 2 months',
        comment: 'The leather ages beautifully. It scratches naturally and develops a gorgeous darker tone over time. Fits my 14-inch MacBook like a glove.',
        date: '2025-11-25'
      }
    ],
    stock: 15,
    colors: [
      { name: 'Tan', hex: '#92400E' },
      { name: 'Midnight Black', hex: '#0F172A' }
    ],
    tags: ['Classic Design'],
    isFeatured: false,
    isNew: false
  },
  {
    id: 'prod-6',
    name: 'TerraCotta Stoneware French Press',
    price: 48,
    description: 'Bring organic textures to your morning brew. Our matte ceramic French press retains heat significantly longer than glass models. Features a high-density stainless steel double mesh filter for smooth, sediment-free coffee.',
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.4,
    reviewCount: 51,
    reviews: [
      {
        id: 'rev-6-1',
        userName: 'Emma Stone',
        rating: 4,
        title: 'Looks stunning on the counter',
        comment: 'Makes wonderful full-bodied coffee. It retains heat really well so my second cup is still warm. A bit heavy, but that is to be expected with quality stoneware.',
        date: '2025-12-29'
      }
    ],
    stock: 12,
    colors: [
      { name: 'Terracotta Clay', hex: '#C2410C' },
      { name: 'Warm Sand', hex: '#F5F5F4' },
      { name: 'Sage Green', hex: '#15803D' }
    ],
    tags: ['Eco-Friendly', 'Best Seller'],
    isFeatured: false,
    isNew: false
  },
  {
    id: 'prod-7',
    name: 'Urban Commute Waterproof Parka',
    price: 165,
    originalPrice: 199,
    description: 'A sleek, technical shield for unpredictable seasons. Completely windproof, seam-sealed waterproof, yet incredibly breathable. Fitted with magnetic pocket flaps, reflective trim, and a fleece-lined collar.',
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 38,
    reviews: [
      {
        id: 'rev-7-1',
        userName: 'Kevin S.',
        rating: 5,
        title: 'Perfect wind and rain protection',
        comment: 'It keeps me dry on my bike commute in pouring Seattle weather. The magnetic pockets are super handy when your hands are freezing and wearing gloves.',
        date: '2026-01-11'
      }
    ],
    stock: 9,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Forest Green', hex: '#065F46' },
      { name: 'Desert Sand', hex: '#D97706' },
      { name: 'Obsidian Black', hex: '#1E293B' }
    ],
    tags: ['Adventure', 'Sale'],
    isFeatured: false,
    isNew: true
  },
  {
    id: 'prod-8',
    name: 'Lumina Smart Ambient Cylinder',
    price: 89,
    description: 'Create your dream environment with millions of colors. Controllable via touch gestures, smart devices, or music syncing. Includes sunrise alarm fade, concentration-boosting daylight modes, and soothing wind-down cycles.',
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 74,
    reviews: [
      {
        id: 'rev-8-1',
        userName: 'Chloe Baker',
        rating: 5,
        title: 'Waking up is so much gentler!',
        comment: 'The sunrise simulation mimics real dawn colors. I wake up before my audio alarm now, feeling refreshed. The music synch feature is also super fun for Friday night relaxation.',
        date: '2026-01-14'
      }
    ],
    stock: 14,
    tags: ['Smart Tech', 'Featured'],
    isFeatured: true,
    isNew: false
  }
];

export const promoCodes: PromoCode[] = [
  { code: 'WELCOME10', discountPercent: 10, description: '10% off your first purchase' },
  { code: 'FLASH20', discountPercent: 20, description: 'Special 20% discount on order' },
  { code: 'SUPERSAVER', discountPercent: 25, description: '25% discount on orders over $200', minPurchase: 200 }
];
