import { NextRequest } from 'next/server'

const API_BASE = process.env.API_URL ?? 'http://localhost:5274'

export async function GET(req: NextRequest) {
  const makeId = req.nextUrl.searchParams.get('makeId')
  if (!makeId) return Response.json([], { status: 200 })

  const res = await fetch(`${API_BASE}/api/lookup/models?makeId=${makeId}`, {
    next: { revalidate: 3600 },
  })
  return Response.json(await res.json(), { status: res.status })
}
