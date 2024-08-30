export async function GET(req: Request) {
  const url = new URL(req.url)
  const href = url.searchParams.get('url')

  if (!href) {
    return new Response('Invalid href', { status: 400 })
  }

  try {
    const res = await fetch(href)

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const html = await res.text()

    const titleMatch = html.match(/<title>(.*?)<\/title>/)
    const title = titleMatch ? titleMatch[1] : ''

    const descriptionMatch = html.match(
      /<meta name="description" content="(.*?)"/
    )
    const description = descriptionMatch ? descriptionMatch[1] : ''

    const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/)
    const imageUrl = imageMatch ? imageMatch[1] : ''

    return new Response(
      JSON.stringify({
        success: 1,
        meta: {
          title,
          description,
          image: {
            url: imageUrl
          }
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching URL:', error)
    return new Response('Error fetching URL', { status: 500 })
  }
}
