'use client'

import { AuthHeader } from '@/components/auth-header'
import { GoogleLoginButton } from '@/components/google-login-button'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signupSchema, SignupValues } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { signup } from './actions'
import { Loader2 } from 'lucide-react'

export function SignupForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      username: '',
      password: ''
    }
  })

  async function onSubmit(values: SignupValues) {
    startTransition(async () => {
      const result = await signup(values)
      if (result.error === 'email') {
        form.setError('email', { message: result.message })
      } else if (result.error === 'username') {
        form.setError('username', { message: result.message })
      } else if (result.error === 'server') {
        form.setError('root', { message: result.message })
      }
    })
  }

  return (
    <MaxWidthWrapper className="pt-20 max-w-lg flex flex-col items-center justify-center pb-16">
      <AuthHeader
        title="YOUR GATEWAY TO SCIENCE"
        description="Start Your Scientific Journey Today!"
      />
      <div className="mt-8 w-full flex flex-col">
        <span className="text-sm font-medium text-start">Sign Up with</span>
        <GoogleLoginButton />
      </div>
      <div className="relative mt-7 w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-500/30 dark:border-gray-500/70" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500 dark:bg-background">
            OR
          </span>
        </div>
      </div>
      <div className="mt-8 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="border-gray-500/30 focus:border-primary dark:bg-gray-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="border-gray-500/30 focus:border-primary dark:bg-gray-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="border-gray-500/30 focus:border-primary dark:bg-gray-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={isPending}
              type="submit"
              className="mt-7 w-full text-white">
              {isPending && <Loader2 className="size-4 mr-2" />}
              Sign Up
            </Button>
            <p className="mt-5 flex justify-center gap-2">
              <span className="text-sm">Already have an account?</span>
              <a
                href="/login"
                className="text-blue-500 underline hover:text-blue-400 text-sm">
                Log In
              </a>
            </p>
          </form>
        </Form>
      </div>
    </MaxWidthWrapper>
  )
}
