# Korean Academy: Architecture

This is the repository's summary of the approved Master Technical Blueprint v1.2. Where this file and the blueprint disagree, the blueprint wins, and this file should be corrected.

## Current status: milestone M0

Most of what follows is a plan. This table separates what exists from what does not.

| Area                                                            | Status                             |
| --------------------------------------------------------------- | ---------------------------------- |
| React + TypeScript (strict) + Vite + Tailwind CSS foundation    | Implemented                        |
| React Router with the Desk route and a not-found route          | Implemented                        |
| Responsive app shell (bottom bar on phones, sidebar on desktop) | Implemented                        |
| Desk home screen with honest empty states                       | Implemented                        |
| Smoke tests for the app shell                                   | Implemented                        |
| ESLint, Prettier, Vitest, CI workflow                           | Implemented                        |
| Capacitor configuration file                                    | Prepared only (no Android project) |
| Dexie databases, content packs, backup                          | Not started (M2)                   |
| PWA service worker and manifest                                 | Not started (M3)                   |
| Android project                                                 | Not started (M3)                   |
| Design system beyond the shell's tokens                         | Not started (M4)                   |
| All 12 modules and all lesson content                           | Not started (M5 onward)            |

Installed but not yet used by any code: `dexie`, `zustand`, `zod`, `@capacitor/core`, `@capacitor/cli`.

## Technology

React, TypeScript (strict), Vite, Tailwind CSS, React Router, Dexie (IndexedDB), Zustand, Motion for React, Lucide icons, Zod, Capacitor, Vitest, ESLint and Prettier. Fonts are self-hosted so typography works offline.

## Layers (target design)

Dependencies point downward only.

1. **Presentation.** React components, pages and animation. Does not touch Dexie directly.
2. **Feature.** One folder per module under `src/features/`, owning its pages, components and hooks.
3. **Domain.** Pure TypeScript with no React or browser APIs: spaced-repetition scheduler, Hangul utilities, romanisation, quiz grading, sentence-builder rules, TOPIK scoring and analytics calculations. This layer is unit tested.
4. **Data.** Dexie databases and repositories. The only code that touches IndexedDB.
5. **Platform.** Thin adapters over browser and Capacitor APIs (audio, recording, text-to-speech, speech recognition, file export, haptics). Each has a web and an Android implementation behind one interface, so feature code never checks which platform it is on.

Today only layers 1 and 2 exist, and only for the home screen. Folders for the other layers are created when a milestone first needs them.

## Routing

React Router with `createBrowserRouter`. The base path comes from Vite's `BASE_URL`, so hosting under a sub-path (such as GitHub Pages) needs no code change. Modules add their own routes in the milestone that builds them. Navigation items without a real destination are shown disabled, and no placeholder pages exist.

## Styling

Tailwind CSS 4, configured in CSS. Design tokens (cream, lavender, pink and mint palettes, Hangul-friendly font stacks) live in `src/styles/index.css`. The shell includes stationery pieces such as notebook paper, washi tape and sticky notes. A fuller design system with per-module visual identities is milestone M4. Reduced-motion preferences are respected both in CSS and through Motion's `MotionConfig`.

## Offline-first direction

No core feature may require a network connection. The web app will precache its shell and content through a service worker (M3). The Android app will bundle the same build. User data stays on the device, with JSON backup export and import. There are no accounts.

## Data design (planned, M2 onward)

Content and user data are kept strictly apart.

- **`userDb`** (read and write): settings, lesson and activity progress, spaced-repetition cards and review logs, study sessions, quiz and TOPIK attempts, mistakes, bookmarks, writing drafts, recordings, reading and drama progress, unlocks.
- **`contentDb`** (read-only after import): content packs, stages, units, lessons, grammar points, vocabulary, sentences, dialogues, listening items, reading texts, TOPIK exams, culture articles, drama scenes, characters, memes, pronunciation rules and the audio manifest.
- **`dictionaryDb`**: entries, conjugated forms and examples, with indexes for Hangul, romanisation and English search.

Content ships as JSON packs validated with Zod. Packs carry a version and hash, so a content update never touches user progress. User data refers to content by stable string IDs. Analytics are computed from stored events and never from stored counters, so no statistic is invented.

## Curriculum

| Stage | Name               |
| ----- | ------------------ |
| 0     | Hangul Foundations |
| 1     | Beginner A         |
| 2     | Beginner B         |
| 3     | Intermediate       |
| 4     | Upper-intermediate |
| 5     | Advanced           |

Pronunciation (vowels, consonants, plain, tense and aspirated sounds, batchim, sound changes, romanisation) and sentence structure (SOV order, particles, endings, tenses, negation, politeness) run through the stages. Interactive sentence building is a domain module.

## The twelve modules

1. Learning Academy
2. Korean-English Dictionary
3. Grammar Centre
4. Vocabulary Studio
5. Conversation Lab
6. Listening Lab
7. Speaking Lab
8. Writing Studio
9. Reading Library
10. TOPIK Centre
11. Korean Culture Academy
12. Progress and Analytics Centre

An original K-Drama Korean Lab (fictional characters, branching scenes, memes) sits alongside them. None of these is implemented yet.

## PWA and Android (planned, M3)

`npm run build` outputs static files to `dist/`. The website and PWA serve that folder, with `vite-plugin-pwa` generating the service worker and manifest. Capacitor copies the same folder into an Android project and packages it, so all assets are inside the app. The application ID is `io.github.mancy07.koreanacademy`, and it becomes permanent once published to Google Play.

## Milestones

| Milestone | Outcome                                              |
| --------- | ---------------------------------------------------- |
| M0        | Repo foundation: tooling, minimal shell, routing, CI |
| M1        | Deploy the website from CI                           |
| M2        | Data foundation: Dexie, packs, backup                |
| M3        | PWA and Android                                      |
| M4        | Minimal design system                                |
| M5        | Stage 0 Hangul, first usable release                 |
| M6        | Lesson engine and spaced repetition                  |
| M7        | Dictionary and Grammar Centre                        |
| M8        | Listening, Speaking and Conversation                 |
| M9        | Reading and Writing                                  |
| M10       | K-Drama Lab                                          |
| M11       | TOPIK and Culture                                    |
| M12       | Progress Centre                                      |
| M13       | Content expansion and release                        |

## Licensing

Application code is MIT-licensed. Content, dictionary data, fonts and audio each keep a separately verified licence. These are recorded in `docs/LICENSES_AND_CREDITS.md` when the first such asset is added.
