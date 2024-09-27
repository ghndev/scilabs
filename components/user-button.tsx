'use client'

import { CircleUser, LogIn, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { useSession } from './session-provider'
import Link from 'next/link'
import { logout } from '@/app/(auth)/actions'
import { useState } from 'react'
import { Profile } from './profile'
import { useRouter } from 'next/navigation'

export function UserButton() {
  const { user } = useSession()

  const router = useRouter()

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleProfile = () => {
    if (!user) {
      router.push('/login')
    }

    setIsProfileModalOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          {user?.image ? (
            <img
              src={user.image}
              alt="avatar"
              className="h-6 w-6 rounded-full object-cover"
            />
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
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          ) : (
            <Link href="/login">
              <DropdownMenuItem className="cursor-pointer">
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
