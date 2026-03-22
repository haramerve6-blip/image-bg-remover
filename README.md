# Image Background Remover

Remove background from images using AI. Simple web interface + Cloudflare Worker proxy.

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS
- **Backend**: Cloudflare Worker (remove.bg API proxy)
- **API**: remove.bg

## Setup

### 1. Get remove.bg API Key

Sign up at https://www.remove.bg/api and get your free API key (50 calls/month free).

### 2. Deploy Cloudflare Worker

```bash
cd worker
npm init -y
npm install wrangler
npx wrangler secret put REMOVE_BG_API_KEY
# Enter your remove.bg API key when prompted
npx wrangler deploy
```

### 3. Update Frontend

Edit `index.html` and replace `WORKER_URL` with your Worker URL:

```javascript
const WORKER_URL = 'https://your-worker-url.workers.dev';
```

### 4. Deploy Frontend

Host `index.html` on any static hosting (Cloudflare Pages, Vercel, Netlify, etc.).

## Usage

1. Open the page
2. Click "Choose Image" and select a JPG/PNG/WebP
3. Wait for processing
4. Click "Download PNG" to save the result

## Local Dev

### Worker

```bash
cd worker
npx wrangler dev
```

### Frontend

Just open `index.html` in a browser, or use a local server:

```bash
python3 -m http.server 8000
```

## License

MIT
