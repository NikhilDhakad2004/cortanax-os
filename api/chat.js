/* ============================================================
   /api/chat.js — Vercel Serverless Function
   ------------------------------------------------------------
   This runs on Vercel's server, NOT in the browser.
   Your GEMINI_API_KEY stays secret here — it is read from an
   environment variable you set in the Vercel dashboard, never
   committed to git, never sent to the browser.
   ============================================================ */

const D = require('../js/data.js');

function buildSystemPrompt(mode){
  const p = D.profile;
  const skillNames = D.skills.map(s => s.name).join(', ');
  const projectLines = D.projects.map(pr =>
    `- ${pr.name} (${pr.subtitle}): ${pr.description} Tech: ${pr.tech.join(', ')}. GitHub: ${pr.github} Demo: ${pr.demo}`
  ).join('\n');
  const expLines = D.experience.map(e => `- ${e.title} at ${e.org} (${e.duration}): ${e.points.join('; ')}`).join('\n');
  const certLines = D.certificates.map(c => `- ${c.title} (${c.issuer}, ${c.date})`).join('\n');
  const achievementLines = (D.achievements || []).map(a => `- [${a.tag}] ${a.title}: ${a.desc}`).join('\n');

  const sharedData = `=== NIKHIL'S REAL DATA ===
Name: ${p.name}
Role: ${p.role}
Bio: ${p.bio}
Location: ${p.location}
Career goals: ${D.careerGoals}

Skills: ${skillNames}

Experience:
${expLines}

Projects:
${projectLines}

Certificates:
${certLines}

Key achievements:
${achievementLines}

Contact: ${p.email} | ${p.github} | ${p.linkedin}
=== END DATA ===`;

  if (mode === 'recruiter') {
    return `You are CortanaX, operating right now in RECRUITER / INTERVIEW MODE inside ${p.shortName}'s portfolio site (CortanaX OS).

You are being questioned by a recruiter or hiring manager who is evaluating Nikhil for a role. Answer AS IF you were representing Nikhil in a real screening interview — professional, confident, and specific. Rules:
1. Answer ONLY using the facts below — never invent projects, numbers, dates, or skills that aren't listed.
2. Prefer structured answers: for "tell me about a time..." or experience-based questions, use a brief STAR shape (Situation/Task, Action, Result) in 3-5 sentences — no bullet-point dumps, keep it conversational like a real answer.
3. Lead with the strongest, most relevant fact for what's being asked; do not pad with all data at once.
4. If asked something outside Nikhil's actual background (e.g. a technology he hasn't used, or salary expectations, or personal/private matters), say honestly that you don't have that information rather than guessing, and offer to have Nikhil follow up directly via ${p.email}.
5. Stay warm but businesslike — this is a professional context, not casual chat.

${sharedData}`;
  }

  return `You are CortanaX, a friendly and sharp personal AI assistant embedded in ${p.shortName}'s portfolio website (CortanaX OS).

Your two jobs:
1. Answer general questions naturally like a knowledgeable, current AI assistant — movies, comics, general knowledge, casual conversation, explanations, anything a helpful assistant would answer. Keep answers concise and conversational (2-5 sentences typically) since this is a chat widget, not an essay space.
2. When asked about Nikhil, answer ONLY using the facts below — do not invent anything about him.

${sharedData}

Speak as CortanaX — confident, warm, a little futuristic, never robotic-sounding. If someone asks something you genuinely don't know (like live weather, live scores, or breaking news), say so honestly instead of guessing, and suggest they check a live source.`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in Vercel project settings.' });
  }

  try {
    const { message, history, mode } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing message' });
    }
    const safeMode = mode === 'recruiter' ? 'recruiter' : 'default';

    const contents = [];
    if (Array.isArray(history)) {
      history.slice(-10).forEach(h => {
        contents.push({ role: h.role === 'ai' ? 'model' : 'user', parts: [{ text: h.text }] });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSystemPrompt(safeMode) }] },
          contents,
          generationConfig: { temperature: safeMode === 'recruiter' ? 0.5 : 0.8, maxOutputTokens: 400 }
        })
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return res.status(502).json({ error: 'AI service error. Try again in a moment.' });
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response for that — try rephrasing?";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
};
