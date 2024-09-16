import { getPost } from './actions'
import { PostDetail } from './post-detail'

interface PageProps {
  params: { postId: string }
}

export async function generateMetadata({ params: { postId } }: PageProps) {
  const post = await getPost(postId)

  return { title: `${post.title} by ${post.author.name}` }
}

export default async function Page({ params: { postId } }: PageProps) {
  return <PostDetail postId={postId} />
}
