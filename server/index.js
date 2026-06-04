import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.PORTFOLIO_ORIGIN,
  ].filter(Boolean),
}));

const rateLimitMap = new Map();
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_PER_MIN || '15');

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000;
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return next();
  }
  const entry = rateLimitMap.get(ip);
  if (now - entry.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return next();
  }
  if (entry.count >= RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }
  entry.count++;
  next();
}

const SYSTEM_PROMPT = `You are Vita — a warm, knowledgeable, and empathetic AI health advisor.
You help people with everyday health concerns: symptoms, nutrition, sleep,
mental wellness, fitness, hydration, common illnesses, preventative care,
and healthy habits.

IMPORTANT RULES:
1. You are NOT a doctor and never claim to be. Always clarify this upfront
   when discussing medical concerns.
2. For anything that sounds serious, urgent, or potentially dangerous
   (chest pain, difficulty breathing, signs of stroke, severe injuries,
   suicidal thoughts, etc.), immediately and clearly tell the user to call
   911 or go to the nearest emergency room. Do not proceed with advice
   until safety is addressed.
3. Always recommend consulting a licensed healthcare professional for
   diagnosis, prescriptions, or treatment decisions.
4. Provide general, evidence-based information only. Do not recommend
   specific medications, dosages, or treatments.
5. Stay strictly within health and wellness topics. If asked about anything
   unrelated (politics, coding, finance, etc.), politely decline and refocus
   on health.
6. Be warm and human — acknowledge the user's feelings before diving into
   information. People are often anxious when asking health questions.
7. End responses with 1-2 credible resource links when relevant:
   - CDC: https://www.cdc.gov
   - Mayo Clinic: https://www.mayoclinic.org
   - MedlinePlus: https://medlineplus.gov
   - NIH: https://www.nih.gov
   - WHO: https://www.who.int
   - Mental Health: https://www.nami.org or https://www.samhsa.gov
8. Keep responses concise, scannable, and formatted with markdown
   (bullet points, bold key terms, headers where helpful).
9. Never store, reference, or ask for personally identifiable information.`;

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

app.post('/api/chat', rateLimit, async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required.' });
  }

  const sanitised = messages
    .filter(m => ['user', 'assistant'].includes(m.role))
    .map(m => ({ role: m.role, content: String(m.content).slice(0, 1000) }))
    .slice(-30);

  if (!sanitised.length || sanitised[sanitised.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Last message must be from the user.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...sanitised],
      stream: true,
      max_tokens: 1024,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || '';
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Groq API error:', err.message);
    res.write(`data: ${JSON.stringify({ error: 'AI service temporarily unavailable.' })}\n\n`);
    res.end();
  }
});

const FEEDBACK_TO = process.env.FEEDBACK_TO || 'divragh65@gmail.com';

app.post('/api/feedback', rateLimit, async (req, res) => {
  const { message, name, contact } = req.body || {};

  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'Feedback message is required.' });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(503).json({
      error: 'Feedback email is not configured on the server yet.',
    });
  }

  const cleanMessage = String(message).slice(0, 4000);
  const cleanName = String(name || 'Anonymous').slice(0, 120);
  const cleanContact = String(contact || '').slice(0, 200);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `Vita Feedback <${process.env.SMTP_USER}>`,
      to: FEEDBACK_TO,
      replyTo: cleanContact || undefined,
      subject: `New Vita feedback from ${cleanName}`,
      text: `From: ${cleanName}\nContact: ${cleanContact || 'not provided'}\n\n${cleanMessage}`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Feedback email error:', err.message);
    res.status(500).json({ error: 'Could not send feedback. Please try again later.' });
  }
});

app.listen(PORT, () => console.log(`✅ Vita backend running on port ${PORT}`));
