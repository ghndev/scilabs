import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { db } from './db'
import { Lucia, Session, User } from 'lucia'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { Google } from 'arctic'

const adapter = new PrismaAdapter(db.session, db.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production'
    }
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      name: databaseUserAttributes.name,
      email: databaseUserAttributes.email,
      image: databaseUserAttributes.image,
      bio: databaseUserAttributes.bio,
      verified: databaseUserAttributes.verified
    }
  }
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  name: string
  email: string
  image: string | null
  bio: string | null
  verified: boolean | null
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
)

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null

    if (!sessionId) {
      return {
        user: null,
        session: null
      }
    }

    const result = await lucia.validateSession(sessionId)

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id)
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        )
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        )
      }
    } catch {}

    return result
  }
)
