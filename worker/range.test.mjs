import assert from 'node:assert/strict'
import test from 'node:test'
import worker, { parseRange } from './index.js'

const body = new Uint8Array(1024).map((_, index) => index % 251)
const asset = () => new Response(body, {
  headers: {
    'Content-Type': 'video/mp4',
    'Content-Length': String(body.byteLength),
    'Cache-Control': 'public, max-age=604800',
  },
})
const env = { ASSETS: { fetch: async () => asset() } }
const request = (range) => new Request('https://example.com/media/sax_1.mp4', {
  headers: range ? { Range: range } : {},
})

test('parses closed, open and suffix ranges', () => {
  assert.deepEqual(parseRange('bytes=10-19', 100), { start: 10, end: 19 })
  assert.deepEqual(parseRange('bytes=90-', 100), { start: 90, end: 99 })
  assert.deepEqual(parseRange('bytes=-10', 100), { start: 90, end: 99 })
  assert.deepEqual(parseRange('bytes=0-999', 100), { start: 0, end: 99 })
  assert.deepEqual(parseRange('bytes=0-1,5-6', 100), null)
  assert.deepEqual(parseRange('bytes=100-', 100), { invalid: true })
  assert.deepEqual(parseRange('bytes=-0', 100), { invalid: true })
})

test('returns 206 with the requested bytes', async () => {
  const response = await worker.fetch(request('bytes=10-19'), env)
  assert.equal(response.status, 206)
  assert.equal(response.headers.get('Content-Range'), 'bytes 10-19/1024')
  assert.equal(response.headers.get('Content-Length'), '10')
  assert.equal(response.headers.get('Accept-Ranges'), 'bytes')
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), body.slice(10, 20))
})

test('streams a full open range as 206', async () => {
  const response = await worker.fetch(request('bytes=0-'), env)
  assert.equal(response.status, 206)
  assert.equal(response.headers.get('Content-Range'), 'bytes 0-1023/1024')
  assert.equal(response.headers.get('Content-Length'), '1024')
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), body)
})

test('rejects an unsatisfiable range', async () => {
  const response = await worker.fetch(request('bytes=1024-'), env)
  assert.equal(response.status, 416)
  assert.equal(response.headers.get('Content-Range'), 'bytes */1024')
})

test('adds Accept-Ranges to ordinary media responses', async () => {
  const response = await worker.fetch(request(null), env)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Accept-Ranges'), 'bytes')
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), body)
})
