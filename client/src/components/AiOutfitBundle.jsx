import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { X, Sparkles, Plus, ShoppingBag, Check, ArrowRight, Tag } from 'lucide-react';

export const AiOutfitBundle = ({ product, isOpen, onClose }) => {
  const { addToCart, showToast } = useCart();
  const [bundleData, setBundleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      setAdded(false);
      fetchBundle(product._id);
    }
  }, [product, isOpen]);

  const fetchBundle = async (productId) => {
    setLoading(true);
    try {
      const res = await api.getOutfitBundle(productId);
      if (res.success) {
        setBundleData(res.bundle);
      }
    } catch (e) {
      console.error('Failed to load bundle:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundleToCart = () => {
    if (!bundleData?.items) return;
    bundleData.items.forEach((item) => {
      addToCart(item, 1);
    });
    setAdded(true);
    showToast(`🎉 Added ${bundleData.items.length} items from the AI Curated Bundle!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel-glow rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-white">AI Curated Power Bundle</h3>
            <p className="text-xs text-indigo-300">Complementary pieces selected by Aura AI matching algorithm</p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-300">Assembling intelligent aesthetic pairing...</p>
          </div>
        ) : bundleData ? (
          <div className="space-y-6 mt-6">
            {/* Items row with + signs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {bundleData.items.map((item, i) => (
                <div key={item._id} className="relative">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <img
                      src={item.images?.[0]?.url}
                      alt={item.name}
                      className="w-full aspect-square rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-xs font-extrabold text-slate-200 mt-1 font-display">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                  {i < bundleData.items.length - 1 && (
                    <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-indigo-600 text-white items-center justify-center shadow-lg text-xs font-bold">
                      +
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Savings Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-xs">
                    Bundle & Save 15%
                  </span>
                  <span className="text-xs text-slate-400">Total Value: <span className="line-through">${bundleData.totalOriginalPrice}</span></span>
                </div>
                <p className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  Bundle Price: <span className="text-emerald-400">${bundleData.bundlePrice}</span>
                  <span className="text-xs text-emerald-300 font-normal ml-2">(Save ${bundleData.savings})</span>
                </p>
              </div>

              <button
                onClick={handleAddBundleToCart}
                disabled={added}
                className={`px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'gradient-btn text-white hover:scale-105 active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Bundle Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Complete Set ({bundleData.items.length} Items)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
