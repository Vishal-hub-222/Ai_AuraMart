import React from 'react';
import { Sparkles, Bot, ArrowRight, ShieldCheck, Zap, Tag, Compass } from 'lucide-react';

export const HeroBanner = ({ onOpenAiAssistant, onExplore, onApplyCode }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12">
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-glow rounded-3xl p-8 md:p-12 relative overflow-hidden border border-indigo-500/20">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span>Next-Gen AI Shopping Engine Activated</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
                Curated Luxury, <br />
                Guided by <span className="gradient-text">Aura AI.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Experience an intelligent marketplace tailored to your unique taste. Chat in natural language with our AI concierge, discover complementary bundles, and find curated tech, audio & lifestyle essentials.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={onOpenAiAssistant}
                  className="gradient-btn px-6 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Bot className="w-4 h-4" />
                  <span>Talk to Aura AI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExplore}
                  className="px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>Browse Catalog</span>
                </button>

                {/* Promo Code Pill */}
                <div
                  onClick={() => onApplyCode('AI20')}
                  className="cursor-pointer group flex items-center gap-2 px-4 py-3 rounded-2xl bg-purple-950/40 hover:bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all"
                  title="Click to copy & apply promo code"
                >
                  <Tag className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                  <span>Code: <span className="text-white font-mono font-bold">AI20</span> (20% OFF)</span>
                </div>
              </div>

              {/* Trust & Feature Badges */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant AI Recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified 100% Authentic</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Shop-the-Look Bundles</span>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive AI Demo Card */}
            <div className="lg:col-span-5">
              <div className="glass-card rounded-2xl p-6 border border-slate-700/70 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Aura AI Live Concierge</p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Online & Ready to Assist
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    AI Interactive Assistant
                  </span>
                </div>

                {/* Sample Simulated Chat Messages */}
                <div className="py-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                      U
                    </div>
                    <div className="bg-slate-800/90 text-slate-200 text-xs rounded-2xl rounded-tl-none p-3 border border-slate-700">
                      "I need wireless studio-grade headphones for remote work under $250."
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      AI
                    </div>
                    <div className="bg-indigo-950/60 text-slate-200 text-xs rounded-2xl rounded-tl-none p-3 border border-indigo-500/30 space-y-2">
                      <p>Found the match! The **Aura Pulse Pro ANC** offers 50h battery, 45dB noise cancellation, and beryllium drivers at $249.</p>
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white">Aura Pulse Pro ANC</span>
                        <span className="text-xs font-bold text-emerald-400">$249</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat CTA */}
                <button
                  onClick={onOpenAiAssistant}
                  className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Try Asking Aura Anything</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
