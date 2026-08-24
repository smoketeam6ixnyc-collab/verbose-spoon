import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.releaseId || !body?.sessionId) return NextResponse.json({ error: 'releaseId and sessionId required' }, { status: 400 })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: 'Supabase server configuration missing' }, { status: 500 })
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabase.rpc('botshield_join_queue', { p_release_id: body.releaseId, p_session_id: body.sessionId })
  if (error) return NextResponse.json({ error: error.message }, { status: 409 })
  return NextResponse.json({ queue: data?.[0] ?? null })
}
