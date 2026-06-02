import { useState } from 'react';
import { Sparkles, ShieldCheck, Compass, RefreshCw, User } from 'lucide-react';
import { Product, CartItem, Order, UserProfile, PromoCode, Review } from './types';
import { initialProducts } from './data/products';
import PromoBanner from './components/PromoBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import UserProfileModal from './components/UserProfileModal';
import WishlistModal from './components/WishlistModal';
import OrderHistoryModal from './components/OrderHistoryModal';

// Seed initial user profile
const initialProfile: UserProfile = {
  name: 'Marcus Vance',
  email: 'marcus.vance@premium.com',
  loyaltyPoints: 380,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  address: {
    fullName: 'Marcus Vance',
    addressLine: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    phone: '(217) 555-0199'
  }
};

export default function App() {
  // Store States
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Overlay Visibility States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Alert Notifications State
  const [toastMessage, setToastMessage] = useState('');

  // Show temporary feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Extract categories dynamically
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products based on category and search query
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Wishlist Toggle
  const handleToggleWishlist = (productId: string) => {
    const exists = wishlist.find((p) => p.id === productId);
    if (exists) {
      setWishlist(wishlist.filter((p) => p.id !== productId));
      showToast('Removed item from your wishlist.');
    } else {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        setWishlist([...wishlist, prod]);
        showToast('Added item to your wishlist! ♥');
      }
    }
  };

  // Add to Cart
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    if (product.stock === 0) {
      showToast('Sorry, this premium item is currently out of stock.');
      return;
    }

    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty >= product.stock) {
        showToast(`Cannot add more. Only ${product.stock} units are available in stock.`);
        return;
      }
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize: size, selectedColor: color }]);
    }

    showToast(`Added "${product.name}" to your shopping cart!`);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, size, color);
      return;
    }

    // Check stock constraints
    const prod = products.find((p) => p.id === productId);
    if (prod && quantity > prod.stock) {
      showToast(`Only ${prod.stock} units available. Stock limit reached.`);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
      ) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Remove Cart Item
  const handleRemoveCartItem = (productId: string, size?: string, color?: string) => {
    const filtered = cart.filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        )
    );
    setCart(filtered);
    showToast('Removed item from shopping cart.');
  };

  // Add Review dynamically to product
  const handleAddReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const updatedProducts = products.map((prod) => {
      if (prod.id === productId) {
        const newReview: Review = {
          ...reviewData,
          id: 'rev-' + (prod.reviews.length + 1) + '-' + Math.floor(Math.random() * 100),
          date: new Date().toISOString().split('T')[0]
        };
        const newReviews = [newReview, ...prod.reviews];
        const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverageRating = Number((totalRating / newReviews.length).toFixed(1));

        return {
          ...prod,
          reviews: newReviews,
          reviewCount: newReviews.length,
          rating: newAverageRating
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    showToast('Thank you! Your review has been submitted successfully.');

    // If selected product is currently open, update its modal view state as well
    if (selectedProduct && selectedProduct.id === productId) {
      const openProd = updatedProducts.find((p) => p.id === productId);
      if (openProd) {
        setSelectedProduct(openProd);
      }
    }
  };

  // Place Order Success Handler (Decrements inventory stock!)
  const handleOrderSuccess = (newOrder: Order) => {
    // Decrement Catalog Stocks
    const updatedProducts = products.map((prod) => {
      const boughtItem = newOrder.items.find((item) => item.product.id === prod.id);
      if (boughtItem) {
        const newStock = Math.max(prod.stock - boughtItem.quantity, 0);
        return { ...prod, stock: newStock };
      }
      return prod;
    });

    setProducts(updatedProducts);
    setOrders([newOrder, ...orders]);
    setCart([]); // Empty cart
    setAppliedPromo(null); // Clear discount code
  };

  // Add Loyalty points to user profile
  const handleAddLoyaltyPoints = (points: number) => {
    setUserProfile((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + Math.round(points)
    }));
  };

  // Explore a product (e.g., from hero CTA)
  const handleExploreProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  // Quick category switch (e.g. from Hero)
  const handleFilterCategory = (category: string) => {
    setSelectedCategory(category);
    setIsAdminMode(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Admin Actions
  const handleAddProductAdmin = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  const handleUpdateProductAdmin = (productId: string, updatedFields: Partial<Product>) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, ...updatedFields } : p))
    );
    showToast('Catalog updated successfully.');
  };

  const handleDeleteProductAdmin = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    showToast('Product listing deleted from catalog.');
  };

  const handleUpdateOrderStatusAdmin = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    showToast(`Order status updated to: ${newStatus}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-amber-400">
      
      {/* Promotional countdown banner at top */}
      <PromoBanner />

      {/* Dynamic interactive navigation bar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistItemsCount={wishlist.length}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        loyaltyPoints={userProfile.loyaltyPoints}
        categories={categories}
      />

      {/* Main content wrapper */}
      <main className="flex-grow">
        
        {/* Toast alerts notice */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-800 flex items-center gap-2 text-xs font-bold animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {toastMessage}
          </div>
        )}

        {/* Conditional View: Shop vs Admin Mode */}
        {isAdminMode ? (
          <AdminDashboard
            products={products}
            orders={orders}
            onAddProduct={handleAddProductAdmin}
            onUpdateProduct={handleUpdateProductAdmin}
            onDeleteProduct={handleDeleteProductAdmin}
            onUpdateOrderStatus={handleUpdateOrderStatusAdmin}
          />
        ) : (
          <div className="space-y-12 pb-16">
            {/* Curated Slide Presentation Hero */}
            <Hero
              onExploreProduct={handleExploreProduct}
              onFilterCategory={handleFilterCategory}
            />

            {/* Product Catalog Display */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              {/* Catalog Titles */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase flex items-center gap-2">
                    <Compass className="w-6 h-6 text-amber-500" />
                    {selectedCategory === 'All' ? 'Exclusive Premium Collection' : `${selectedCategory} Collection`}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Showing {filteredProducts.length} of {products.length} handpicked items.
                  </p>
                </div>

                {/* Active Search Filter clear info */}
                {searchQuery && (
                  <div className="text-xs bg-neutral-200 px-3 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-auto">
                    <span>Filtered by: &quot;<strong>{searchQuery}</strong>&quot;</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-neutral-500 hover:text-neutral-800 font-bold underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-3xl py-16 px-4 text-center max-w-lg mx-auto space-y-4">
                  <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 mx-auto">
                    <RefreshCw className="w-8 h-8 text-neutral-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-800">No Products Match Filters</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      We couldn&apos;t find any luxury gear matching your query. Try adjusting your keyword or category.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-5 py-2 bg-neutral-950 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-extrabold uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      isInWishlist={!!wishlist.find((w) => w.id === prod.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onSelectProduct={setSelectedProduct}
                      onAddToCart={(p) => handleAddToCart(p)}
                    />
                  ))}
                </div>
              )}

              {/* Promo Section card */}
              <div className="bg-neutral-950 text-white p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="space-y-2 max-w-xl">
                  <span className="inline-flex items-center gap-1 bg-amber-500 text-neutral-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Premium Loyalty Program
                  </span>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight">
                    Earn Points With Every Simulated Purchase
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Every item you checkout automatically converts into loyalty reward points credited instantly to your profile. Points can be spent on future updates, VIP ranks, and badge unlocks.
                  </p>
                </div>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="px-5 py-3 bg-white hover:bg-amber-500 hover:text-neutral-950 text-neutral-950 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 self-start md:self-auto"
                >
                  <User className="w-4 h-4" />
                  Check My Points
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Luxury Store Footer */}
      <footer className="bg-neutral-950 text-white border-t border-neutral-900 pt-12 pb-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-900">
          {/* Column 1: Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-white text-neutral-950 rounded-lg flex items-center justify-center font-black text-base">
                A
              </div>
              <span className="text-base font-black tracking-widest text-white uppercase">
                AURA
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              A high-fidelity premium lifestyle concept store. We design and distribute the highest quality active headphones, apparel, and modern home amenities.
            </p>
          </div>

          {/* Column 2: Categories quick clicks */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-amber-400 tracking-wider text-[10px]">Shop Categories</h4>
            <ul className="space-y-2 text-neutral-400 font-semibold">
              <li>
                <button onClick={() => handleFilterCategory('Electronics')} className="hover:text-white transition-colors">
                  Electronics & Audio
                </button>
              </li>
              <li>
                <button onClick={() => handleFilterCategory('Apparel')} className="hover:text-white transition-colors">
                  Athletic Apparel
                </button>
              </li>
              <li>
                <button onClick={() => handleFilterCategory('Accessories')} className="hover:text-white transition-colors">
                  Leather Accessories
                </button>
              </li>
              <li>
                <button onClick={() => handleFilterCategory('Home & Living')} className="hover:text-white transition-colors">
                  Home & Stoneware
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer support details */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-amber-400 tracking-wider text-[10px]">Customer Care</h4>
            <ul className="space-y-2 text-neutral-400 font-semibold">
              <li><span className="hover:text-white transition-colors">Secure Payments</span></li>
              <li><span className="hover:text-white transition-colors">Free Shipping Over $150</span></li>
              <li><span className="hover:text-white transition-colors">30-Day Returns Policy</span></li>
              <li>
                <button onClick={() => setIsOrdersOpen(true)} className="hover:text-white transition-colors">
                  Logistics Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter signup */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-amber-400 tracking-wider text-[10px]">Newsletter Sign-up</h4>
            <p className="text-neutral-400 leading-relaxed">
              Subscribe to receive premium catalog drop notices and hidden discount offers.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); showToast('Thank you for subscribing to AURA notifications!'); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="your.email@premium.com"
                className="bg-neutral-900 text-white placeholder-neutral-500 px-3 py-2 rounded-xl border border-neutral-800 text-xs focus:outline-none w-full"
              />
              <button type="submit" className="px-3 py-2 bg-white text-neutral-950 rounded-xl font-bold hover:bg-amber-500 hover:text-neutral-950 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[10px] font-semibold">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>© 2026 AURA Lifestyle Concept. Demo E-Commerce App. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors">Privacy Policy</span>
            <span className="hover:text-white transition-colors">Terms of Service</span>
            <button onClick={() => setIsAdminMode(!isAdminMode)} className="text-neutral-400 hover:text-amber-500 transition-colors uppercase font-black tracking-wider">
              Merchant Sign-In
            </button>
          </div>
        </div>
      </footer>

      {/* OVERLAY MODALS */}
      
      {/* 1. Product Quick Details overlay Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, size, color) => {
            handleAddToCart(p, size, color);
            setSelectedProduct(null);
          }}
          onAddReview={handleAddReview}
        />
      )}

      {/* 2. Shopping Cart Sliding Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        appliedPromo={appliedPromo}
        onApplyPromo={setAppliedPromo}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout wizard Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        appliedPromo={appliedPromo}
        userProfile={userProfile}
        onOrderSuccess={handleOrderSuccess}
        onAddPoints={handleAddLoyaltyPoints}
      />

      {/* 4. User Wishlist Overlay Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      {/* 5. My Profile settings Overlay Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onUpdateProfile={setUserProfile}
      />

      {/* 6. Order History & Delivery Stepper Modal */}
      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

    </div>
  );
}
