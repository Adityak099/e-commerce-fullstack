# FreshMart E-Commerce Project

FreshMart is a full-stack grocery and e-commerce application. It has a Next.js frontend for customers to browse products, manage a cart, choose a delivery location, checkout, and view orders. The backend is an Express API that handles authentication, products, carts, orders, payment initialization, Razorpay payment verification, and persistence across PostgreSQL, MongoDB, and Redis.

The project is split into two main folders:

- `backend`: Express.js API, authentication, database configuration, cart/order/payment/product modules.
- `frontend`: Next.js application, pages, shared components, hooks, services, and public image assets.

## Main Features

- Customer registration and login using JWT authentication.
- Product browsing, product detail pages, category pages, and live search.
- Redis-backed shopping cart with add, update, remove, clear, and merge behavior.
- Checkout page with shipping address collection.
- Razorpay payment integration.
- Payment signature verification on the backend.
- PostgreSQL order records for payment and financial state.
- MongoDB order snapshots for itemized order details.
- User order history and order detail pages.
- Navbar delivery location selector using browser geolocation or manual entry.
- Responsive storefront layout with reusable UI components.

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS, Axios, Lucide React.
- Backend: Node.js, Express.js.
- Databases and storage: PostgreSQL/Supabase, MongoDB Atlas, Redis/Upstash.
- Payment gateway: Razorpay.
- Auth: JWT, bcrypt.

## Environment Variables

Backend environment variables should be stored in:

```text
backend/.env
```

Important backend variables:

```env
PORT=5000
DATABASE_URL=your_postgres_pooler_url
DIRECT_URL=your_direct_postgres_url
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Frontend API URL can be configured with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If this is not set, the frontend defaults to `http://localhost:5000/api`.

## Run The Project

Start backend:

```bash
cd backend
npm install
npm run dev
```

Start frontend:

```bash
cd frontend
npm install
npm run dev
```

Default URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

# Backend Folder

This section documents every backend file and what the code in that file is responsible for.

## *Backend Root Files*

### `backend/package.json`

Defines backend project metadata, scripts, and dependencies. It includes scripts such as `npm run dev`, `npm start`, and `npm run seed`. It also lists backend packages like Express, Mongoose, PostgreSQL clients, Redis clients, JWT, bcrypt, Razorpay, Prisma, and dotenv.

### `backend/app.js`

Main backend entry point. It loads environment variables from `backend/.env`, initializes Express, connects to MongoDB and Redis, configures CORS and JSON parsing, mounts all API route groups, exposes test/health endpoints, and starts the backend server.

Routes mounted here include:

- `/api/auth`
- `/api/cart`
- `/api/orders`
- `/api/payment`
- `/api/products`

It also has test endpoints for PostgreSQL, MongoDB, and Redis connectivity.

### `backend/prisma/schema.prisma`

Defines Prisma configuration and the PostgreSQL data model. It includes:

- `User` model for registered users.
- `orders` model for order/payment records.
- `Role` enum for `CUSTOMER`, `ADMIN`, and `SELLER`.

The `orders` table stores total price, status, shipping address, payment id, Razorpay order id, and creation time.

### `backend/scripts/seed.js`

Seed script for creating or inserting sample data into the backend data stores. This is typically used during development to populate products or test records.

## Backend Source Files

### `backend/src/app.js`

Currently empty. This appears to be an unused or placeholder app file. The active backend server entry point is `backend/app.js`.

### `backend/src/server.js`

Currently empty. This appears to be an unused or placeholder server file. The active server startup logic is in `backend/app.js`.

## Backend Config Files

### `backend/src/config/config.mongodb.js`

Contains MongoDB connection logic using Mongoose. It reads `MONGODB_URI` from environment variables and connects the backend to MongoDB Atlas. MongoDB is used for products and order snapshots.

### `backend/src/config/config.pgdb.js`

Creates and exports the PostgreSQL connection pool using the `pg` package. It explicitly loads `backend/.env`, reads `DATABASE_URL`, configures SSL for Supabase, and exports the pool used by order and database-related services.

This file prevents accidental fallback to local PostgreSQL by throwing a clear error when `DATABASE_URL` is missing.

### `backend/src/config/config.prisma.js`

Configures and exports the Prisma client. This is used when code wants to interact with PostgreSQL through Prisma instead of raw SQL.

### `backend/src/config/config.razorpay.js`

Creates and exports a Razorpay instance using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from environment variables. It logs an error if the Razorpay keys are missing.

### `backend/src/config/config.redis.js`

Creates and manages the Redis connection. Redis is used mainly for cart storage, token blacklist checks, and temporary user/session data. It exposes helper logic so services can ensure Redis is available before reading or writing cart data.

## Backend Middleware Files

### `backend/src/middleware/errorHandler.js`

General error-handling middleware. It centralizes API error responses so backend errors can be returned in a consistent JSON format.

### `backend/src/middleware/notFound.js`

Middleware for handling requests to routes that do not exist. It returns a not-found response when no route matched the request.

### `backend/src/middleware/rbac.middleware.js`

Role-based access control middleware. It protects routes that should only be available to users with specific roles, such as admin or seller routes.

## Auth Module

### `backend/src/modules/auth/auth.routes.js`

Defines authentication API routes. It connects HTTP endpoints to auth controller functions for user registration, login, and logout.

### `backend/src/modules/auth/auth.controller.js`

Handles auth HTTP requests. It reads request body data, calls the auth service, logs successful auth actions, and returns JSON responses for register, login, and logout.

### `backend/src/modules/auth/auth.service.js`

Contains auth business logic. It handles:

- Normalizing email addresses.
- Checking whether a user already exists.
- Hashing passwords with bcrypt.
- Comparing login passwords.
- Creating JWT tokens.
- Blacklisting JWT tokens in Redis during logout.
- Checking whether a token is blacklisted.

### `backend/src/modules/auth/auth.repository.js`

Handles database access for auth-related user operations. It contains logic for finding users by email and creating new users.

### `backend/src/modules/auth/auth.middleware.js`

Protects private routes. It reads the `Authorization` header, verifies the JWT token, checks Redis for blacklisted tokens, attaches the decoded user to `req.user`, and blocks invalid or missing tokens.

It also contains an admin-check middleware.

## Cart Module

### `backend/src/modules/cart/cart.routes.js`

Defines cart API routes and applies authentication to all cart endpoints. It includes routes for:

- Getting the current cart.
- Adding items.
- Updating item quantity.
- Removing an item.
- Clearing the cart.
- Merging a guest cart.

### `backend/src/modules/cart/cart.controller.js`

Handles cart HTTP requests. It reads user id from `req.user`, validates request data, calls cart service functions, and returns cart responses.

It also contains older checkout-related code at the bottom, but active payment checkout is handled by the orders module.

### `backend/src/modules/cart/cart.service.js`

Contains Redis-backed cart logic. It:

- Reads cart data by user id.
- Normalizes cart item ids.
- Adds products to the cart.
- Updates quantity.
- Removes products.
- Clears the cart.
- Merges guest and logged-in carts.
- Recalculates total price after cart changes.

## Orders Module

### `backend/src/modules/orders/order.routes.js`

Defines order API routes:

- `POST /api/orders/checkout`: creates a pending order and Razorpay order.
- `GET /api/orders/history`: returns logged-in user's order history.
- `GET /api/orders/my-orders`: alias used by the frontend dashboard.
- `GET /api/orders/:id`: returns one order with item snapshot.

### `backend/src/modules/orders/order.controller.js`

Handles order HTTP requests. It has:

- `checkout`: validates address, creates a pending order, creates a Razorpay order, stores the Razorpay order id, and returns payment initialization data to the frontend.
- `getOrderHistory`: returns all orders for the logged-in user.
- `getOrderById`: returns one order for the logged-in user.

### `backend/src/modules/orders/order.service.js`

Contains order business logic and database operations. It:

- Reads the live cart from Redis.
- Creates a pending order in PostgreSQL.
- Saves an itemized order snapshot in MongoDB.
- Attaches the Razorpay order id to the PostgreSQL order.
- Finalizes an order after payment verification.
- Marks payment status as completed.
- Stores Razorpay payment id.
- Clears the user's cart after successful payment.
- Returns normalized order history and order detail data to the frontend.

### `backend/src/modules/orders/order.model.js`

Defines the MongoDB order snapshot schema. It stores itemized order data linked to the PostgreSQL order id, including:

- `pgOrderId`
- `userId`
- ordered items
- shipping address
- order timestamp

This lets the app keep a stable copy of what was in the cart at checkout time.

## Payment Module

### `backend/src/modules/payment/payment.routes.js`

Defines payment routes. Currently it exposes:

- `POST /api/payment/verify`

### `backend/src/modules/payment/payment.controller.js`

Verifies Razorpay payments. It:

- Reads `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
- Uses `RAZORPAY_KEY_SECRET` to create an HMAC SHA256 signature.
- Compares the expected signature with Razorpay's signature.
- Calls order service to finalize the order if verification passes.

## Product Module

### `backend/src/modules/product/product.routes.js`

Defines product API routes. It connects product endpoints to product controller functions for listing, searching, creating, updating, deleting, and fetching product details.

### `backend/src/modules/product/product.controller.js`

Handles product HTTP requests. It reads params, query strings, and request bodies, then calls product service methods. It supports product listing, search, product detail lookup, seller products, creation, update, and deletion.

### `backend/src/modules/product/product.service.js`

Contains product business logic. It coordinates product creation, update, deletion, filtering, seller ownership checks, and calls repository/model functions as needed.

### `backend/src/modules/product/product.repository.js`

Contains product database access logic. It abstracts direct product queries so controllers and services do not need to know database details.

### `backend/src/modules/product/product.model.js`

Defines the MongoDB product schema. Product records include details such as name, slug, description, price, category, stock, images, seller id, and timestamps.

### `backend/src/modules/product/product.validators.js`

Contains product validation helpers or schemas. It is used to make sure product input data is valid before creating or updating products.

---

# Frontend Folder

This section documents every frontend file and what the code in that file is responsible for.

## *Frontend Root Files*

### `frontend/package.json`

Defines frontend project metadata, scripts, and dependencies. Scripts include:

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run lint`

Dependencies include Next.js, React, Axios, Lucide React, and Tailwind-related packages.

### `frontend/next.config.mjs`

Next.js configuration file. It is used to configure framework-level behavior such as images, build options, redirects, or experimental settings.

### `frontend/eslint.config.mjs`

ESLint configuration for the frontend. It controls linting rules for Next.js and React code.

### `frontend/postcss.config.mjs`

PostCSS configuration used by Tailwind CSS and the frontend styling pipeline.

### `frontend/tailwind.config.js`

Tailwind CSS configuration. It defines where Tailwind should scan for classes and can contain theme customization such as colors, spacing, fonts, and plugin configuration.

### `frontend/jsconfig.json`

JavaScript project configuration for the frontend. It helps Next.js and the editor resolve path aliases like `@/components` and `@/services`.

## Frontend App Files

### `frontend/src/app/layout.js`

Root Next.js layout. It wraps all pages with shared HTML structure, global styles, providers, navbar, footer, and app-wide metadata.

### `frontend/src/app/page.js`

Home page route. It displays the main storefront landing content using layout components such as hero, categories, features, best sellers, and featured products.

### `frontend/src/app/globals.css`

Global CSS file. It imports Tailwind layers and defines app-wide CSS variables, colors, base styles, utility styling, and theme tokens.

### `frontend/src/app/favicon.ico`

Browser favicon shown in the tab for the frontend app.

## Frontend Auth Routes

### `frontend/src/app/(auth)/layout.js`

Layout wrapper for auth pages. It provides a shared structure for login and register screens.

### `frontend/src/app/(auth)/login/page.js`

Login page. It collects user email and password, calls the auth service, stores auth data, and redirects users after successful login.

### `frontend/src/app/(auth)/register/page.js`

Registration page. It collects new user details, calls the register API, and handles registration success or errors.

## Frontend Shop Routes

### `frontend/src/app/(shop)/cart/page.js`

Cart page. It displays current cart items, lets users change quantities, remove products, see totals, and proceed to checkout.

### `frontend/src/app/(shop)/checkout/page.js`

Checkout page. It collects shipping address, initializes Razorpay payment through `/orders/checkout`, opens the Razorpay payment popup, verifies payment through `/payment/verify`, and redirects to the order detail page after success.

### `frontend/src/app/(shop)/dashboard/page.js`

User dashboard order history page. It fetches `/orders/my-orders`, displays previous orders, shows totals/status, and links to order detail pages.

### `frontend/src/app/(shop)/dashboard/orders/[id]/page.js`

Order detail page. It fetches a single order by id, shows status, date, ordered items, and total amount.

### `frontend/src/app/(shop)/products/page.js`

Products listing page. It displays products, supports browsing/searching, and links to product detail pages.

### `frontend/src/app/(shop)/products/[id]/page.js`

Product detail route. It loads and displays one product based on the route parameter.

### `frontend/src/app/(shop)/category/[slug]/page.js`

Category page. It displays products for a selected category based on the `slug` route parameter.

## Frontend Lib Files

### `frontend/src/lib/api.js`

Creates the shared Axios instance for frontend API calls. It sets the backend base URL, enables credentials, and attaches the JWT token from `localStorage` to the `Authorization` header on every request.

## Frontend Services

### `frontend/src/services/auth.service.js`

Frontend authentication service. It handles login, registration, logout, current user retrieval, token storage, auth-state checks, and auth-change events.

### `frontend/src/services/cart.Service.js`

Frontend cart service. It calls cart API endpoints for getting cart data, adding items, updating quantities, removing items, clearing the cart, formatting cart prices, and emitting cart-change events.

### `frontend/src/services/product.Service.js`

Frontend product service. It calls product API endpoints for fetching products, searching products, loading product details, and supporting live search.

## Frontend Hooks

### `frontend/src/hooks/useAuth.js`

Custom auth hook. It provides React components with authentication state and user information.

### `frontend/src/hooks/useCart.js`

Custom cart hook. It provides cart data and cart operations to components while handling loading and error state.

### `frontend/src/hooks/useCartSummary.js`

Custom hook for cart summary data. It calculates or tracks cart item count and listens for cart-change events so the navbar cart badge stays updated.

## Frontend UI Components

### `frontend/src/components/ui/Button.jsx`

Reusable button component. It supports variants, sizes, disabled state styling, and consistent button classes across the app.

### `frontend/src/components/ui/Container.jsx`

Reusable layout container. It constrains page content width and applies consistent horizontal spacing.

### `frontend/src/components/ThemeProvider.js`

Theme provider component. It wraps app content and provides theme-related behavior or context for frontend styling.

## Frontend Shared Components

### `frontend/src/components/shared/Navbar.jsx`

Main navigation bar. It includes logo, search, location selector, navigation links, user menu, logout, cart button, cart count, and mobile controls.

The location selector allows the user to use browser geolocation or manually save a delivery location in `localStorage`.

### `frontend/src/components/shared/SearchBar.jsx`

Live product search component. It debounces search input, calls the product search service, shows matching product results, handles result clicks, and supports redirecting to a full product search page.

### `frontend/src/components/shared/Logo.jsx`

Reusable brand/logo component used where the FreshMart identity needs to be displayed.

### `frontend/src/components/shared/Footer.jsx`

Footer component. It displays shared footer content such as links, brand details, and bottom-of-page information.

## Frontend Layout Components

### `frontend/src/components/layout/Hero.jsx`

Homepage hero section. It presents the main FreshMart storefront message and visual content for the first viewport.

### `frontend/src/components/layout/Categories.jsx`

Homepage category section. It displays grocery/product categories and links users into category pages.

### `frontend/src/components/layout/Features.jsx`

Homepage features section. It highlights service benefits such as delivery, freshness, support, or convenience.

### `frontend/src/components/layout/BestSellers.jsx`

Homepage best-sellers section. It displays highlighted or popular products.

## Frontend Product Components

### `frontend/src/components/product/AddToCartButton.js`

Reusable add-to-cart button. It sends selected product information to the cart service and updates cart state.

### `frontend/src/components/product/FeaturedProducts.js`

Displays featured products on the homepage or product-related sections. It fetches or receives product data and renders product cards.

### `frontend/src/components/product/ProductCard.js`

Reusable product card. It displays product image, name, price, category/details, and actions such as viewing or adding to cart.

### `frontend/src/components/product/ProductView.js`

Detailed product display component. It shows product image, description, price, quantity controls, and add-to-cart behavior.

## Frontend Public Assets

### `frontend/public/placeholder.svg`

Default placeholder image used when a product or content image is unavailable.

### `frontend/public/hero/vegetables.jpg`

Hero image asset for vegetables.

### `frontend/public/hero/spices.jpg`

Hero image asset for spices.

### `frontend/public/hero/fruits.jpg`

Hero image asset for fruits.

### `frontend/public/hero/dairy.jpg`

Hero image asset for dairy.

### `frontend/public/categories/baby-care.png`

Category image asset for baby care.

### `frontend/public/categories/bakery.jpg`

Category image asset for bakery.

### `frontend/public/categories/cleaning.jpg`

Category image asset for cleaning products.

### `frontend/public/categories/dairy.jpg`

Category image asset for dairy.

### `frontend/public/categories/Demo-Image.svg`

Demo or fallback category image asset.

### `frontend/public/categories/drinks.jpg`

Category image asset for drinks.

### `frontend/public/categories/electronics.png`

Category image asset for electronics.

### `frontend/public/categories/fashion.png`

Category image asset for fashion.

### `frontend/public/categories/fruits-vegetables.jpg`

Category image asset for fruits and vegetables.

### `frontend/public/categories/grains.jpg`

Category image asset for grains.

### `frontend/public/categories/home-kitchen.png`

Category image asset for home and kitchen.

### `frontend/public/categories/personal-care.jpg`

Category image asset for personal care.

### `frontend/public/categories/pet-care.png`

Category image asset for pet care.

### `frontend/public/categories/snacks.jpg`

Category image asset for snacks.

### `frontend/public/categories/spices.jpg`

Category image asset for spices.

### `frontend/public/categories/toy.png`

Category image asset for toys.

---

# Root Files

### `jsconfig.json`

Root JavaScript configuration file. It helps editor tooling understand project-wide JavaScript settings and path resolution.

### `.gitignore`

Git ignore rules for the project. It prevents generated files, dependency folders, environment files, build output, and local machine artifacts from being committed.

### `README.md`

This documentation file. It explains what the FreshMart project is, how it is structured, and what each file is responsible for.

---

# Important Flow Summary

## Checkout And Payment Flow

1. User adds products to cart.
2. Cart is stored in Redis using the logged-in user id.
3. User opens checkout page and enters shipping address.
4. Frontend calls `POST /api/orders/checkout`.
5. Backend reads the live cart from Redis.
6. Backend creates a pending order in PostgreSQL.
7. Backend stores item snapshot in MongoDB.
8. Backend creates a Razorpay order.
9. Frontend opens Razorpay checkout popup.
10. Razorpay returns payment id, order id, and signature.
11. Frontend calls `POST /api/payment/verify`.
12. Backend verifies Razorpay signature.
13. Backend marks order as completed.
14. Backend clears Redis cart.
15. Frontend redirects user to order detail page.

## Location Flow

1. User clicks the navbar location button.
2. User can choose browser current location or enter a location manually.
3. Browser geolocation asks for permission.
4. Selected location is saved in `localStorage`.
5. Navbar displays the saved delivery location.

