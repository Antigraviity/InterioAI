# InterioAI — AI Interior Design SaaS

> Transform empty rooms into stunning interiors using AI. Pinterest-inspired UI built for interior design companies.

---

## Features

- Pinterest-style masonry UI with hover overlays and pill navigation
- AI generation via Replicate (Stable Diffusion) or OpenAI DALL-E 3
- 8 design styles: Modern, Minimalist, Scandinavian, Industrial, Luxury, Traditional, Bohemian, Japandi
- Auto Mode: generates 5 style variations automatically
- Before/After comparison slider
- Inspiration feed with curated gallery and category filters
- Drag-and-drop image upload with instant preview
- Download any generated design
- Mobile responsive

---

## Quick Start

### Prerequisites
- Node.js 18+

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Run development server
```bash
npm run dev
# Open http://localhost:3000
```

> The app runs in Demo Mode without API keys — uploads work, generation returns placeholder images.

---

## API Keys

### AI Generation (pick one)

**Replicate (Stable Diffusion — Recommended)**
1. Sign up at replicate.com
2. Get API key from Settings
3. Set: `REPLICATE_API_KEY=r8_xxxx`

**OpenAI DALL-E 3**
1. Sign up at platform.openai.com
2. Create API key
3. Set: `OPENAI_API_KEY=sk-xxxx`

### Cloud Storage (Optional)

**Cloudinary**
```
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=secret
```

### Database (Optional — user history)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/interiorai
```

---

## Project Structure

```
interior-ai/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main app page (state hub)
│   ├── globals.css             # Pinterest-inspired design system
│   └── api/generate/route.ts  # AI generation API endpoint
├── components/
│   ├── Navbar.tsx              # Sticky navbar with search
│   ├── HeroSection.tsx         # Landing hero text
│   ├── UploadSection.tsx       # Drag & drop upload
│   ├── StyleSelector.tsx       # 8 style cards with color swatches
│   ├── GenerateControls.tsx    # Mode, room type, custom prompt
│   ├── ResultsGallery.tsx      # Masonry grid of results
│   ├── InspirationFeed.tsx     # Curated inspiration masonry
│   ├── ComparisonSlider.tsx    # Before/After drag slider
│   └── Toast.tsx               # Notifications
├── lib/utils.ts
├── .env.example
└── README.md
```

---

## Deployment on Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add all environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

---

## Extending for SaaS

### Add Authentication (NextAuth)
```bash
npm install next-auth
```

### Add Database (Prisma)
```bash
npm install prisma @prisma/client
npx prisma init
```

### Add Cloudinary Storage
```bash
npm install cloudinary
```

---

## Suggested Pricing Tiers

| Plan | Generations/mo | Price |
|------|---------------|-------|
| Starter | 50 | $29/mo |
| Pro | 200 | $79/mo |
| Agency | Unlimited | $199/mo |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Custom CSS variables
- **Icons:** Lucide React
- **AI:** Replicate API or OpenAI DALL-E 3
- **Deploy:** Vercel
