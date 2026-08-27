import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

import { AdminStats } from './AdminStats';
import { ProductManagement } from './ProductManagement';
import { OrderManagement } from './OrderManagement';
import { UserManagement } from './UserManagement';

import {
  X,
  Shield,
  ShieldAlert,
  Package,
  ShoppingBag,
  Users,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Lock,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboard = ({ isOpen, onClose, onProductCreated }) => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'users'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAllAdminData();
    }
  }, [isOpen, isAdmin]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      // 1. Products
      const prodRes = await api.getProducts({ limit: 100 });
      if (prodRes.success && prodRes.products) {
        setProducts(prodRes.products);
      }

      // 2. Orders
      try {
        const orderRes = await api.getAllOrders();
        if (orderRes.success && orderRes.orders) {
          setOrders(orderRes.orders);
        }
      } catch (e) {
        console.warn('Orders note:', e);
      }

      // 3. Users
      try {
        const userRes = await api.getAllUsers();
        if (userRes.success && userRes.users) {
          setUsersList(userRes.users);
        }
      } catch (e) {
        console.warn('Users note:', e);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Access Guard: If not logged in as Admin
  if (!user || !isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
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
            Only authenticated store administrators can manage catalog products, create or edit items, or manage customer orders.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-1">
            <p className="text-slate-400 text-[11px] font-bold">Current Account:</p>
            <p className="text-white font-semibold truncate">{user ? user.email : 'Guest / Not Signed In'}</p>
            <span className="inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Role: {user ? user.role : 'Guest'}
            </span>
          </div>

          {/* Sign In with Admin Account */}
          <button
            type="button"
            onClick={() => {
              onClose();
              openAuthModal('Please sign in with your Store Administrator credentials', 'admin');
            }}
            className="w-full gradient-btn py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Shield className="w-4 h-4 text-emerald-300" />
            <span>Sign In as Store Administrator</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl glass-panel-glow rounded-3xl p-5 sm:p-7 border border-indigo-500/30 shadow-2xl max-h-[92vh] flex flex-col justify-between my-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold font-display text-white">
                  AuraMart Store Admin Portal
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ⚡ Administrator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cloudinary Media Storage • Gemini AI Copywriter • Add & Delete Catalog Controls • Orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={loadAllAdminData}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Refresh admin data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close admin panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="my-3">
          <AdminStats products={products} orders={orders} users={usersList} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 pb-2 border-b border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Management & Catalog ({products.length})</span>
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
            <span>User Accounts & Permissions ({usersList.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-3 min-h-[360px]">
          {activeTab === 'products' && (
            <ProductManagement
              products={products}
              onRefresh={() => {
                loadAllAdminData();
                if (onProductCreated) onProductCreated();
              }}
            />
          )}

          {activeTab === 'orders' && (
            <OrderManagement
              orders={orders}
              onRefresh={loadAllAdminData}
            />
          )}

          {activeTab === 'users' && (
            <UserManagement
              users={usersList}
              onRefresh={loadAllAdminData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
