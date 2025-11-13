# ASYLEN VENTURES - Real Estate Platform

A production-ready Next.js 14+ full-stack real estate platform built with TypeScript, Tailwind CSS, and Prisma.

## 🚀 Phase 1: Project Initialization & Setup ✅

This project has been initialized with all core dependencies and folder structure for the ASYLEN VENTURES real estate platform.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 4 with custom theme
- **Database ORM**: Prisma
- **Authentication**: NextAuth v5
- **Form Handling**: React Hook Form + Zod
- **State Management**: Zustand
- **UI Components**: Custom components + Radix UI primitives
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 🎨 Branding Colors

- **Primary**: #0A2463 (Navy Blue)
- **Secondary**: #D4AF37 (Gold)
- **Accent**: #247BA0 (Light Blue)
- **Background**: #F8F9FA (Light Gray)

## 📁 Project Structure

```
app/
├── (auth)/              # Authentication pages
│   ├── signin/
│   ├── signup/
│   └── layout.tsx
├── (dashboard)/         # User dashboard
│   ├── dashboard/
│   └── layout.tsx
├── (admin)/            # Admin panel
│   ├── admin/
│   └── layout.tsx
├── properties/         # Property listings
│   ├── [id]/          # Dynamic property detail
│   └── page.tsx
├── api/               # API routes
├── layout.tsx         # Root layout
├── page.tsx          # Homepage
└── globals.css       # Global styles

components/
├── ui/               # Reusable UI components
├── layout/          # Layout components (Header, Footer, Sidebar)
├── cards/           # Card components (PropertyCard, etc.)
└── forms/          # Form components

lib/
├── utils.ts        # Utility functions
├── types.ts        # TypeScript types & interfaces
└── prisma.ts      # Prisma client singleton

prisma/
├── schema.prisma  # Database schema
└── seed.js       # Database seeding script

public/
├── images/       # Image assets
└── icons/       # Icon assets
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push          # Push schema changes to database
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with initial data
npm run db:generate      # Generate Prisma Client

# Code Quality
npm run lint             # Run ESLint

# Deployment
npm run deploy:preview      # Deploy to Vercel preview
npm run deploy:production   # Deploy to Vercel production
```

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

3. **Set Up Database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth
- `NEXTAUTH_URL` - Application URL
- `CLOUDINARY_*` - Cloudinary credentials for image uploads
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_ID` & `GITHUB_SECRET` - GitHub OAuth (optional)

## 📊 Database Schema

The Prisma schema includes:
- **User**: User accounts with role-based access (ADMIN, AGENT, USER)
- **Account**: OAuth provider accounts
- **Property**: Real estate listings with full details

## 🎨 Custom Tailwind Theme

Custom color palette configured:
- Primary colors (Navy Blue variations)
- Secondary colors (Gold variations)
- Accent colors (Light Blue variations)
- Dark mode support ready

## 🔒 Type Safety

- TypeScript strict mode enabled
- Comprehensive type definitions in `lib/types.ts`
- Prisma-generated types for database models

## 🧩 Component Library

Base components created:
- **UI**: Button (with variants)
- **Layout**: Header, Footer, Sidebar
- **Cards**: PropertyCard
- **Forms**: LoginForm

## 📱 Pages Implemented

### Public Pages
- Homepage with hero section and features
- Properties listing page with filters
- Property detail page
- Sign in / Sign up pages

### Protected Pages
- User dashboard
- Admin dashboard

## 🔄 Next Steps (Future Phases)

- [ ] Implement authentication with NextAuth
- [ ] Add property CRUD operations
- [ ] Implement file upload with Cloudinary
- [ ] Add Google Maps integration
- [ ] Build advanced search and filters
- [ ] Implement user profile management
- [ ] Add messaging system
- [ ] Create admin panel features
- [ ] Add analytics and reporting

## 📄 License

Private - ASYLEN VENTURES

## 🤝 Contributing

This is a private project. Contact the project owner for contribution guidelines.

---

**Built with ❤️ for ASYLEN VENTURES**
