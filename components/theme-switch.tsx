'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const ThemeSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <SwitchPrimitives.Root className="peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-gray-200" />
    )
  }

  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200',
        className
      )}
      ref={ref}
      checked={theme === 'dark'}
      onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      {...props}>
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0'
        )}>
        <div className="flex h-full w-full items-center justify-center">
          {theme === 'dark' ? (
            <Moon className="h-3 w-3 text-black fill-black" />
          ) : (
            <Sun className="h-3 w-3 fill-black" />
          )}
        </div>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  )
})
ThemeSwitch.displayName = 'ThemeSwitch'

export { ThemeSwitch }
