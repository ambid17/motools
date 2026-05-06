import { NextRequest } from 'next/server'
import { pool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()

  if (!email || !password) {
    return Response.json({ error: 'Email and password are required' }, { status: 400 })
  }

  // Ensure password table exists (idempotent)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_passwords (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      hashed_password TEXT NOT NULL
    )
  `)

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rows.length > 0) {
    return Response.json({ error: 'Email already registered' }, { status: 409 })
  }

  const id = randomUUID()
  const hashedPassword = await bcrypt.hash(password as string, 10)

  await pool.query(
    `INSERT INTO users (id, email, name, "emailVerified") VALUES ($1, $2, $3, NULL)`,
    [id, email, (name as string | undefined) ?? (email as string).split('@')[0]]
  )
  await pool.query(
    'INSERT INTO user_passwords (user_id, hashed_password) VALUES ($1, $2)',
    [id, hashedPassword]
  )

  return Response.json({ success: true }, { status: 201 })
}
