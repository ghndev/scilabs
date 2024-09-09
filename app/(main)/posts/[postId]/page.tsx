import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { db } from '@/db'
import { formatDate, formatEnumValue } from '@/lib/utils'
import { CircleUser } from 'lucide-react'
import { notFound } from 'next/navigation'
import { EditorOutput } from '@/components/editor-output'
import { cache } from 'react'

interface PageProps {
  params: { postId: string }
}

const getPost = cache(async (postId: string) => {
  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })

  if (!post) {
    return notFound()
  }

  return post
})

export async function generateMetadata({ params: { postId } }: PageProps) {
  const post = await getPost(postId)

  return { title: `${post.title} by ${post.author.name}` }
}

export default async function Page({ params: { postId } }: PageProps) {
  const post = await getPost(postId)

  return (
    <MaxWidthWrapper className="max-w-[700px] mt-5 pb-12">
      <div className="text-white text-[0.65rem] w-fit py-1 px-2 bg-[#4B6BFB] rounded">
        {formatEnumValue(post.topic)}
      </div>
      <h1 className="text-2xl mt-2 font-bold">{post.title}</h1>
      <div className="flex items-center mt-3 mb-5 gap-3">
        <div className="flex items-center gap-1.5">
          {post.author.image ? (
            <img
              src={post.author.image}
              alt="user"
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <CircleUser className="text-primary h-6 w-6" strokeWidth={1} />
          )}
          <p className="text-[#696A75] text-xs font-semibold">
            {post.author.name}
          </p>
        </div>
        <p className="text-[#696A75] text-xs">{formatDate(post.createdAt)}</p>
      </div>
      <EditorOutput content={post.content} />
    </MaxWidthWrapper>
  )
}
