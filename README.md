# Wardrobe MVP

A personal wardrobe manager for two — built with Next.js, Tailwind CSS, and TypeScript. Add clothing items with photos, browse and filter your wardrobe, get rule-based outfit suggestions, and manage separate His & Hers profiles with shared items.

## Features

- **His & Hers profiles** — separate wardrobes with a one-click switcher in the nav; items can be shared between both profiles
- **Outfit generator** — rule-based scoring by occasion (casual, work, running, formal, wedding, etc.) and weather; strict filtering for sport/formal occasions
- **Cloudinary image upload** — photos stored on Cloudinary; drag to reframe which part of the image shows in thumbnails
- **Item quick-view** — click any item to see full details in a modal; drag the image to reframe the crop
- **Multiple occasions per item** — tag items with one or more occasions using chip toggles
- **CSV export / import** — back up and restore your wardrobe; merge by ID so no duplicates
- **LLM CSV skill** — prompt file (`WARDROBE_SKILL.md`) for generating wardrobe CSV from clothing photos using Claude or ChatGPT, including a catalog/order-sheet mode that crops individual items from a single image

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/speedofsound98/wardrobe-mvp.git
cd wardrobe-mvp

# 2. Install dependencies
npm install

# 3. Add your Cloudinary credentials
cp .env.example .env.local
# fill in CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment variables

Create a `.env.local` file in the project root:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get free credentials at [cloudinary.com](https://cloudinary.com) — the free tier is more than enough for personal use.

## Project structure

```
wardrobe-mvp/
│
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home dashboard
│   │   ├── wardrobe/          # Browse & filter items
│   │   ├── add/               # Add new item
│   │   ├── edit/[id]/         # Edit existing item
│   │   ├── outfit/            # Outfit generator
│   │   ├── outfits/           # Saved outfits
│   │   └── api/upload/        # Cloudinary upload endpoint
│   │
│   ├── components/
│   │   ├── Nav.tsx            # Sticky nav + profile switcher
│   │   ├── FilterBar.tsx
│   │   ├── ItemCard.tsx       # Compact card with shared badge
│   │   ├── ItemForm.tsx       # Add/edit form with occasion chips
│   │   ├── ItemModal.tsx      # Quick-view modal with drag-to-reframe
│   │   └── OutfitCard.tsx     # Outfit result with score + thumbnails
│   │
│   └── lib/
│       ├── types.ts           # WardrobeItem, OutfitResult, form types
│       ├── storage.ts         # localStorage CRUD, profile-scoped keys, shared pool
│       ├── outfitEngine.ts    # Rule-based outfit scoring (color, occasion, weather)
│       ├── profiles.ts        # His/Hers profile definitions
│       ├── useProfile.ts      # Profile hook (null-safe, hydration-safe)
│       └── csv.ts             # Export / import with occasions array support
│
├── WARDROBE_SKILL.md          # LLM prompt for generating wardrobe CSV from photos
├── .env.local                 # Cloudinary credentials (not committed)
├── package.json
└── tsconfig.json
```

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, `"use client"` components)
- [Tailwind CSS](https://tailwindcss.com)
- [Cloudinary](https://cloudinary.com) — image hosting
- [Lucide React](https://lucide.dev) — icons
- `localStorage` — item metadata persistence (profile-scoped keys)

## Using the LLM CSV skill

See [`WARDROBE_SKILL.md`](./WARDROBE_SKILL.md) for ready-to-use prompts to bulk-add items:

- **Mode 1** — send individual clothing photos; get one CSV row per item
- **Mode 2** — send a catalog or order screenshot; LLM identifies each item and outputs crop coordinates so you can extract photos per item
