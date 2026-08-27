import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Package, Clock, Truck, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export const OrderHistoryModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let res;
      if (user?.role === 'admin') {
        res = await api.getAllOrders();
      } else if (user) {
        res = await api.getMyOrders();
      } else {
        res = await api.getAllOrders();
      }

      if (res && res.success && res.orders) {
        setOrders(res.orders);
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl glass-panel-glow rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl max-h-[85vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-white">Order Tracking & History</h3>
              <p className="text-xs text-slate-400">Real-time status updates synced with MongoDB Atlas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
              <span>Loading your orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No orders found</p>
              <p className="text-xs text-slate-500">Place an order to see live tracking details here.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Tracking Code</span>
                    <p className="font-mono font-bold text-indigo-400 text-xs">{order.trackingCode || order._id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500">Order Date</span>
                    <p className="text-xs text-slate-300">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-900" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400">
                          Qty: {item.quantity} • ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer total */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-slate-400">
                    Ship to: <strong className="text-slate-200">{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.city})
                  </span>
                  <span className="text-sm font-extrabold text-white font-display">
                    Total: ${order.totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
