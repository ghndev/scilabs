'use client'

import { CircleUser, LogIn, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import Link from 'next/link'
import { logout } from '@/app/(auth)/actions'
import { useState } from 'react'
import { Profile } from './profile'
import { useRouter } from 'next/navigation'
import {
  keepPreviousData,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { getCurrentUser } from '@/app/(main)/actions'
import { useSession } from './session-provider'
import { Skeleton } from './ui/skeleton'
import { Avatar, AvatarImage } from './ui/avatar'

export function UserButton() {
  const { user: isLoggedIn } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const { data: user, isFetching } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await getCurrentUser(),
    staleTime: Infinity
  })

  const handleProfile = () => {
    if (!user) {
      router.push('/login')
    }

    setIsProfileModalOpen(true)
  }

  if (isLoggedIn && isFetching) {
    return <Skeleton className="size-6 rounded-full" />
  }

  const handleLogout = async () => {
    await logout()
    queryClient.invalidateQueries({ queryKey: ['user'] })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          {user?.image ? (
            <Avatar className="size-6">
              <AvatarImage src={user.image} alt="avatar" />
            </Avatar>
          ) : (
            <CircleUser className="text-primary h-6 w-6" strokeWidth={1} />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="dark:border">
          <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {user ? (
            <DropdownMenuItem className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          ) : (
            <Link href="/login">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Login</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {user && (
        <Profile
          isOpen={isProfileModalOpen}
          setIsOpen={setIsProfileModalOpen}
          user={user}
        />
      )}
    </>
  )
}
