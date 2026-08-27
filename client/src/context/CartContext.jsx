import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, openAuthModal } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('auramart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('auramart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      showToast('Please sign in or register to add items to your cart! 🛍️', 'info');
      openAuthModal('Please sign in or register your account to add items to cart!');
      return false;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: primaryImage,
          category: product.category,
          quantity
        }
      ];
    });
    showToast(`Added ${quantity}x "${product.name}" to cart! 🛍️`);
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'AI20' || normalized === 'AURA20') {
      setCouponCode(normalized);
      setDiscountPercent(20);
      showToast('🎉 Promo code AI20 applied! 20% OFF your entire order.');
      return { success: true };
    } else if (normalized === 'AURA10') {
      setCouponCode(normalized);
      setDiscountPercent(10);
      showToast('Promo code AURA10 applied! 10% OFF.');
      return { success: true };
    } else {
      showToast('Invalid promo code. Try "AI20"', 'error');
      return { success: false, message: 'Invalid promo code. Try "AI20"' };
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingAmount = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const taxAmount = Math.round((subtotal - discountAmount) * 0.08); // 8% tax
  const total = Math.max(0, subtotal - discountAmount + shippingAmount + taxAmount);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        discountPercent,
        applyCoupon,
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        total,
        totalCount,
        toasts,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
