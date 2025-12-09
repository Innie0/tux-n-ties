# Tux N Ties - Full-Stack Tuxedo Store

A modern, full-stack e-commerce website for a tuxedo rental and sales store built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Homepage**: Showcases tuxedo styles and branding
- **Inventory Page**: Browse all tuxedos with search and filtering
- **Product Detail Pages**: View photos, sizes, colors, and pricing for each tuxedo
- **Rent/Buy Options**: Customers can choose to rent or purchase tuxedos
- **Booking System**: Schedule appointments for fittings
- **Shopping Cart**: Add items to cart and manage selections
- **Checkout Flow**: Complete purchase with shipping and payment information
- **Admin Dashboard**: Manage inventory and bookings
- **Mobile Responsive**: Fully responsive design for all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma)
- **ORM**: Prisma

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard
│   ├── bookings/         # Booking page
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── inventory/        # Product listing
│   ├── product/          # Product detail pages
│   └── page.tsx          # Homepage
├── components/           # Reusable components
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## Database Schema

The application uses Prisma with SQLite and includes models for:
- Users (customers and admins)
- Products (tuxedos)
- Cart Items
- Bookings
- Orders
- Order Items

## Features in Detail

### Admin Dashboard
- Add, edit, and delete products
- Manage booking statuses
- View all bookings and orders

### Shopping Experience
- Browse products by category
- Search functionality
- Detailed product pages with image galleries
- Size and color selection
- Rent or buy options
- Shopping cart persistence (localStorage)

### Booking System
- Schedule fitting appointments
- Select date and time
- Add special requests/notes
- Admin can manage booking statuses

## Development

To add sample data, you can use the admin dashboard to create products, or seed the database directly.

## License

MIT

