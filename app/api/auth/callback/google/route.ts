import { google, lucia } from '@/auth'
import { db } from '@/db'
import { OAuth2RequestError } from 'arctic'
import { generateIdFromEntropySize } from 'lucia'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { generateUsername } from 'unique-username-generator'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')

  const storedState = cookies().get('state')?.value
  const storedCodeVerifier = cookies().get('code_verifier')?.value

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 })
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    )

    const response = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        method: 'GET'
      }
    )

    const googleUser = (await response.json()) as {
      id: string
      email: string
      name: string
      picture?: string
    }

    const existingUser = await db.user.findUnique({
      where: {
        googleId: googleUser.id
      }
    })

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )

      return new Response(null, {
        status: 302,
        headers: {
          Location: '/'
        }
      })
    }

    const userId = generateIdFromEntropySize(10)
    const username = generateUsername('', 5, 10)

    await db.user.create({
      data: {
        id: userId,
        email: googleUser.email,
        name: username,
        image: googleUser.picture,
        googleId: googleUser.id
      }
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    })
  } catch (error) {
    console.error(error)
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400
      })
    }

    return new Response(null, { status: 500 })
  }
}
