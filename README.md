# ✨ AuraMart

> **A polished, AI-assisted e-commerce experience built for discovering products, curating bundles, and managing a modern storefront.** 🛍️

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

## 🌟 What is AuraMart?

AuraMart pairs a sleek React storefront with an Express and MongoDB API. Shoppers can browse a curated catalogue, refine results, save a cart, place orders, and ask **Aura AI** for product recommendations. Administrators can manage products, users, and orders from the built-in dashboard.

> 💡 The current “AI” features use application-side intent parsing, catalogue matching, and copy-generation templates—no third-party LLM key is required.

## ✨ Highlights

| Experience | What it includes |
| --- | --- |
| 🧠 **Smart discovery** | Intent-aware search that recognises categories, keywords, and budgets. |
| 💬 **Aura AI concierge** | Conversational product recommendations based on the live catalogue. |
| 🎁 **Curated bundles** | Complementary product bundles with a calculated 15% saving. |
| 🛒 **Storefront flow** | Product views, cart, coupons, checkout, order history, and reviews. |
| 🛠️ **Admin studio** | Product image uploads, AI-assisted product copy, user visibility, and order-status management. |
| 📱 **Responsive UI** | A Vite + React interface styled with Tailwind CSS and Lucide icons. |

## 🧰 Tech stack

- ⚛️ **Client:** React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- 🚀 **Server:** Node.js, Express, Mongoose, JWT, Multer
- 🗄️ **Data:** MongoDB / MongoDB Atlas
- ☁️ **Media:** Cloudinary (for product image uploads)

## 🗂️ Project structure

```text
Ai_AuraMart/
├── client/                 # React + Vite storefront
│   ├── src/admin/          # Admin dashboard views
│   ├── src/components/     # Storefront components and modals
│   └── src/services/api.js # API client
└── server/                 # Express API
    ├── controllers/        # Auth, product, order, and AI logic
    ├── models/             # MongoDB schemas
    ├── routes/             # /api route definitions
    └── seed/               # Optional catalogue seed script
```

## 🚀 Run locally

### 1. Prerequisites

- 🟢 Node.js 18 or later
- 🍃 A MongoDB database (local or Atlas)
- ☁️ A Cloudinary account if you plan to upload product images

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment variables

Create `server/.env` (or a root `.env`) with the following values:

```dotenv
# Required
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret

# Required for product image uploads
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# Optional
PORT=4000
NODE_ENV=development
```

For the frontend, leave `VITE_API_URL` unset during local development—the Vite proxy forwards `/api` requests to `http://localhost:4000`. When deploying the client separately, create `client/.env` with:

```dotenv
VITE_API_URL=https://your-api.example.com
```

### 4. Start the app

Open two terminals:

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — web app
cd client && npm run dev
```

Visit **http://localhost:5173**. The API health endpoint is available at **http://localhost:4000/api/health**. ✅

### 5. Optional: seed the catalogue

With `MONGO_URL` configured, populate the database with sample data:

```bash
cd server && npm run seed
```

## 🔌 API at a glance

| Area | Base route | Notable capabilities |
| --- | --- | --- |
| 🔐 Authentication | `/api/auth` | Register, sign in, profile, preferences, and admin user listing. |
| 📦 Products | `/api/products` | Browse, filter, create, update, delete, upload images, and review products. |
| 🧾 Orders | `/api/orders` | Create orders, view personal orders, and administer order status. |
| ✨ AI tools | `/api/ai` | Assistant chat, smart search, product copy, bundles, and review summaries. |

Protected routes expect this header:

```http
Authorization: Bearer <token>
```

## 🧪 Available scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `client` | `npm run dev` | Start the Vite development server. |
| `client` | `npm run build` | Build the production web bundle. |
| `client` | `npm run preview` | Preview the production bundle locally. |
| `server` | `npm start` | Start the API with Node.js. |
| `server` | `npm run dev` | Start the API with Nodemon. |
| `server` | `npm run seed` | Insert sample catalogue data. |

## 🔒 Deployment notes

- Set `NODE_ENV=production` to have Express serve `client/dist` after building the client.
- Keep `MONGO_URL`, `JWT_SECRET`, and Cloudinary credentials out of version control. 🛡️
- Set `VITE_API_URL` only when the client and API are deployed to different origins.

---

Built with ✨ for better product discovery.
