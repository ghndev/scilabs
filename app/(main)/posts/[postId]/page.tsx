import { getPost } from './actions'
import { PostDetail } from './post-detail'

interface PageProps {
  params: { postId: string }
}

export async function generateMetadata({ params: { postId } }: PageProps) {
  const post = await getPost(postId)

  if (!post) {
    return { title: 'Post not found' }
  }

  return { title: `${post.title} by ${post.author.name}` }
}

export default async function Page({ params: { postId } }: PageProps) {
  const post = await getPost(postId)

  return <PostDetail post={post} />
}
