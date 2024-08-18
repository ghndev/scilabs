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
import { loginSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <MaxWidthWrapper className="pt-20 max-w-lg flex flex-col items-center justify-center pb-16">
      <AuthHeader
        title="WELCOME TO THE sciLABS"
        description="Explore a Variety of Science Articles!"
      />
      <div className="mt-8 w-full flex flex-col">
        <span className="text-sm font-medium text-start">Social Login</span>
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
          <form onSubmit={form.handleSubmit(() => console.log('login'))}>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
            </div>
            <Button type="submit" className="mt-7 w-full text-white">
              Log In
            </Button>
            <p className="mt-5 flex justify-center gap-2">
              <span className="text-sm">New to sciLABS?</span>
              <a
                href="/signup"
                className="text-blue-500 underline hover:text-blue-400 text-sm">
                Sign Up
              </a>
            </p>
          </form>
        </Form>
      </div>
    </MaxWidthWrapper>
  )
}
