import { Search, ShoppingBag, Heart, User, LayoutDashboard, ClipboardList } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  cartItemsCount: number;
  wishlistItemsCount: number;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenProfile: () => void;
  onOpenOrders: () => void;
  loyaltyPoints: number;
  categories: string[];
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  cartItemsCount,
  wishlistItemsCount,
  isAdminMode,
  setIsAdminMode,
  onOpenCart,
  onOpenWishlist,
  onOpenProfile,
  onOpenOrders,
  loyaltyPoints,
  categories
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setIsAdminMode(false);
              }}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="h-10 w-10 bg-neutral-950 text-white rounded-xl flex items-center justify-center font-black text-xl tracking-tighter shadow-md group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="block text-xl font-black tracking-wider text-neutral-900 font-sans leading-none">
                  AURA
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-600">
                  PREMIUM
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          {!isAdminMode && (
            <div className="hidden md:flex flex-1 max-w-md relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium tech, apparel, decor..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-full bg-neutral-50 text-sm placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Right Action Navigation */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Admin Dashboard Toggle */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isAdminMode
                  ? 'bg-amber-500 text-neutral-950 border border-amber-500 shadow-sm'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-transparent'
              }`}
              title={isAdminMode ? 'Switch to Shop view' : 'Switch to Seller/Admin Dashboard'}
            >
              {isAdminMode ? (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Shop Mode</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Seller Portal</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-neutral-200 hidden sm:block" />

            {/* Wishlist Button (Only in Shop Mode) */}
            {!isAdminMode && (
              <button
                onClick={onOpenWishlist}
                className="relative p-2 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white animate-bounce">
                    {wishlistItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button (Only in Shop Mode) */}
            {!isAdminMode && (
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile / Orders Dropdown */}
            <div className="relative group">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 p-1.5 sm:pl-1.5 sm:pr-3 rounded-full border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline text-xs font-bold text-neutral-800 font-mono">
                  {loyaltyPoints} pts
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-neutral-100 shadow-xl py-1 hidden group-hover:block z-50">
                <button
                  onClick={onOpenProfile}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-neutral-400" /> My Profile
                </button>
                <button
                  onClick={onOpenOrders}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-neutral-400" /> My Orders
                </button>
                <div className="border-t border-neutral-100 my-1" />
                <div className="px-4 py-1 text-[10px] text-neutral-400 font-bold uppercase">
                  Simulated User
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar & Categories Row */}
      {!isAdminMode && (
        <div className="border-t border-neutral-100 px-4 py-2 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search premium goods..."
              className="w-full pl-9 pr-4 py-1.5 border border-neutral-200 bg-neutral-50 rounded-full text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Categories Menu Bar */}
      {!isAdminMode && (
        <div className="bg-neutral-50 border-t border-b border-neutral-200 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start sm:justify-center space-x-6 h-10 whitespace-nowrap text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
