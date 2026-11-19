# Проверка — 2026-11-17

## Сборка и зависимости
- `npm run build`: exit 0 (TypeScript + Vite).
- `npm run typecheck`: exit 0.
- Установка основных зависимостей: npm audit 0 vulnerabilities.
- Runtime: React, React DOM, GSAP; без 3D и дополнительных UI-библиотек.

## Браузер OpenCode
- Dev: localhost:5180; production preview: localhost:5181.
- Ширины проверены в same-origin iframe с настоящим viewport каждой ширины; не масштабированием desktop-страницы.

| Ширина | Горизонтальное переполнение | Видео | Фотоблок |
|---:|---|---|---|
| 320 | нет | 9:16 | 4:5 |
| 375 | нет | 9:16 | 4:5 |
| 390 | нет | 9:16 | 4:5 |
| 768 | нет | 9:16 | 4:5 |
| 1024 | нет | 9:16 | 4:5 |
| 1440 | нет | 9:16 | 4:5 |

- Все шесть проверок: один H1, заголовок в пределах viewport, autoplay=false.
- Изображения просмотрены при последовательной прокрутке всех секций; naturalWidth > 0.
- Исходная ошибка высоты café-фото выявлена на full-page screenshot; исправлена явным height:auto. Повторный замер на всех ширинах: отношение 0.8.
- Видео до Play: readyState=0, paused=true, preload=none, 0 media requests.
- Клик по большой кнопке Play: paused=false, error=null. После оптимизации 2026-11-19 видео 1080×1920, длительность 27.5 с. Пауза: paused=true.
- Fullscreen API: вызов из встроенного браузера дал тайм-аут; последующая проверка fullscreen=false, документ доступен. Результат не считается успешным тестом fullscreen.
- Café-фото открывает именно café; Escape закрывает. Ошибка возврата фокуса в React StrictMode воспроизведена и устранена закрытием native dialog в effect cleanup; повторная проверка focusReturned=true.
- Якорь «Послушать выступление» переводит к #video; навигационные цели существуют.
- Телефонные ссылки: tel:+79224640857. Telegram-ссылка не выдумана.
- MAX: открывается страница Oleg Tsapenko с действиями «Отправить сообщение» и «Открыть в браузере»; сообщение не отправлялось.
- Production console errors: []; failed resource requests: [].
- Reduced motion: GSAP matchMedia и CSS отключение движений проверены в коде; переключение системной настройки не автоматизировалось.

## Lighthouse
`lighthouse.json` и `lighthouse.html`: Accessibility 1.0, Best Practices 1.0, SEO 1.0, failures=[]; Performance инструментом не измеряется.

## Ревью
Один независимый review исходного кода: важных/критических дефектов не найдено. Упоминание отсутствующего Telegram сделано условным. Размеры мелких текстов увеличены. Абсолютный OG URL отложен до получения домена.

## Обновление — 2026-11-19 (публикация и оптимизация)

- Видео перекодировано: 19 326 111 байт (18,4 МиБ), 1080×1920, 27,5 с, H.264 High CRF 23, AAC 192 kbps, `faststart`; SSIM 0.989 относительно исходника.
- Production preview: видео воспроизводится, `paused=false`, `readyState=4`, `duration=27.515`, `error=null`; медиазапрос отдаётся с кодом 206.
- Мобильные viewport 390×844 и 320×700: горизонтального переполнения нет, видео 9:16, кнопки MAX и «Позвонить» с корректными `href`.
- Повторный Lighthouse: Accessibility **1.0**, Best Practices **1.0**, SEO **1.0**, failures=[].
- `npm run build`: exit 0; в `dist` 29 файлов, 29,6 МБ, максимальный файл 19,3 МБ, файлов >25 МиБ нет; `performance.mp4` отсутствует, `_headers` присутствует.
- Неиспользуемый `public/media/optimized/performance.mp4` (44,4 МиБ) удалён из публикуемого дерева; резервная копия — в игнорируемой `.tools/source/`, история Git сохранена.
- Битая ссылка `/media/Vid_sax.mp4` в сообщении об ошибке видео заменена на актуальный `media.video`.
- Push `90cfae2..b2f085e` выполнен в `origin/github-publication` без force.

## Живой сайт — 2026-11-19

- URL: **https://oleg-saxophone.tsapenkooleg89.workers.dev**; HTTPS работает, сертификат Cloudflare.
- Фактический тип публикации — Cloudflare Worker со static assets, не Pages. Git-интеграция настроена: repo `tsapenkooleg/oleg-saxophone`, production branch `github-publication`, build `npm run build`, deploy `npx wrangler deploy`, root `/`.
- Контент, шрифты, изображения и оптимизированное видео загружаются; консоль без ошибок.
- Кэширование: `/assets/*` и `/fonts/*` — `public, max-age=31536000, immutable`; `/media/*` — `public, max-age=604800`.
- Мобильные 390×844 и 320×700 на живом домене: горизонтального переполнения нет, видео 9:16, кнопки MAX и «Позвонить» с корректными `href`, битых изображений нет.
- Видео на живом домене воспроизводится: `paused=false`, `currentTime>0`, `readyState=4`, `duration=27.515`, `error=null`, 1080×1920.
- Ограничение Workers static assets: запрос `Range` возвращал `200` и весь файл без `Content-Range`/`Accept-Ranges`.
- Первая версия Range-фикса использовала `run_worker_first: ["/media/sax_1.mp4"]`. На живом Worker обычный GET обрабатывался Worker, но Range-запрос к тому же URL edge отдавал напрямую (`200`, полный файл, без `Accept-Ranges`), даже с `Authorization`, `no-store` и версионного preview-домена.
- Рабочая схема: видео публикуется по нестатическому пути `/stream/sax_1.mp4`; Worker вызывается для него всегда и читает файл из `/media/sax_1.mp4` через `env.ASSETS`. Остальные ассеты идут напрямую.
- Локальный preview: `/stream/sax_1.mp4` → 302 → `/media/sax_1.mp4`; Range-запрос после перехода — `206`, `Content-Range: bytes 0-1023/19326111`. В браузере видео играет: `readyState=4`, `duration=27.515`, 1080×1920, `error=null`.
- Тесты `worker/range.test.mjs` — 8/8 pass; проверка на реальном файле 19 326 111 байт (начало, середина, хвост, суффикс, полный диапазон, HEAD, 416, обычный GET) — pass; `wrangler deploy --dry-run` — успешно (33 ассета, Worker 3,16 KiB).

## Ограничения
Нет Telegram URL и собственного домена. Не проверялись физические мобильные устройства и фактический fullscreen во встроенном Chromium. Видео оптимизировано до 19,3 МБ и загружается по запросу пользователя, не на первом экране. Range-фикс требует публикации и проверки на реальном Safari/iPhone; в текущем окружении доступен только Chromium.
