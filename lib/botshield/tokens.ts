import { createHmac, timingSafeEqual } from 'crypto'

const secret = process.env.BOTSHIELD_TOKEN_SECRET

function getSecret() {
  if (!secret || secret.length < 32) throw new Error('BOTSHIELD_TOKEN_SECRET must be at least 32 characters')
  return secret
}

export function signCheckoutToken(payload: { sessionId: string; releaseId: string; expiresAt: number }) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', getSecret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifyCheckoutToken(token: string) {
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', getSecret()).update(body).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as { sessionId: string; releaseId: string; expiresAt: number }
  return payload.expiresAt > Date.now() ? payload : null
}
