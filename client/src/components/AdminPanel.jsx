import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  X,
  PlusCircle,
  Upload,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  Check,
  Package,
  Layers,
  DollarSign,
  Users,
  Shield,
  ShieldAlert,
  Search,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  BarChart3
} from 'lucide-react';

export const AdminPanel = ({ isOpen, onClose, onProductCreated }) => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useCart();

  // Navigation tabs: 'overview', 'create', 'inventory', 'orders', 'users'
  const [activeTab, setActiveTab] = useState('create');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Product Creation Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Audio');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('25');
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiHighlights, setAiHighlights] = useState(['', '', '']);
  const [tags, setTags] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load Data on Open
  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchAllAdminData();
    }
  }, [isOpen, isAdmin]);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products
      const prodRes = await api.getProducts({ limit: 100 });
      if (prodRes.success) {
        setProducts(prodRes.products || []);
      }

      // 2. Fetch Orders
      try {
        const orderRes = await api.getAllOrders();
        if (orderRes.success) {
          setOrders(orderRes.orders || []);
        }
      } catch (err) {
        console.warn('Orders fetch note:', err);
      }

      // 3. Fetch Users
      try {
        const userRes = await api.getAllUsers();
        if (userRes.success) {
          setUsersList(userRes.users || []);
        }
      } catch (err) {
        console.warn('Users fetch note:', err);
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleGenerateAiCopy = async () => {
    if (!name.trim()) {
      showToast('Please enter a product title first!', 'info');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await api.generateProductCopy({
        name,
        category,
        price: Number(price) || 100,
        roughNotes: description
      });

      if (res.success && res.copy) {
        setDescription(res.copy.description || '');
        setAiSummary(res.copy.summary || '');
        if (res.copy.highlights && Array.isArray(res.copy.highlights)) {
          setAiHighlights(res.copy.highlights);
        }
        if (res.copy.tags && Array.isArray(res.copy.tags)) {
          setTags(res.copy.tags.join(', '));
        }
        showToast('✨ AI Copywriter generated rich description & tags!');
      }
    } catch (e) {
      showToast('AI copywriting failed', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) {
      showToast('Please fill in product title, price, and category', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('category', category);
      formData.append('price', price);
      formData.append('originalPrice', originalPrice || Math.round(Number(price) * 1.25));
      formData.append('stock', stock);
      formData.append('featured', featured);
      formData.append('description', description || `${name} premium edition.`);
      formData.append('aiGeneratedSummary', aiSummary || '');
      formData.append(
        'aiHighlights',
        JSON.stringify(aiHighlights.filter((h) => h.trim() !== ''))
      );
      formData.append(
        'tags',
        JSON.stringify(tags.split(',').map((t) => t.trim()).filter(Boolean))
      );

      if (imageUrlInput.trim()) {
        formData.append('imageUrls', JSON.stringify([imageUrlInput.trim()]));
      }

      // Append files for Cloudinary upload
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      const res = await api.createProduct(formData);
      if (res.success) {
        showToast(`🎉 Product "${res.product.name}" created & stored successfully!`);
        // Reset form fields
        setName('');
        setPrice('');
        setOriginalPrice('');
        setDescription('');
        setAiSummary('');
        setAiHighlights(['', '', '']);
        setTags('');
        setSelectedFiles([]);
        setImagePreviews([]);
        setImageUrlInput('');
        
        // Refresh catalog
        fetchAllAdminData();
        if (onProductCreated) onProductCreated();
        setActiveTab('inventory');
      } else {
        showToast(res.message || 'Creation failed', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error uploading product. Make sure you are signed in as Admin.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, prodName) => {
    if (!window.confirm(`⚠️ Are you sure you want to delete "${prodName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        showToast(`🗑️ Product "${prodName}" deleted successfully!`);
        fetchAllAdminData();
        if (onProductCreated) onProductCreated();
      } else {
        showToast(res.message || 'Deletion failed', 'error');
      }
    } catch (e) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order status updated to "${newStatus}"`);
        fetchAllAdminData();
      } else {
        showToast(res.message || 'Status update failed', 'error');
      }
    } catch (e) {
      showToast('Failed to update order status', 'error');
    }
  };

  if (!isOpen) return null;

  // Access Control Guard: If user is not Admin
  if (!user || !isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 border border-rose-500/40 shadow-2xl text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-extrabold font-display text-white">
            Admin Access Restricted
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Only authenticated store administrators have permissions to add, edit, or delete catalog items and manage store orders.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-1.5">
            <p className="text-slate-400 text-[11px] font-bold">Current Account:</p>
            <p className="text-white font-medium truncate">{user ? user.email : 'Not logged in'}</p>
            <span className="inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Role: {user ? user.role : 'Guest'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full gradient-btn py-3 rounded-xl text-white font-bold text-xs shadow-lg"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  // Filtered products for Inventory tab
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl glass-panel-glow rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl max-h-[90vh] flex flex-col justify-between my-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold font-display text-white">
                  AuraStore Administrator Studio
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Admin Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cloudinary Storage • AI Copywriter • Live Catalog Inventory & Deletion • Orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={fetchAllAdminData}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Refresh all data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <p className="text-[10px] uppercase font-bold text-indigo-400">Catalog Items</p>
            <p className="text-lg font-extrabold text-white">{products.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <p className="text-[10px] uppercase font-bold text-emerald-400">Total Orders</p>
            <p className="text-lg font-extrabold text-white">{orders.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <p className="text-[10px] uppercase font-bold text-purple-400">Store Revenue</p>
            <p className="text-lg font-extrabold text-white">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <p className="text-[10px] uppercase font-bold text-amber-400">Registered Users</p>
            <p className="text-lg font-extrabold text-white">{usersList.length || '2+'}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 pb-2 border-b border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Manage & Delete Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users & Roles ({usersList.length})</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto py-4 min-h-[360px]">
          {/* TAB 1: CREATE PRODUCT */}
          {activeTab === 'create' && (
            <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Nova Acoustic Wireless ANC Earphones"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Selling Price ($) *</label>
                  <input
                    type="number"
                    placeholder="199"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Original Price & Stock */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Original Price ($)</label>
                    <input
                      type="number"
                      placeholder="249"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Stock Units</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-product"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 cursor-pointer"
                />
                <label htmlFor="featured-product" className="text-slate-300 font-bold cursor-pointer">
                  Featured Product (Highlight on Home Showcase)
                </label>
              </div>

              {/* Cloudinary Image Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    Cloudinary Media Storage & Uploader
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Cloud: dp87e4rda</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Upload Files (Cloudinary Stream)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="w-full text-slate-400 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Or Direct Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {imagePreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover border border-indigo-500/50"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* AI Copywriter Generator Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-300">Product Description & Copy</span>
                <button
                  type="button"
                  onClick={handleGenerateAiCopy}
                  disabled={aiGenerating || !name.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-all"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-purple-400 ${aiGenerating ? 'animate-spin' : ''}`} />
                  <span>{aiGenerating ? 'Writing Copy with Gemini AI...' : '✨ Generate Copy with Gemini AI'}</span>
                </button>
              </div>

              {/* Description */}
              <textarea
                rows={3}
                placeholder="Detailed product story and technical specifications..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />

              {/* Tags */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="wireless, premium, bluetooth, anc, studio"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full gradient-btn py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Uploading to Cloudinary & Publishing...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Publish New Product to Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: INVENTORY & PRODUCT DELETION */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search product by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 text-white text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-48 bg-slate-900 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Smart Home">Smart Home</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              {/* Product Table / List */}
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <Package className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="font-bold text-white text-sm">No products found</p>
                  <p className="text-xs">Try adjusting search or category filter</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod._id}
                      className="p-3.5 bg-slate-900/60 hover:bg-slate-900 transition-colors flex items-center justify-between gap-3"
                    >
                      <img
                        src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                            {prod.category}
                          </span>
                          {prod.featured && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              Featured
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">
                            ID: {prod._id.slice(-6)}
                          </span>
                        </div>
                        <p className="font-bold text-white text-xs truncate mt-0.5">{prod.name}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-semibold text-emerald-400">${prod.price}</span>
                          <span>•</span>
                          <span>Stock: {prod.stock} units</span>
                          <span>•</span>
                          <span>Rating: {prod.rating} ★ ({prod.numReviews})</span>
                        </div>
                      </div>

                      {/* Admin Delete Action */}
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod._id, prod.name)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all shrink-0"
                        title="Delete Product (Admin Only)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="font-bold text-white text-sm">No orders placed yet</p>
                  <p className="text-xs">Customer orders will appear here in real-time</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                        <div>
                          <span className="font-mono text-[11px] text-indigo-400 font-bold">
                            Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                          </span>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Customer: <span className="font-bold text-white">{order.shippingAddress?.fullName || 'Aura Customer'}</span> • {order.shippingAddress?.city || 'Worldwide'}
                          </p>
                        </div>

                        {/* Status update dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="bg-slate-950 text-white text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 font-semibold cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                              alt={item.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate text-[11px]">{item.name}</p>
                              <p className="text-slate-400 text-[10px]">Qty: {item.quantity} × ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-sm font-extrabold text-white">
                          Total: <span className="text-emerald-400">${order.totalPrice?.toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: USERS & ROLES */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                {usersList.map((u) => (
                  <div
                    key={u._id}
                    className="p-3.5 bg-slate-900/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          u.role === 'admin'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        }`}
                      >
                        {u.role === 'admin' ? 'Store Admin' : 'Customer'}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Joined {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
