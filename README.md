# CortanaX OS — Nikhil Dhakad's AI Portfolio

## 🧠 Connect the real AI brain (Gemini — free)

CortanaX's chat is now powered by Google Gemini, kept secret via a Vercel serverless function.

### Step 0 — Get a free API key
1. Go to https://aistudio.google.com
2. Sign in with Google → click **"Get API Key"** → **"Create API key in new project"**
3. Copy the key (starts with `AIza...`). Never commit this to GitHub, never paste it in code directly.

### Step 1 — Push this project to GitHub
```bash
cd cortanax-os
git init
git add .
git commit -m "CortanaX OS"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Deploy to Vercel
1. Go to https://vercel.com → sign in with GitHub → **New Project** → import your repo
2. Before clicking Deploy, open **Environment Variables**
3. Add: `GEMINI_API_KEY` = *(paste your key here)*
4. Click **Deploy**

That's it — CortanaX now has a real AI brain (general knowledge, movies, comics, conversation) AND knows Nikhil's real data (projects, skills, experience) because it's fed into the system prompt in `api/chat.js`.

### Local testing (optional)
Opening `index.html` directly (double-click) won't have the API — the chat will silently fall back to the old offline rule-based replies, so the site never breaks. To test the real API locally, install Vercel CLI (`npm i -g vercel`) and run `vercel dev` from the project folder with a `.env` file containing `GEMINI_API_KEY=your_key`.

---

## 🚀 How to add a new project (auto-updates the live site)

1. Open `js/data.js`
2. Find the `projects: [ ... ]` array
3. Add a new object, e.g.:

```js
{
  id: "my-new-project",
  name: "Project Name",
  subtitle: "One-line subtitle",
  description: "2-3 sentence description of what it does.",
  flagship: false,
  tech: ["Python", "React", "..."],
  features: ["Feature 1", "Feature 2"],
  github: "https://github.com/you/repo",
  demo: "https://your-demo-link.com",
  image: null
}
```
4. Save, commit, and push to GitHub — Vercel auto-redeploys in ~30 seconds.

Same pattern works for `skills`, `certificates`, and `experience` arrays.

## 📁 Structure
```
cortanax-os/
├── index.html      → all page structure/sections
├── css/style.css    → CortanaX OS visual theme
├── js/data.js       → ALL real content (edit this to update site)
├── js/main.js       → boot sequence, animations, rendering, chat logic
├── api/chat.js      → serverless function — talks to Gemini securely
└── assets/          → profile photo, resume PDF
```

## ✅ Built so far (Sprint 1 + 2 + 3 + 4)
- Boot sequence, Home Dashboard, About, Skills, Projects, Resume, Certificates, Contact
- GitHub Live Analytics (real API data: repos, stars, languages, contribution graph)
- Terminal (help/about/skills/projects/resume/contact/certs/achievements/clear)
- AI Assistant — real Gemini-powered chat with offline fallback
- Real resume PDF wired up (`assets/Nikhil_Dhakad_Resume.pdf`)
- **Voice input** — mic button using the browser's Web Speech API (Chrome/Edge); speak your question instead of typing
- **Voice output** — toggleable spoken replies via SpeechSynthesis
- **Recruiter / Interview Mode** — a mode toggle in the AI Assistant panel that switches CortanaX into a professional, STAR-structured interview persona (`api/chat.js` now accepts a `mode: "default" | "recruiter"` field and builds a different system prompt accordingly)
- **Circular skill progress rings** — animated SVG rings alongside the linear bars in Skills Lab
- **Achievements section** — badge cards under About Me, also fed into the AI's knowledge so it can talk about them
- **3D hologram profile card** — mouse-parallax tilt on the About Me profile card (disabled automatically on touch devices)
- **Sound effects** — boot chime, click ticks, and chat send/receive blips, synthesized live with the Web Audio API (no audio files to host). Off by default — toggle with the 🔈 icon in the top HUD bar
- **Light/Dark theme toggle** — 🌙/☀️ icon in the HUD bar, persisted across visits, no flash-of-wrong-theme on reload
- **Animated starfield** — twinkling background layer behind the particle network
- **AI Memory** — the assistant now remembers your conversation on your device across page reloads (stored in `localStorage`, never sent anywhere except to the AI itself). Clear anytime with the "🧹 Clear Memory" button
- **Project Explainer** — each project card has a "🤖 Ask CortanaX to explain this" button that jumps to the AI Assistant and asks about that specific project
- **Contact form** — sends via [Formspree](https://formspree.io) if configured, otherwise gracefully falls back to opening the visitor's email app pre-filled
- **QR code** — auto-generated in the Contact Hub pointing at your live site (falls back to your GitHub profile until you set a live URL)

## 🔧 Configure the new features (all in `js/data.js` → `profile`)
- `siteUrl` — set this to your live Vercel URL after deploying, so the QR code points to your actual site instead of GitHub
- `formspreeEndpoint` — sign up free at https://formspree.io, create a form, paste the endpoint URL here to make the Contact Hub form actually deliver messages to your inbox. Leave blank and it still works — it just opens the visitor's email app instead

## 🔜 Deliberately not built (out of realistic scope for a portfolio site)
Full 3D OS shell, a real Earth/space 3D scene, eye tracking, AI-generated video intro, and multi-language support were on the original "dream" list but need a 3D engine, camera access, or content pipelines that go beyond what a portfolio needs — skipping these was a deliberate call, not an oversight.

## 🔜 Next Sprint
- Sprint 5: Deployment — push to GitHub, deploy on Vercel, set `GEMINI_API_KEY` + `siteUrl` + `formspreeEndpoint`, attach a custom domain

**Note:** `assets/Nikhil_Dhakad_Resume.pdf` is a placeholder path — drop your actual resume PDF into the `assets/` folder with that exact filename, or update `js/data.js` → `profile.resumeFile`.

