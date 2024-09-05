'use client'

import dynamic from 'next/dynamic'

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
)

interface EditorOutputProps {
  content: any
}

const style = {
  paragraph: {
    lineHeight: '1.6em',
    margin: '.4em 0'
  }
}

export function EditorOutput({ content }: EditorOutputProps) {
  return <Output style={style} data={content} />
}
