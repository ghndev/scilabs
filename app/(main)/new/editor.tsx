'use client'

import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { topics } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { postSchema, PostValues } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Loader2, Upload } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'
import { useToast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { createPost } from './actions'

export function Editor() {
  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      topic: '',
      title: '',
      content: null
    }
  })

  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null)

  const { mutate: savePost, isPending } = useMutation({
    mutationFn: createPost,
    onError: (error) => {
      toast({
        title: error.message,
        description: 'There was an error on our end. Please try again.',
        variant: 'destructive'
      })
    }
  })

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: 'Type your content here...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link'
            }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles('imageUploader', {
                    files: [file]
                  })

                  return {
                    success: 1,
                    file: {
                      url: res.url
                    }
                  }
                }
              }
            }
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed
        }
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        _titleRef?.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  async function onSubmit(values: PostValues) {
    const blocks = await ref.current?.save()

    const payload: PostValues = {
      topic: values.topic,
      title: values.title,
      content: blocks
    }

    savePost(payload)
  }

  if (!isMounted) {
    return null
  }

  return (
    <MaxWidthWrapper className="max-w-[700px] mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button
            disabled={isPending}
            type="submit"
            size="sm"
            className="text-white mb-10">
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            upload
          </Button>
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <button
                        aria-expanded={open}
                        className="text-xs flex items-center">
                        {field.value ? (
                          <div className="text-white p-1 px-2 bg-[#4B6BFB] rounded">
                            {
                              topics.find(
                                (topic) => topic.value === field.value
                              )?.label
                            }
                          </div>
                        ) : (
                          'Select topic...'
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-0">
                      <Command>
                        <CommandInput
                          className="text-xs"
                          placeholder="Search topic..."
                        />
                        <CommandList>
                          <CommandEmpty>No topic found.</CommandEmpty>
                          <CommandGroup>
                            {topics.map((topic) => (
                              <CommandItem
                                className="text-xs"
                                key={topic.value}
                                value={topic.value}
                                onSelect={(currentValue) => {
                                  form.setValue('topic', currentValue)
                                  form.clearErrors('topic')
                                  setOpen(false)
                                }}>
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === topic.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <TextareaAutosize
                    {...field}
                    ref={(e) => {
                      field.ref(e)
                      // @ts-ignore
                      _titleRef.current = e
                    }}
                    placeholder="Title"
                    className="w-full resize-none appearance-none overflow-hidden bg-transparent text-2xl font-bold focus:outline-none mt-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div id="editor" className="min-h-[300px] w-fit md:w-full" />
        </form>
      </Form>
    </MaxWidthWrapper>
  )
}
