import React from 'react';
import { Package, ShoppingBag, DollarSign, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export const AdminStats = ({ products = [], orders = [], users = [] }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Products */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-white mt-2 font-display">{products.length}</p>
        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
          <span className="text-emerald-400 font-semibold">{products.filter((p) => p.featured).length} featured</span> in store
        </p>
      </div>

      {/* Total Orders */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer Orders</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-white mt-2 font-display">{orders.length}</p>
        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
          <span className="text-amber-400 font-semibold">{pendingOrders} pending</span> processing
        </p>
      </div>

      {/* Revenue */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Store Revenue</span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-white mt-2 font-display">${totalRevenue.toFixed(2)}</p>
        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">Live</span> payment volume
        </p>
      </div>

      {/* Users & Stock */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Users & Stock</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-white mt-2 font-display">{users.length || '2+'}</p>
        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
          {lowStockCount > 0 ? (
            <span className="text-rose-400 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3 h-3" /> {lowStockCount} low stock alerts
            </span>
          ) : (
            <span className="text-emerald-400 font-semibold">Inventory levels healthy</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default AdminStats;
