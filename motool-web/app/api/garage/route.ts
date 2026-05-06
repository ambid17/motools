import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const API_BASE = process.env.API_URL ?? 'http://localhost:5274'

async function bearerToken(req: NextRequest) {
  return getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
}

export async function GET(req: NextRequest) {
  const token = await bearerToken(req)
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const res = await fetch(`${API_BASE}/api/garage`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return Response.json(await res.json(), { status: res.status })
}

export async function POST(req: NextRequest) {
  const token = await bearerToken(req)
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const res = await fetch(`${API_BASE}/api/garage`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return Response.json(await res.json(), { status: res.status })
}
