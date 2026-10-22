import { calcNutrition, TEMPLATES } from './fitness'
import { EX_BY_ID } from '../data/exercises'

/*
  AI coach using Google Gemini (has a free tier).
  The API key is entered by the user and kept in their own browser.
  NOTE: for a public app with many users, call Gemini from your own backend
  (e.g. a Vercel serverless function) so the key is never exposed.
*/
const GOALS = { muscle: 'build muscle', fat_loss: 'lose fat', recomp: 'build muscle and lose fat (recomposition)' }

function systemPrompt(state, lang) {
  const p = state.profile
  const n = calcNutrition(p)
  const recent = state.sessions.slice(-5).map(s =>
    `${s.date} ${TEMPLATES[s.templateKey]?.name.en}: ` +
    s.items.map(it => `${EX_BY_ID[it.id]?.name} ${it.sets.map(x => `${x.w}kg×${x.r}`).join(',')}`).join('; ')
  ).join('\n') || 'No workouts logged yet.'

  return `You are FitCoach, a friendly, practical personal gym trainer and nutrition coach for a user in Bangladesh.
Reply in ${lang === 'bn' ? 'Bangla (Bengali script). Keep exercise and machine names in English.' : 'simple English.'}
Keep answers short and actionable: use short bullet points, concrete sets/reps/kg or food amounts.
Suggest affordable Bangladeshi foods (rice, roti, dal, egg, chicken, fish, doi, chola, soya chunks).
Never diagnose injuries or prescribe medicine: for sharp pain, numbness or injury, tell them to stop and see a doctor or physiotherapist.

User profile:
- Name: ${p.name || 'unknown'}, ${p.sex}, ${p.age} years, ${p.height} cm, ${p.weight} kg
- Goal: ${GOALS[p.goal]}
- Trains ${p.daysPerWeek} days/week, prefers ${p.equipment}
- Daily targets: ${n?.calories} kcal, ${n?.protein} g protein
Recent workouts:
${recent}`
}

export async function askCoach(state, history, lang) {
  const { aiKey, aiModel } = state.settings
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': aiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt(state, lang) }] },
      contents: history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`)
  return data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '...'
}
