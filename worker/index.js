const VIDEO_PATH = '/stream/sax_1.mp4'
const VIDEO_ASSET_PATH = '/media/sax_1.mp4'
const RANGE_PATTERN = /^bytes=(\d*)-(\d*)$/

export function parseRange(header, size) {
  const match = RANGE_PATTERN.exec(header.trim())
  if (!match) return null

  let start = match[1] === '' ? NaN : Number(match[1])
  let end = match[2] === '' ? NaN : Number(match[2])
  if (Number.isNaN(start) && Number.isNaN(end)) return { invalid: true }

  if (Number.isNaN(start)) {
    start = Math.max(size - end, 0)
    end = size - 1
  } else if (Number.isNaN(end)) {
    end = size - 1
  }

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || start > end) {
    return { invalid: true }
  }

  return { start, end: Math.min(end, size - 1) }
}

function responseHeaders(asset, overrides = {}) {
  const headers = new Headers(asset.headers)
  headers.set('Accept-Ranges', 'bytes')
  for (const [name, value] of Object.entries(overrides)) headers.set(name, value)
  return headers
}

function assetRequest(url, method) {
  const assetUrl = new URL(url)
  assetUrl.pathname = VIDEO_ASSET_PATH
  assetUrl.search = ''
  return new Request(assetUrl.toString(), { method })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname !== VIDEO_PATH) return env.ASSETS.fetch(request)

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
    }

    const rangeHeader = request.headers.get('Range')
    if (!rangeHeader) {
      const asset = await env.ASSETS.fetch(assetRequest(url, request.method))
      return new Response(asset.body, {
        status: asset.status,
        statusText: asset.statusText,
        headers: responseHeaders(asset),
      })
    }

    const asset = await env.ASSETS.fetch(assetRequest(url, 'GET'))
    if (!asset.ok) return asset

    const size = Number(asset.headers.get('Content-Length'))
    if (!Number.isSafeInteger(size) || size <= 0) return asset

    const range = parseRange(rangeHeader, size)
    if (range?.invalid) {
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${size}`, 'Accept-Ranges': 'bytes' },
      })
    }
    if (!range) return asset

    const headers = responseHeaders(asset, {
      'Content-Length': String(range.end - range.start + 1),
      'Content-Range': `bytes ${range.start}-${range.end}/${size}`,
    })

    if (range.start === 0 && range.end === size - 1) {
      return new Response(request.method === 'HEAD' ? null : asset.body, { status: 206, headers })
    }

    const buffer = await asset.arrayBuffer()
    const chunk = buffer.slice(range.start, range.end + 1)
    return new Response(request.method === 'HEAD' ? null : chunk, { status: 206, headers })
  },
}
