import React from 'react';
import { Sparkles, Heart, Shield, Cpu, Cloud, Database } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-20 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold font-display text-white">
                Aura<span className="gradient-text">Mart</span>
              </span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Next-generation e-commerce curated with intelligent AI recommendations, automated bundle matching, and ultra-secure checkout.
            </p>
          </div>

          {/* Infrastructure */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Cloud & AI Stack
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-300">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>MongoDB Atlas Database</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Cloud className="w-3.5 h-3.5 text-sky-400" />
                <span>Cloudinary Media Storage</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Aura Intelligent AI Engine</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>JWT & Bcrypt Security</span>
              </li>
            </ul>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Departments
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Studio Audio & ANC Headphones</li>
              <li>Biometric & Titanium Smartwatches</li>
              <li>Smart Home & Circadian Ambient Tech</li>
              <li>Luxury Minimalist Apparel & Travel Gear</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Exclusive VIP Drops
            </h4>
            <p className="text-slate-400 mb-2">
              Receive AI-personalized product alerts and early access to limited edition drops.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="vip@example.com"
                className="w-full bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs text-white"
              />
              <button className="gradient-btn px-4 py-2 rounded-xl text-white font-bold text-xs shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AuraMart AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Protocol</span>
            <span>Terms of Service</span>
            <span>AI Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
