import { validateRequest } from '@/auth'
import { Editor } from '@/components/editor'
import { db } from '@/db'
import { Ban } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

interface PageProps {
  params: { postId: string }
}

export default async function Page({ params: { postId } }: PageProps) {
  const { user } = await validateRequest()

  if (!user) {
    return redirect('/login')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    return notFound()
  }

  if (post.authorId !== user.id) {
    return (
      <div className="mx-auto mt-20 text-3xl font-semibold text-destructive flex flex-col items-center gap-2 text-center">
        <Ban className="size-14" />
        You do not have permission
      </div>
    )
  }

  return <Editor initialData={post} postId={post.id} />
}
