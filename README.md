# M.C Diamondz Fashion Emporium

A modern, responsive e-commerce platform built with Next.js, React, Tailwind CSS, and Prisma.

## Features

- 🛍️ Product catalog with categories and search
- 🛒 Shopping cart with persistent storage
- 🔐 User authentication (JWT + OAuth)
- 💳 Multiple payment gateways (Stripe, PayPal, Flutterwave)
- 📱 Responsive design for all devices
- ⚡ Fast performance with Next.js
- 🔄 Real-time inventory management
- 📊 Admin dashboard
- 📦 Order tracking system

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma, PostgreSQL
- **Authentication**: NextAuth.js (JWT + OAuth)
- **Payments**: Stripe, PayPal, Flutterwave
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mista-Val/mc-diamondz.git 
   cd mc-diamondz
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your configuration.

4. **Set up the database**
   - Create a new PostgreSQL database
   - Update the `DATABASE_URL` in your `.env.local` file
   - Run database migrations:
     ```bash
     npx prisma migrate dev --name init
     ```
   - Seed the database with sample data (optional):
     ```bash
     npx prisma db seed
     ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── app/                    # App router pages and layouts
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin dashboard
│   └── ...
│
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── layout/           # Layout components
│   └── ...
│
├── lib/                   # Utility functions and libraries
│   ├── api/              # API client and utilities
│   ├── auth/             # Authentication utilities
│   └── db/               # Database utilities
│
├── prisma/               # Database schema and migrations
├── public/               # Static files
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Available Scripts

- `dev` - Start the development server
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run ESLint
- `typecheck` - Check TypeScript types
- `format` - Format code with Prettier
- `test` - Run tests
- `prisma:generate` - Generate Prisma Client
- `prisma:migrate` - Run database migrations
- `prisma:studio` - Open Prisma Studio

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mc_diamondz?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# PayPal
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""
PAYPAL_ENVIRONMENT="sandbox"

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=""
FLUTTERWAVE_SECRET_KEY=""
FLUTTERWAVE_ENCRYPTION_KEY=""
FLUTTERWAVE_WEBHOOK_HASH=""

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_BUCKET_NAME=""

# Email (using SendGrid)
SENDGRID_API_KEY=""
EMAIL_FROM="noreply@mcdiamondz.com"
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## Support

For support, email support@mcdiamondz.com or open an issue in the GitHub repository.

## Admin Dashboard

### Features

- **Categories Management**
  - Create, read, update, and delete categories
  - Nested categories with breadcrumb navigation
  - Category status and featured flags
  - Category products listing

- **Products Management**
  - CRUD operations for products
  - Product categorization
  - Image uploads
  - Inventory tracking

- **UI Components**
  - Reusable UI components built with Radix UI
  - Responsive design
  - Dark mode support
  - Form validation with React Hook Form

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (or your preferred database)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mc-diamondz.git
   cd mc-diamondz
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Project Structure

```
.
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types
- `npm run format` - Format code with Prettier

### Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type checking
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation
- [Prisma](https://www.prisma.io/) - Database ORM
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Lucide Icons](https://lucide.dev/) - Icons

### License

MIT
