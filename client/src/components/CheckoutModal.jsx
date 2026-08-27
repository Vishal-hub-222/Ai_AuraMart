import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  PackageCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cartItems, subtotal, discountAmount, shippingAmount, taxAmount, total, clearCart, showToast } = useCart();
  const { user, openAuthModal } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '450 Innovation Blvd, Suite 200',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
    paymentMethod: 'Credit Card (Simulated)'
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-8 border border-indigo-500/30 shadow-2xl text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Verified Sign In Required</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Only verified registered users can purchase items on AuraMart. Please sign in or create an account to proceed with checkout.
          </p>
          <button
            onClick={() => {
              onClose();
              openAuthModal('Sign in to verify your identity and buy products');
            }}
            className="w-full gradient-btn py-3.5 rounded-xl text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        guestEmail: formData.email,
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        discountPrice: discountAmount,
        shippingPrice: shippingAmount,
        taxPrice: taxAmount,
        totalPrice: total
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        setCompletedOrder(res.order);
        clearCart();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onOrderSuccess) {
          onOrderSuccess(res.order);
        }
      }
    } catch (e) {
      console.error('Order placement failed:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl glass-panel-glow rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl my-8">
        <button
          onClick={() => {
            setCompletedOrder(null);
            onClose();
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation Screen */
          <div className="p-8 sm:p-12 text-center space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                Payment Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                Thank You for Your Order!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Your order is confirmed and currently being processed at our automated fulfillment center.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left max-w-lg mx-auto space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-white">{completedOrder._id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tracking Code:</span>
                <span className="font-mono font-bold text-indigo-400">{completedOrder.trackingCode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Estimated Delivery:</span>
                <span className="font-bold text-emerald-400">
                  {new Date(completedOrder.estimatedDeliveryDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm">
                <span className="text-white">Amount Paid:</span>
                <span className="text-white font-display">${completedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  onClose();
                }}
                className="gradient-btn px-6 py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xl"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* Left: Shipping & Payment Form */}
            <form onSubmit={handlePlaceOrder} className="md:col-span-7 p-6 sm:p-8 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                    256-Bit Encrypted Checkout
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-white">Shipping & Payment</h3>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-300">1. Shipping Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-slate-300">2. Payment Method (Simulated)</p>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white">Instant Card Checkout</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Sandbox Active</span>
                  </div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 font-mono text-xs text-slate-300 p-2.5 rounded-xl border border-slate-800"
                    placeholder="Card Number"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || cartItems.length === 0}
                className="w-full gradient-btn py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing Order with AI Protocol...</span>
                ) : (
                  <>
                    <span>Authorize & Pay ${total.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Right: Order Summary Sidebar */}
            <div className="md:col-span-5 p-6 sm:p-8 bg-slate-950/60 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-3">Order Summary</h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-2.5 text-xs">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span>{shippingAmount === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${shippingAmount}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="text-white">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-sm">
                  <span className="text-white">Total</span>
                  <span className="text-lg text-emerald-400 font-display">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
