import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Production serves /stream/sax_1.mp4 through the Worker with Range support.
// Locally, redirect it to the real asset so dev and preview behave the same.
function streamVideoFallback(): Plugin {
  const redirect = (req: { url?: string }, res: { statusCode: number; setHeader(name: string, value: string): void; end(): void }, next: () => void) => {
    if (req.url?.split('?')[0] === '/stream/sax_1.mp4') {
      res.statusCode = 302
      res.setHeader('Location', '/media/sax_1.mp4')
      res.end()
      return
    }
    next()
  }
  return {
    name: 'stream-video-fallback',
    configureServer(server) { server.middlewares.use(redirect) },
    configurePreviewServer(server) { server.middlewares.use(redirect) },
  }
}

export default defineConfig({ plugins: [react(), streamVideoFallback()] })
