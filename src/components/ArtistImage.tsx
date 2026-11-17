import { useState, type ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }

export function ArtistImage({ src, alt, className, ...props }: Props) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className={`image-fallback ${className ?? ''}`} role="img" aria-label={alt}>Фотография временно недоступна</span>
  const width = src.includes('oleg-portrait') ? 1086 : src.includes('cafe-portrait') ? 941 : 1672
  const height = src.includes('oleg-portrait') ? 1448 : src.includes('cafe-portrait') ? 1672 : 941
  return <img src={src} alt={alt} className={className} width={width} height={height}
    srcSet={`${src.replace('.webp', '-800.webp')} 800w, ${src} ${width}w`}
    sizes={className === 'hero-media' || src.includes('guitar-duo') ? '100vw' : '(max-width: 767px) 86vw, 500px'}
    onError={() => setFailed(true)} {...props} />
}
