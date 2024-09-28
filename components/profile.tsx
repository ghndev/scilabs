import { Dispatch, SetStateAction, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { UserData } from '@/lib/types'
import { Label } from './ui/label'
import { useToast } from './ui/use-toast'
import { useUploadThing } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import Dropzone, { FileRejection } from 'react-dropzone'
import { Loader2, MousePointerSquareDashed } from 'lucide-react'
import { Progress } from './ui/progress'
import { useForm } from 'react-hook-form'
import { profileSchema, ProfileValues } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import { updateProfile } from '@/app/(main)/actions'
import { useRouter } from 'next/navigation'

interface ProfileProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  user: UserData
}

export function Profile({ isOpen, setIsOpen, user }: ProfileProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onUploadProgress(p) {
      setUploadProgress(p)
    },
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        form.setValue('image', res[0].url)
        toast({
          title: 'Image uploaded successfully',
          description: 'Click save button to update your profile'
        })
      }
    }
  })

  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles)
    setIsDragOver(false)
  }

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles

    setIsDragOver(false)

    toast({
      title: `${file.file.type} type is not supported.`,
      description: 'Please choose a PNG, JPG, or JPEG image instead.',
      variant: 'destructive'
    })
  }

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      image: user.image || undefined,
      username: user.name,
      bio: user.bio || undefined
    }
  })

  const imageUrl = form.watch('image')
  const usernameLength = form.watch('username').length
  const bioLength = form.watch('bio')?.length

  const { mutate: saveProfile, isPending } = useMutation({
    mutationKey: ['profile'],
    mutationFn: async (values: ProfileValues) => await updateProfile(values),
    onSuccess: ({ message }) => {
      toast({
        title: message
      })
      setIsOpen(false)
    }
  })

  const onSubmit = (values: ProfileValues) => {
    saveProfile(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Photo</Label>
          <div className="flex items-center justify-center gap-10">
            <div
              className={cn(
                'relative size-10 sm:size-28 rounded-full bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 flex justify-center flex-col items-center',
                { 'ring-blue-900/25 bg-blue-900/10': isDragOver }
              )}>
              <div className="relative flex flex-col items-center justify-center h-full w-full">
                <Dropzone
                  onDropAccepted={onDropAccepted}
                  onDropRejected={onDropRejected}
                  accept={{
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpeg'],
                    'image/jpg': ['.jpg']
                  }}
                  onDragEnter={() => setIsDragOver(true)}
                  onDragLeave={() => setIsDragOver(false)}>
                  {({ getRootProps, getInputProps }) => (
                    <div
                      className="h-full w-full flex flex-col items-center justify-center cursor-pointer"
                      {...getRootProps()}>
                      <input {...getInputProps()} />
                      {isDragOver ? (
                        <MousePointerSquareDashed className="h-6 w-6 text-zinc-500" />
                      ) : (
                        isUploading && (
                          <Loader2 className="animate-spin size-4 sm:size-6 text-zinc-500" />
                        )
                      )}
                      <div className="flex flex-col items-center justify-center text-[0.7rem] text-zinc-700">
                        {isUploading ? (
                          <div className="flex-col hidden sm:flex items-center justify-center">
                            <p>Uploading...</p>
                            <Progress
                              value={uploadProgress}
                              className="mt-2 h-2 bg-gray-300"
                            />
                          </div>
                        ) : isDragOver ? (
                          <p className="hidden sm:block">
                            <span className="font-semibold">Drop file</span> to
                            upload
                          </p>
                        ) : imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="profile"
                            className="size-10 sm:size-28 rounded-full object-cover"
                          />
                        ) : (
                          <p className="font-semibold">Drag and drop</p>
                        )}
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>
            </div>
            <div>
              <p>
                <span className="font-bold">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs">
                Please choose a <span className="font-semibold"> PNG</span>,{' '}
                <span className="font-semibold">JPG</span>, or{' '}
                <span className="font-semibold">JPEG</span> image
              </p>
            </div>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <div className="flex-grow">
                      <FormMessage className="text-xs" />
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <p
                        className={cn('text-xs', {
                          'text-red-500': usernameLength && usernameLength > 10
                        })}>
                        {usernameLength || 0}/10
                      </p>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <div className="flex-grow">
                      <FormMessage className="text-xs" />
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <p
                        className={cn('text-xs', {
                          'text-red-500': bioLength && bioLength > 260
                        })}>
                        {bioLength || 0}/260
                      </p>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={isPending} className="float-right" type="submit">
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
