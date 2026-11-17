# Korean Academy: Security

Status: policy document for milestone M0 onward. **No security audit has been performed, and this document does not mean the application is secure.** It records the rules we commit to following and the checks we will run. Update it whenever the architecture changes.

## 1. Scope and how to read this document

Korean Academy is an offline-first, accountless web, PWA and Android app. It has no backend, no login, no analytics and no network calls required for core features. That removes whole classes of risk, so many common checklist items do not apply. Each rule below is labelled:

- **NOW**: applies to the current architecture.
- **WHEN**: becomes mandatory the moment a named feature is introduced.
- **N/A**: not applicable to the current architecture. Do not add the feature just to satisfy a checklist.

## 2. Principles

1. **Minimise what exists.** Fewer dependencies, permissions, network calls and stored data mean fewer things to attack.
2. **Never trust input.** Backup files, content packs, URLs and stored data are all treated as untrusted until validated.
3. **Secrets never ship.** Anything in the browser or the APK is public. A secret in frontend code is not a secret.
4. **Be honest about protection.** We never claim protection we have not built (see section 8).
5. **Privacy by default.** The app collects nothing. Anything optional is off until the user turns it on.
6. **Security is part of done.** A milestone is not finished until its security checks (section 12) pass.

## 3. Assets and threat model

### Assets worth protecting

| Asset                                                                      | Why it matters                                         |
| -------------------------------------------------------------------------- | ------------------------------------------------------ |
| Learner's local data (progress, review cards, writing drafts, saved words) | Personal, and lost work is lost motivation             |
| Voice recordings (Speaking Lab, M8)                                        | Biometric-adjacent personal data                       |
| Backup files the user exports                                              | Plain copies of all of the above                       |
| Source repository and GitHub account                                       | Whoever controls these controls what users run         |
| Deployed website and service worker                                        | A tampered site runs attacker code in the app's origin |
| Android signing key (from M3)                                              | Whoever holds it can publish updates as us             |
| Content integrity                                                          | Wrong or altered lessons teach wrong Korean            |

### Realistic threats

| Threat                              | Example                                                        | Relevant when                       |
| ----------------------------------- | -------------------------------------------------------------- | ----------------------------------- |
| Malicious or vulnerable dependency  | A compromised npm package runs code in the build or in the app | NOW                                 |
| Leaked secret                       | A keystore or key committed to the public repo                 | NOW                                 |
| Cross-site scripting (XSS)          | Untrusted text rendered as HTML reads IndexedDB                | NOW (design), WHEN user text exists |
| Malicious backup or content file    | Oversized, malformed or crafted JSON                           | WHEN M2                             |
| Shared-origin access                | Another site on the same origin reads our storage              | WHEN M1 (hosting choice)            |
| Tampered release or deploy pipeline | Altered workflow, stolen account                               | NOW                                 |
| Over-broad Android configuration    | Debuggable build, cleartext traffic, extra permissions         | WHEN M3                             |
| Unintended data sharing             | Speech recognition sending audio to a cloud service            | WHEN M8                             |
| Abuse of a future AI endpoint       | Stolen key, runaway cost                                       | WHEN AI is introduced               |

### Out of scope (we cannot defend against these)

- Someone with an unlocked device, or a rooted or malware-infected device.
- A user deliberately editing their own local data. It is their data, and nothing in the app grants privileges based on it.
- Nation-state attackers.

## 4. Trust boundaries

| Boundary                                                    | Rule                                                                                |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Our source code and bundled content (inside the build)      | Trusted after review. Content packs are validated anyway, to catch our own mistakes |
| npm packages                                                | Semi-trusted. Locked, audited and minimised                                         |
| Backup files the user imports                               | **Untrusted**                                                                       |
| Any downloaded content pack (if ever added)                 | **Untrusted** until hash and schema checks pass                                     |
| Text the user types (drafts, notes)                         | **Untrusted for rendering.** Always shown as text, never as HTML                    |
| URLs, query strings and the URL hash                        | **Untrusted**                                                                       |
| Data read back from IndexedDB                               | Validated where its shape matters (it may be old, corrupt or edited)                |
| Platform APIs (microphone, speech recognition, file picker) | Permissioned and treated as external. They may use the network                      |
| Any future backend or AI provider                           | **Untrusted network.** Holds secrets, never the client                              |

## 5. Security checklist

### Dependencies and supply chain

| Item                           | Status | Rule                                                                                                                                                                         |
| ------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Remove unused dependencies     | NOW    | Every package needs a reason and a user. Run `npx knip` or `npx depcheck` at each milestone and remove what is unused. Install a package in the milestone that first uses it |
| Scan for known vulnerabilities | NOW    | `npm audit` before every merge to `main` and every release. See section 7                                                                                                    |
| Review updates                 | NOW    | Read changelogs for major bumps. No blind `npm audit fix --force`                                                                                                            |
| CI workflow permissions        | NOW    | `permissions: contents: read` by default. Grant more only to the job that needs it                                                                                           |

### Secrets and configuration

| Item                                        | Status              | Rule                                                                                                                                |
| ------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Secrets and history scanning                | NOW                 | Scan before the first push and before each release (section 7). The repository is public, so assume anything committed is permanent |
| No API keys or credentials in frontend code | NOW                 | There are none. This rule is permanent (section 6)                                                                                  |
| Validate environment variables              | WHEN env vars exist | There are none today. If added, validate them with Zod at startup, fail loudly, and remember that every `VITE_` variable is public  |
| Debug features off in production            | NOW                 | Dev-only code is guarded by `import.meta.env.DEV`. No debug routes, logs of user data or test hooks in release builds               |
| Exposed files and source maps               | NOW                 | Inspect `dist/` after every production build (section 12). Source maps stay off unless deliberately enabled                         |

### Data and input

| Item                                                            | Status                                   | Rule                             |
| --------------------------------------------------------------- | ---------------------------------------- | -------------------------------- |
| Validate, sanitise and safely render user content               | NOW (design), WHEN first user text input | Render as text only. No raw HTML |
| Prevent XSS and HTML injection                                  | NOW                                      | Section 6                        |
| JSON import and export security                                 | WHEN M2                                  | Section 9                        |
| Protect IndexedDB; do not trust imported or modified local data | WHEN M2                                  | Section 8                        |

### Delivery

| Item                                           | Status           | Rule       |
| ---------------------------------------------- | ---------------- | ---------- |
| Security headers and CSP                       | WHEN M1 (deploy) | Section 10 |
| Android permissions, storage, WebView, plugins | WHEN M3          | Section 11 |
| Privacy and data minimisation                  | NOW              | Section 14 |

### Server-side items

| Item                                                                    | Status | Rule                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CORS                                                                    | N/A    | There is no backend. When one is introduced, allow only our own origins, never `*` with credentials                                                                                                                                                                             |
| Rate limiting                                                           | N/A    | There are no public APIs. WHEN an API or AI endpoint is introduced, it must have per-client and global limits and a spending cap                                                                                                                                                |
| Authentication, authorisation, password hashing, protected admin routes | N/A    | There are no accounts and none are planned. Do not add them to satisfy a checklist. If accounts are ever introduced, use a vetted identity provider and a slow password hash (Argon2id or bcrypt), enforce authorisation on the server only, and write a new threat model first |

## 6. Secure coding rules

1. **No raw HTML.** Never use `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval` or `new Function`. React escapes text by default. Do not bypass that. A lint rule banning these is a recommended addition (section 17).
2. **Content is data, not markup.** Lessons are structured JSON blocks (`explain`, `drill`, and so on) rendered by our components. If rich text is ever needed, use a small structured format that our code renders, not HTML strings.
3. **Safe links.** Only `https:`, and `mailto:` where genuinely needed. Reject `javascript:` and `data:` links. External links use `rel="noopener noreferrer"`.
4. **Inline SVG only from our own repository.** Never inline SVG that came from a user or a downloaded file, since SVG can carry scripts.
5. **Validate at every boundary** with Zod: content packs, backups, settings read from storage, and platform-adapter results.
6. **No secrets in code.** No keys, tokens, passwords or keystores in the repository, in `VITE_` variables, in `capacitor.config.ts` or in Android resources.
7. **Do not log personal data.** No logging of drafts, recordings or backup contents. Development logging is stripped or guarded for production.
8. **Fail safely.** A corrupt record or a bad import must produce a clear message and leave existing data untouched, not a crash or partial write.
9. **No unexplained network calls.** Core features make none. Any new call needs a documented reason, a user-visible switch and an update to the CSP.
10. **Least privilege everywhere**: CI tokens, Android permissions, Capacitor plugins, browser APIs.

## 7. Dependency and secret management

### Dependencies

- Commit `package-lock.json`. CI and fresh checkouts use `npm ci`.
- Add a package only after checking what it does, who maintains it, its licence and its install scripts. Prefer our own small module to a package that does one small thing.
- Review the lockfile diff in every pull request that changes dependencies.
- Keep Vite, Capacitor and the Vite dev server current, since development servers have had security fixes. Never expose the dev server to untrusted networks. Do not run `vite --host` on public Wi-Fi, and keep Codespaces forwarded ports private.

Commands (run in the project folder):

```bash
npm audit                 # known vulnerabilities, including dev tools
npm audit --omit=dev      # only what ships to users
npm audit signatures      # verifies registry signatures and provenance
npm outdated              # packages with newer versions
npx knip                  # unused files, exports and dependencies
```

Triage rules: a vulnerability in a package that ships to users is fixed or mitigated before the next release. A vulnerability only in a build tool is judged by whether it is reachable in our workflow. Record any accepted risk with a reason and a date in the pull request.

Planned automation (recommended for M1, not yet added): Dependabot version updates for `npm` and `github-actions`, GitHub's dependency-review action on pull requests, and CodeQL code scanning. All three are free for public repositories.

### Secrets

- `.gitignore` already excludes `.env` files. Android signing files get added to it before M3 (section 17).
- **If a secret is ever committed, deleting it is not enough.** Revoke or rotate it first, because the old value is already public. Then remove it from history (for example with `git filter-repo`) and confirm with a scan.
- Enable GitHub **secret scanning and push protection** for the repository (Settings, Code security).
- Scan locally before the first push and before each release, for example with gitleaks (check its current documentation for the exact command):

```bash
git ls-files                       # review exactly which files are tracked
gitleaks detect --source . -v      # scan the working tree and git history
```

- Secrets needed by CI (for example a release signing key, if we ever sign in CI) live only in GitHub Actions secrets, are used only by protected branches or tags, and are never printed.
- Protect the GitHub account: two-factor authentication, a recovery method, and review of connected apps. Do the same for the Google Play developer account.

## 8. Local data (IndexedDB)

What is true and what is not:

- **IndexedDB is not encrypted.** Anyone with access to the unlocked device, the browser profile, a rooted device or a device backup can read the data. We provide no encryption at rest, and the app must never say or imply otherwise.
- Storage is isolated per origin by the browser, and on Android by the app's WebView. That separates it from other sites and apps. It does not separate it from other code running in our own origin, which is why XSS prevention and a strict CSP matter.
- **Shared-origin risk (decide at M1).** GitHub Pages serves every repository of a user under one origin (`mancy07.github.io`). Another page on that origin could read this app's IndexedDB. Prefer a host that gives the app its own origin (a custom domain, or Cloudflare Pages' own subdomain), or keep that origin free of any other site.
- Data read back from storage can be old, corrupt or hand-edited. Repositories validate the shape of records where code depends on it, and migrations are versioned and tested.
- **Nothing is trusted for security decisions.** The app has no privileges, payments or accounts, so edited local data can only affect that user's own experience. Keep it that way: never gate anything with real consequences on local data.
- Namespace database names (`korean-academy-user`, and so on) and never store secrets in IndexedDB or `localStorage`.
- Recordings (M8) stay on the device, have a delete-all control, and are never uploaded without explicit, informed opt-in.
- Optional backup encryption is a possible future feature using the Web Crypto API. Until it exists, backups are plain text and the export screen says so.

## 9. Backup export and import (WHEN M2)

Export:

- Produce plain JSON with a `schemaVersion`, app version and date. Include no secrets.
- Warn the user that the file is **not encrypted** and contains their study data.
- Recordings are excluded from the default JSON backup (large and sensitive). If offered, they are an explicit, separate option.

Import (treat the file as hostile):

1. **Check size first.** Read `file.size` before reading contents and reject anything over a fixed limit (to be set in M2, for example a few tens of megabytes).
2. **Parse safely.** Wrap `JSON.parse` in `try/catch`. Never `eval`. Never merge parsed objects into existing objects with `Object.assign` or spread without validation, which avoids prototype pollution.
3. **Validate with Zod before touching the database.** Use strict schemas: unknown keys rejected or stripped, `schemaVersion` required, string lengths capped, array lengths capped, IDs matched against a pattern, numbers range-checked, dates parsed.
4. **Reject newer schema versions** than the app understands, with a clear message. Migrate older ones through tested migration functions.
5. **Preview, then confirm.** Show what will be imported (counts per table) and require confirmation before replacing data. Offer an automatic safety export of current data first.
6. **Write atomically.** Use one Dexie transaction for the whole import. On any failure, nothing changes.
7. **Never execute or render imported strings as markup.** Imported text goes through the same text-only rendering as typed text.
8. **Test with bad files:** empty, huge, truncated, wrong types, extra keys, `__proto__` keys, deeply nested, and wrong `schemaVersion`. These become permanent automated tests.

Content packs follow the same rules (Zod validation, size and count caps). Bundled packs ship inside the build. If downloadable packs are ever added, require HTTPS, a SHA-256 hash pinned inside the app (not served alongside the pack), and a size cap. A hash check proves integrity, not trustworthiness.

## 10. Web and PWA security

- **HTTPS only.** Required for service workers, microphone and PWA install, and enforced by our hosting choices.
- **Content Security Policy (decide at M1).** The goal is no inline scripts, no third-party origins, and no `eval`. A starting policy to _test_, not a proven one:

```text
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:;
font-src 'self'; media-src 'self' blob:; connect-src 'self'; worker-src 'self';
manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'
```

Points to settle with testing: how React and Motion apply styles, Vite's dev server (which needs looser rules than production, so apply the CSP to production builds only), and the Android WebView.

- **How headers are delivered depends on the host.** GitHub Pages cannot set custom response headers. A CSP can be set with a `<meta http-equiv>` tag, which cannot enforce `frame-ancestors` or reporting. Cloudflare Pages supports a `_headers` file for real headers (CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, a restrictive `Permissions-Policy`, `frame-ancestors 'none'`). The host choice is part of the M1 decision.
- **Service worker (M3).** Precache only our own files. Version the caches and show an update prompt. Do not cache third-party responses. Do not call `skipWaiting` without the user's consent. Remember that a service worker controls everything on its scope, so an XSS that registers one is serious.
- **No third-party requests.** Fonts are self-hosted, so no Google Fonts requests are made. Keep it that way.
- **Browser storage** holds only non-secret data (section 8).
- **Production build.** Source maps stay off. `vite preview` is for local checking only and is not a production server.

## 11. Android and Capacitor security (WHEN M3)

Checks before the first Android build and again before every release:

- **Application ID** `io.github.mancy07.koreanacademy` is permanent. Never reuse it for experiments.
- **No remote code in release.** Remove `server.url` (a development live-reload setting) and any `allowNavigation` entries from release builds. The app loads only its own bundled files. The `androidScheme: 'https'` setting serves them from a stable local origin.
- **Cleartext traffic off.** No `http://` content, no mixed content.
- **Not debuggable.** Release builds are non-debuggable. WebView debugging is enabled only for debug builds.
- **Permissions: ask for the minimum.** Review `AndroidManifest.xml` after generation, because the template adds some defaults. Request `RECORD_AUDIO` only when the Speaking Lab exists, and at the moment of use, not at launch. Request no location, contacts, camera or broad storage access.
- **Plugins.** Add only the Capacitor plugins a milestone needs, keep them current, and review what each one's permissions add to the manifest. Prefer official Capacitor plugins. Treat community plugins as third-party code.
- **Exported components.** Every activity, service or receiver is `android:exported="false"` unless it must be public. Add no deep links or intent filters unless a feature requires them.
- **Android backup.** Auto Backup can copy app data to the user's Google account. Decide deliberately at M3: allow it only if restore is tested, otherwise disable it and rely on the JSON export. Document the choice.
- **File export.** Use the system share sheet or file picker and the app's own directories, not broad storage permissions.
- **Signing.** Use Play App Signing. Keep the upload key offline and backed up. Never commit keystores or `keystore.properties`.
- **Data safety.** Google Play requires a data-safety declaration and a privacy policy even for apps that collect nothing. State exactly what the app does.

## 12. Security review process

### Every milestone (before merging the last pull request)

- [ ] `npm audit --omit=dev` reviewed, and `npm audit` triaged
- [ ] `npx knip` or `npx depcheck` run; unused dependencies removed
- [ ] No new dependency without a recorded reason
- [ ] No new network call, permission or stored data type without a documented reason
- [ ] No raw HTML rendering introduced; user text rendered as text
- [ ] New file-input or parsing code validated with Zod and has bad-input tests
- [ ] CI is green: typecheck, lint, tests, build
- [ ] This document updated if the architecture changed

### Before GitHub publication (first push, M0)

- [ ] `git ls-files` reviewed: only intended files are tracked
- [ ] Secret scan of the working tree and history is clean
- [ ] `.env*` files and key material are excluded by `.gitignore`
- [ ] `package-lock.json` is committed
- [ ] Two-factor authentication is on for the GitHub account
- [ ] Secret scanning, push protection and private vulnerability reporting are enabled
- [ ] Branch protection on `main`: pull request and passing CI required

### Before web deployment (M1 and every deploy)

- [ ] Hosting choice gives the app its own origin, or the shared origin is verified empty (section 8)
- [ ] CSP and available headers are applied and tested in a production build
- [ ] The deploy job alone gets extra permissions, and only the ones it needs
- [ ] `npm run build`, then inspect `dist/` (below)
- [ ] The deployed site loads no third-party origins (check the browser's Network tab)
- [ ] After M3: the update flow works and a stale service worker cannot trap users

Production build inspection:

```bash
npm run build
find dist -name "*.map"                                       # expect nothing
grep -rniE "api[_-]?key|secret|token|BEGIN .*PRIVATE" dist    # review every hit
ls -R dist                                                    # nothing unexpected
```

### Before an Android release (M3 onward)

- [ ] Release build is signed, non-debuggable, with no `server.url`
- [ ] Manifest permissions reviewed against the list in section 11
- [ ] Exported components and backup setting reviewed
- [ ] No cleartext traffic; works in airplane mode
- [ ] Plugins and their permissions reviewed; versions current
- [ ] Data-safety form and privacy policy match the app's real behaviour
- [ ] Keystore stored safely and never committed
- [ ] Tested on a real device, including backup, import and restore

### After adding any third-party package, API or external content

- [ ] Licence checked and recorded (`docs/LICENSES_AND_CREDITS.md` for content)
- [ ] Maintainer, activity and install scripts checked
- [ ] `npm audit` and `npm audit signatures` re-run
- [ ] Bundle size and new network calls checked
- [ ] CSP, Android permissions and privacy statements updated
- [ ] External content validated against its schema and never rendered as HTML

## 13. Optional future AI integrations

AI is optional and must never be required for core learning (WHEN introduced).

- **Provider keys never appear in browser or Android code.** A key in the bundle can be extracted by anyone. Calls go through a small server-side proxy that holds the key.
- Introducing that proxy brings in the server-side items: strict CORS, per-client and global rate limits, a hard spending cap, input size limits, logging without personal content, and a new threat model.
- **Off by default.** An explicit opt-in screen says what is sent, to whom, and that it leaves the device.
- Send the minimum: never recordings, the backup file or unrelated study data without separate consent.
- Treat model output as untrusted text. Render it as plain text, never as HTML, and never let it trigger actions.
- Guard against prompt injection when a prompt includes user-supplied or imported text.
- The app must work fully when the AI feature is unavailable or disabled.
- Corrections from AI are not authoritative. The UI says so, to protect teaching accuracy.

## 14. Privacy

- **Collect nothing.** No analytics, advertising, tracking, crash-reporting SDKs, cookies or accounts.
- Study data stays on the device. Export is user-initiated and goes where the user sends it.
- Anything that reaches the network is disclosed in the interface. For example, platform speech recognition may send audio to a cloud service on some devices. The Speaking Lab states this before first use.
- The microphone is requested only when the user starts a recording, and recordings can be deleted individually or all at once.
- Provide a plain-language privacy statement before the first public release (and a Play Store privacy policy at M3).
- If we ever add telemetry, it is opt-in, anonymous, documented and reviewed against this section first.

## 15. Incident response basics

Roles: today the maintainer (`mancy07`) does everything. Keep a list of where credentials live.

| Scenario                    | First actions                                                                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secret committed            | Revoke or rotate it immediately. Remove from history. Re-scan. Check for any use of the secret                                                                   |
| Vulnerable dependency       | Check whether it is reachable in our code. Update or patch. Release if it ships to users                                                                         |
| Malicious package suspected | Stop installing and deploying. Compare the lockfile against the last known-good version. Pin or remove the package. Rotate any secrets the build could have seen |
| GitHub account compromise   | Reset the password, revoke sessions and tokens, review recent commits, workflows and repository settings, and re-enable two-factor authentication                |
| Bad release (web)           | Revert the deploy to the last good build. Fix forward in a pull request                                                                                          |
| Bad release (Android)       | Halt the staged rollout in Play Console. Publish a fixed version with a higher version code                                                                      |
| User data loss bug          | Stop the rollout. Reproduce with a test. Fix. Tell users how to recover from a backup if one exists                                                              |

General steps: **contain, assess, fix, release, review.** Record what happened, why, and what changed in the process. Tell affected users plainly and promptly when their data or safety could be affected.

## 16. Reporting a vulnerability

Please report suspected vulnerabilities privately through the **Report a vulnerability** option on this repository's Security tab (the maintainer must enable private vulnerability reporting in the repository settings). Do not open a public issue for a security problem. Include the steps to reproduce, the affected version and what you expect the impact to be. Reports are handled on a best-effort basis by a single maintainer.

## 17. Open items and recommended follow-ups

These are recorded here and are **not yet implemented**:

1. Decide at install time whether to defer packages that no code uses yet (`dexie`, `zustand`, `zod`, `@capacitor/core`, `@capacitor/cli`) until their milestones.
2. Add Android signing patterns (`*.keystore`, `*.jks`, `keystore.properties`) to `.gitignore` before M3.
3. Add an ESLint rule that bans `dangerouslySetInnerHTML` and similar, using core ESLint's `no-restricted-syntax`.
4. Add `persist-credentials: false` to the checkout step in `ci.yml`, and consider pinning third-party actions to commit SHAs.
5. Add Dependabot, dependency review and CodeQL (recommended with M1).
6. Choose a host with its own origin and a header strategy (M1).
7. Draft the CSP, test it against a production build, and document the result (M1).
8. Set the backup size limit and write the malformed-import test suite (M2).
9. Make the Android backup decision and review the generated manifest (M3).
10. Write the privacy statement before the first public release.
