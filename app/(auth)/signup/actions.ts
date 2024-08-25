'use server'

import { db } from '@/db'
import { signupSchema, SignupValues } from '@/lib/validation'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { hash } from '@node-rs/argon2'
import { generateIdFromEntropySize } from 'lucia'
import { redirect } from 'next/navigation'

export async function signup(credentials: SignupValues) {
  try {
    const { email, username, password } = signupSchema.parse(credentials)

    const userByEmail = await db.user.findFirst({ where: { email } })

    if (userByEmail) {
      return {
        error: 'email',
        message: 'Email already taken'
      }
    }

    const userByUsername = await db.user.findFirst({
      where: { name: username }
    })

    if (userByUsername) {
      return {
        error: 'username',
        message: 'Username already taken'
      }
    }

    const hashedPassword = await hash(password, {
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
        password: hashedPassword
      }
    })

    return redirect('/login')
  } catch (error) {
    if (isRedirectError(error)) throw error
    console.error(error)
    return {
      error: 'server',
      message: 'Something went wrong. Please try again.'
    }
  }
}
