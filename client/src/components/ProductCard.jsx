import React from 'react';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, Eye, Sparkles, Check } from 'lucide-react';

export const ProductCard = ({ product, onQuickView, onOpenBundle }) => {
  const { addToCart, cartItems } = useCart();
  const isInCart = cartItems.some((item) => item._id === product._id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800/80 hover:border-indigo-500/40 relative transition-all duration-300">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1.5">
          {product.featured && (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30">
              Featured
            </span>
          )}
          {discountPercent && (
            <span className="px-2 py-1 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md shadow-rose-500/20">
              -{discountPercent}%
            </span>
          )}
        </div>

        {product.aiGeneratedSummary && (
          <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-[10px] font-semibold text-indigo-300 backdrop-blur-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
            <span>AI Verified</span>
          </span>
        )}
      </div>

      {/* Image Container with hover actions */}
      <div className="relative aspect-square w-full bg-slate-900/60 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 backdrop-blur-md shadow-lg transition-transform hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quick View</span>
          </button>
          {onOpenBundle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenBundle(product);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-transform hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Bundle</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-indigo-400 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-slate-200">{product.rating || '4.8'}</span>
              <span className="text-slate-500 text-[11px]">({product.numReviews || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short AI Snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.aiGeneratedSummary || product.description}
          </p>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-white font-display">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center transition-all shadow-md ${
              isInCart
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'gradient-btn text-white hover:scale-105 active:scale-95'
            } ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isInCart ? 'In Cart (Click to add more)' : 'Add to Cart'}
          >
            {isInCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
