import React from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Clock, CheckCircle2, Truck, AlertCircle, RefreshCw } from 'lucide-react';

export const OrderManagement = ({ orders = [], onRefresh }) => {
  const { showToast } = useCart();

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await api.updateOrderStatus(orderId, status);
      if (res.success) {
        showToast(`Order status updated to "${status}"`);
        if (onRefresh) onRefresh();
      } else {
        showToast(res.message || 'Status update failed', 'error');
      }
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Shipped':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Processing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Cancelled':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 space-y-2 glass-card rounded-2xl p-6">
        <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
        <p className="font-bold text-white text-sm">No Customer Orders Yet</p>
        <p className="text-xs">When shoppers complete checkout, incoming orders will stream here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-bold text-white">Live Customer Orders Stream ({orders.length})</span>
        <button
          onClick={onRefresh}
          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh Orders</span>
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div>
                <span className="font-mono text-indigo-400 font-bold text-[11px]">
                  #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                </span>
                <p className="text-slate-300 text-xs mt-0.5">
                  Customer: <span className="font-bold text-white">{order.shippingAddress?.fullName || 'Verified Shopper'}</span>
                  {order.shippingAddress?.city && <span> • {order.shippingAddress.city}</span>}
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(order.orderStatus || order.status)}`}>
                  {order.orderStatus || order.status}
                </span>
                <select
                  value={order.orderStatus || order.status}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  className="bg-slate-950 text-white text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-indigo-500"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(order.orderItems || order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate text-[11px]">{item.name}</p>
                    <p className="text-slate-400 text-[10px]">
                      {item.quantity} unit(s) × ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-500">
                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-xs font-extrabold text-white">
                Total: <span className="text-emerald-400 text-sm">${order.totalPrice?.toFixed(2)}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
