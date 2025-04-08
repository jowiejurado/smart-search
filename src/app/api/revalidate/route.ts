import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')
  const tag = request.nextUrl.searchParams.get('tag')

  if (!path && !tag) {
    return NextResponse.json({ message: 'Missing path or tag param' }, { status: 400 })
  }

  if (tag) {
    revalidateTag(tag)
  } else if (path) {
    // This doesn't work for dynamic paths
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: true, now: Date.now(), type: tag ? 'tag' : 'path', value: tag || path })
}
