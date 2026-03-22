# Image Background Remover — SPEC.md

## 1. Overview

- **Type**: Web tool (single page + serverless worker)
- **Core Function**: Upload image → remove background via AI → download result
- **Target Users**: Anyone needing quick background removal without Photoshop

---

## 2. UI/UX

### Layout

- Header with title
- Upload button (centered, top)
- Side-by-side preview: Original | Result
- Download button appears below result after processing

### Components

| Component | States |
|-----------|--------|
| Upload Button | Default, Hover |
| Preview Boxes | Empty (placeholder), Loaded |
| Loader | Hidden, Active |
| Download Button | Hidden, Visible |
| Error Message | Hidden, Visible |

### Constraints

- File types: JPG, PNG, WebP only
- Max file size: 10MB
- Result format: PNG (transparent background)

---

## 3. Architecture

### Frontend (`index.html`)

- Pure HTML/CSS/JS, no framework
- Fetches to Cloudflare Worker
- Shows original + result side-by-side
- Download via blob URL

### Backend (`worker/index.js`)

- Cloudflare Worker (ES Module format)
- Receives `multipart/form-data` with `image_file`
- Forwards to `https://api.remove.bg/v1.0/removebg`
- Returns PNG image buffer
- CORS headers for cross-origin requests

### Config (`wrangler.toml`)

- Worker name: `image-bg-remover`
- Secrets: `REMOVE_BG_API_KEY` (via `wrangler secret put`)

---

## 4. API

### Worker Endpoint

```
POST /
Content-Type: multipart/form-data

Form field: image_file (image file)

Response: image/png
```

### Error Response

```json
{ "error": "error message" }
```

---

## 5. Future Expansions (v2)

- [ ] Batch processing
- [ ] History (Cloudflare R2)
- [ ] Custom model (rembg) for zero API cost
- [ ] Additional output formats (JPG with white bg)
- [ ] API key usage tracking

---

## 6. License

MIT
