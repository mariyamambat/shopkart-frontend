# ShopKart

A full-stack e-commerce app built with the MERN stack. Browse products, save a wishlist, manage a cart, pay with Razorpay in test mode, and view your orders.

## Features

- Register and log in with JWT authentication in an httpOnly cookie
- Browse products with search, category filtering, and price sorting
- Save products to a wishlist
- Manage a shopping cart with stock limits and a live cart count
- Check out with shipping address validation
- Pay with Razorpay and server-side payment signature verification
- View order confirmations and order history

## Tech stack

React 19, Vite, React Router, Axios, Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt, and Razorpay.

## Getting started

Requires Node.js 20.19+ or 22.12+ (Vite 8), a MongoDB Atlas database, and a Razorpay account with test mode enabled.

```sh
git clone https://github.com/ZairaAk/shopkart.git
cd shopkart
```

### Backend

```sh
cd backend
npm install
```

Create `backend/.env` with your local configuration:

```dotenv
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
```

Start the backend:

```sh
npm run dev
```

### Frontend

In a second terminal, from the repository root:

```sh
cd shopkart-frontend
npm install
npm run dev
```

Open [http://localhost:5173/login](http://localhost:5173/login).

## Test payments

Use Razorpay test mode. At checkout, use the UPI ID `success@razorpay`, or choose a Netbanking or Wallet option and complete the test payment.

## API

The backend runs on `http://localhost:3000`. All endpoints except customer registration, login, and product endpoints require authentication.

| Area | Method | Endpoint | Description |
| --- | --- | --- | --- |
| Customers | `POST` | `/customers/register` | Register a customer |
| Customers | `POST` | `/customers/login` | Log in |
| Customers | `POST` | `/customers/logout` | Log out |
| Customers | `GET` | `/customers/me` | Get the current customer profile |
| Products | `GET` | `/products` | List products |
| Products | `GET` | `/products/:id` | Get a product |
| Products | `POST` | `/products` | Create a product |
| Wishlist | `GET` | `/wishlist` | Get the current customer's wishlist |
| Wishlist | `POST` | `/wishlist/:productId` | Add a product to the wishlist |
| Wishlist | `DELETE` | `/wishlist/:productId` | Remove a product from the wishlist |
| Cart | `GET` | `/cart` | Get the current customer's cart |
| Cart | `POST` | `/cart/:productId` | Add a product to the cart |
| Cart | `PATCH` | `/cart/:productId` | Update a cart item's quantity |
| Cart | `DELETE` | `/cart/:productId` | Remove a cart item |
| Orders | `POST` | `/orders/create-payment-order` | Create a payment order |
| Orders | `POST` | `/orders/verify-payment` | Verify a payment |
| Orders | `GET` | `/orders` | List the current customer's orders |
| Orders | `GET` | `/orders/:id` | Get an order |

## Project structure

```text
backend/
  controllers/
  models/
  routes/
  middlewares/
  utils/
  index.js
shopkart-frontend/
  src/
    components/
    context/
    pages/
    services/
```
