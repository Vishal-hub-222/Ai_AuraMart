const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');

const sampleProducts = [
  {
    name: 'Aura Pulse Pro ANC Headphones',
    description: 'Immerse yourself in studio-grade acoustics. The Aura Pulse Pro features custom 40mm beryllium drivers, hybrid active noise cancellation up to 45dB, and an ultra-plush memory foam headband designed for 50-hour all-day listening sessions.',
    price: 249,
    originalPrice: 329,
    category: 'Audio',
    tags: ['headphones', 'anc', 'wireless', 'bluetooth', 'audio', 'music', 'studio'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
        alt: 'Aura Pulse Pro ANC Headphones'
      },
      {
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
        alt: 'Aura Pulse Pro Side View'
      }
    ],
    rating: 4.9,
    numReviews: 48,
    stock: 35,
    featured: true,
    aiGeneratedSummary: 'Top-tier audio clarity with next-gen adaptive noise cancelling and 50-hour battery life.',
    aiHighlights: [
      'Hybrid 45dB Active Noise Cancellation with Transparency Mode',
      'Spatial Audio Engine with Dynamic Head Tracking',
      '50-Hour continuous playtime with 10-minute fast charging',
      'Aircraft-grade aluminum frame with genuine Italian leather trim'
    ],
    specifications: [
      { key: 'Driver Size', value: '40mm Custom Beryllium' },
      { key: 'Battery Life', value: '50 Hours (ANC On)' },
      { key: 'Connectivity', value: 'Bluetooth 5.3 & 3.5mm Lossless' },
      { key: 'Weight', value: '254 grams' }
    ]
  },
  {
    name: 'Chronos Titanium Smartwatch Horizon',
    description: 'Precision engineering meets biometric intelligence. Machined from Grade 5 aerospace titanium with sapphire crystal glass, the Chronos Horizon monitors ECG, blood oxygen, stress levels, and over 100 athletic activities in real time.',
    price: 389,
    originalPrice: 499,
    category: 'Wearables',
    tags: ['smartwatch', 'titanium', 'fitness', 'health', 'wearable', 'gps', 'luxury'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
        alt: 'Chronos Titanium Smartwatch'
      },
      {
        url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80',
        alt: 'Chronos Smartwatch on Display'
      }
    ],
    rating: 4.8,
    numReviews: 36,
    stock: 22,
    featured: true,
    aiGeneratedSummary: 'Aerospace-grade titanium smart wearable with dual-frequency GPS and advanced biometric tracking.',
    aiHighlights: [
      'Grade 5 Titanium bezel with scratch-proof Sapphire glass',
      'Always-on 1.43” AMOLED Retina display with 2000 nits peak brightness',
      'Medical-grade ECG and SpO2 cardiovascular monitoring',
      '14-Day ultra battery life on a single magnetic charge'
    ],
    specifications: [
      { key: 'Case Material', value: 'Grade 5 Aerospace Titanium' },
      { key: 'Water Resistance', value: '10 ATM (100 meters)' },
      { key: 'Display', value: '1.43” AMOLED (466x466)' },
      { key: 'Sensors', value: 'Optical Bio-Tracker 4.0, ECG, Barometer' }
    ]
  },
  {
    name: 'CyberBlade Mechanical Wireless Keyboard',
    description: 'Crafted for creators and esports pros. Featuring custom hot-swappable linear switches, CNC aluminum chassis, sound-dampening gasket mount, and programmable per-key RGB backlighting.',
    price: 159,
    originalPrice: 199,
    category: 'Electronics',
    tags: ['keyboard', 'mechanical', 'gaming', 'rgb', 'desk', 'wireless', 'tech'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
        alt: 'CyberBlade Mechanical Keyboard'
      },
      {
        url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80',
        alt: 'Keyboard Close Up'
      }
    ],
    rating: 4.7,
    numReviews: 29,
    stock: 40,
    featured: false,
    aiGeneratedSummary: 'Gasket-mounted hot-swappable mechanical masterpiece delivering the ultimate typing acoustic profile.',
    aiHighlights: [
      'Tri-mode connectivity: 2.4GHz ultra-low latency, Bluetooth 5.2 & Type-C',
      'Full CNC anodized aluminum enclosure with polycarbonate plate',
      'Pre-lubed custom smooth linear switches with PBT dye-sub keycaps',
      '4000mAh long-lasting battery with intelligent sleep mode'
    ],
    specifications: [
      { key: 'Layout', value: '75% Compact (84 Keys)' },
      { key: 'Switch Type', value: 'Hot-Swappable Custom Linear' },
      { key: 'Battery', value: '4000mAh Rechargeable' },
      { key: 'Keycaps', value: 'Double-Shot PBT Cherry Profile' }
    ]
  },
  {
    name: 'OmniBeam Ambient Smart Lighting Lamp',
    description: 'Transform any room into a tranquil sanctuary. The OmniBeam creates dynamic circadian color spectrums, responds to voice assistants, and syncs seamlessly with music rhythms and screen backdrops.',
    price: 89,
    originalPrice: 119,
    category: 'Smart Home',
    tags: ['lamp', 'lighting', 'smarthome', 'ambient', 'rgb', 'minimalist', 'decor'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
        alt: 'OmniBeam Smart Ambient Lamp'
      }
    ],
    rating: 4.9,
    numReviews: 54,
    stock: 60,
    featured: true,
    aiGeneratedSummary: 'Circadian rhythm smart ambient lamp with 16 million colors and instant voice integration.',
    aiHighlights: [
      '16 Million colors + Dynamic preset mood gradients',
      'Matter & Apple HomeKit / Google Home / Alexa compatible',
      'Touch capacitive base with smooth dimming slider',
      'Anti-glare optical diffuser with eye-comfort certification'
    ],
    specifications: [
      { key: 'Luminous Flux', value: '800 Lumens' },
      { key: 'Color Temp', value: '2200K - 6500K Tunable White + RGB' },
      { key: 'Wireless', value: 'Wi-Fi 2.4GHz & Thread Protocol' }
    ]
  },
  {
    name: 'Nomad X Weatherproof Modular Backpack',
    description: 'The definitive commuter and travel companion. Constructed from recycled Cordura ballistic fabric with waterproof AquaGuard zippers, magnetic Fidlock buckles, and dedicated padded compartments for 16” laptops.',
    price: 139,
    originalPrice: 179,
    category: 'Accessories',
    tags: ['backpack', 'bag', 'travel', 'waterproof', 'laptop', 'commute', 'gear'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
        alt: 'Nomad X Backpack'
      },
      {
        url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80',
        alt: 'Nomad X Travel Pack'
      }
    ],
    rating: 4.9,
    numReviews: 62,
    stock: 25,
    featured: true,
    aiGeneratedSummary: 'Heavy-duty weatherproof modular backpack engineered for digital nomads and daily urban transit.',
    aiHighlights: [
      '100% Recycled 840D Ballistic Nylon with Hydrophobic coating',
      'Ergonomic EVA back panel with ventilated airflow channels',
      'Quick-access RFID-shielded passport & card pocket',
      'Expandable 24L to 30L roll-top capacity'
    ],
    specifications: [
      { key: 'Capacity', value: '24L - 30L Expandable' },
      { key: 'Laptop Fit', value: 'Up to 16” MacBook Pro' },
      { key: 'Weight', value: '1.1 kg' }
    ]
  },
  {
    name: 'Merino Wool Minimalist Technical Overshirt',
    description: 'Refined modern tailoring meets high-performance natural fibers. Spun from ultra-fine 18.5-micron Australian merino wool, this overshirt naturally regulates body temperature, resists odor, and drapes impeccably.',
    price: 145,
    originalPrice: 185,
    category: 'Fashion',
    tags: ['fashion', 'wool', 'overshirt', 'apparel', 'jacket', 'minimalist', 'style'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
        alt: 'Merino Wool Overshirt'
      }
    ],
    rating: 4.8,
    numReviews: 21,
    stock: 18,
    featured: false,
    aiGeneratedSummary: 'Naturally thermoregulating 100% merino wool technical overshirt with timeless architectural lines.',
    aiHighlights: [
      '100% Sustainable 18.5 Micron Extra-Fine Merino Wool',
      'Natural wrinkle resistance and moisture-wicking properties',
      'Concealed matte black magnetic closures',
      'Tailored modern fit suitable for layering'
    ],
    specifications: [
      { key: 'Fabric Weight', value: '280 GSM Mid-weight' },
      { key: 'Care', value: 'Machine Wash Delicate or Dry Clean' },
      { key: 'Fit', value: 'Structured Modern Regular' }
    ]
  },
  {
    name: 'Apex True Wireless Noise-Cancelling Earbuds',
    description: 'Featherlight comfort with commanding studio sound. Equipped with graphene drivers, adaptive dual ANC, 6 AI beamforming microphones for crystal calls, and wireless Qi fast charging.',
    price: 129,
    originalPrice: 169,
    category: 'Audio',
    tags: ['earbuds', 'wireless', 'anc', 'bluetooth', 'audio', 'music', 'waterproof'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
        alt: 'Apex True Wireless Earbuds'
      }
    ],
    rating: 4.7,
    numReviews: 43,
    stock: 45,
    featured: true,
    aiGeneratedSummary: 'Pocketable acoustic power with IPX7 waterproofing, AI voice clarity, and 36-hour total battery.',
    aiHighlights: [
      'Graphene dynamic audio drivers with punchy deep bass',
      'IPX7 Sweat & Waterproof rating for intense workouts',
      'Multipoint Bluetooth connection allows seamless device switching',
      '9 Hours per charge + 27 additional hours in pocket case'
    ],
    specifications: [
      { key: 'Playtime', value: '36 Hours Total (9h + 27h case)' },
      { key: 'Waterproof', value: 'IPX7 Certified' },
      { key: 'Codecs', value: 'LDAC, AAC, SBC' }
    ]
  },
  {
    name: 'AeroMat Desk Leather Pad & MagSafe Dock',
    description: 'Unify your desk aesthetic with sustainably sourced vegan top-grain leather. Includes an integrated 15W high-speed MagSafe wireless charging zone for your phone and earbuds.',
    price: 65,
    originalPrice: 85,
    category: 'Lifestyle',
    tags: ['deskpad', 'charger', 'magsafe', 'leather', 'workspace', 'lifestyle', 'accessories'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
        alt: 'AeroMat Desk Pad'
      }
    ],
    rating: 4.9,
    numReviews: 78,
    stock: 50,
    featured: false,
    aiGeneratedSummary: 'Water-resistant luxury desk pad with flush 15W MagSafe fast-wireless charging pad built-in.',
    aiHighlights: [
      'Supple vegan PU leather surface optimized for optical mice',
      'Embedded 15W MagSafe fast wireless charger with LED indicator',
      'Non-slip natural rubber base prevents desk sliding',
      'Spill-resistant surface wipes clean effortlessly'
    ],
    specifications: [
      { key: 'Dimensions', value: '900mm x 400mm x 3mm' },
      { key: 'Charging Output', value: '15W Fast Wireless' },
      { key: 'Cable Included', value: '1.8m Braided USB-C' }
    ]
  },
  {
    name: 'Lumina Arc Cinematic 4K Ultra Short Throw Projector',
    description: 'Bring the IMAX theater to your living room. The Lumina Arc delivers 4K HDR10+ laser projections up to 150 inches from just 9 inches away from the wall, complete with Dolby Atmos Harmon Kardon sound.',
    price: 1299,
    originalPrice: 1599,
    category: 'Electronics',
    tags: ['projector', '4k', 'cinematic', 'laser', 'tv', 'smarthome', 'audio', 'luxury'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
        alt: 'Lumina Arc Laser Projector'
      }
    ],
    rating: 5.0,
    numReviews: 14,
    stock: 8,
    featured: true,
    aiGeneratedSummary: 'Ultra Short Throw Triple Laser Projector producing stunning 150-inch 4K HDR home theater images.',
    aiHighlights: [
      'ALPD 4.0 RGB Triple Laser Engine with 2800 ANSI Lumens',
      'True 4K UHD resolution with HDR10+ and Dolby Vision support',
      'Built-in 60W Harmon Kardon Dolby Atmos soundbar system',
      'Ultra Short Throw 0.23:1 ratio creates 120” display from 7 inches'
    ],
    specifications: [
      { key: 'Resolution', value: '4K UHD (3840 x 2160)' },
      { key: 'Brightness', value: '2800 ANSI Lumens' },
      { key: 'Sound', value: '60W Harmon Kardon Dolby Atmos' }
    ]
  },
  {
    name: 'PureAir AI Smart HEPA Air Purifier',
    description: 'Breathe pristine air. Featuring real-time PM2.5 laser sensors, medical-grade H13 True HEPA filtration, and whisper-quiet 22dB sleep mode that eliminates 99.97% of airborne allergens and dust.',
    price: 179,
    originalPrice: 229,
    category: 'Smart Home',
    tags: ['purifier', 'hepa', 'smarthome', 'air', 'health', 'clean', 'home'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1000&q=80',
        alt: 'PureAir AI HEPA Purifier'
      }
    ],
    rating: 4.8,
    numReviews: 32,
    stock: 28,
    featured: false,
    aiGeneratedSummary: 'Medical-grade H13 HEPA purifier with smart laser sensor air quality auto-adjustment.',
    aiHighlights: [
      '3-Stage H13 True HEPA filter captures particles down to 0.1 microns',
      'Real-time numerical PM2.5 indicator with color ring light',
      'Covers large spaces up to 600 sq ft in under 20 minutes',
      'Whisper-quiet 22dB silent night mode'
    ],
    specifications: [
      { key: 'CADR Rating', value: '380 m³/h' },
      { key: 'Coverage Area', value: 'Up to 600 sq ft' },
      { key: 'Noise Level', value: '22dB - 48dB' }
    ]
  },
  {
    name: 'Veloce Precision Titanium Aviator Sunglasses',
    description: 'Handcrafted luxury optics. Machined from Japanese beta-titanium with polarizing Carl Zeiss CR-39 anti-reflective lenses, delivering 100% UV400 radiation protection with featherweight comfort.',
    price: 110,
    originalPrice: 150,
    category: 'Accessories',
    tags: ['sunglasses', 'aviator', 'titanium', 'eyewear', 'fashion', 'luxury', 'summer'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
        alt: 'Veloce Aviator Sunglasses'
      }
    ],
    rating: 4.8,
    numReviews: 19,
    stock: 30,
    featured: false,
    aiGeneratedSummary: 'Japanese beta-titanium ultralight sunglasses with scratch-resistant polarized Zeiss lenses.',
    aiHighlights: [
      'Ultra-flexible Japanese Beta-Titanium frame weighing just 14g',
      'Polarized Carl Zeiss lenses with oleophobic smudge protection',
      '100% UVA / UVB 400 protection guarantee',
      'Custom handcrafted leather hard case & microfiber cloth included'
    ],
    specifications: [
      { key: 'Frame Weight', value: '14 grams' },
      { key: 'Lens Technology', value: 'Carl Zeiss Polarized CR-39' },
      { key: 'UV Protection', value: 'UV400 Cat 3' }
    ]
  },
  {
    name: 'HydroPulse Smart Temperature Control Bottle',
    description: 'The intelligent hydration flask. Vacuum-insulated double-wall stainless steel keeps drinks ice cold for 28 hours or hot for 14 hours. The OLED touch lid displays exact liquid temperature and glows to remind you to drink.',
    price: 49,
    originalPrice: 65,
    category: 'Lifestyle',
    tags: ['bottle', 'flask', 'smart', 'hydration', 'fitness', 'travel', 'lifestyle'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80',
        alt: 'HydroPulse Smart Bottle'
      }
    ],
    rating: 4.7,
    numReviews: 57,
    stock: 75,
    featured: true,
    aiGeneratedSummary: 'OLED temperature touch bottle with smart hydration reminder lights and 28-hour cold insulation.',
    aiHighlights: [
      'Touch-activated OLED cap displays real-time liquid temperature in °F/°C',
      'Timed RGB halo reminder pulse encourages consistent hydration',
      'Medical grade 316 pro stainless steel interior leaves zero metallic taste',
      'Magnetic IPX8 waterproof wireless charging cap lasts 30 days per charge'
    ],
    specifications: [
      { key: 'Capacity', value: '650ml / 22 oz' },
      { key: 'Insulation', value: '28h Cold / 14h Hot' },
      { key: 'Material', value: '316 Pro Grade Stainless Steel' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URL;
    if (!mongoUri) {
      throw new Error('MONGO_URL missing in environment variables');
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas!');

    // Clear old data
    console.log('Cleaning up existing collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});

    // Create Admin and Customer users
    console.log('Creating demo users...');
    const adminUser = await User.create({
      name: 'Vishal Admin',
      email: 'admin@auramart.ai',
      password: 'password123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      preferences: {
        favoriteCategories: ['Electronics', 'Audio'],
        priceRangePreference: 'all',
        aiPersonalizationEnabled: true
      }
    });

    const demoCustomer = await User.create({
      name: 'Sophia Vance',
      email: 'customer@auramart.ai',
      password: 'password123',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      preferences: {
        favoriteCategories: ['Audio', 'Wearables', 'Lifestyle'],
        priceRangePreference: 'medium',
        aiPersonalizationEnabled: true
      }
    });

    console.log('Inserting products catalog...');
    const productsWithCreator = sampleProducts.map((p) => ({
      ...p,
      createdBy: adminUser._id
    }));
    const createdProducts = await Product.insertMany(productsWithCreator);

    // Create sample reviews for first 3 products
    console.log('Creating reviews...');
    for (let i = 0; i < 3; i++) {
      const prod = createdProducts[i];
      await Review.create([
        {
          product: prod._id,
          user: demoCustomer._id,
          userName: 'Sophia Vance',
          rating: 5,
          comment: 'Absolutely phenomenal build quality. Exceeded every expectation. The AI assistant recommended this based on my daily routine and it is spot on!',
          sentiment: 'positive',
          verifiedPurchase: true
        },
        {
          product: prod._id,
          user: adminUser._id,
          userName: 'Alex Rivers',
          rating: 5,
          comment: 'Sleek, minimalist, and performs like a flagship. Arrived in 2 days in sustainable luxury packaging.',
          sentiment: 'positive',
          verifiedPurchase: true
        }
      ]);
    }

    console.log(`\n🎉 Seed Complete Successfully!`);
    console.log(`- Created ${createdProducts.length} Products`);
    console.log(`- Admin Account: admin@auramart.ai / password123`);
    console.log(`- Customer Account: customer@auramart.ai / password123`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
