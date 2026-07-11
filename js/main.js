/* ============================================================
   CORTANAX OS — MAIN SCRIPT
   ============================================================ */

const D = CORTANAX_DATA;

/* ---------- BOOT SEQUENCE ---------- */
const bootLines = [
  { text: "Initializing Neural Core...", cls: "" },
  { text: "Loading AI Engine [OK]", cls: "ok" },
  { text: "Mounting Skill Modules... [OK]", cls: "ok" },
  { text: "Syncing Project Repository... [OK]", cls: "ok" },
  { text: "Authenticating User...", cls: "" },
  { text: "Access Granted.", cls: "accent-line" },
  { text: " ", cls: "" },
  { text: `Hello. I am CortanaX,`, cls: "" },
  { text: `the personal AI assistant created by ${D.profile.shortName}.`, cls: "" },
  { text: " ", cls: "" },
  { text: "Welcome to the future.", cls: "accent-line" },
];

const bootLog = document.getElementById('bootLog');
const bootScreen = document.getElementById('bootScreen');
const osShell = document.getElementById('osShell');
const bootSkip = document.getElementById('bootSkip');

let bootFinished = false;

async function typeLine(line){
  return new Promise(resolve => {
    const div = document.createElement('div');
    if(line.cls) div.className = line.cls;
    bootLog.appendChild(div);
    let i = 0;
    const speed = 18;
    const interval = setInterval(() => {
      div.textContent = line.text.slice(0, i+1);
      i++;
      if(i >= line.text.length){
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

async function runBoot(){
  for(const line of bootLines){
    if(bootFinished) return;
    await typeLine(line);
    await new Promise(r => setTimeout(r, line.text.trim() ? 120 : 60));
  }
  await new Promise(r => setTimeout(r, 500));
  finishBoot();
}

function finishBoot(){
  if(bootFinished) return;
  bootFinished = true;
  playBootChime();
  bootScreen.classList.add('fade-out');
  osShell.classList.remove('hidden');
  setTimeout(() => bootScreen.remove(), 700);
}

bootSkip.addEventListener('click', finishBoot);
runBoot();

/* ---------- CLOCK ---------- */
const hudClock = document.getElementById('hudClock');
function updateClock(){
  const now = new Date();
  hudClock.textContent = now.toLocaleTimeString('en-US', { hour12:false });
}
setInterval(updateClock, 1000);
updateClock();

/* ---------- VISITOR SCAN (real, live client-side data) ---------- */
function detectBrowser(){
  const ua = navigator.userAgent;
  if(ua.includes('Edg/')) return 'Microsoft Edge';
  if(ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
  if(ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if(ua.includes('Firefox/')) return 'Firefox';
  if(ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  return 'Unknown browser';
}
function detectPlatform(){
  const platform = navigator.userAgentData?.platform || navigator.platform || 'Unknown';
  return platform;
}
function updateVisitorScan(){
  const vsTime = document.getElementById('vsTime');
  const vsTz = document.getElementById('vsTz');
  const vsPlatform = document.getElementById('vsPlatform');
  const vsBrowser = document.getElementById('vsBrowser');
  const vsConn = document.getElementById('vsConn');
  const vsScreen = document.getElementById('vsScreen');
  if(!vsTime) return;

  const now = new Date();
  vsTime.textContent = now.toLocaleTimeString('en-US', { hour12:true });
  vsTz.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
  vsPlatform.textContent = detectPlatform();
  vsBrowser.textContent = detectBrowser();

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  vsConn.textContent = conn ? `${conn.effectiveType?.toUpperCase() || '—'}` : 'Unavailable';

  vsScreen.textContent = `${window.screen.width}×${window.screen.height}`;
}
updateVisitorScan();
setInterval(updateVisitorScan, 1000);

/* ---------- PARTICLE BACKGROUND ---------- */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initParticles(){
  particles = [];
  const count = Math.min(90, Math.floor(window.innerWidth / 14));
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.6 + 0.4,
      vx: (Math.random()-0.5)*0.15,
      vy: (Math.random()-0.5)*0.15,
      alpha: Math.random()*0.5 + 0.15
    });
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function drawParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0) p.x = canvas.width;
    if(p.x > canvas.width) p.x = 0;
    if(p.y < 0) p.y = canvas.height;
    if(p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ---------- STARFIELD (ambient twinkle layer) ---------- */
(function initStarfield(){
  const field = document.getElementById('starfield');
  if(!field) return;
  const count = Math.min(120, Math.floor(window.innerWidth / 12));
  const frag = document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const star = document.createElement('div');
    star.className = 'star';
    const size = (Math.random() * 1.8 + 0.6).toFixed(2);
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDuration = (Math.random() * 3 + 2).toFixed(2) + 's';
    star.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
    frag.appendChild(star);
  }
  field.appendChild(frag);
})();

/* ---------- THEME TOGGLE (light / dark), persisted ---------- */
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme){
  if(theme === 'light'){
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.textContent = '☀️';
    themeToggle.classList.add('active');
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    themeToggle.classList.remove('active');
  }
  themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
}
(function initTheme(){
  let saved = 'dark';
  try{ saved = localStorage.getItem('cortanax_theme') || 'dark'; }catch(e){}
  applyTheme(saved);
})();
themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  try{ localStorage.setItem('cortanax_theme', next); }catch(e){}
  playTone(isLight ? 440 : 660, 0.08, 'sine');
});

/* ---------- SOUND ENGINE (Web Audio API — no external audio files) ---------- */
let audioCtx = null;
let soundOn = false;
function getAudioCtx(){
  if(!audioCtx){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(AC) audioCtx = new AC();
  }
  return audioCtx;
}
function playTone(freq = 500, duration = 0.08, type = 'sine', gainVal = 0.05){
  if(!soundOn) return;
  const ctxA = getAudioCtx();
  if(!ctxA) return;
  if(ctxA.state === 'suspended') ctxA.resume();
  const osc = ctxA.createOscillator();
  const gain = ctxA.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctxA.currentTime);
  gain.gain.setValueAtTime(gainVal, ctxA.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctxA.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctxA.destination);
  osc.start();
  osc.stop(ctxA.currentTime + duration);
}
function playBootChime(){
  if(!soundOn) return;
  [523.25, 659.25, 783.99].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.25, 'sine', 0.04), i * 140);
  });
}
function playClickTick(){ playTone(320, 0.05, 'square', 0.03); }
function playSendBlip(){ playTone(880, 0.06, 'sine', 0.04); }
function playReceiveBlip(){ playTone(560, 0.09, 'sine', 0.04); }

const soundToggle = document.getElementById('soundToggle');
(function initSound(){
  try{ soundOn = localStorage.getItem('cortanax_sound') === 'on'; }catch(e){}
  soundToggle.textContent = soundOn ? '🔊' : '🔈';
  soundToggle.classList.toggle('active', soundOn);
  soundToggle.setAttribute('aria-pressed', String(soundOn));
})();
soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? '🔊' : '🔈';
  soundToggle.classList.toggle('active', soundOn);
  soundToggle.setAttribute('aria-pressed', String(soundOn));
  try{ localStorage.setItem('cortanax_sound', soundOn ? 'on' : 'off'); }catch(e){}
  if(soundOn) playTone(700, 0.08, 'sine', 0.05);
});
// Click-tick on dock navigation and boot chime once sound is toggled on / boot finishes
document.querySelectorAll('.dock-item, .btn, .mode-btn, .wake-toggle, .voice-toggle').forEach(el => {
  el.addEventListener('click', () => playClickTick());
});

/* ---------- CURSOR GLOW ---------- */
if(window.CortanaFigure) CortanaFigure.init('cortanaFigure');

const arModeBtn = document.getElementById('arModeBtn');
let arActive = false;
if(arModeBtn){
  // Hide the button entirely if this browser can't do camera access at all —
  // no point offering a feature that will only ever fail here.
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    arModeBtn.style.display = 'none';
  }
  arModeBtn.addEventListener('click', async () => {
    if(!window.CortanaFigure) return;
    if(!arActive){
      arModeBtn.textContent = '...';
      const result = await CortanaFigure.enableAR();
      if(result.ok){
        arActive = true;
        arModeBtn.textContent = '✖ Exit AR';
        arModeBtn.classList.add('active');
      } else {
        arModeBtn.textContent = result.reason === 'denied' ? '🚫 Camera blocked' : '⚠️ Not available here';
        setTimeout(() => { arModeBtn.textContent = '✨ AR Mode'; }, 2200);
      }
    } else {
      CortanaFigure.disableAR();
      arActive = false;
      arModeBtn.textContent = '✨ AR Mode';
      arModeBtn.classList.remove('active');
    }
  });
}

const cursorGlow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ---------- NAVIGATION ---------- */
const dockItems = document.querySelectorAll('.dock-item');
const navTriggers = document.querySelectorAll('[data-nav]');

function goToSection(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({ behavior:'smooth' });
}
navTriggers.forEach(btn => {
  btn.addEventListener('click', () => goToSection(btn.dataset.nav));
});

const sections = document.querySelectorAll('.panel');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      dockItems.forEach(d => d.classList.toggle('active', d.dataset.nav === entry.target.id));
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

/* ---------- RENDER DATA ---------- */

// Home
document.getElementById('ownerName').textContent = D.profile.shortName;
document.getElementById('homeTagline').textContent = D.profile.tagline;

// About
document.getElementById('aboutName').textContent = D.profile.shortName;
document.getElementById('aboutRole').textContent = D.profile.role;
document.getElementById('aboutLocation').textContent = D.profile.location;
document.getElementById('aboutBio').textContent = D.profile.bio;
document.getElementById('careerGoals').textContent = D.careerGoals;

const eduTimeline = document.getElementById('educationTimeline');
D.education.forEach(e => {
  eduTimeline.innerHTML += `
    <div class="timeline-item">
      <div class="timeline-item__title">${e.degree}</div>
      <div class="timeline-item__org">${e.institute}</div>
      <div class="timeline-item__date">${e.duration} — ${e.status}</div>
    </div>`;
});

// Achievements
const achievementsList = document.getElementById('achievementsList');
(D.achievements || []).forEach(a => {
  achievementsList.innerHTML += `
    <div class="achievement-card">
      <span class="achievement-card__tag">${a.tag}</span>
      <div class="achievement-card__title">${a.title}</div>
      <div class="achievement-card__desc">${a.desc}</div>
    </div>`;
});

// Profile card 3D tilt (mouse-parallax "hologram" feel; disabled on touch devices)
(function initProfileTilt(){
  const card = document.querySelector('.profile-card');
  if(!card || matchMedia('(hover: none)').matches) return;
  const maxTilt = 10;
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;  // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * maxTilt * 2;
    const rotX = (0.5 - py) * maxTilt * 2;
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
})();

// Experience
const expList = document.getElementById('experienceList');
D.experience.forEach(e => {
  expList.innerHTML += `
    <div class="timeline-item">
      <div class="timeline-item__title">${e.title}</div>
      <div class="timeline-item__org">${e.org}</div>
      <div class="timeline-item__date">${e.duration}</div>
      <ul class="timeline-item__points">${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>`;
});

// Skills — circular progress rings + linear bar (both driven by the same %)
const skillsGrid = document.getElementById('skillsGrid');
const RING_RADIUS = 24, RING_CIRC = 2 * Math.PI * RING_RADIUS; // ≈ 150.8
D.skills.forEach(s => {
  skillsGrid.innerHTML += `
    <div class="skill-card">
      <div class="skill-ring">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle class="track" cx="28" cy="28" r="${RING_RADIUS}"></circle>
          <circle class="fill" cx="28" cy="28" r="${RING_RADIUS}" data-level="${s.level}"></circle>
        </svg>
        <span class="skill-ring__pct">${s.level}%</span>
      </div>
      <div class="skill-card__body">
        <div class="skill-card__top">
          <span class="skill-card__name">${s.name}</span>
          <span class="skill-card__pct">${s.level}%</span>
        </div>
        <div class="skill-bar"><div class="skill-bar__fill" data-level="${s.level}"></div></div>
        <div class="skill-card__cat">${s.category}</div>
      </div>
    </div>`;
});
// animate bars + rings when skills panel is visible
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      document.querySelectorAll('.skill-bar__fill').forEach(fill => {
        fill.style.width = fill.dataset.level + '%';
      });
      document.querySelectorAll('.skill-ring circle.fill').forEach(circle => {
        const level = parseFloat(circle.dataset.level) || 0;
        const offset = RING_CIRC - (level / 100) * RING_CIRC;
        circle.style.strokeDashoffset = offset;
      });
      skillObserver.disconnect();
    }
  });
}, { threshold: 0.2 });
skillObserver.observe(document.getElementById('skills'));

// Projects
const projectsGrid = document.getElementById('projectsGrid');
D.projects.forEach(p => {
  projectsGrid.innerHTML += `
    <div class="project-card ${p.flagship ? 'project-card--flagship' : ''}">
      ${p.flagship ? '<span class="project-card__badge">FLAGSHIP PROJECT</span>' : ''}
      <div class="project-card__name">${p.name}</div>
      <div class="project-card__subtitle">${p.subtitle}</div>
      <p class="project-card__desc">${p.description}</p>
      <ul class="project-card__features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <div class="tech-tags">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
      <div class="project-card__actions">
        ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener"><button class="btn btn--primary btn--sm">▶ Live Demo</button></a>` : ''}
        ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener"><button class="btn btn--ghost btn--sm">⌘ GitHub</button></a>` : ''}
        <button class="btn--askai" data-explain-project="${p.id}">🤖 Ask CortanaX to explain this</button>
      </div>
    </div>`;
});

// Certificates
const certsGrid = document.getElementById('certsGrid');
D.certificates.forEach(c => {
  certsGrid.innerHTML += `
    <div class="cert-card">
      <div class="cert-card__title">${c.title}</div>
      <div class="cert-card__issuer">${c.issuer}</div>
      <div class="cert-card__date">${c.date}</div>
      ${c.verify ? `<a href="${c.verify}" target="_blank" rel="noopener" class="cert-card__verify">Verify →</a>` : ''}
    </div>`;
});

// Contact
const contactGrid = document.getElementById('contactGrid');
const contactItems = [
  { label: 'EMAIL', value: D.profile.email, href: `mailto:${D.profile.email}` },
  { label: 'PHONE', value: D.profile.phone, href: `tel:${D.profile.phone}` },
  { label: 'GITHUB', value: D.profile.github.replace('https://',''), href: D.profile.github },
  { label: 'LINKEDIN', value: D.profile.linkedin.replace('https://',''), href: D.profile.linkedin },
];
contactItems.forEach(c => {
  contactGrid.innerHTML += `
    <a href="${c.href}" target="_blank" rel="noopener" class="contact-card">
      <span class="contact-card__label">${c.label}</span>
      <span class="contact-card__value">${c.value}</span>
    </a>`;
});

/* ---- QR code (client-side, no library — public QR image API) ---- */
(function renderQr(){
  const qrImg = document.getElementById('qrCode');
  const qrLabel = document.getElementById('qrLabel');
  if(!qrImg) return;
  const target = D.profile.siteUrl && D.profile.siteUrl.trim() ? D.profile.siteUrl.trim() : D.profile.github;
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(target)}`;
  qrLabel.textContent = D.profile.siteUrl && D.profile.siteUrl.trim()
    ? 'Scan to open this site on your phone'
    : 'Site not deployed yet — QR currently points to GitHub. Set profile.siteUrl in data.js once deployed.';
})();

/* ---- Contact form: Formspree if configured, otherwise opens the visitor's email app ---- */
const contactForm = document.getElementById('contactForm');
const cfStatus = document.getElementById('cfStatus');
if(contactForm){
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('cfName').value.trim();
    const email = document.getElementById('cfEmail').value.trim();
    const message = document.getElementById('cfMessage').value.trim();
    const submitBtn = document.getElementById('cfSubmit');
    if(!name || !email || !message) return;

    const endpoint = D.profile.formspreeEndpoint && D.profile.formspreeEndpoint.trim();

    if(!endpoint){
      // Graceful fallback: no form backend configured yet — open a pre-filled email instead
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${D.profile.email}?subject=${subject}&body=${body}`;
      cfStatus.textContent = 'Opening your email app (no form backend connected yet — see README to add Formspree).';
      cfStatus.className = 'form-status';
      return;
    }

    submitBtn.disabled = true;
    cfStatus.textContent = 'Sending...';
    cfStatus.className = 'form-status';
    try{
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if(!res.ok) throw new Error('form submit failed');
      cfStatus.textContent = '✓ Message sent — thanks! Nikhil will get back to you soon.';
      cfStatus.className = 'form-status ok';
      playReceiveBlip();
      contactForm.reset();
    } catch(err){
      cfStatus.textContent = 'Could not send right now — please email directly instead.';
      cfStatus.className = 'form-status err';
    } finally{
      submitBtn.disabled = false;
    }
  });
}

/* ---------- AI ASSISTANT (rule-based, offline) ---------- */
const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

function addChatMsg(text, from){
  const wrap = document.createElement('div');
  wrap.className = `chat-msg chat-msg--${from}`;
  wrap.innerHTML = from === 'ai'
    ? `<span class="chat-avatar"></span><div class="chat-bubble">${text}</div>`
    : `<div class="chat-bubble">${text}</div>`;
  chatLog.appendChild(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
  return wrap;
}

function generateReply(msg){
  const m = msg.toLowerCase();
  if(m.includes('project')){
    const p = D.projects[0];
    return `Nikhil's flagship project is <strong>${p.name}</strong> — ${p.description} Built with ${p.tech.slice(0,4).join(', ')} and more. You can try the live demo from the Projects Lab section.`;
  }
  if(m.includes('skill')){
    return `Nikhil's core strengths are Python, Machine Learning, Deep Learning, Computer Vision (YOLOv8), and Cybersecurity fundamentals — check the Skills Lab for the full ${D.skills.length}-skill breakdown.`;
  }
  if(m.includes('resume') || m.includes('cv')){
    return `You can download Nikhil's full resume from the Resume Center section — it covers experience, education, and certifications.`;
  }
  if(m.includes('experience') || m.includes('intern')){
    return `Nikhil interned at Sachitech, Nashik as a Data Science & ML Intern, where he improved model prediction accuracy by 25% and built pipelines processing 2M+ records daily.`;
  }
  if(m.includes('education') || m.includes('college') || m.includes('degree')){
    return `Nikhil is in his final year of BCA (Data Science) at SRM Institute of Science and Technology, KTR Main Campus (2024–2027).`;
  }
  if(m.includes('contact') || m.includes('email') || m.includes('hire')){
    return `You can reach Nikhil at ${D.profile.email} or connect on LinkedIn/GitHub — links are in the Contact Hub section.`;
  }
  if(m.includes('certificate') || m.includes('cert')){
    return `Nikhil holds ${D.certificates.length} certificates, including IBM SkillsBuild (Network Security), AWS Cloud Practitioner, and three cybersecurity job simulations via Forage. See the Certificates Vault.`;
  }
  if(m.includes('hello') || m.includes('hi')){
    return `Hey! I'm CortanaX, Nikhil's personal AI. Ask me about his projects, skills, experience, or how to contact him.`;
  }
  return `I don't have a live AI connection right now, so I'm running on my offline knowledge — I can tell you about Nikhil's <strong>projects</strong>, <strong>skills</strong>, <strong>experience</strong>, or <strong>contact info</strong>. For general questions, connect the Gemini API (see README) to unlock full conversation.`;
}

let chatHistory = [];
let chatMode = 'default'; // 'default' | 'recruiter'
let voiceOutputOn = false;

/* ---- AI Memory: persist conversation across visits (this browser only) ---- */
const MEMORY_KEY = 'cortanax_chat_memory';
const chatMemoryNote = document.getElementById('chatMemoryNote');
const clearMemoryBtn = document.getElementById('clearMemoryBtn');

function saveChatMemory(){
  try{
    // Cap stored history so localStorage never grows unbounded
    localStorage.setItem(MEMORY_KEY, JSON.stringify(chatHistory.slice(-40)));
  }catch(e){ /* storage unavailable/full — fail silently, chat still works this session */ }
  updateMemoryNote();
}

function updateMemoryNote(){
  if(!chatMemoryNote) return;
  chatMemoryNote.textContent = chatHistory.length
    ? `🧠 Remembering this conversation on this device (${chatHistory.length} messages). Nothing is sent anywhere except to the AI when you send a message.`
    : '';
}

function loadChatMemory(){
  let saved = [];
  try{ saved = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]'); }catch(e){ saved = []; }
  if(!Array.isArray(saved) || !saved.length) return;
  chatLog.innerHTML = ''; // remove the default static welcome bubble, we'll restore real history
  saved.forEach(m => addChatMsg(m.text, m.role === 'ai' ? 'ai' : 'user'));
  chatHistory = saved;
  updateMemoryNote();
}

if(clearMemoryBtn){
  clearMemoryBtn.addEventListener('click', () => {
    chatHistory = [];
    try{ localStorage.removeItem(MEMORY_KEY); }catch(e){}
    chatLog.innerHTML = '';
    addChatMsg('I\'m CortanaX — Nikhil\'s personal AI. Ask me about his skills, projects, or experience. Try: <em>"tell me about his AI project"</em>', 'ai');
    updateMemoryNote();
  });
}

/* ---- Mode toggle (Chat / Recruiter) ---- */
const modeDefaultBtn = document.getElementById('modeDefaultBtn');
const modeRecruiterBtn = document.getElementById('modeRecruiterBtn');

function setMode(mode){
  chatMode = mode;
  modeDefaultBtn.classList.toggle('active', mode === 'default');
  modeRecruiterBtn.classList.toggle('active', mode === 'recruiter');
  const note = mode === 'recruiter'
    ? "Switched to <strong>Recruiter Mode</strong> — I'll answer like Nikhil is being interviewed: structured, specific, professional. Ask me about his experience, projects, or fit for a role."
    : "Back to <strong>Chat Mode</strong> — casual conversation, ask me anything.";
  addChatMsg(note, 'ai');
}
modeDefaultBtn.addEventListener('click', () => { if(chatMode !== 'default') setMode('default'); });
modeRecruiterBtn.addEventListener('click', () => { if(chatMode !== 'recruiter') setMode('recruiter'); });

/* ---- Voice output (speak AI replies aloud, female voice) ---- */
const voiceToggle = document.getElementById('voiceToggle');

// Known female-sounding system/browser voice names across platforms (checked in priority order)
const FEMALE_VOICE_HINTS = [
  'Google UK English Female', 'Google US English Female',
  'Microsoft Zira', 'Microsoft Aria', 'Microsoft Jenny',
  'Samantha', 'Victoria', 'Karen', 'Moira', 'Tessa', 'Fiona',
  'Female'
];

let cachedVoices = [];
let chosenVoice = null;

function pickFemaleVoice(){
  if(!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if(!voices.length) return null;
  cachedVoices = voices;

  // 1. Exact/partial name match against known female voice names
  for(const hint of FEMALE_VOICE_HINTS){
    const match = voices.find(v => v.name.toLowerCase().includes(hint.toLowerCase()));
    if(match) return match;
  }
  // 2. Fallback: any English voice whose name doesn't obviously say "male"
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  const notMale = englishVoices.find(v => !/male/i.test(v.name) || /female/i.test(v.name));
  if(notMale) return notMale;

  // 3. Last resort: first English voice, or first voice overall
  return englishVoices[0] || voices[0];
}

function ensureVoiceLoaded(){
  chosenVoice = pickFemaleVoice();
  if(!chosenVoice && 'speechSynthesis' in window){
    // Voices load asynchronously in some browsers (esp. Chrome) — retry once ready
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      chosenVoice = pickFemaleVoice();
    }, { once: true });
  }
}
ensureVoiceLoaded();

function speak(text){
  if(!voiceOutputOn || !('speechSynthesis' in window)){
    if(window.CortanaFigure) CortanaFigure.setState('idle');
    return;
  }
  const clean = text.replace(/<[^>]*>/g, ''); // strip HTML tags before speaking
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(clean);
  if(!chosenVoice) chosenVoice = pickFemaleVoice();
  if(chosenVoice) utter.voice = chosenVoice;
  utter.rate = 1.02;
  utter.pitch = 1.05; // slightly higher pitch reinforces a female tone as a fallback on voices without gender in the name
  if(window.CortanaFigure){
    utter.onstart = () => CortanaFigure.setState('speaking');
    utter.onboundary = () => CortanaFigure.pulse(); // approximates a talking rhythm from real word timing
    utter.onend = () => CortanaFigure.setState('idle');
    utter.onerror = () => CortanaFigure.setState('idle');
  }
  window.speechSynthesis.speak(utter);
}
voiceToggle.addEventListener('click', () => {
  voiceOutputOn = !voiceOutputOn;
  voiceToggle.classList.toggle('active', voiceOutputOn);
  voiceToggle.textContent = voiceOutputOn ? '🔊 Voice: On' : '🔊 Voice: Off';
  voiceToggle.setAttribute('aria-pressed', String(voiceOutputOn));
  if(!voiceOutputOn && 'speechSynthesis' in window) window.speechSynthesis.cancel();
});

/* ---- Voice input ("Hey CortanaX" style mic button, Web Speech API) ---- */
const micBtn = document.getElementById('micBtn');
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;
if(SpeechRecognitionAPI){
  recognizer = new SpeechRecognitionAPI();
  recognizer.lang = 'en-US';
  recognizer.interimResults = false;
  recognizer.maxAlternatives = 1;

  recognizer.addEventListener('start', () => micBtn.classList.add('listening'));
  recognizer.addEventListener('end', () => {
    micBtn.classList.remove('listening');
    // resume hands-free wake listening if it was paused for this one-shot capture
    if(wakeModeOn && !wakeRecognizer){ startWakeRecognizer(); }
  });
  recognizer.addEventListener('error', () => micBtn.classList.remove('listening'));
  recognizer.addEventListener('result', (e) => {
    const transcript = e.results?.[0]?.[0]?.transcript;
    if(transcript){
      chatInput.value = transcript;
      handleSend();
    }
  });

  micBtn.addEventListener('click', () => {
    if(micBtn.classList.contains('listening')){
      recognizer.stop();
    } else {
      // pause hands-free wake recognizer so both don't fight over the mic
      if(wakeRecognizer){ try{ wakeRecognizer.stop(); } catch(e){} wakeRecognizer = null; }
      try{ recognizer.start(); } catch(e){ /* already started, ignore */ }
    }
  });
} else {
  micBtn.title = 'Voice input not supported in this browser';
  micBtn.addEventListener('click', () => {
    addChatMsg("Voice input isn't supported in this browser — try Chrome or Edge, or just type your question.", 'ai');
  });
}

/* ---- "Hey CortanaX" hands-free wake-word activation ---- */
const wakeToggle = document.getElementById('wakeToggle');
const WAKE_PATTERN = /hey\s*cortana\s*x?/i;
let wakeModeOn = false;
let wakeRecognizer = null;
let awaitingWakeCommand = false;

function extractAfterWake(transcript){
  const match = transcript.match(WAKE_PATTERN);
  if(!match) return '';
  return transcript.slice(match.index + match[0].length).trim();
}

function handleWakeCommand(text){
  if(!text) return;
  chatInput.value = text;
  document.getElementById('assistant').scrollIntoView({ behavior: 'smooth', block: 'start' });
  handleSend();
}

function startWakeRecognizer(){
  if(!SpeechRecognitionAPI) return;
  wakeRecognizer = new SpeechRecognitionAPI();
  wakeRecognizer.lang = 'en-US';
  wakeRecognizer.continuous = true;
  wakeRecognizer.interimResults = true;

  wakeRecognizer.addEventListener('result', (e) => {
    const lastResult = e.results[e.results.length - 1];
    if(!lastResult.isFinal) return;
    const transcript = (lastResult[0]?.transcript || '').trim();
    if(!transcript) return;

    if(awaitingWakeCommand){
      awaitingWakeCommand = false;
      wakeToggle.classList.remove('listening');
      handleWakeCommand(transcript);
      return;
    }

    if(WAKE_PATTERN.test(transcript)){
      const rest = extractAfterWake(transcript);
      if(rest){
        handleWakeCommand(rest);
      } else {
        awaitingWakeCommand = true;
        wakeToggle.classList.add('listening');
        addChatMsg("I'm listening — go ahead.", 'ai');
      }
    }
  });

  wakeRecognizer.addEventListener('end', () => {
    // Browsers auto-stop continuous recognition after a while — restart while wake mode is on
    if(wakeModeOn){
      try{ wakeRecognizer.start(); } catch(e){ /* ignore rapid-restart errors */ }
    }
  });
  wakeRecognizer.addEventListener('error', () => { /* 'no-speech'/'aborted' are benign; onend restarts it */ });

  try{ wakeRecognizer.start(); } catch(e){ /* ignore */ }
}

if(wakeToggle){
  wakeToggle.addEventListener('click', () => {
    if(!SpeechRecognitionAPI){
      addChatMsg("Hands-free wake-word listening isn't supported in this browser — try Chrome or Edge.", 'ai');
      return;
    }
    wakeModeOn = !wakeModeOn;
    wakeToggle.classList.toggle('active', wakeModeOn);
    wakeToggle.textContent = wakeModeOn ? '🎙️ Hey CortanaX: On' : '🎙️ Hey CortanaX: Off';
    wakeToggle.setAttribute('aria-pressed', String(wakeModeOn));

    if(wakeModeOn){
      addChatMsg("Hands-free mode is on — say <strong>\"Hey CortanaX\"</strong> anytime, then ask your question.", 'ai');
      startWakeRecognizer();
    } else {
      awaitingWakeCommand = false;
      wakeToggle.classList.remove('listening');
      if(wakeRecognizer){ try{ wakeRecognizer.stop(); } catch(e){} wakeRecognizer = null; }
    }
  });
}

/* ---- Typewriter reveal for AI replies (streaming feel) ---- */
function typeWriterReveal(el, htmlText, speed = 12){
  return new Promise(resolve => {
    const plain = htmlText.replace(/<[^>]*>/g, '');
    let i = 0;
    el.textContent = '';
    function step(){
      if(i <= plain.length){
        el.textContent = plain.slice(0, i);
        chatLog.scrollTop = chatLog.scrollHeight;
        i += 2;
        setTimeout(step, speed);
      } else {
        el.innerHTML = htmlText; // restore real formatting (bold, em, etc.) once fully revealed
        chatLog.scrollTop = chatLog.scrollHeight;
        resolve();
      }
    }
    step();
  });
}

async function handleSend(){
  const val = chatInput.value.trim();
  if(!val) return;
  addChatMsg(val, 'user');
  chatInput.value = '';
  chatHistory.push({ role: 'user', text: val });
  playSendBlip();
  saveChatMemory();

  const typingBubble = addChatMsg('<em>thinking...</em>', 'ai');
  const bubbleEl = typingBubble.querySelector('.chat-bubble');
  if(window.CortanaFigure) CortanaFigure.setState('thinking');

  try{
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: val, history: chatHistory, mode: chatMode })
    });
    if(!res.ok) throw new Error('api error');
    const data = await res.json();
    chatHistory.push({ role: 'ai', text: data.reply });
    playReceiveBlip();
    speak(data.reply);
    await typeWriterReveal(bubbleEl, data.reply);
  } catch(err){
    // Fallback: offline rule-based reply (e.g. running locally without Vercel, or API not yet connected)
    const fallback = generateReply(val);
    chatHistory.push({ role: 'ai', text: fallback });
    playReceiveBlip();
    speak(fallback);
    await typeWriterReveal(bubbleEl, fallback);
  }
  saveChatMemory();
}
chatSend.addEventListener('click', handleSend);
chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') handleSend(); });

loadChatMemory(); // restore any previous conversation on this device

/* ---- Project Explainer: "Ask CortanaX" quick action on project cards ---- */
document.getElementById('projectsGrid').addEventListener('click', e => {
  const btn = e.target.closest('[data-explain-project]');
  if(!btn) return;
  const proj = D.projects.find(p => p.id === btn.dataset.explainProject);
  if(!proj) return;
  goToSection('assistant');
  chatInput.value = `Explain the "${proj.name}" project in detail — what problem it solves, how it works, and why it's impressive.`;
  setTimeout(handleSend, 400); // small delay so the scroll-to-assistant finishes first
});

/* ---------- GITHUB LIVE ANALYTICS ---------- */
const GH_USER = D.profile.githubUsername;
const ghStatus = document.getElementById('githubStatus');
const ghContent = document.getElementById('githubContent');
const ghStatsRow = document.getElementById('ghStatsRow');
const ghChartImg = document.getElementById('ghChartImg');
const ghLangBars = document.getElementById('ghLangBars');
const ghRepoGrid = document.getElementById('ghRepoGrid');

let githubLoaded = false;
async function loadGithubStats(){
  if(githubLoaded) return;
  githubLoaded = true;
  try{
    const userRes = await fetch(`https://api.github.com/users/${GH_USER}`);
    if(!userRes.ok) throw new Error('user fetch failed');
    const user = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`);
    const repos = reposRes.ok ? await reposRes.json() : [];

    // Stats row
    ghStatsRow.innerHTML = `
      <div class="gh-stat"><div class="gh-stat__value">${user.public_repos ?? '—'}</div><div class="gh-stat__label">PUBLIC REPOS</div></div>
      <div class="gh-stat"><div class="gh-stat__value">${user.followers ?? '—'}</div><div class="gh-stat__label">FOLLOWERS</div></div>
      <div class="gh-stat"><div class="gh-stat__value">${user.following ?? '—'}</div><div class="gh-stat__label">FOLLOWING</div></div>
      <div class="gh-stat"><div class="gh-stat__value">${Array.isArray(repos) ? repos.reduce((s,r)=>s+r.stargazers_count,0) : '—'}</div><div class="gh-stat__label">TOTAL STARS</div></div>
    `;

    // Contribution chart (public image service, no auth needed)
    ghChartImg.src = `https://ghchart.rshah.org/00e5ff/${GH_USER}`;

    // Languages aggregation
    if(Array.isArray(repos) && repos.length){
      const langCount = {};
      repos.forEach(r => { if(r.language) langCount[r.language] = (langCount[r.language]||0) + 1; });
      const total = Object.values(langCount).reduce((a,b)=>a+b,0) || 1;
      const sorted = Object.entries(langCount).sort((a,b)=>b[1]-a[1]).slice(0,6);
      ghLangBars.innerHTML = sorted.map(([lang,count]) => {
        const pct = Math.round((count/total)*100);
        return `<div class="gh-lang-item">
          <span class="gh-lang-item__name">${lang}</span>
          <div class="gh-lang-item__bar"><div class="gh-lang-item__fill" style="width:${pct}%"></div></div>
          <span class="gh-lang-item__pct">${pct}%</span>
        </div>`;
      }).join('') || `<div class="term-line" style="color:var(--muted)">No language data available yet.</div>`;

      // Repo cards (top 6 by recent update)
      ghRepoGrid.innerHTML = repos.slice(0,6).map(r => `
        <a href="${r.html_url}" target="_blank" rel="noopener" class="gh-repo-card">
          <div class="gh-repo-card__name">${r.name}</div>
          <div class="gh-repo-card__desc">${r.description ? r.description : 'No description provided.'}</div>
          <div class="gh-repo-card__meta">
            <span>★ ${r.stargazers_count}</span>
            <span>${r.language || '—'}</span>
          </div>
        </a>`).join('');
    } else {
      ghLangBars.innerHTML = `<div style="color:var(--muted)">No public repos found.</div>`;
    }

    ghStatus.classList.add('hidden');
    ghContent.classList.remove('hidden');
  } catch(err){
    ghStatus.textContent = `Could not reach GitHub API right now. View the profile directly: ${D.profile.github}`;
  }
}

const ghObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if(entry.isIntersecting) loadGithubStats(); });
}, { threshold: 0.2 });
ghObserver.observe(document.getElementById('github'));

/* ---------- TERMINAL ---------- */
const terminalBody = document.getElementById('terminalBody');
const terminalInput = document.getElementById('terminalInput');
const terminalWindow = document.getElementById('terminalWindow');

function termPrint(text, cls){
  const line = document.createElement('div');
  line.className = 'term-line' + (cls ? ` ${cls}` : '');
  line.innerHTML = text;
  terminalBody.appendChild(line);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

const termCommands = {
  help: () => `Available commands:
  <span class="accent">about</span>         — who is Nikhil
  <span class="accent">skills</span>        — list core skills
  <span class="accent">projects</span>      — list projects
  <span class="accent">resume</span>        — resume download link
  <span class="accent">contact</span>       — contact info
  <span class="accent">certs</span>         — list certificates
  <span class="accent">achievements</span>  — list key achievements
  <span class="accent">clear</span>         — clear the terminal`,

  about: () => `${D.profile.shortName} — ${D.profile.role}\n${D.profile.bio}`,

  skills: () => D.skills.map(s => `${s.name.padEnd(28,'.')}${s.level}%`).join('\n'),

  projects: () => D.projects.map(p =>
    `${p.name} (${p.subtitle})\n  tech: ${p.tech.join(', ')}\n  github: ${p.github}\n  demo: ${p.demo}`
  ).join('\n\n'),

  resume: () => `Resume available at: ${D.profile.resumeFile}\n(Use the Resume Center section to download.)`,

  contact: () => `Email: ${D.profile.email}\nPhone: ${D.profile.phone}\nGitHub: ${D.profile.github}\nLinkedIn: ${D.profile.linkedin}`,

  certs: () => D.certificates.map(c => `${c.title} — ${c.issuer} (${c.date})`).join('\n'),

  achievements: () => (D.achievements || []).map(a => `[${a.tag}] ${a.title} — ${a.desc}`).join('\n'),

  clear: () => { terminalBody.innerHTML = ''; return null; }
};

function runTermCommand(raw){
  const cmd = raw.trim().toLowerCase();
  termPrint(cmd, 'term-line--cmd');
  if(!cmd){ return; }
  if(termCommands[cmd]){
    const output = termCommands[cmd]();
    if(output !== null && output !== undefined) termPrint(output);
  } else {
    termPrint(`command not found: ${cmd} — type 'help' for available commands`, 'term-line--err');
  }
}

terminalInput.addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    const val = terminalInput.value;
    terminalInput.value = '';
    playClickTick();
    runTermCommand(val);
  }
});
terminalWindow.addEventListener('click', () => terminalInput.focus());
