# Image Background Remover — SPEC.md

## 1. Overview

- **Type**: Web application (Next.js full-stack)
- **Core Function**: Upload image → remove background via AI → download result
- **Target Users**: Anyone needing quick background removal without Photoshop

---

## 2. UI/UX

### Layout

- Header with title
- Upload button (centered, top)
- Drag & drop support
- Side-by-side preview: Original | Result
- Download button appears below result after processing

### Components

| Component | States |
|-----------|--------|
| Upload Button | Default, Hover, Active |
| Preview Boxes | Empty (placeholder), Loaded |
| Loader | Hidden, Active |
| Download Button | Hidden, Visible |
| Error Alert | Hidden, Visible |

### Constraints

- File types: JPG, PNG, WebP only
- Max file size: 10MB
- Result format: PNG (transparent background)

---

## 3. Architecture

### Frontend (`src/app/page.tsx`)

- Next.js 16 App Router component (Client)
- Fetches to `/api/remove-bg` (same origin)
- Shows original + result side-by-side with checkerboard bg for transparency
- Download via blob URL

### Backend (`src/app/api/remove-bg/route.ts`)

- Next.js Route Handler (App Router)
- Receives `multipart/form-data` with `image_file`
- Forwards to `https://api.remove.bg/v1.0/removebg`
- Returns PNG image buffer
- CORS: same-origin (no cross-origin issues)

### Config

- Environment variables in `.env.local`
- `REMOVE_BG_API_KEY`: remove.bg API key

---

## 4. API

### Endpoint

```
POST /api/remove-bg
Content-Type: multipart/form-data

Form field: image_file (image file)

Response: image/png
```

### Error Response

```json
{ "error": "error message" }
```

---

## 5. Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **Styling**: Tailwind CSS v4
- **Runtime**: Node.js / Vercel / Cloudflare Pages

---

## 6. File Structure

```
├── src/
│   └── app/
│       ├── api/
│       │   └── remove-bg/
│       │       └── route.ts    # API route
│       ├── globals.css         # Tailwind imports
│       ├── layout.tsx          # Root layout
│       └── page.tsx            # Main UI
├── .env.example
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── SPEC.md
└── PRD.md
```

---

## 7. License

MIT
