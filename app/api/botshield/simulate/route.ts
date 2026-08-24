import { NextRequest, NextResponse } from 'next/server'
import { scoreRisk } from '@/lib/botshield/risk'

export async function POST(req: NextRequest) {
  const input = await req.json().catch(() => ({}))
  const result = scoreRisk({
    requestsPerMinute: Number(input.requestsPerMinute ?? 1),
    replayedToken: Boolean(input.replayedToken),
    identicalPattern: Boolean(input.identicalPattern),
    checkoutSeconds: Number(input.checkoutSeconds ?? 8),
    automationSignal: Boolean(input.automationSignal),
    coordinatedBehavior: Boolean(input.coordinatedBehavior),
  })
  return NextResponse.json({ mode: 'simulation', ...result })
}
