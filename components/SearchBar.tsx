'use client'

import { Search } from 'lucide-react'
import { Input } from './ui/input'

export default function SearchBar() {
  return (
    <div className="relative h-10">
      <Input
        placeholder="Search"
        className="h-full text-xs bg-gray-100 border-none"
      />
      <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 size-5 bg-gray-100" />
    </div>
  )
}
