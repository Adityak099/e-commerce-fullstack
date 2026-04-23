src/
├── app/                  # (App Router) Routes, Layouts, and Loading states
│   ├── (auth)/           # Route Group: Login, Register, Forgot Password
│   ├── (shop)/           # Route Group: Home, Products, Categories
│   ├── dashboard/        # Protected: Order History, Profile
│   ├── checkout/         # Payment and Verification logic
│   ├── api/              # Route handlers (if needed for proxying)
│   ├── layout.js         # Root layout (Navbar/Footer/Providers)
│   └── page.js           # Homepage
├── components/           # UI Components
│   ├── ui/               # Atomic components (Button, Input, Badge - e.g., Shadcn)
│   ├── shared/           # Cross-page components (Navbar, Footer, Sidebar)
│   └── modules/          # Feature-specific components
│       ├── cart/         # CartDrawer, CartItem, CartSummary
│       ├── products/     # ProductCard, ProductGrid, PriceTag
│       └── orders/       # OrderHistoryTable, StatusBadge
├── hooks/                # Custom React hooks (useCart, useAuth, useRazorpay)
├── lib/                  # Third-party configs (axios instance, utils, razorpay-loader)
├── services/             # The "Bridge" to your Node.js Backend
│   ├── api.js            # Axios base instance with Interceptors
│   ├── auth.service.js   # login(), logout()
│   └── order.service.js  # createOrder(), verifyPayment()
├── store/                # Client-side state management (Zustand or Redux)
├── types/                # TypeScript types (if using TS)
├── constants/            # API Endpoints, Theme Colors, Configs
└── assets/               # Local images, Icons, Fonts



src/
├── app/
│   ├── layout.js                 # Root: Providers, Navbar, Footer
│   ├── page.js                   # URL: / (Landing Page - Gourmet Branding)
│   │
│   ├── (auth)/                   # Group: Auth (No URL prefix)
│   │   ├── login/
│   │   │   └── page.js           # URL: /login
│   │   └── register/
│   │       └── page.js           # URL: /register
│   │
│   ├── shop/                     # Folder: Product Catalog
│   │   ├── page.js               # URL: /shop (Product Listing)
│   │   └── [slug]/
│   │       └── page.js           # URL: /shop/classic-roasted-makhana
│   │
│   ├── cart/
│   │   └── page.js               # URL: /cart (Review items)
│   │
│   ├── checkout/
│   │   ├── page.js               # URL: /checkout (Address & Summary)
│   │   └── verify/
│   │       └── page.js           # URL: /checkout/verify (Handle RZP callback)
│   │
│   └── dashboard/                # Protected Routes
│       ├── page.js               # URL: /dashboard (User Profile)
│       └── orders/
│           ├── page.js           # URL: /dashboard/orders (Order History)
│           └── [id]/
│               └── page.js       # URL: /dashboard/orders/order_123 (Details)
│
├── components/
│   ├── ui/                       # Shadcn/Base components (Button, Input)
│   ├── shared/                   # Navbar.js, Footer.js, CartDrawer.js
│   └── product/                  # ProductCard.js, PriceDisplay.js
│
├── hooks/                        # useAuth.js, useCart.js, useRazorpay.js
├── services/                     # Backend API Integrations
│   ├── api.js                    # Axios instance + Interceptor
│   ├── auth.service.js           # POST /auth/logout, etc.
│   └── order.service.js          # POST /orders/verify, etc.
│
├── store/                        # Zustand stores (cart-store.js)
└── lib/                          # razorpay-loader.js, utils.js