import { useRef, useState } from 'react'
import { media } from '../config'

export function VideoSection() {
  const video = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState(false)
  async function play() {
    try {
      await video.current?.play()
      setStarted(true)
    } catch { setError(true) }
  }
  return <section className="video-section section" id="video">
    <div className="section-heading reveal"><span className="eyebrow">Живой звук</span><h2>Музыка, которую<br /><em>хочется слушать</em></h2><p>Лучше один раз услышать.</p></div>
    <div className="video-layout reveal">
      <div className="video-frame">
        <div className="video-stage">
          <video ref={video} controls playsInline preload="none" poster={media.poster} aria-label="Живое выступление Олега Цапенко" onPlay={() => { setStarted(true); setError(false) }} onError={() => setError(true)} src={media.video} />
          {!started && !error && <button className="play-button" onClick={play} aria-label="Воспроизвести выступление"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4 21 12 8 20Z" fill="currentColor" /></svg></button>}
        </div>
        {error && <p className="video-error" role="status">Не удалось воспроизвести видео. <a href={media.videoAsset} target="_blank" rel="noreferrer">Открыть видео</a></p>}
        <div className="video-caption"><span>Живое выступление</span><span>01 / 01</span></div>
      </div>
      <div className="video-note"><span className="quote-mark" aria-hidden="true">“</span><p>Саксофон умеет говорить там, где слов становится мало.</p><span className="line" /><span className="eyebrow">Бирск · Башкортостан</span></div>
    </div>
  </section>
}
