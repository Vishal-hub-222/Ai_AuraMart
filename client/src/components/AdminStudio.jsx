import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  X,
  PlusCircle,
  Upload,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  Check,
  Package,
  Layers,
  DollarSign
} from 'lucide-react';

export const AdminStudio = ({ isOpen, onClose, onProductCreated }) => {
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'manage'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Audio');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('25');
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiHighlights, setAiHighlights] = useState(['', '', '']);
  const [tags, setTags] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCatalog();
    }
  }, [isOpen]);

  const fetchCatalog = async () => {
    try {
      const res = await api.getProducts({ limit: 50 });
      if (res.success) {
        setProducts(res.products);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleGenerateAiCopy = async () => {
    if (!name.trim()) {
      showToast('Please enter a product title first!', 'info');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await api.generateProductCopy({
        name,
        category,
        price: Number(price) || 100,
        roughNotes: description
      });

      if (res.success && res.copy) {
        setDescription(res.copy.description);
        setAiSummary(res.copy.summary);
        setAiHighlights(res.copy.highlights);
        setTags(res.copy.tags.join(', '));
        showToast('✨ AI Copywriter generated rich description & tags!');
      }
    } catch (e) {
      showToast('AI copywriting failed', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !category) {
      showToast('Please fill required product fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('originalPrice', originalPrice || Math.round(Number(price) * 1.25));
      formData.append('stock', stock);
      formData.append('featured', featured);
      formData.append('description', description || `${name} premium edition.`);
      formData.append('aiGeneratedSummary', aiSummary || '');
      formData.append(
        'aiHighlights',
        JSON.stringify(aiHighlights.filter((h) => h.trim() !== ''))
      );
      formData.append(
        'tags',
        JSON.stringify(tags.split(',').map((t) => t.trim()).filter(Boolean))
      );

      if (imageUrlInput.trim()) {
        formData.append('imageUrls', JSON.stringify([imageUrlInput.trim()]));
      }

      // Append files for Cloudinary upload
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      const res = await api.createProduct(formData);
      if (res.success) {
        showToast(`🎉 Product "${res.product.name}" created & stored to MongoDB & Cloudinary!`);
        // Reset form
        setName('');
        setPrice('');
        setOriginalPrice('');
        setDescription('');
        setAiSummary('');
        setAiHighlights(['', '', '']);
        setTags('');
        setSelectedFiles([]);
        setImagePreviews([]);
        setImageUrlInput('');
        fetchCatalog();
        if (onProductCreated) onProductCreated();
      } else {
        showToast(res.message || 'Creation failed', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error uploading product to Cloudinary & MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, prodName) => {
    if (!window.confirm(`Delete product "${prodName}"?`)) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        showToast(`Deleted "${prodName}"`);
        fetchCatalog();
        if (onProductCreated) onProductCreated();
      }
    } catch (e) {
      showToast('Failed to delete product', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl glass-panel-glow rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl max-h-[90vh] flex flex-col justify-between my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-white">Aura Admin Studio</h3>
              <p className="text-xs text-slate-400">
                Cloudinary Media Uploads • AI Copywriting • Catalog Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-3 pt-3 border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'create' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Product & Cloudinary Upload</span>
            {activeTab === 'create' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`pb-2.5 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'manage' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Live Catalog Inventory ({products.length})</span>
            {activeTab === 'manage' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4">
          {activeTab === 'create' ? (
            <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Nova Acoustic Wireless ANC Earphones"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price ($) *</label>
                  <input
                    type="number"
                    placeholder="199"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800"
                    required
                  />
                </div>

                {/* Stock & Featured */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Stock Units</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="featured" className="text-slate-300 font-bold cursor-pointer">
                      Featured Item
                    </label>
                  </div>
                </div>
              </div>

              {/* Cloudinary Image Upload */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    Cloudinary Media Storage
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Cloud: dp87e4rda</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Upload File (Cloudinary Stream)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="w-full text-slate-400 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Or Paste Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                    />
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {imagePreviews.map((src, i) => (
                      <img key={i} src={src} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-indigo-500/50" />
                    ))}
                  </div>
                )}
              </div>

              {/* AI Copywriting Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-300">Product Description & Copy</span>
                <button
                  type="button"
                  onClick={handleGenerateAiCopy}
                  disabled={aiGenerating || !name.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  <span>{aiGenerating ? 'Writing with AI...' : '✨ Generate with AI Copywriter'}</span>
                </button>
              </div>

              {/* Description */}
              <textarea
                rows={3}
                placeholder="Product description or rough notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />

              {/* Tags */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="wireless, premium, bluetooth, anc"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-btn py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Uploading to Cloudinary & Saving Product...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Publish Product to Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Manage Catalog Tab */
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                {products.map((prod) => (
                  <div key={prod._id} className="p-3.5 bg-slate-900/60 flex items-center justify-between gap-3">
                    <img
                      src={prod.images?.[0]?.url}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">{prod.category}</span>
                        {prod.featured && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-white text-xs truncate">{prod.name}</p>
                      <p className="text-[11px] text-slate-400">
                        ${prod.price} • Stock: {prod.stock}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(prod._id, prod.name)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
