export interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  stock: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: {
    cardLast4: string;
    cardType: string;
  };
  trackingNumber: string;
}

export interface UserProfile {
  name: string;
  email: string;
  loyaltyPoints: number;
  avatar: string;
  address: {
    fullName: string;
    addressLine: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  minPurchase?: number;
}
