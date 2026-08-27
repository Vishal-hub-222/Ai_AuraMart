import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Sparkles,
  ShoppingBag,
  User,
  Search,
  Bot,
  Package,
  PlusCircle,
  LogOut,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  Shield
} from 'lucide-react';

export const Navbar = ({
  onOpenAiAssistant,
  onOpenAuth,
  onOpenAdmin,
  onOpenOrders,
  onSearch,
  activeCategory,
  onSelectCategory
}) => {
  const { user, logout, isAdmin } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const categories = ['All', 'Audio', 'Wearables', 'Electronics', 'Smart Home', 'Accessories', 'Fashion', 'Lifestyle'];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => {
              onSelectCategory('All');
              setSearchTerm('');
              onSearch('');
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight font-display text-white">
                Aura<span className="gradient-text">Mart</span>
              </span>
              <span className="ml-1 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Powered
              </span>
            </div>
          </div>

          {/* AI Smart Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Ask Aura or search (e.g., 'wireless headphones under $200' or 'minimalist')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-24 py-2.5 rounded-full border border-slate-700/70 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-all shadow-sm"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Search</span>
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Aura AI Chat Launcher Button */}
            <button
              onClick={onOpenAiAssistant}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 text-indigo-200 hover:border-indigo-400 hover:text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all group"
            >
              <div className="relative">
                <Bot className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950"></span>
              </div>
              <span className="hidden sm:inline text-sm font-semibold">Aura AI Concierge</span>
            </button>

            {/* Admin Portal Trigger */}
            <button
              onClick={onOpenAdmin}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-md ${
                isAdmin
                  ? 'bg-emerald-950/60 hover:bg-emerald-900/80 border-emerald-500/40 text-emerald-200 hover:text-white shadow-emerald-900/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
              title="Store Admin Management Portal"
            >
              <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-emerald-400' : 'text-indigo-400'}`} />
              <span>Admin Portal</span>
            </button>

            {/* Orders Modal Trigger */}
            <button
              onClick={onOpenOrders}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all"
              title="My Orders & Tracking"
            >
              <Package className="w-5 h-5 text-slate-300" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-200 hover:text-white transition-all group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-[11px] font-bold text-white flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/50"
                    />
                    <span className="hidden sm:inline text-xs font-semibold max-w-[90px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-panel-glow rounded-2xl p-2 z-50 animate-fade-in shadow-2xl border border-slate-700/80">
                      <div className="px-3 py-2 border-b border-slate-800">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                          isAdmin
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        }`}>
                          {isAdmin ? '⚡ Store Administrator' : '✨ Verified Customer'}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenOrders();
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                        >
                          <Package className="w-4 h-4 text-indigo-400" />
                          <span>Order History & Tracking</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenAdmin();
                          }}
                          className={`w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                            isAdmin
                              ? 'text-emerald-300 hover:text-white hover:bg-emerald-950/40'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <Shield className={`w-4 h-4 ${isAdmin ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span>{isAdmin ? 'Store Admin Portal' : 'Admin Portal'}</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-all shadow-sm"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search input */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search or ask Aura AI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-400 pl-9 pr-20 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-600 text-white"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Category Pills Bar */}
      <div className="border-t border-slate-800/60 bg-slate-950/40 backdrop-blur-md overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2 font-medium shrink-0">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Categories:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
