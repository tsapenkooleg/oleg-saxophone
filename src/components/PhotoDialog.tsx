import { useEffect, useRef } from 'react'

export function PhotoDialog({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const element = dialog.current
    element?.showModal()
    return () => { element?.close(); previous?.focus() }
  }, [])
  return <dialog ref={dialog} className="photo-dialog" aria-label="Увеличенная фотография" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
    <button className="dialog-close" onClick={onClose} aria-label="Закрыть фотографию" autoFocus>×</button>
    <img src={src} alt={alt} />
  </dialog>
}
