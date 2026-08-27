import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  X,
  Star,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ThumbsUp,
  MessageSquare,
  ChevronRight,
  Lock
} from 'lucide-react';

export const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart, showToast } = useCart();
  const { user, openAuthModal } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // overview, specs, reviews, aiSummary
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      setSelectedImage(0);
      setQuantity(1);
      fetchReviewsAndAiSummary(product._id);
    }
  }, [product, isOpen]);

  const fetchReviewsAndAiSummary = async (productId) => {
    setLoadingAiSummary(true);
    try {
      const [prodRes, aiRes] = await Promise.all([
        api.getProductById(productId),
        api.getReviewSummary(productId)
      ]);

      if (prodRes.success && prodRes.reviews) {
        setReviews(prodRes.reviews);
      }
      if (aiRes.success && aiRes.summary) {
        setAiSummary(aiRes.summary);
      }
    } catch (e) {
      console.error('Error fetching modal details:', e);
    } finally {
      setLoadingAiSummary(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('Sign in to leave a verified review on this product!');
      return;
    }
    if (!newReview.comment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await api.addReview(product._id, { rating: newReview.rating, comment: newReview.comment });
      if (res.success) {
        setReviews((prev) => [res.review, ...prev]);
        setNewReview({ rating: 5, comment: '' });
        if (showToast) showToast('Review posted successfully! ⭐');
        // Refresh AI summary
        const aiRes = await api.getReviewSummary(product._id);
        if (aiRes.success) setAiSummary(aiRes.summary);
      } else {
        if (showToast) showToast(res.message || 'Failed to post review', 'error');
      }
    } catch (err) {
      console.error('Failed to post review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [
    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', alt: product.name }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl glass-panel-glow rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="p-6 md:p-8 bg-slate-950/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              {/* Main Image */}
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative mb-4">
                <img
                  src={images[selectedImage]?.url}
                  alt={images[selectedImage]?.alt || product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                {product.featured && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    Featured
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === idx ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guarantee badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/60">
                <Truck className="w-4 h-4 text-indigo-400" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/60">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Tabs */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold">{product.rating || 4.8}</span>
                  <span className="text-slate-400 text-[10px]">({product.numReviews || reviews.length} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mb-3">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-white font-display">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-slate-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                      Save ${(product.originalPrice - product.price).toFixed(0)}
                    </span>
                  </>
                )}
              </div>

              {/* Tabs navigation */}
              <div className="flex border-b border-slate-800 gap-4 mb-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 transition-colors relative ${
                    activeTab === 'overview' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Overview
                  {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
                </button>
                <button
                  onClick={() => setActiveTab('aiSummary')}
                  className={`pb-2 transition-colors relative flex items-center gap-1 ${
                    activeTab === 'aiSummary' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>AI Insights</span>
                  {activeTab === 'aiSummary' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />}
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 transition-colors relative ${
                    activeTab === 'specs' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Specifications
                  {activeTab === 'specs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 transition-colors relative ${
                    activeTab === 'reviews' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Reviews ({reviews.length})
                  {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[160px] text-xs text-slate-300">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    <p className="leading-relaxed">{product.description}</p>
                    {product.aiHighlights && product.aiHighlights.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <p className="font-semibold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          Key Highlights:
                        </p>
                        <ul className="space-y-1 pl-1">
                          {product.aiHighlights.map((hl, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'aiSummary' && (
                  <div className="space-y-3">
                    {aiSummary ? (
                      <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-300 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Sentiment Verdict
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                            {aiSummary.positiveRate}% Positive
                          </span>
                        </div>
                        <p className="italic text-slate-200 text-[11px] leading-relaxed">
                          "{aiSummary.verdict}"
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                            <p className="text-[10px] font-bold text-emerald-400 mb-1">What Buyers Love</p>
                            <ul className="space-y-0.5 text-[10px] text-slate-300">
                              {aiSummary.keyPros?.map((pro, i) => (
                                <li key={i}>• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                            <p className="text-[10px] font-bold text-amber-400 mb-1">Things to Note</p>
                            <ul className="space-y-0.5 text-[10px] text-slate-300">
                              {aiSummary.keyCons?.map((con, i) => (
                                <li key={i}>• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400">Loading AI Sentiment Intelligence...</p>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-2">
                    {product.specifications && product.specifications.length > 0 ? (
                      <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800 text-xs">
                        {product.specifications.map((spec, i) => (
                          <div key={i} className="flex justify-between py-2 px-3 bg-slate-900/50">
                            <span className="font-semibold text-slate-400">{spec.key}</span>
                            <span className="text-slate-200 font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400">Standard specifications apply for this item.</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Review Form */}
                    {!user ? (
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/30 text-center space-y-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                          <Lock className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-white">Sign In to Leave a Verified Review</p>
                        <p className="text-[11px] text-slate-400">Only verified registered users can post reviews. Your honest feedback matters!</p>
                        <button
                          onClick={() => openAuthModal('Sign in to leave a verified review!')}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition-all"
                        >
                          Sign In / Register
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleAddReview} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="font-bold text-white text-[11px]">Reviewing as <span className="text-emerald-400">{user.name}</span></span>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                type="button"
                                key={s}
                                onClick={() => setNewReview({ ...newReview, rating: s })}
                                className="focus:outline-none"
                              >
                                <Star className={`w-3.5 h-3.5 ${s <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          placeholder="Share your experience..."
                          rows={2}
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          className="w-full bg-slate-950 text-xs text-slate-200 p-2 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
                          required
                        />
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold disabled:opacity-50"
                        >
                          {submittingReview ? 'Submitting...' : 'Post Review'}
                        </button>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                      {reviews.length === 0 ? (
                        <p className="text-slate-500 text-center py-2">No reviews yet. Be the first to review!</p>
                      ) : (
                        reviews.map((r, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-200 text-[11px]">{r.userName}</span>
                                {r.verifiedPurchase && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-semibold">
                                    <ShieldCheck className="w-3 h-3" /> Verified
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(r.rating || 5)].map((_, idx) => (
                                  <Star key={idx} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-300">{r.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions: Quantity & Add to Cart */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              {/* Quantity Picker */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 gradient-btn py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {quantity} to Cart • ${(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
