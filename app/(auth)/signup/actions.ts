'use server'

import { db } from '@/db'
import { signupSchema, SignupValues } from '@/lib/validation'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { hash } from '@node-rs/argon2'
import { generateIdFromEntropySize } from 'lucia'
import { lucia } from '@/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signup(credentials: SignupValues) {
  try {
    const { email, username, password } = signupSchema.parse(credentials)

    const existingEmail = await db.user.findFirst({ where: { email } })

    if (existingEmail) {
      return {
        error: 'email',
        message: 'Email already taken'
      }
    }

    const existingUsername = await db.user.findFirst({
      where: { name: username }
    })

    if (existingUsername) {
      return {
        error: 'username',
        message: 'Username already taken'
      }
    }

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    })

    const userId = generateIdFromEntropySize(10)

    await db.user.create({
      data: {
        id: userId,
        name: username,
        email,
        password: passwordHash
      }
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    return redirect('/')
  } catch (error) {
    if (isRedirectError(error)) throw error
    console.error(error)
    return {
      error: 'server',
      message: 'Something went wrong. Please try again.'
    }
  }
}
