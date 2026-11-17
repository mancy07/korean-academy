# Korean Academy

[![CI](https://github.com/mancy07/korean-academy/actions/workflows/ci.yml/badge.svg)](https://github.com/mancy07/korean-academy/actions/workflows/ci.yml)

An offline-first Korean language learning app, planned as a website, an installable PWA and an Android app, all built from one React and TypeScript codebase. It is free to use, with no ads, subscriptions, paid APIs or accounts.

It is aimed at English speakers who want to learn Korean from the alphabet upward, and at anyone who wants to study without needing an internet connection.

## Project status

**Milestone M0 (repository foundation) is in progress.** The project is an early foundation, not a usable learning app yet. No lessons, audio, dictionary data or study tracking exist.

### What exists today

- A React 19 + TypeScript (strict) + Vite + Tailwind CSS 4 application.
- Routing with React Router: one real page (the Desk home screen) and a "Page not found" screen.
- A responsive app shell: a bottom navigation bar on phones and a notebook-spine sidebar on larger screens, with a skip link, keyboard focus styles and reduced-motion support.
- The Desk home screen: a time-of-day Korean greeting and today's date, both read from the device clock, a list of the six planned stages (all marked "Planned") and honest empty states. It shows no progress, streaks or statistics, because none exist.
- Navigation items for Learn, Practice, Dictionary and Me are present but disabled, because those areas are not built.
- Tests for the app shell (Vitest and Testing Library).
- Tooling: ESLint, Prettier, Vitest and a GitHub Actions CI workflow.
- A prepared Capacitor configuration. There is no Android project yet.

### What is planned (not implemented)

The 12 modules: Learning Academy, Korean-English Dictionary, Grammar Centre, Vocabulary Studio, Conversation Lab, Listening Lab, Speaking Lab, Writing Studio, Reading Library, TOPIK Centre, Korean Culture Academy, and Progress and Analytics Centre. Also planned: an original K-Drama Korean Lab, a pronunciation system, interactive sentence building, offline data storage, PWA installation and the Android app.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the architecture and the milestone plan.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (22 LTS recommended)
- npm (included with Node.js)
- [Git](https://git-scm.com/)

## Installation

```bash
git clone https://github.com/mancy07/korean-academy.git
cd korean-academy
npm ci
```

`npm ci` installs the exact versions recorded in `package-lock.json`. Use `npm install` only when you are deliberately adding or updating a dependency.

## Development

```bash
npm run dev
```

Vite prints a local address, usually http://localhost:5173. Edits reload automatically.

## Scripts

| Command                | What it does                                         |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start the development server                         |
| `npm run build`        | Typecheck, then create a production build in `dist/` |
| `npm run preview`      | Serve the production build locally                   |
| `npm run typecheck`    | Check TypeScript types without building              |
| `npm run lint`         | Run ESLint                                           |
| `npm run format`       | Format all files with Prettier                       |
| `npm run format:check` | Check formatting without changing files              |
| `npm run test`         | Run the tests once                                   |
| `npm run test:watch`   | Run the tests and re-run on changes                  |

Before opening a pull request, run `npm run typecheck`, `npm run lint`, `npm run test` and `npm run build`. The CI workflow runs the same four checks.

## Project structure

```
.github/workflows/   CI workflow
docs/                Architecture document
src/
  app/               Router and layout (app shell)
  features/          One folder per feature or module (currently: home)
  styles/            Global stylesheet and design tokens
tests/               Test setup (tests for a file sit next to that file)
capacitor.config.ts  Android wrapper settings (no Android project yet)
```

More folders, such as `domain/`, `data/` and `platform/`, are added in the milestone that first needs them.

## Planned: PWA and Android

Not implemented yet. The intended approach:

- **PWA (milestone M3):** a service worker and web manifest so the website can be installed and used offline.
- **Android (milestone M3):** the same web build wrapped with [Capacitor](https://capacitorjs.com/). The application ID is `io.github.mancy07.koreanacademy`.

Both ship from the same `npm run build` output.

## Licence

The **application source code** in this repository is released under the [MIT Licence](LICENSE).

The MIT Licence covers **application code only**. Lesson content, illustrations, dictionary data, fonts and audio are separate works. Each keeps its own licence, which is verified and recorded in `docs/LICENSES_AND_CREDITS.md` (created when the first such asset is added) before it is included.
