# Von Der Becke Academy Corp - Multi-Program Platform

**Version:** 2.0 - Authentication System Complete  
**Status:** In Active Development  
**Last Updated:** November 11, 2025

---

## 🎯 Project Overview

Von Der Becke Academy Corp is a comprehensive platform that unifies multiple programs under one umbrella organization. Our mission: **Enabling social progress through the power of education, compassion, and innovation.**

### Core Programs
1. **Spirit Of** (`spiritof`) - Community impact and volunteer initiatives
2. **Fyght4** (`fyght4`) - Advocacy and support programs
3. **Taekwondo Academy** (`taekwondo`) - Martial arts training for all ages
4. **Edyens Gate** (`edyensgate`) - Online learning and educational resources

---

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 16.0.1 (App Router)
- **Styling:** Tailwind CSS 4.1.17 (CSS-first configuration with @layer directives)
- **Authentication:** Passwordless (Magic Links + PIN Codes with bcrypt encryption)
- **Database:** MongoDB Atlas with Mongoose ODM
- **Payment:** Stripe v19.3.0 (Checkout + Customer Management)
- **Email:** Resend API
- **Icons:** React Icons
- **Language:** JavaScript/TypeScript (hybrid)

### Current File Structure
```
vcorp/
├── app/
│   ├── layout.js                        # Root layout with Navigation & Footer
│   ├── page.js                          # Homepage with hero, programs grid, impact
│   ├── globals.css                      # Tailwind + custom neon color palette
│   ├── api/
│   │   ├── register/
│   │   │   └── route.js                 # User registration + Stripe customer
│   │   └── auth/
│   │       ├── signin/route.js          # Send magic link or PIN code
│   │       ├── verify/route.js          # Verify magic link token
│   │       ├── verify-pin/route.js      # Verify PIN code
│   │       └── signout/route.js         # Sign out endpoint
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.jsx           # Site-wide nav with Sign In
│   │   │   └── Footer.jsx               # Site-wide footer
│   │   ├── sections/
│   │   │   ├── HeroSection.jsx          # Reusable hero component
│   │   │   ├── ProgramsGrid.jsx         # 4-card program grid
│   │   │   ├── ImpactSection.jsx        # Impact stats & features
│   │   │   └── RegistrationTeaser.jsx   # CTA section
│   │   └── ui/
│   │       └── Button.jsx               # Reusable button with variants
│   ├── register/
│   │   └── page.tsx                     # Registration form with zip lookup
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx                 # Sign in with magic link or PIN
│   │   └── verify/
│   │       └── page.tsx                 # Email verification page
│   ├── programs/
│   │   ├── page.tsx                     # Programs overview
│   │   └── [slug]/
│   │       └── page.tsx                 # Dynamic program detail pages
│   └── user/
│       └── dashboard/
│           └── page.tsx                 # User dashboard
├── lib/
│   ├── db/
│   │   └── mongodb.js                   # MongoDB connection with caching
│   └── models/
│       └── User.js                      # Mongoose User schema
├── public/
│   └── [images]                         # Logo, hero images, program images
├── .env.local                           # Environment variables (not committed)
└── tailwind.config.js                   # Tailwind configuration
```

---

## 🔐 Authentication System

### Features Implemented
- **Passwordless Authentication:** No passwords to remember or manage
- **Dual Sign-In Methods:**
  1. **Magic Links:** 24-hour expiry, sent via email
  2. **PIN Codes:** 6-digit codes with 5-minute expiry, bcrypt encrypted
- **Rate Limiting:** 60-second cooldown between code requests
- **Email Verification:** Required before account activation
- **Session Management:** Ready for NextAuth v5 integration

### User Flow
1. **Registration** (`/register`)
   - Collect: name, email, phone, DOB, address
   - Automatic zip code lookup for city/state
   - Creates MongoDB user + Stripe customer
   - Sends verification email with magic link

2. **Sign In** (`/auth/signin`)
   - Choose magic link or PIN code
   - Magic link: Click link in email → instant sign-in
   - PIN code: Enter 6-digit code from email → verify → sign-in

3. **Dashboard** (`/user/dashboard`)
   - Welcome message with user's name
   - Sign out button
   - Settings link (to be implemented)

### Security Features
- PIN codes hashed with bcrypt (10 rounds)
- Tokens generated with crypto.randomBytes(32)
- Email verification required for account activation
- Expiry checks on all tokens/PINs
- Rate limiting on code requests

---

## 🎨 Visual & Brand Guidelines

### Neon Aesthetic Color Palette
**Primary Colors:**
- **Neon Cyan:** `#00F0FF` - Primary brand color, CTAs, links
- **Neon Pink:** `#FF006E` - Accent color, hover states
- **Neon Purple:** `#D092FF` - Secondary accent
- **Electric Blue:** `#0081C6` - Supporting blue

**Supporting Colors:**
- **Navy:** `#1A1A2E` - Dark backgrounds, cards
- **Deep Black:** `#0A0A0A` - Base background
- **White:** `#FFFFFF` - Text, contrasts
- **Light Grey:** `#B3B3B3` - Secondary text

**Tailwind Configuration:**
```javascript
colors: {
  'neon-cyan': '#00F0FF',
  'neon-pink': '#FF006E',
  'neon-purple': '#D092FF',
  'electric-blue': '#0081C6',
  'navy': '#1A1A2E',
  'deep-black': '#0A0A0A',
  'light-grey': '#B3B3B3',
}
```

---

## 📄 Page Specifications

### 1. Homepage (`/`)

#### Hero Section
- **Dimensions:** 1920×850px optimized image
- **Overlay:** Dark gradient with neon accent borders
- **Content:**
  - H1: "One Platform. Many Programs. Real Impact."
  - Subhead: "Join our family of programs: Taekwondo, Community Impact, Online Learning & more."
  - CTA: "Explore Programs" (smooth scroll to grid)

#### Programs Grid
- **Layout:** 2×2 or 1×4 responsive grid
- **Programs:**
  1. **Spirit Of** - "Making a difference, one community at a time"
  2. **Fyght4** - "Advocacy and support when you need it most"
  3. **Taekwondo Academy** - "Discipline. Respect. Excellence."
  4. **Edyens Gate** - "Learn anywhere, anytime"
- **Card Features:**
  - Program logo/icon
  - Short tagline (1 line)
  - "Learn More" link → `/programs/[slug]`
  - Neon glow border on hover

#### Impact Section
- **Icons + Text Blocks:**
  - 🏗️ Build Skills
  - 🤝 Join Community
  - 💝 Support Others
  - 💻 Flexible Online
- **Layout:** 4-column grid, icons with neon backgrounds

#### Featured Spotlight (Optional)
- Rotating banner highlighting one program
- "Featured This Month: [Program]"
- Image + CTA

#### Registration Teaser
- Short pitch: "Sign up today — identity verified, payment made easy"
- CTA: "Register Now" → `/register`

#### Impact Numbers
- Stats section:
  - "3,000+ Members"
  - "50+ Events per Year"
  - "4 Programs, 1 Mission"

#### Footer
- Contact info, social links
- Newsletter subscription
- Legal: Privacy Policy, Terms of Service, Financial Records
- Admin Login link (subtle)

---

### 2. Program Detail Pages (`/programs/[slug]`)

**Slug Values:** `taekwondo`, `spiritof`, `fyght4`, `edyensgate`

#### Structure for Each Program
1. **Hero Banner**
   - Program-specific image (class photo, event, branding)
   - Program logo overlay
   - Tagline

2. **About Section**
   - 2-3 paragraph introduction
   - Key features list

3. **Target Audience**
   - Who is this for? (Kids, adults, families, professionals)

4. **Pricing & Membership**
   - Membership tiers (if applicable)
   - Pricing table
   - "Join Now" CTA → `/register?program=[slug]`

5. **Identity Verification Info**
   - "We use Stripe Identity to keep our community safe"
   - Transparency about the process

6. **Upcoming Events / Schedule**
   - Calendar or list view
   - For taekwondo: class schedule
   - For spiritof: volunteer opportunities

7. **FAQ Section**
   - Collapsible accordion
   - 5-7 common questions

8. **Gallery / Video**
   - Photo grid or embedded video
   - Past events, testimonials

9. **Testimonials**
   - 2-3 quotes from members

10. **Secondary CTA**
    - "Ask a Question" button → contact form
    - "Download Info Packet" → PDF

---

### 3. Registration Flow (`/register`)

#### Features
- **Minimal Nav:** Simplified header, no distractions
- **URL Params:** `/register?program=taekwondo` pre-selects program
- **Progress Bar:** Step 1: Info | Step 2: Identity | Step 3: Payment | Step 4: Confirmation

#### Step 1: Basic Information
- Full name
- Email
- Phone
- Program selection (dropdown if not pre-selected)

#### Step 2: Identity Verification
- Integrate Stripe Identity
- Show "Why we verify" explanation
- Upload ID or use Stripe's verification flow

#### Step 3: Payment
- Use existing `CheckoutForm` component
- Show summary: Program name, price, start date
- Stripe payment element

#### Step 4: Confirmation
- Thank you message
- Next steps (e.g., "Check your email", "Join our Discord", etc.)
- Redirect to program page after 5 seconds

---

### 4. Admin Portal (`/admin`)

#### Login Page (`/admin/login`)
- Simple email/password form
- Link in footer: "Admin Login" (small, unobtrusive)

#### Dashboard (`/admin/dashboard`)
- **Metrics:**
  - Total registrations
  - Revenue per program
  - Recent signups
- **Tables:**
  - All members (filterable by program)
  - Payment records
  - Export to CSV

**Note:** Not MVP, can be Phase 2

---

## 🚀 Implementation Status

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Next.js 16 setup with App Router
- [x] Tailwind CSS 4.1.17 installed and configured
- [x] MongoDB Atlas connection with Mongoose
- [x] Base component library (Button, Navigation, Footer)
- [x] Custom neon color palette

### ✅ Phase 2: Authentication System (COMPLETE)
- [x] User registration with demographics and address
- [x] Stripe customer creation on registration
- [x] Email verification with magic links
- [x] Passwordless sign-in (magic links + PIN codes)
- [x] PIN code encryption with bcrypt
- [x] Rate limiting (60-second cooldown)
- [x] User dashboard with sign-out
- [x] Resend email integration

### ✅ Phase 3: Homepage & Programs (COMPLETE)
- [x] Modern homepage with hero section
- [x] Programs grid with 4 program cards
- [x] Impact section with statistics
- [x] Registration teaser with CTA
- [x] Program detail pages (`/programs/[slug]`)
- [x] Programs overview page
- [x] Responsive navigation with mobile menu

### 🚧 Phase 4: User Management (IN PROGRESS)
- [x] User dashboard page
- [ ] User settings page
- [ ] Profile editing
- [ ] Program enrollment display
- [ ] Session management with NextAuth v5

### 📋 Phase 5: Payment Integration (PENDING)
- [ ] Stripe payment flow for program tiers
- [ ] Subscription management
- [ ] Webhook handling for payment events
- [ ] Invoice generation
- [ ] Payment history in dashboard

### 📋 Phase 6: Identity Verification (PENDING)
- [ ] Stripe Identity integration
- [ ] ID verification flow
- [ ] Verification status in dashboard
- [ ] Admin verification oversight

### 📋 Phase 7: Admin Portal (PENDING)
- [ ] Admin authentication
- [ ] Admin dashboard with metrics
- [ ] User management interface
- [ ] Payment records view
- [ ] Export functionality

### 📋 Phase 8: Polish & Launch (PENDING)
- [ ] Performance optimization
- [ ] SEO metadata for all pages
- [ ] Full mobile responsiveness testing
- [ ] Accessibility audit (WCAG AA)
- [ ] Production deployment to Vercel

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📦 Installed Dependencies

### Core Framework
```json
{
  "next": "^16.0.1",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

### Styling
```json
{
  "tailwindcss": "^4.1.17"
}
```

### Database & Authentication
```json
{
  "mongoose": "^8.9.0",
  "bcryptjs": "^2.4.3"
}
```

### Payment Processing
```json
{
  "stripe": "^19.3.0",
  "@stripe/react-stripe-js": "^5.3.0",
  "@stripe/stripe-js": "^8.4.0"
}
```

### Email Service
```json
{
  "resend": "^4.0.1"
}
```

### UI & Icons
```json
{
  "react-icons": "^5.4.0"
}
```

---

## 🎯 Design Assets Needed

### Hero Images (1920×850)
- [ ] Homepage hero (diverse group, vibrant)
- [ ] Taekwondo class in action
- [ ] Community volunteers (Spirit Of)
- [ ] Advocacy event (Fyght4)
- [ ] Online learning (Edyens Gate)

### Program Logos/Icons
- [ ] Spirit Of logo
- [ ] Fyght4 logo
- [ ] Taekwondo emblem
- [ ] Edyens Gate logo

### Icon Set
- Use React Icons or Heroicons
- Ensure neon color application in JSX

---

## 🔐 Environment Variables

Create `.env.local` in root (not committed to git):
```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=vacorp@fyht4.com

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# NextAuth (Future)
# NEXTAUTH_SECRET=your-secret-key
# NEXTAUTH_URL=http://localhost:3000
```

---

## 📊 Database Schema

### User Model (`lib/models/User.js`)
```javascript
{
  // Basic Information
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, lowercase),
  phone: String (required),
  dateOfBirth: Date (required),
  
  // Address
  address: {
    street: String (required),
    city: String (required),
    state: String (required, 2 chars),
    zipCode: String (required, 5 digits)
  },
  
  // Authentication
  emailVerified: Date,
  verificationToken: String,
  verificationTokenExpiry: Date (24 hours),
  pinCode: String (bcrypt hashed),
  pinCodeExpiry: Date (5 minutes),
  
  // Stripe Integration
  stripeCustomerId: String (unique),
  
  // Programs
  programs: [{
    programId: String (spiritof|fyght4|taekwondo|edyensgate),
    tier: String,
    enrolledAt: Date,
    status: String (active|inactive|suspended),
    programData: Mixed
  }],
  
  // Account Status
  accountStatus: String (pending|active|inactive|suspended),
  identityVerified: Boolean,
  lastLogin: Date,
  profileCompleteness: Number (0-100),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📱 Responsive Breakpoints

Using Tailwind defaults:
- `sm`: 640px
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px
- `2xl`: 1536px

**Mobile-First Approach:**
- Stack cards vertically on mobile
- Single-column layout for program details
- Hamburger menu for navigation

---

## ♿ Accessibility Checklist

- [ ] All images have `alt` text
- [ ] Color contrast meets WCAG AA (neon on dark can be tricky)
- [ ] Keyboard navigation works
- [ ] Focus states visible (neon glow)
- [ ] Form labels properly associated
- [ ] ARIA labels for icon buttons

---

## 🧪 Testing Strategy

### Manual Testing
- Cross-browser (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS Safari, Chrome Mobile)
- Screen reader testing

### Automated (Future)
- Jest + React Testing Library for components
- Playwright for E2E registration flow
- Lighthouse CI for performance

---

## 📝 Content Guidelines

### Tone of Voice
- **Empowering:** "Join us in making a difference"
- **Inclusive:** "Programs for everyone"
- **Professional yet Approachable:** Avoid jargon, use clear language
- **Action-Oriented:** Strong CTAs ("Explore", "Join", "Register")

### Copy Length
- **Headlines:** 5-10 words max
- **Taglines:** 1 sentence
- **Body paragraphs:** 3-5 sentences
- **CTAs:** 2-3 words ("Get Started", "Learn More", "Join Now")

---

## 🚧 Known Issues & Technical Debt

### Completed Cleanup
- ✅ Removed old donation system (donate folder, CheckoutForm, DonateForm)
- ✅ Removed duplicate navigation and footer components
- ✅ Consolidated /projects to /programs routing
- ✅ Fixed hydration errors (Navigation/Footer now only in root layout)
- ✅ Removed debug console.logs from production API routes

### Current State
- ✅ Tailwind CSS 4.1.17 installed and configured
- ✅ MongoDB Atlas connected with Mongoose
- ✅ Authentication system complete and secure
- ✅ Email service (Resend) integrated
- ✅ Stripe customer creation on registration

### To Address
1. Implement NextAuth v5 for session management
2. Build user settings page with profile editing
3. Add Stripe payment flow for program enrollments
4. Implement Stripe Identity for verification
5. Build admin portal for user/payment management
6. Add form validation library (Zod or Yup)
7. Implement loading states for all async operations
8. Add error boundary components
9. Full accessibility audit (WCAG AA compliance)
10. SEO optimization (meta tags, Open Graph, structured data)

---

## 🤝 Collaboration Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/homepage-redesign

# Regular commits
git commit -m "feat: add hero section with neon gradient"

# Push to GitHub
git push origin feature/homepage-redesign

# Create PR for review
```

### Commit Message Format
- `feat:` New feature
- `fix:` Bug fix
- `style:` Formatting, CSS changes
- `refactor:` Code restructure
- `docs:` Documentation updates
- `chore:` Dependency updates, config

---

## 📚 Resources & References

### Design Inspiration
- [Stripe Checkout](https://stripe.com/checkout) - Payment UX
- [Discord](https://discord.com) - Neon aesthetic
- [Linear](https://linear.app) - Modern SaaS design
- [Dribbble "neon UI"](https://dribbble.com/search/neon-ui)

### Technical Docs
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Stripe Identity](https://stripe.com/docs/identity)
- [React Hook Form](https://react-hook-form.com)

---

## ✅ Recent Updates (November 11, 2025)

### Authentication System
- Implemented passwordless authentication with magic links and PIN codes
- Added bcrypt encryption for PIN codes (10 rounds)
- Built 60-second rate limiting to prevent code spam
- Created user dashboard with sign-out functionality
- Integrated Resend email service with verified domain

### Code Cleanup
- Removed all old donation system files
- Consolidated Navigation and Footer to root layout only
- Fixed hydration errors
- Removed debug console.logs from production code
- Cleaned up unused imports and components

### Database & Backend
- Connected MongoDB Atlas cluster (vcorp-cluster)
- Created complete User model with Mongoose
- Implemented secure token generation with crypto
- Added automatic Stripe customer creation on registration
- Built RESTful API routes for auth flow

---

## 📞 Support & Contact

**Project Lead:** teamvcorp  
**Repository:** github.com/teamvcorp/vcorp  
**Questions?** Open a GitHub issue or contact admin

---

## ✅ Next Immediate Actions

1. **Install NextAuth v5** - Implement proper session management
2. **Build Settings Page** - `/user/settings` with profile editing
3. **Stripe Payment Flow** - Add payment for program tiers and subscriptions
4. **Stripe Identity** - Implement ID verification for safety
5. **Admin Portal** - Build admin dashboard for oversight
6. **Mobile Testing** - Comprehensive responsive design testing
7. **Production Deploy** - Set up Vercel deployment with environment variables

---

**Let's continue building something amazing!** 🚀
