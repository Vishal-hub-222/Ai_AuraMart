import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  Trash2,
  Check,
  Star,
  CornerDownLeft,
  Flame,
  Search
} from 'lucide-react';

export const AiAssistantDrawer = ({ isOpen, onClose, onQuickViewProduct }) => {
  const { addToCart, cartItems } = useCart();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "👋 Welcome! I am **Aura AI**, your personal shopping & style concierge. I can help you find products by budget, style, occasion, or specifications. How can I assist you today?",
      products: [],
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    '🎧 Best wireless headphones for travel under $250',
    '⌚ Smartwatch with health tracking',
    '⌨️ Mechanical keyboard for minimalist desk',
    '🎒 Weatherproof daily commuter backpack'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.chatWithAssistant(
        query,
        messages.map((m) => ({ role: m.role, content: m.content }))
      );

      if (res.success) {
        const aiMsg = {
          role: 'assistant',
          content: res.reply,
          products: res.products || [],
          detectedIntent: res.detectedIntent,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I'm having a little trouble connecting to my knowledge base right now. Please feel free to browse our catalog directly!",
            timestamp: new Date()
          }
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I ran into an issue finding recommendations. Please try another query!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared! What products or style advice can I help you find now? ✨",
        products: [],
        timestamp: new Date()
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg h-full glass-panel-glow border-l border-indigo-500/30 flex flex-col justify-between shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/30 relative">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white font-display text-base">Aura AI Concierge</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI v2.5
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Adaptive Shopping Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              title="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-lg'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Render suggested product cards inside chat */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      Recommended Matches:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.products.map((prod) => {
                        const inCart = cartItems.some((item) => item._id === prod._id);
                        return (
                          <div
                            key={prod._id}
                            className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-indigo-500/40 transition-all"
                          >
                            <img
                              src={
                                prod.images?.[0]?.url ||
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-900 cursor-pointer"
                              onClick={() => {
                                if (onQuickViewProduct) onQuickViewProduct(prod);
                              }}
                            />
                            <div
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => {
                                if (onQuickViewProduct) onQuickViewProduct(prod);
                              }}
                            >
                              <p className="font-bold text-white text-xs truncate hover:text-indigo-300">
                                {prod.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-extrabold text-white text-xs font-display">
                                  ${prod.price}
                                </span>
                                <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                                  {prod.rating || 4.8}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                                inCart
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              }`}
                              title={inCart ? 'Added to Cart' : 'Add to Cart'}
                            >
                              {inCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl rounded-tl-none w-fit">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Aura is analyzing catalog & specs...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto no-scrollbar flex gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white border border-slate-800 shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t border-slate-800 bg-slate-950"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask anything (e.g., 'gifts for gamer under $150')..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-400 pl-4 pr-12 py-3 rounded-xl border border-slate-700/70 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="absolute right-1.5 p-2 rounded-lg gradient-btn text-white disabled:opacity-40 disabled:hover:scale-100 transition-all hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
