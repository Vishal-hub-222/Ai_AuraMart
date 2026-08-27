const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'auramart_products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// @desc    Get all products with search, filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      rating,
      featured,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popular') sortOption = { numReviews: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('createdBy', 'name email role')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      products,
      page: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('createdBy', 'name email role');
    } else {
      product = await Product.findOne({ slug: id }).populate('createdBy', 'name email role');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json({
      success: true,
      product,
      reviews,
      relatedProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (with optional direct Cloudinary image upload)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      tags,
      stock,
      featured,
      aiGeneratedSummary,
      aiHighlights,
      specifications,
      imageUrls
    } = req.body;

    const images = [];

    // Handle files uploaded through Multer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.buffer);
        images.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          alt: name || 'Product image'
        });
      }
    }

    // Handle image URLs if passed as array or JSON string
    if (imageUrls) {
      const parsedUrls = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
      parsedUrls.forEach((url) => {
        if (url && url.trim()) {
          images.push({ url: url.trim(), public_id: '', alt: name });
        }
      });
    }

    // Fallback default image if none provided
    if (images.length === 0) {
      images.push({
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        public_id: '',
        alt: name
      });
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    let parsedSpecs = specifications;
    if (typeof specifications === 'string') {
      try {
        parsedSpecs = JSON.parse(specifications);
      } catch (e) {
        parsedSpecs = [];
      }
    }

    let parsedHighlights = aiHighlights;
    if (typeof aiHighlights === 'string') {
      try {
        parsedHighlights = JSON.parse(aiHighlights);
      } catch (e) {
        parsedHighlights = aiHighlights.split(',').map((h) => h.trim()).filter(Boolean);
      }
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.25),
      category,
      tags: parsedTags || [],
      images,
      stock: Number(stock) || 20,
      featured: featured === 'true' || featured === true,
      aiGeneratedSummary: aiGeneratedSummary || '',
      aiHighlights: parsedHighlights || [],
      specifications: parsedSpecs || [],
      createdBy: req.user._id
    });

    const populatedProduct = await Product.findById(product._id).populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      product: populatedProduct || product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ownership verification: each admin can only edit their own products
    if (product.createdBy && product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only edit products created by your account'
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      tags,
      stock,
      featured,
      aiGeneratedSummary,
      aiHighlights,
      specifications,
      imageUrls,
      existingImages
    } = req.body;

    if (name) product.name = name.trim();
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    if (aiGeneratedSummary !== undefined) product.aiGeneratedSummary = aiGeneratedSummary;

    if (tags !== undefined) {
      if (typeof tags === 'string') {
        try {
          product.tags = JSON.parse(tags);
        } catch (e) {
          product.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
        }
      } else if (Array.isArray(tags)) {
        product.tags = tags;
      }
    }

    if (aiHighlights !== undefined) {
      if (typeof aiHighlights === 'string') {
        try {
          product.aiHighlights = JSON.parse(aiHighlights);
        } catch (e) {
          product.aiHighlights = aiHighlights.split(',').map((h) => h.trim()).filter(Boolean);
        }
      } else if (Array.isArray(aiHighlights)) {
        product.aiHighlights = aiHighlights;
      }
    }

    if (specifications !== undefined) {
      if (typeof specifications === 'string') {
        try {
          product.specifications = JSON.parse(specifications);
        } catch (e) {
          product.specifications = [];
        }
      } else if (Array.isArray(specifications)) {
        product.specifications = specifications;
      }
    }

    // Preserve existing images if passed or retain current ones
    let updatedImages = [];
    if (existingImages) {
      try {
        const parsed = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        updatedImages = parsed;
      } catch (e) {
        updatedImages = product.images || [];
      }
    } else {
      updatedImages = product.images || [];
    }

    // Handle new uploaded files if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.buffer);
        updatedImages.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          alt: product.name || 'Product image'
        });
      }
    }

    // Handle new image URLs if passed
    if (imageUrls) {
      try {
        const parsedUrls = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
        parsedUrls.forEach((url) => {
          if (url && url.trim()) {
            updatedImages.push({ url: url.trim(), public_id: '', alt: product.name });
          }
        });
      } catch (e) {
        if (typeof imageUrls === 'string' && imageUrls.trim()) {
          updatedImages.push({ url: imageUrls.trim(), public_id: '', alt: product.name });
        }
      }
    }

    if (updatedImages.length > 0) {
      product.images = updatedImages;
    }

    // If product had no createdBy assigned yet (e.g. initial seed), assign to editing admin
    if (!product.createdBy) {
      product.createdBy = req.user._id;
    }

    const updatedProduct = await product.save();
    const populated = await Product.findById(updatedProduct._id).populate('createdBy', 'name email role');

    res.json({
      success: true,
      product: populated || updatedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ownership verification: each admin can only delete their own products
    if (product.createdBy && product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only delete products created by your account'
      });
    }

    // Attempt to delete images from Cloudinary if public_id exists
    for (const img of product.images) {
      if (img.public_id) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (e) {
          console.warn(`Could not delete image ${img.public_id} from Cloudinary:`, e.message);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ product: req.params.id });

    res.json({ success: true, message: 'Product and associated reviews deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get distinct categories
// @route   GET /api/products/categories/all
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          sampleImage: { $first: { $arrayElemAt: ['$images.url', 0] } }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          sampleImage: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private (Verified Authenticated Users)
const addReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required. Only verified signed-in users can leave a review.' });
    }

    const { rating, comment } = req.body;
    if (!rating || !comment || comment.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide both a rating and a comment' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user has purchased this product
    const userOrder = await Order.findOne({
      user: req.user._id,
      'orderItems.product': product._id
    });
    const verifiedPurchase = Boolean(userOrder) || req.user.role === 'admin';

    const ratingNum = Number(rating);
    let sentiment = 'positive';
    if (ratingNum <= 2) sentiment = 'negative';
    else if (ratingNum === 3) sentiment = 'neutral';

    // Check if user already reviewed this product
    let review = await Review.findOne({ product: product._id, user: req.user._id });
    if (review) {
      review.rating = ratingNum;
      review.comment = comment.trim();
      review.sentiment = sentiment;
      review.verifiedPurchase = verifiedPurchase;
      await review.save();
    } else {
      review = await Review.create({
        product: product._id,
        user: req.user._id,
        userName: req.user.name || 'Verified Customer',
        rating: ratingNum,
        comment: comment.trim(),
        sentiment,
        verifiedPurchase
      });
    }

    // Update product rating and reviews count
    const allReviews = await Review.find({ product: product._id });
    product.numReviews = allReviews.length;
    product.rating = Number(
      (allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length).toFixed(1)
    );
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review,
      rating: product.rating,
      numReviews: product.numReviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addReview
};
