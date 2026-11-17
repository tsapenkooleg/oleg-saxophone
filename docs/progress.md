# Implementation ledger

Plan: docs/superpowers/plans/2026-11-17-landing.md

- Initial checkpoint: 6fc6320; all five original media preserved.
- Ruling: use the explicitly requested project directory, a local feature branch, and a concise ledger; no external worktree because the user limits all work to this project.
- Ruling: supplied concept is approved; no repeat design questions or unnecessary agents. Native browser interaction checks suit this static low-risk landing better than implementation-mirroring unit tests.
- Pre-flight: config paths feed all components; optimized assets must exist before browser verification.
- Task 1 complete: React/Vite installed, originals unchanged, four full and four 800px WebP derivatives plus H.264/AAC video and poster generated. ffmpeg-static GitHub download failed with proxy 407; bundled npm ffmpeg binary succeeded. Tools isolated in ignored .tools.
- Task 2 complete: sections, contacts, native video/dialog, image fallbacks, responsive images, local fonts, reduced motion, SEO. Build and typecheck exit 0.
- Task 3 complete: browser six-width checks, video playback/pause, photo Escape/focus-return, navigation, MAX profile and phone URLs, resource and console checks. Lighthouse 100/100/100; screenshots and reports saved.
- Final review: one independent source review, no important/critical defects. Conditional Telegram wording and label-size polish incorporated during browser finishing. Absolute OG image URL deferred until deployment domain is supplied.
- Ruling: no invented Telegram URL or production domain; Telegram automatically appears when config is supplied, OG domain remains a deployment setting. Cost: Telegram unavailable until owner supplies it; social crawler preview needs absolute deployment URL.
- Ruling: fullscreen automation in embedded Chromium did not confirm a transition, so report it as unverified; native video controls retained. Cost: requires final check in the deployment browser/physical device.
- Runtime regressions found and fixed during visual QA: gallery height attribute overrode preferred ratio; explicit height:auto restores 4:5 on all six widths. StrictMode dialog cleanup now closes before focus restoration; browser verified false → true focus-return result.
