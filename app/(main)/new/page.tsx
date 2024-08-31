import { validateRequest } from '@/auth'
import { Editor } from './editor'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { user } = await validateRequest()

  if (!user) {
    return redirect('/login')
  }

  return <Editor />
}