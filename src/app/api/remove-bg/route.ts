import { NextRequest, NextResponse } from 'next/server'

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY
const API_URL = 'https://api.remove.bg/v1.0/removebg'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image_file')

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (!REMOVE_BG_API_KEY) {
      return NextResponse.json({ error: 'remove.bg API key not configured' }, { status: 500 })
    }

    // Forward to remove.bg
    const rbFormData = new FormData()
    rbFormData.append('image_file', imageFile)
    rbFormData.append('size', 'auto')
    rbFormData.append('format', 'png')

    const rbResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: rbFormData,
    })

    if (!rbResponse.ok) {
      const errorText = await rbResponse.text()
      return NextResponse.json({ error: `remove.bg error: ${errorText}` }, { status: rbResponse.status })
    }

    const resultBuffer = await rbResponse.arrayBuffer()

    return new NextResponse(resultBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
