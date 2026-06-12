# Wardrobe MVP

A personal wardrobe manager built with Next.js, Tailwind CSS, and TypeScript. Add clothing items, browse your wardrobe, and get rule-based outfit suggestions.

## Setup

```bash
# 1. Clone the repo and enter the project directory
git clone https://github.com/speedofsound98/wardrobe-mvp.git
cd wardrobe-mvp

# 2. Install dependencies
npm install

# 3. Add your Cloudinary credentials
cp .env.example .env.local
# then fill in CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

# 4. Start the development server
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

Images are uploaded to Cloudinary and stored by URL. Item metadata is persisted in `localStorage`.

## Project structure

```
wardrobe-mvp/
│
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home dashboard
│   │   ├── wardrobe/         # Browse & filter items
│   │   ├── add/              # Add new item
│   │   ├── edit/[id]/        # Edit existing item
│   │   ├── outfit/           # Outfit generator
│   │   └── api/upload/       # Cloudinary upload endpoint
│   │
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── FilterBar.tsx
│   │   ├── ItemCard.tsx
│   │   ├── ItemForm.tsx
│   │   └── OutfitCard.tsx
│   │
│   └── lib/
│       ├── types.ts          # Shared TypeScript types
│       ├── storage.ts        # localStorage CRUD + constants
│       └── outfitEngine.ts   # Rule-based outfit scoring
│
├── .env.local                # Cloudinary credentials (not committed)
├── package.json
└── tsconfig.json
```

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Cloudinary](https://cloudinary.com) — image storage
- [Lucide React](https://lucide.dev) — icons
- `localStorage` — item metadata persistence
