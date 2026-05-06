const API_BASE = process.env.API_URL ?? 'http://localhost:5274'

export async function GET() {
  const res = await fetch(`${API_BASE}/api/lookup/makes`, { next: { revalidate: 3600 } })
  return Response.json(await res.json(), { status: res.status })
}
