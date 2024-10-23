import { PostDetail } from './post-detail'

interface PageProps {
  params: { postId: string }
}

export default async function Page({ params: { postId } }: PageProps) {
  return <PostDetail postId={postId} />
}
