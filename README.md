# Image Background Remover

Remove background from images using AI. Built with Next.js + Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS v4
- **Backend**: Next.js API Route (Route Handler)
- **API**: remove.bg

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get remove.bg API Key

Sign up at https://www.remove.bg/api and get your free API key (50 calls/month free).

### 3. Configure environment

Copy `.env.example` to `.env.local` and add your API key:

```bash
cp .env.example .env.local
# Edit .env.local and add your REMOVE_BG_API_KEY
```

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

### 5. Build for production

```bash
npm run build
npm start
```

## Deploy

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set `REMOVE_BG_API_KEY` in Vercel dashboard → Settings → Environment Variables.

### Cloudflare Pages

Connect your GitHub repo to Cloudflare Pages. Set environment variable `REMOVE_BG_API_KEY` in the Pages dashboard.

## Usage

1. Open the page
2. Click "Choose Image" or drag & drop a JPG/PNG/WebP
3. Wait for processing
4. Click "Download PNG" to save the result

## License

MIT
