# 🌿 Vita — Your Everyday Health Companion

Vita is a friendly, knowledgeable AI health advisor. It listens to everyday
health concerns, provides general evidence-based information, suggests
lifestyle adjustments, and always points you toward credible resources and
professional help when needed.

> **Vita is not a doctor.** It provides general health information only and is
> not a substitute for professional medical advice. In an emergency, call 911.

## ✨ Features

- 💬 Real-time streaming chat (Server-Sent Events) powered by **Groq**
- 🩺 Warm, empathetic health guidance with built-in safety guardrails
- 🚨 Emergency-aware: redirects urgent symptoms to 911 / emergency care
- 📚 Cites credible sources (CDC, Mayo Clinic, MedlinePlus, NIH, WHO)
- 🎨 Calming "wellness journal" UI — sage greens, warm off-whites, serif accents
- 📱 Responsive: collapsible sidebar on mobile
- ⚡ Markdown rendering, typing indicator, quick-start topic chips

## 🧱 Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18 + Vite, Tailwind CSS v3, lucide-react, react-markdown |
| Backend  | Node.js + Express, SSE streaming |
| AI       | Groq (`llama-3.3-70b-versatile`) via the OpenAI-compatible SDK |

## 🚀 Quick Start

### 1. Add your Groq API key

Open `server/.env` and replace the placeholder:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

Get a **free** key at <https://console.groq.com>.

### 2. Run the two servers

**Terminal 1 — backend:**

```bash
cd server
node index.js
```

**Terminal 2 — frontend:**

```bash
cd client
npm run dev
```

Then open <http://localhost:5173>.

> The Vite dev server proxies `/api` → `http://localhost:3001`, so no extra
> CORS configuration is needed during local development.

## 📂 Project Structure

```
health-advisor/
├── server/          # Express + Groq streaming backend
│   ├── index.js
│   ├── .env         # your key goes here (git-ignored)
│   └── .env.example
└── client/          # React + Vite frontend
    └── src/
        ├── App.jsx
        └── components/
```

## ⚙️ Environment Variables (`server/.env`)

| Key                  | Required | Description |
|----------------------|----------|-------------|
| `GROQ_API_KEY`       | ✅       | Your Groq API key |
| `PORT`               | ❌       | Backend port (default `3001`) |
| `RATE_LIMIT_PER_MIN` | ❌       | Requests/min per IP (default `15`) |
| `PORTFOLIO_ORIGIN`   | ❌       | Allowed CORS origin for production |

## ☁️ Deploying to DigitalOcean (later)

On your droplet, edit `/var/www/health-advisor/server/.env` and set:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
PORTFOLIO_ORIGIN=https://yourdomain.com
```

Build the frontend with `npm run build` (in `client/`) and serve the `dist/`
folder behind your web server / reverse proxy, pointing `/api` at the Node
backend.

> ⚠️ **Never commit `.env` to GitHub** — it is already git-ignored.

## ⚖️ Disclaimer

Vita provides general health information for educational purposes only. It does
not diagnose conditions, prescribe treatments, or replace consultation with a
licensed healthcare professional. Always seek the advice of a qualified
provider with any questions regarding a medical condition. **In an emergency,
call 911 immediately.**
