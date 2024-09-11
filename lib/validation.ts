import { Topic } from '@prisma/client'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Username is required')
    .email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export type LoginValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  username: z
    .string()
    .min(1, 'Username is required')
    .max(10, 'Username must be 10 characters or less')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    )
    .refine((name) => !name.includes(' '), {
      message: 'Username cannot contain spaces'
    }),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be 100 characters or less')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
})

export type SignupValues = z.infer<typeof signupSchema>

export const postSchema = z.object({
  topic: z.nativeEnum(Topic),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  content: z.any()
})

export type PostValues = z.infer<typeof postSchema>
