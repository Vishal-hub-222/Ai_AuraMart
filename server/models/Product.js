const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0
    },
    originalPrice: {
      type: Number,
      default: function () {
        return Math.round(this.price * 1.25);
      }
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: ['Electronics', 'Fashion', 'Audio', 'Wearables', 'Smart Home', 'Accessories', 'Lifestyle']
    },
    tags: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: '' },
        alt: { type: String, default: '' }
      }
    ],
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 12
    },
    stock: {
      type: Number,
      required: true,
      default: 50
    },
    featured: {
      type: Boolean,
      default: false
    },
    aiGeneratedSummary: {
      type: String,
      default: ''
    },
    aiHighlights: [{ type: String }],
    specifications: [
      {
        key: { type: String },
        value: { type: String }
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

// Pre-save slug generation
productSchema.pre('save', function (next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
