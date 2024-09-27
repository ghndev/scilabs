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

interface ProfileProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  user: UserData
}

export function Profile({ isOpen, setIsOpen, user }: ProfileProps) {
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageUrl, setImageUrl] = useState(user.image || '')

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onUploadProgress(p) {
      setUploadProgress(p)
    },
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        setImageUrl(res[0].url)
        toast({
          title: 'Image uploaded successfully',
          description: 'Your profile picture has been updated.'
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
                          <Loader2 className="animate-spin h-6 w-6 text-zinc-500" />
                        )
                      )}
                      <div className="flex flex-col items-center justify-center text-[0.7rem] text-zinc-700">
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center">
                            <p>Uploading...</p>
                            <Progress
                              value={uploadProgress}
                              className="mt-2 h-2 bg-gray-300"
                            />
                          </div>
                        ) : isDragOver ? (
                          <p>
                            <span className="font-semibold">Drop file</span> to
                            upload
                          </p>
                        ) : imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="profile"
                            className="size-10 md:size-28 rounded-full object-cover"
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
                <span className="font-bold text-zinc-700">Click to upload</span>{' '}
                or drag and drop
              </p>
              <p className="text-xs">
                Please choose a <span className="font-semibold"> PNG</span>,{' '}
                <span className="font-semibold">JPG</span>, or{' '}
                <span className="font-semibold">JPEG</span> image
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
