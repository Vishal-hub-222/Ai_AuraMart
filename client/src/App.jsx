import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { AiOutfitBundle } from './components/AiOutfitBundle';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AdminDashboard } from './admin';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

import {
  Sparkles,
  Bot,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

const MainAppContent = () => {
  const { applyCoupon, showToast } = useCart();
  const { user, isAdmin, isAuthOpen, closeAuthModal, openAuthModal, authPromptMessage, authRole } = useAuth();

  // Catalog State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-asc', 'price-desc', 'rating'
  const [priceFilter, setPriceFilter] = useState(2000);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Modal & Drawer visibility
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bundleProduct, setBundleProduct] = useState(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery, sortBy, featuredOnly]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        // Use AI Smart Search endpoint when search query is entered
        const res = await api.smartSearch(searchQuery);
        if (res.success && res.products) {
          setProducts(res.products);
          setLoading(false);
          return;
        }
      }

      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (sortBy) params.sort = sortBy;
      if (featuredOnly) params.featured = 'true';
      params.limit = 24;

      const res = await api.getProducts(params);
      if (res.success && res.products) {
        setProducts(res.products);
      }
    } catch (error) {
      console.error('Error fetching catalog:', error);
      showToast('Could not load products. Please ensure server is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleOpenBundle = (product) => {
    setBundleProduct(product);
  };

  const filteredProducts = products.filter((p) => p.price <= priceFilter);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Top Navigation */}
      <Navbar
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenAuth={() => openAuthModal()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onSearch={handleSearch}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Hero Section */}
        {!searchQuery && (
          <HeroBanner
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            onExplore={() => {
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onApplyCode={(code) => applyCoupon(code)}
          />
        )}

        {/* Catalog Section Header & Filter Toolbar */}
        <section id="catalog-section" className="py-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold font-display text-white">
                  {searchQuery
                    ? `AI Search Results for "${searchQuery}"`
                    : activeCategory === 'All'
                    ? 'Curated Catalog'
                    : `${activeCategory} Collection`}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 text-xs font-bold border border-slate-700">
                  {filteredProducts.length} Items
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery
                  ? 'Intelligent semantic matching matching specifications and budget'
                  : 'Handcrafted selection with AI performance verifications and warranty'}
              </p>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Featured toggle */}
              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 font-semibold ${
                  featuredOnly
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Only</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="newest" className="bg-slate-900">Newest Arrivals</option>
                  <option value="rating" className="bg-slate-900">Top Rated</option>
                  <option value="price-asc" className="bg-slate-900">Price: Low to High</option>
                  <option value="price-desc" className="bg-slate-900">Price: High to Low</option>
                </select>
              </div>

              {/* Refresh Catalog */}
              <button
                onClick={fetchProducts}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Refresh catalog"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl gradient-btn flex items-center justify-center mx-auto shadow-xl animate-pulse">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-300">
                Loading Intelligent Catalog...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 glass-card rounded-3xl p-8 border border-slate-800">
              <Search className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your criteria. Try adjusting your filters or ask Aura AI to find alternatives!
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                  setFeaturedOnly(false);
                }}
                className="gradient-btn px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={handleQuickView}
                  onOpenBundle={handleOpenBundle}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Aura AI Concierge Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="group relative flex items-center gap-3 p-3.5 sm:px-5 sm:py-3.5 rounded-full gradient-btn text-white font-bold shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative">
            <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-900 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-900" />
          </div>
          <span className="hidden sm:inline text-xs font-extrabold tracking-wide">
            Chat with Aura AI
          </span>
        </button>
      </div>

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />

      <AiOutfitBundle
        product={bundleProduct}
        isOpen={Boolean(bundleProduct)}
        onClose={() => setBundleProduct(null)}
      />

      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onQuickViewProduct={(prod) => {
          setIsAiAssistantOpen(false);
          setSelectedProduct(prod);
        }}
      />

      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => {
          fetchProducts();
        }}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductCreated={() => {
          fetchProducts();
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={closeAuthModal}
        promptMessage={authPromptMessage}
        initialRole={authRole}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
