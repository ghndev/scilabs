import { db } from '@/db'
import { PostDetail } from './post-detail'

interface PageProps {
  params: { postId: string }
}

async function getPost(postId: string) {
  const post = db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: true
    }
  })

  return post
}

export async function generateMetadata({ params: { postId } }: PageProps) {
  const post = await getPost(postId)

  if (!post) {
    return { title: 'Post not found' }
  }

  return { title: `${post.title} by ${post.author.name}` }
}

export default async function Page({ params: { postId } }: PageProps) {
  return <PostDetail postId={postId} />
}
