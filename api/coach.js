/*
  Vercel Serverless Function: POST /api/coach
  Keeps the Gemini API key secret on the server, so every user can use the AI coach
  without creating their own key.

  Setup on Vercel: Project → Settings → Environment Variables
    GEMINI_API_KEY = your key from https://aistudio.google.com/apikey
    GEMINI_MODEL   = gemini-2.5-flash   (optional)
*/
const MAX_MESSAGES = 20
const MAX_CHARS = 2000

export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY

  // GET is used by the app to check whether the shared coach is available
  if (req.method === 'GET') return res.status(200).json({ ok: Boolean(key) })
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'Method not allowed' } })
  if (!key) return res.status(503).json({ error: { message: 'AI coach is not configured on the server' } })

  const { system, messages } = req.body || {}
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: { message: 'No messages' } })
  }

  // basic limits so nobody can send huge requests with your key
  const contents = messages.slice(-MAX_MESSAGES).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(m.text || '').slice(0, MAX_CHARS) }]
  }))

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: String(system || '').slice(0, 6000) }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    })
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) return res.status(r.status).json({ error: { message: data?.error?.message || 'Gemini error' } })

  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '...'
  return res.status(200).json({ text })
}
