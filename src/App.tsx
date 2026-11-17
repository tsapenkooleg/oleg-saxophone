import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact, media } from './config'
import { VideoSection } from './components/VideoSection'
import { PhotoDialog } from './components/PhotoDialog'
import { ArtistImage } from './components/ArtistImage'

gsap.registerPlugin(ScrollTrigger)

const events = [
  ['01', 'Свадьбы', 'Романтические мелодии для одного из самых важных дней.'],
  ['02', 'Юбилеи', 'Любимые композиции и тёплая атмосфера для близких людей.'],
  ['03', 'Корпоративы', 'Элегантное музыкальное сопровождение праздничного вечера.'],
  ['04', 'Романтические вечера', 'Особенное звучание для моментов, которые хочется помнить.'],
]

function MaxButton() {
  return <a className="button" href={contact.max} target="_blank" rel="noreferrer">
    <img className="max-icon" src="/max.svg" width="20" height="20" alt="" />Написать в MAX
  </a>
}

export default function App() {
  const [photo, setPhoto] = useState<{ src: string; alt: string } | null>(null)
  useEffect(() => {
    const match = gsap.matchMedia()
    match.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.hero-media', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out' })
      gsap.fromTo('.hero-copy > *', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9, stagger: .12, delay: .6, ease: 'power3.out' })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%' } }))
    })
    return () => match.revert()
  }, [])

  return <>
    <a className="skip-link" href="#video">Перейти к содержанию</a>
    <header className="nav">
      <a className="brand" href="#top"><span>ОЦ</span><small>ОЛЕГ ЦАПЕНКО</small></a>
      <nav aria-label="Основная навигация"><a href="#about">Об артисте</a><a href="#events">События</a><a href="#contacts">Контакты</a></nav>
      <a className="nav-contact" href={contact.max} target="_blank" rel="noreferrer" aria-label="Написать Олегу в MAX">MAX <span>↗</span></a>
    </header>
    <main id="top">
      <section className="hero">
        <ArtistImage className="hero-media" src={media.hero} fetchPriority="high" alt="Олег Цапенко играет на саксофоне на сцене" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow">Саксофонист · Бирск</span>
          <h1>ОЛЕГ<br /><span>ЦАПЕНКО</span></h1>
          <p className="hero-tagline">Музыка, которую чувствуют</p>
          <p className="hero-events">Свадьбы <i>•</i> Юбилеи <i>•</i> Корпоративы</p>
          <div className="hero-actions"><MaxButton /><a className="text-link" href="#video">Послушать выступление <span>↓</span></a></div>
        </div>
        <div className="hero-scroll" aria-hidden="true">Листайте вниз <span>↓</span></div>
      </section>

      <section className="about section" id="about">
        <div className="about-copy reveal">
          <span className="eyebrow">Об артисте</span>
          <h2><span className="artist-name">Олег Цапенко —</span>Музыка<br />с <em>характером</em></h2>
          <p>Саксофон для меня — больше, чем инструмент. Это возможность рассказать историю без единого слова.</p>
          <p>В моём музыкальном мире встречаются мягкий Smooth Jazz, энергия Jazz-Rock, романтические мелодии и любимые хиты разных поколений.</p>
          <p>За плечами — годы сценической практики, любовь к живому звуку и богатый музыкальный опыт.</p>
          <p>Каждое выступление — возможность создать особую атмосферу и подарить слушателям настоящие эмоции.</p>
        </div>
        <button className="portrait-wrap reveal" onClick={() => setPhoto({ src: media.portrait, alt: 'Студийный портрет Олега Цапенко' })} aria-label="Увеличить портрет Олега Цапенко">
          <ArtistImage src={media.portrait} loading="lazy" decoding="async" alt="Студийный портрет Олега Цапенко в костюме" />
          <span className="image-label">Олег Цапенко <b>↗</b></span>
        </button>
      </section>

      <section className="events section" id="events">
        <div className="section-heading reveal"><span className="eyebrow">Музыка для вашего события</span><h2>Каждому моменту<br /><em>своё звучание</em></h2></div>
        <div className="event-list">{events.map(([n, title, text]) => <article className="event reveal" key={title}>
          <span>{n}</span><h3>{title}</h3><p>{text}</p><b aria-hidden="true">↗</b>
        </article>)}</div>
      </section>

      <section className="atmosphere">
        <ArtistImage src={media.duo} loading="lazy" decoding="async" alt="Художественная сцена с саксофонистом и гитаристом" />
        <div className="atmosphere-shade" />
        <div className="atmosphere-copy reveal"><span className="eyebrow">Живой звук · особенная атмосфера</span><h2>У каждого праздника<br />есть своё <em>звучание</em></h2></div>
      </section>

      <section className="gallery section" aria-label="Фотография вне сцены">
        <button className="gallery-image reveal" onClick={() => setPhoto({ src: media.cafe, alt: 'Олег Цапенко в уютном кафе' })} aria-label="Смотреть фото Олега Цапенко в кафе">
          <ArtistImage src={media.cafe} loading="lazy" decoding="async" alt="Олег Цапенко в уютном кафе" />
          <span>Смотреть фото <b>↗</b></span>
        </button>
        <div className="gallery-copy reveal"><span className="eyebrow">Вне сцены</span><p>Тёплые моменты, живой разговор и музыка, которая остаётся с вами.</p></div>
      </section>

      <section className="steps section">
        <div className="section-heading reveal"><span className="eyebrow">Как заказать выступление</span><h2>Три шага до<br /><em>живой музыки</em></h2></div>
        <div className="step-list">{[
          ['01', 'Напишите', contact.telegram ? 'в MAX или Telegram' : 'в MAX — удобным сообщением'],
          ['02', 'Расскажите', 'о мероприятии и музыкальных пожеланиях'],
          ['03', 'Обсудим', 'репертуар, формат и стоимость выступления'],
        ].map(([n, title, text]) => <div className="step reveal" key={n}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
      </section>

      <VideoSection />

      <section className="contact-section" id="contacts">
        <div className="contact-inner reveal">
          <span className="eyebrow">Будем на связи</span>
          <h2>Пусть ваш праздник<br /><em>звучит красиво</em></h2>
          <p>Живой саксофон для особенных моментов.</p>
          <div className="contact-actions">
            <MaxButton />
            {contact.telegram && <a className="button button--outline" href={contact.telegram} target="_blank" rel="noreferrer">
              <svg className="max-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m21 3-3 18-6-5-3 3 1-6 8-7-10 6-6-2Z" /></svg>Telegram
            </a>}
            <a className="button button--outline" href={contact.phone}>Позвонить <span>↗</span></a>
          </div>
          <p className="booking-note">Свадьбы, юбилеи, корпоративы и частные праздники.<br />Стоимость выступления — по запросу.</p>
          <div className="contact-meta"><a href={contact.phone}>{contact.phoneLabel}</a><span>Бирск · Республика Башкортостан</span></div>
        </div>
      </section>
    </main>
    <footer><span>Олег Цапенко <i>•</i> Саксофонист <i>•</i> Бирск</span><span>© 2026</span></footer>
    {photo && <PhotoDialog {...photo} onClose={() => setPhoto(null)} />}
  </>
}
