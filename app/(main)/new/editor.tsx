'use client'

import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { topics } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

export function Editor() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string>()

  return (
    <MaxWidthWrapper className="max-w-[700px] mt-10">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button aria-expanded={open} className="text-xs flex items-center">
            {value ? (
              <div className="text-white p-1 px-2 bg-[#4B6BFB] rounded-lg">
                {topics.find((topic) => topic.value === value)?.label}
              </div>
            ) : (
              'Select topic...'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-0">
          <Command>
            <CommandInput className="text-xs" placeholder="Search topic..." />
            <CommandList>
              <CommandEmpty>No topic found.</CommandEmpty>
              <CommandGroup>
                {topics.map((topic) => (
                  <CommandItem
                    className="text-xs"
                    key={topic.value}
                    value={topic.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === topic.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="text-white p-1 bg-[#4B6BFB] rounded-lg">
                      {topic.label}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <TextareaAutosize
        placeholder="Title"
        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-2xl font-bold focus:outline-none mt-3"
      />
    </MaxWidthWrapper>
  )
}
