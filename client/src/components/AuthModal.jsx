import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  Shield,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Building
} from 'lucide-react';

export const AuthModal = ({
  isOpen,
  onClose,
  initialTab = 'login',
  initialRole = 'customer',
  promptMessage = ''
}) => {
  const { login, register } = useAuth();
  const { showToast } = useCart();
  
  // Tab state: 'login' or 'signup'
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Role / Position state: 'customer' or 'admin'
  const [role, setRole] = useState(initialRole || 'customer');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialRole) setRole(initialRole);
      if (initialTab) setActiveTab(initialTab);
    }
  }, [isOpen, initialRole, initialTab]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (activeTab === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setLoading(true);

    if (activeTab === 'login') {
      const res = await login(email.trim(), password);
      if (res.success) {
        if (res.user?.role === 'admin') {
          showToast(`⚡ Welcome back, ${res.user.name || 'Admin'}! Store Administrator privileges active.`);
        } else {
          showToast(`Welcome back, ${res.user?.name || 'Customer'}! Signed in successfully 👋`);
        }
        resetForm();
        onClose();
      } else {
        setErrorMessage(res.message || 'Invalid email or password. Please try again.');
        showToast(res.message || 'Login failed', 'error');
      }
    } else {
      const res = await register(name.trim(), email.trim(), password, role);
      if (res.success) {
        showToast(
          `🎉 Account created successfully as ${role === 'admin' ? 'Store Administrator' : 'Customer'}!`
        );
        resetForm();
        onClose();
      } else {
        setErrorMessage(res.message || 'Registration failed. Try a different email.');
        showToast(res.message || 'Registration failed', 'error');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Header */}
        <div className="text-center space-y-2 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-all ${
              role === 'admin'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30'
                : 'gradient-btn shadow-indigo-500/30'
            }`}
          >
            {role === 'admin' ? (
              <Shield className="w-6 h-6 text-white" />
            ) : (
              <Sparkles className="w-6 h-6 text-white" />
            )}
          </div>

          <h3 className="text-2xl font-extrabold font-display text-white">
            {activeTab === 'login'
              ? role === 'admin'
                ? 'Administrator Sign In'
                : 'Customer Sign In'
              : role === 'admin'
              ? 'Create Admin Account'
              : 'Create Customer Account'}
          </h3>

          <p className="text-xs text-slate-400">
            {activeTab === 'login'
              ? role === 'admin'
                ? 'Access catalog controls, manage your products & monitor orders'
                : 'Access intelligent recommendations, order history & saved items'
              : role === 'admin'
              ? 'Register as store administrator to publish & manage your catalog items'
              : 'Create your account to start curated shopping with AI concierges'}
          </p>
        </div>

        {/* Prompt Message Banner */}
        {promptMessage && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
            <p className="text-xs text-indigo-300 font-medium">{promptMessage}</p>
          </div>
        )}

        {/* Tab Switcher (Sign In vs Sign Up) */}
        <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Role / Position Selector (Shown on BOTH Login and Sign Up) */}
        <div className="mb-4">
          <label className="block text-slate-300 font-bold mb-1.5 text-[11px] uppercase tracking-wider">
            Select Position / Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {/* Customer Position */}
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                role === 'customer'
                  ? 'bg-indigo-600/25 border-indigo-500 text-white ring-1 ring-indigo-500/50 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  role === 'customer' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[11px] leading-tight">Customer</p>
                <p className="text-[9px] text-slate-400 truncate">Shopping & AI</p>
              </div>
            </button>

            {/* Admin Position */}
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                role === 'admin'
                  ? 'bg-emerald-600/25 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  role === 'admin' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[11px] leading-tight">Store Admin</p>
                <p className="text-[9px] text-slate-400 truncate">Catalog Control</p>
              </div>
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Sign Up Name Field */}
          {activeTab === 'signup' && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={role === 'admin' ? 'e.g. Vishal Admin' : 'e.g. Vishal Sharma'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              {role === 'admin' ? 'Administrator Email *' : 'Email Address *'}
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder={role === 'admin' ? 'admin@auramart.ai' : 'name@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 text-white pl-9 pr-10 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign Up Confirm Password */}
          {activeTab === 'signup' && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 text-white pl-9 pr-10 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4 ${
              role === 'admin'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/30'
                : 'gradient-btn shadow-indigo-600/30'
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {activeTab === 'login'
                    ? role === 'admin'
                      ? 'Sign In as Store Administrator'
                      : 'Sign In as Customer'
                    : role === 'admin'
                    ? 'Create Store Admin Account'
                    : 'Create Customer Account'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch Link */}
        <div className="text-center pt-4 border-t border-slate-800/80 mt-5">
          <button
            type="button"
            onClick={() => handleTabChange(activeTab === 'login' ? 'signup' : 'login')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            {activeTab === 'login'
              ? "Don't have an account? Sign Up for free"
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
