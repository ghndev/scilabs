'use client'

import { Search } from 'lucide-react'
import { Input } from './ui/input'

export function SearchBar() {
  return (
    <div className="relative h-8 hidden sm:block">
      <Input
        placeholder="Search"
        className="h-full text-xs bg-gray-100 border-none dark:bg-[#242535]"
      />
      <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 size-5 bg-gray-100 dark:bg-[#242535] dark:text-[#52525B]" />
    </div>
  )
}
