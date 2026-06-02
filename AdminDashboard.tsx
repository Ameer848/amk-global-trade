import { useState } from 'react';
import {
  Plus,
  Trash2,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  DollarSign,
  Upload,
  CheckCircle,
  Edit,
  Save
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (productId: string, updated: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function AdminDashboard({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus
}: AdminDashboardProps) {
  // UI Tabs
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');

  // Add Product Form States
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState(10);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
  const [tags, setTags] = useState('New');
  const [sizes, setSizes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Inline edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  // Curated Preset images for quick click
  const presetImages = [
    { label: 'White Tech Gear', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { label: 'Yellow Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
    { label: 'Home Thermos', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Modern Sneaker', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80' }
  ];

  // Calculations
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const lowStockCount = lowStockProducts.length;

  // Calculate categories revenue
  const categoriesRev = products.reduce((acc, prod) => {
    const totalPaid = orders.reduce((sum, order) => {
      const item = order.items.find((itm) => itm.product.id === prod.id);
      return sum + (item ? item.product.price * item.quantity : 0);
    }, 0);
    acc[prod.category] = (acc[prod.category] || 0) + totalPaid;
    return acc;
  }, {} as Record<string, number>);

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || !description) return;

    const parsedSizes = sizes ? sizes.split(',').map((s) => s.trim()) : undefined;
    const parsedTags = tags ? tags.split(',').map((t) => t.trim()) : ['New'];

    const newProd: Product = {
      id: 'prod-' + (products.length + 1) + '-' + Math.floor(Math.random() * 1000),
      name,
      price: Number(price),
      originalPrice: originalPrice > 0 ? Number(originalPrice) : undefined,
      description,
      category,
      image: imageUrl,
      images: [imageUrl],
      rating: 4.5,
      reviewCount: 1,
      reviews: [
        {
          id: 'rev-init',
          userName: 'Admin Storefront',
          rating: 5,
          title: 'Added by Merchant',
          comment: 'Authentic premium item verified by store manager.',
          date: new Date().toISOString().split('T')[0]
        }
      ],
      stock: Number(stock),
      sizes: parsedSizes,
      tags: parsedTags,
      isNew: true
    };

    onAddProduct(newProd);
    
    // Reset form
    setName('');
    setPrice(0);
    setOriginalPrice(0);
    setDescription('');
    setStock(10);
    setSizes('');
    setShowAddForm(false);
    setSuccessMsg('Product added successfully to store catalog!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleSaveClick = (productId: string) => {
    onUpdateProduct(productId, {
      price: Number(editPrice),
      stock: Number(editStock)
    });
    setEditingId(null);
  };

  const startEdit = (prod: Product) => {
    setEditingId(prod.id);
    setEditPrice(prod.price);
    setEditStock(prod.stock);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight uppercase">
            Merchant Seller Portal
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage store catalog, track simulated sales, restock low items, and update order courier statuses.
          </p>
        </div>

        {/* Dashboard Mode Tabs */}
        <div className="flex bg-neutral-100 p-1 rounded-xl text-xs font-extrabold self-start">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'analytics' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Analytics & Reports
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Manage Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Orders Received ({orders.length})
          </button>
        </div>
      </div>

      {/* Success banner message */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* TAB 1: ANALYTICS REPORT */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* 4 Core Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue Card */}
            <div className="bg-white border border-neutral-200 p-5 rounded-3xl shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Total Revenue</span>
                <h3 className="text-2xl font-black text-neutral-950 font-mono">${totalSales}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white border border-neutral-200 p-5 rounded-3xl shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Total Orders</span>
                <h3 className="text-2xl font-black text-neutral-950 font-mono">{totalOrders}</h3>
              </div>
              <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            {/* AOV Card */}
            <div className="bg-white border border-neutral-200 p-5 rounded-3xl shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Avg Order Value</span>
                <h3 className="text-2xl font-black text-neutral-950 font-mono">${averageOrderValue}</h3>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            {/* Stock Alerts Card */}
            <div className="bg-white border border-neutral-200 p-5 rounded-3xl shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Low Stock Warnings</span>
                <h3 className="text-2xl font-black text-rose-600 font-mono">{lowStockCount} items</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                lowStockCount > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-neutral-50 text-neutral-400'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Interactive Category Sales Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart panel */}
            <div className="lg:col-span-2 bg-white border border-neutral-200 p-6 rounded-3xl shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                  Sales Breakdown By Category
                </h3>
                <p className="text-[11px] text-neutral-400">Interactive simulated category stats</p>
              </div>

              <div className="space-y-4 pt-2">
                {['Electronics', 'Apparel', 'Accessories', 'Home & Living'].map((cat) => {
                  const rev = categoriesRev[cat] || 0;
                  const totalRevMax = totalSales || 1;
                  const percentage = Math.round((rev / totalRevMax) * 100) || 0;

                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-neutral-700">
                        <span>{cat}</span>
                        <span className="font-mono text-neutral-950">${rev} ({percentage}%)</span>
                      </div>
                      <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-950 rounded-full transition-all duration-500"
                          style={{ width: `${totalSales > 0 ? percentage : 25}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Restock alerts board */}
            <div className="bg-white border border-neutral-200 p-6 rounded-3xl shadow-xs space-y-4 flex flex-col h-fit">
              <div>
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Inventory Action Center
                </h3>
                <p className="text-[11px] text-neutral-400">Refill products that are critically low on stock</p>
              </div>

              <div className="flex-1 divide-y divide-neutral-100">
                {lowStockCount === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-100">
                    All items are adequately stocked.
                  </div>
                ) : (
                  lowStockProducts.map((prod) => (
                    <div key={prod.id} className="py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div className="max-w-[120px]">
                          <h4 className="text-xs font-bold text-neutral-800 truncate">{prod.name}</h4>
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            Stock: {prod.stock}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onUpdateProduct(prod.id, { stock: prod.stock + 25 })}
                        className="px-3 py-1 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-900 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        +25 Refill
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Trigger Form Action */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
              Store Catalog Management
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer animate-bounce"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? 'Cancel Form' : 'Add Product'}
            </button>
          </div>

          {/* Add Product Form Panel */}
          {showAddForm && (
            <form onSubmit={handleAddProductSubmit} className="bg-neutral-50 border border-neutral-200 p-6 rounded-3xl space-y-6">
              <div className="border-b border-neutral-200 pb-3">
                <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">
                  Launch New Product Listing
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Product Name */}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Product Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. AeroSound Max Pro"
                    className="w-full px-3.5 py-2 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Retail Price ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">MSRP / Original Price ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    placeholder="Optional: Set for sale tags"
                    className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  />
                </div>

                {/* Initial Stock */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Initial Stock Level</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-2 md:col-span-3">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Detailed Description</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter premium product description..."
                    className="w-full px-3.5 py-2 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  />
                </div>

                {/* Custom Image Link */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Product Image Link (URL)</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  />
                </div>

                {/* Preset clicks */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Or Pick Preset</label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {presetImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(img.url)}
                        className="px-2 py-1 bg-white border border-neutral-200 rounded hover:border-neutral-400 text-[9px] font-bold"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes & Tags */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Sizes (Comma-separated)</label>
                  <input
                    type="text"
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    placeholder="e.g. S, M, L or 8, 9, 10"
                    className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Badges / Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 bg-white rounded-xl text-xs focus:outline-none focus:border-neutral-950"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-100"
                >
                  Discard Form
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Launch Product
                </button>
              </div>
            </form>
          )}

          {/* Desktop Table view */}
          <div className="border border-neutral-200 rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black text-neutral-500 uppercase">
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Action Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.map((prod) => {
                    const isEditing = editingId === prod.id;
                    const isLow = prod.stock <= 5;

                    return (
                      <tr key={prod.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="max-w-[180px] sm:max-w-[260px]">
                            <span className="block font-bold text-neutral-900 truncate">{prod.name}</span>
                            <span className="block text-[10px] text-neutral-400 truncate font-medium">{prod.description}</span>
                          </div>
                        </td>
                        <td className="p-4 text-neutral-600 font-semibold">{prod.category}</td>
                        <td className="p-4 font-bold text-neutral-800 font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-16 p-1 border border-neutral-200 rounded font-mono"
                            />
                          ) : (
                            `$${prod.price}`
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(Number(e.target.value))}
                              className="w-16 p-1 border border-neutral-200 rounded font-mono"
                            />
                          ) : (
                            <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              isLow ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-neutral-100 text-neutral-700'
                            }`}>
                              {prod.stock} units
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveClick(prod.id)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-all cursor-pointer"
                                title="Save changes"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => startEdit(prod)}
                                className="p-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-lg border border-neutral-200 transition-all cursor-pointer"
                                title="Edit catalog details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteProduct(prod.id)}
                              disabled={products.length <= 1}
                              className={`p-1.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg transition-all cursor-pointer ${
                                products.length <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-rose-100'
                              }`}
                              title="Delete product listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS RECEIVED */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
            Customer Incoming Orders Dashboard
          </h3>

          {orders.length === 0 ? (
            <div className="p-16 border border-neutral-200 rounded-3xl text-center text-neutral-500 bg-white space-y-2">
              <div className="w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-neutral-300" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-800">No Orders Logged Yet</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto mt-1">
                  Switch to Shop view, put items in the shopping cart, and complete a mock checkout to generate entries!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-4 shadow-sm"
                >
                  {/* Order Summary Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                    <div>
                      <span className="block text-xs font-black text-neutral-900 uppercase">
                        Order ID: <span className="font-mono text-amber-600 font-extrabold">{order.id}</span>
                      </span>
                      <span className="block text-[10px] text-neutral-400 font-medium">
                        Date: {order.date} • Tracking: {order.trackingNumber}
                      </span>
                    </div>

                    {/* Interactive Shipping status dropdown */}
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Ship Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`text-xs font-extrabold px-3 py-1 rounded-lg border focus:outline-none ${
                          order.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : order.status === 'Processing'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : order.status === 'Shipped'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        <option value="Pending">Pending Preparation</option>
                        <option value="Processing">Processing Warehouse</option>
                        <option value="Shipped">Shipped (Out with Courier)</option>
                        <option value="Delivered">Delivered (Completed)</option>
                      </select>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    {/* Buyer Address */}
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">
                        Buyer Delivery Address
                      </h4>
                      <div className="text-neutral-700 space-y-0.5">
                        <p className="font-bold">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                      </div>
                    </div>

                    {/* Items Ordered */}
                    <div className="space-y-1.5 md:col-span-2">
                      <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">
                        Items Ordered
                      </h4>
                      <div className="divide-y divide-neutral-100 bg-neutral-50 px-4 py-2 rounded-2xl border border-neutral-100 max-h-40 overflow-y-auto">
                        {order.items.map((itm, idx) => (
                          <div key={idx} className="py-1.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <img src={itm.product.image} alt={itm.product.name} className="w-7 h-7 rounded-md object-cover" />
                              <div className="max-w-[180px]">
                                <span className="block font-bold text-neutral-900 truncate">{itm.product.name}</span>
                                <span className="block text-[9px] text-neutral-400">
                                  Qty: {itm.quantity} {itm.selectedSize && `• Size: ${itm.selectedSize}`} {itm.selectedColor && `• Color: ${itm.selectedColor}`}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-neutral-800">${itm.product.price * itm.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Totals Summary bar */}
                  <div className="bg-neutral-50 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs border border-neutral-100">
                    <div className="flex gap-4 text-neutral-500 font-semibold">
                      <span>Subtotal: <strong className="text-neutral-800 font-mono font-bold">${order.subtotal}</strong></span>
                      {order.discount > 0 && <span>Discount: <strong className="text-emerald-600 font-mono font-bold">-${order.discount}</strong></span>}
                      <span>Tax: <strong className="text-neutral-800 font-mono font-bold">${order.tax}</strong></span>
                      <span>Shipping: <strong className="text-neutral-800 font-mono font-bold">${order.shipping}</strong></span>
                    </div>
                    <span className="text-sm font-black text-neutral-950 font-mono">
                      Total: ${order.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
