import React, { useState } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  PlusCircle,
  Upload,
  Sparkles,
  Trash2,
  Edit,
  Package,
  Search,
  Check,
  Image as ImageIcon,
  DollarSign,
  Layers,
  AlertCircle,
  Lock,
  UserCheck,
  X,
  SlidersHorizontal,
  Eye
} from 'lucide-react';

export const ProductManagement = ({ products = [], onRefresh }) => {
  const { showToast } = useCart();
  const { user } = useAuth();

  const [subTab, setSubTab] = useState('inventory'); // 'inventory', 'add', 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ownershipFilter, setOwnershipFilter] = useState('all'); // 'all' or 'mine'

  // Form State (used for both Add & Edit)
  const [editingProductId, setEditingProductId] = useState(null);
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
  const [existingImages, setExistingImages] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Helper to check if current admin owns the product
  const isProductOwner = (prod) => {
    if (!user) return false;
    if (!prod.createdBy) return true; // If unassigned legacy product, allow admin to manage
    const creatorId = typeof prod.createdBy === 'object' ? prod.createdBy._id : prod.createdBy;
    return creatorId && creatorId.toString() === user._id.toString();
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
        setDescription(res.copy.description || '');
        setAiSummary(res.copy.summary || '');
        if (res.copy.highlights && Array.isArray(res.copy.highlights)) {
          setAiHighlights(res.copy.highlights);
        }
        if (res.copy.tags && Array.isArray(res.copy.tags)) {
          setTags(res.copy.tags.join(', '));
        }
        showToast('✨ Gemini AI wrote persuasive description, summary & tags!');
      }
    } catch (e) {
      showToast('AI copywriting failed', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const resetForm = () => {
    setEditingProductId(null);
    setName('');
    setCategory('Audio');
    setPrice('');
    setOriginalPrice('');
    setStock('25');
    setFeatured(false);
    setDescription('');
    setAiSummary('');
    setAiHighlights(['', '', '']);
    setTags('');
    setSelectedFiles([]);
    setImagePreviews([]);
    setImageUrlInput('');
    setExistingImages([]);
  };

  const handleStartEdit = (prod) => {
    if (!isProductOwner(prod)) {
      showToast('Permission denied: You can only edit products you created.', 'error');
      return;
    }
    setEditingProductId(prod._id);
    setName(prod.name || '');
    setCategory(prod.category || 'Audio');
    setPrice(prod.price !== undefined ? String(prod.price) : '');
    setOriginalPrice(prod.originalPrice !== undefined ? String(prod.originalPrice) : '');
    setStock(prod.stock !== undefined ? String(prod.stock) : '20');
    setFeatured(Boolean(prod.featured));
    setDescription(prod.description || '');
    setAiSummary(prod.aiGeneratedSummary || '');
    setAiHighlights(
      prod.aiHighlights && prod.aiHighlights.length > 0
        ? [...prod.aiHighlights, '', ''].slice(0, 3)
        : ['', '', '']
    );
    setTags(Array.isArray(prod.tags) ? prod.tags.join(', ') : '');
    setExistingImages(prod.images || []);
    setSelectedFiles([]);
    setImagePreviews([]);
    setImageUrlInput('');
    setSubTab('edit');
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages(existingImages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) {
      showToast('Please fill in title, price, and category', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
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

      if (editingProductId) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      if (imageUrlInput.trim()) {
        formData.append('imageUrls', JSON.stringify([imageUrlInput.trim()]));
      }

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      let res;
      if (editingProductId) {
        res = await api.updateProduct(editingProductId, formData);
      } else {
        res = await api.createProduct(formData);
      }

      if (res.success) {
        showToast(
          editingProductId
            ? `✅ Product "${res.product.name}" updated successfully!`
            : `🎉 Product "${res.product.name}" created and added to catalog!`
        );
        resetForm();
        if (onRefresh) onRefresh();
        setSubTab('inventory');
      } else {
        showToast(res.message || 'Operation failed', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error saving product. Make sure you are logged in as Admin.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, prodName, prod) => {
    if (!isProductOwner(prod)) {
      showToast('Permission denied: You can only delete products you created.', 'error');
      return;
    }

    if (!window.confirm(`⚠️ Are you sure you want to permanently delete "${prodName}"?`)) {
      return;
    }
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        showToast(`🗑️ Deleted "${prodName}" from catalog`);
        if (onRefresh) onRefresh();
      } else {
        showToast(res.message || 'Deletion failed: Admin permission required', 'error');
      }
    } catch (e) {
      showToast('Failed to delete product', 'error');
    }
  };

  // Filter products by search, category, and ownership
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesOwnership = ownershipFilter === 'all' || isProductOwner(p);
    return matchesSearch && matchesCategory && matchesOwnership;
  });

  const myProductsCount = products.filter((p) => isProductOwner(p)).length;

  return (
    <div className="space-y-4">
      {/* Sub Tabs: Manage Inventory vs Add Product vs Edit Product */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setSubTab('inventory');
              if (editingProductId) resetForm();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'inventory'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setSubTab('add');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'add'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>

          {subTab === 'edit' && (
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white shadow-md flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Editing Product</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Logged in as: <strong className="text-white">{user?.name || user?.email}</strong></span>
          </span>
        </div>
      </div>

      {/* SUBTAB 1: INVENTORY & PRODUCT MANAGEMENT */}
      {subTab === 'inventory' && (
        <div className="space-y-3">
          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search catalog products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 text-white text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            </div>

            {/* Ownership Filter Toggle */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setOwnershipFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  ownershipFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Products ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setOwnershipFilter('mine')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  ownershipFilter === 'mine'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>My Products</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] font-bold">
                  {myProductsCount}
                </span>
              </button>
            </div>

            {/* Category Selector */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-40 bg-slate-900 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Audio">Audio</option>
              <option value="Wearables">Wearables</option>
              <option value="Electronics">Electronics</option>
              <option value="Smart Home">Smart Home</option>
              <option value="Fashion">Fashion</option>
              <option value="Accessories">Accessories</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          {/* Product Items Table */}
          {filteredProducts.length === 0 ? (
            <div className="py-14 text-center text-slate-400 space-y-2 glass-card rounded-2xl p-6">
              <Package className="w-8 h-8 mx-auto text-slate-600" />
              <p className="font-bold text-white text-xs">
                {ownershipFilter === 'mine' ? 'You have not added any products yet' : 'No products matched'}
              </p>
              <p className="text-[11px]">
                {ownershipFilter === 'mine'
                  ? 'Click "Add New Product" above to publish your first item.'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
              {filteredProducts.map((prod) => {
                const owner = isProductOwner(prod);
                const creatorName = prod.createdBy?.name || prod.createdBy?.email || 'Store Admin';

                return (
                  <div
                    key={prod._id}
                    className="p-3.5 bg-slate-900/60 hover:bg-slate-900 transition-colors flex items-center justify-between gap-3"
                  >
                    <img
                      src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">
                          {prod.category}
                        </span>
                        {prod.featured && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            Featured
                          </span>
                        )}
                        {/* Creator Ownership Badge */}
                        {owner ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                            ✨ Created by You
                          </span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            Created by {creatorName}
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-white text-xs truncate mt-0.5">{prod.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-semibold text-emerald-400">${prod.price}</span>
                        <span>•</span>
                        <span>Stock: {prod.stock} units</span>
                        <span>•</span>
                        <span>Rating: {prod.rating} ★</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {owner ? (
                        <>
                          {/* Edit Button (Allowed for owner) */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(prod)}
                            className="p-2 rounded-xl text-slate-300 hover:text-indigo-300 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 transition-all"
                            title="Edit your product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Button (Allowed for owner) */}
                          <button
                            type="button"
                            onClick={() => handleDelete(prod._id, prod.name, prod)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all"
                            title="Delete your product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        /* Locked indicator for products owned by other admins */
                        <div
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-[10px] font-semibold cursor-not-allowed"
                          title={`Only the creator (${creatorName}) can edit or delete this product`}
                        >
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>Owned by {creatorName.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2 & 3: ADD OR EDIT PRODUCT FORM */}
      {(subTab === 'add' || subTab === 'edit') && (
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              {subTab === 'edit' ? (
                <>
                  <Edit className="w-4 h-4 text-purple-400" />
                  <span>Edit Product: "{name}"</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  <span>Publish New Product</span>
                </>
              )}
            </h4>

            {subTab === 'edit' && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setSubTab('inventory');
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Edit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Product Title *</label>
              <input
                type="text"
                placeholder="e.g. Aura Spatial Wireless ANC Earphones"
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
                className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
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
                className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Original Price & Stock */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Original Price ($)</label>
                <input
                  type="number"
                  placeholder="249"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800"
                />
              </div>
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
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="admin-product-featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <label htmlFor="admin-product-featured" className="text-slate-300 font-bold cursor-pointer">
              Mark as Featured Product (Highlight on Home Showcase)
            </label>
          </div>

          {/* Cloudinary Stream & Image Input */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                Product Images & Cloudinary Storage
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Cloud: dp87e4rda</span>
            </div>

            {/* Existing Images (Edit mode) */}
            {subTab === 'edit' && existingImages.length > 0 && (
              <div className="space-y-1.5 pb-2 border-b border-slate-800">
                <p className="text-slate-400 text-[11px]">Existing Images (Click 'x' to remove):</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.url}
                        alt="Product"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-950"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow hover:bg-rose-500"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  {subTab === 'edit' ? 'Upload Additional Images' : 'Upload File (Cloudinary)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full text-slate-400 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Or Direct Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="flex gap-2 pt-1">
                {imagePreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-indigo-500/50"
                  />
                ))}
              </div>
            )}
          </div>

          {/* AI Copywriter Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-slate-300">Product Description</span>
            <button
              type="button"
              onClick={handleGenerateAiCopy}
              disabled={aiGenerating || !name.trim()}
              className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 text-purple-400 ${aiGenerating ? 'animate-spin' : ''}`} />
              <span>{aiGenerating ? 'Generating with AI...' : '✨ Write with Gemini AI'}</span>
            </button>
          </div>

          {/* Description */}
          <textarea
            rows={3}
            placeholder="Product details and specifications..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          />

          {/* Tags */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Tags (Comma Separated)</label>
            <input
              type="text"
              placeholder="audio, anc, wireless, bluetooth"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full gradient-btn py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <span>Saving Product...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>
                  {subTab === 'edit'
                    ? 'Save & Update Product'
                    : 'Publish Product (Admin Only)'}
                </span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductManagement;
