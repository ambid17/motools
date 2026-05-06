import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import PostgresAdapter from '@auth/pg-adapter'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { rows } = await pool.query<{
          id: string
          email: string
          name: string
          hashed_password: string
        }>(
          `SELECT u.id, u.email, u.name, up.hashed_password
           FROM users u
           JOIN user_passwords up ON up.user_id = u.id
           WHERE u.email = $1`,
          [credentials.email]
        )

        if (!rows[0]) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          rows[0].hashed_password
        )
        if (!valid) return null

        return { id: rows[0].id, email: rows[0].email, name: rows[0].name }
      },
    }),
  ],
  // Use standard HS256 JWTs so the ASP.NET Core backend can validate them
  jwt: {
    encode: async ({ token, maxAge }) =>
      new SignJWT(token as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(new Date(Date.now() + (maxAge ?? 30 * 24 * 60 * 60) * 1000))
        .setIssuedAt()
        .sign(secret),
    decode: async ({ token }) => {
      if (!token) return null
      try {
        const { payload } = await jwtVerify(token, secret)
        return payload
      } catch {
        return null
      }
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      return token
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
})
