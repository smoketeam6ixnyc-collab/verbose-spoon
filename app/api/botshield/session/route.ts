import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { scoreRisk } from '@/lib/botshield/risk'

export async function GET(){const sessionId=randomUUID();const risk=scoreRisk({requestsPerMinute:1,replayedToken:false,identicalPattern:false,checkoutSeconds:8,automationSignal:false,coordinatedBehavior:false});return NextResponse.json({sessionId,...risk,expiresInSeconds:900})}
