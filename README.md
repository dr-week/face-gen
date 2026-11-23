# Facegen

Offline desktop workspace for preparing face-swap jobs. Pick a source face and a target image, validate and preview both locally, then stage the pair for processing.

Nothing is uploaded, nothing is sent to a cloud AI service, and no image data leaves the machine. The swap engine itself is **not implemented yet** — see [Status](#status).

## Status

The renderer is a working image workspace; the processing half is deliberately absent.

| Area | State |
| --- | --- |
| Source / target image selection | Works — file picker and drag-and-drop |
| Validation (type, size, dimensions, decode) | Works, with inline errors |
| Local previews, file name and size | Works |
| Remove / replace a selection | Works |
| "Prepare swap" action | Disabled placeholder — no model or runtime behind it |
| Face swap, export, video | Not implemented |
| Rust backend | Bare Tauri shell — no custom commands, no extra plugins |

Until a licensed offline model is integrated, the app is a UI and file-handling reference rather than a face-swap tool.

## Requirements

- **Node.js** `^20.19.0 || >=22.12.0` (required by Vite 8 and `sass-embedded`)
- **Rust** 1.90+ with edition 2024 support (desktop shell only)
- **Windows:** Visual Studio C++ Build Tools (MSVC) and WebView2 runtime
- **Target platform direction:** WinML on Windows 11 24H2+, with an interchangeable CPU fallback

The frontend alone (`npm run dev`) needs only Node.

## Getting started

```bash
npm ci            # reproducible install from package-lock.json
npm run dev       # Vite dev server at http://localhost:5173 (browser UI)
npm run tauri dev # desktop window, runs the Vite dev server for you
```

Build:

```bash
npm run build        # tsc -b type check, then Vite production build into dist/
npm run tauri build  # packaged desktop installer (Cargo release build)
npm run preview      # serve the built dist/ to check production output
```

`npm run build` is the fastest full check: it type-checks `src/` under `noUnusedLocals` / `noUnusedParameters` and fails on any error. Last verified: TypeScript 7.0.2 and Vite 8.3.1, `dist` at 16.77 kB JS (6.90 kB gzip) and 5.07 kB CSS (1.71 kB gzip).

## Image rules

Both slots accept the same files and enforce the same limits (`maxImageBytes`, `maxImagePixels` in `src/App.tsx`):

| Rule | Value |
| --- | --- |
| Accepted types | JPEG, PNG, WebP, BMP (`file.type` based) |
| Max file size | 100 MB |
| Max dimensions | 40 megapixels |
| Decode check | `createImageBitmap` must succeed |

A rejected or failed selection keeps the previous image. If a newer selection is made while an older one is still decoding, only the newest wins and the stale decode is discarded; object URLs are revoked on replace, clear and unmount.

## Project layout

```
index.html                 Vite entry
src/index.tsx              Renders <App/> into #root
src/App.tsx                Whole UI: selection state, validation, drop targets, previews
src/App.scss               Component styles
src/index.css              Global tokens and resets
public/                    favicon.svg, icons.svg
src-tauri/                 Tauri 2 shell
  src/lib.rs, main.rs      tauri::Builder::default() with no custom commands
  tauri.conf.json          Window, CSP, bundle targets, icons
  capabilities/default.json   core:default permissions only
  icons/                   App icon set (Tauri logo — replace before release)
FACEGEN_PROMPT.md          Build/run prompt and dated research notes
RUNS.md                    Run ledger: seed, change, checks, measurements
```

There is no router, state library, or CSS framework — Solid signals plus a single stylesheet. Keep it that way unless a real domain boundary appears.

## Privacy and security model

- Images are read in the renderer via `URL.createObjectURL` and displayed from `blob:` URLs; the app never copies, uploads, or persists them.
- The Tauri CSP is locked to self: `connect-src ipc: http://ipc.localhost`, `script-src 'self'`, `img-src 'self' asset: blob: data:`.
- The capability file grants only `core:default`; there is no filesystem, shell, or HTTP plugin, so the backend cannot read arbitrary paths.
- No telemetry, analytics, LLM, or network calls exist in the codebase.

Any future model or dependency must work fully offline. Do not add anything that downloads weights or media at runtime.

## Not verified / absent

- No tests, linter, formatter config, or CI workflow in the repo.
- No license file — treat the code as all rights reserved until one is added.
- macOS and Linux desktop builds are untested; only the Windows path is the stated target.
- Runtime RAM, VRAM, GPU, and latency numbers cannot be reported: no swap runtime is installed.

## Related docs

- [`FACEGEN_PROMPT.md`](FACEGEN_PROMPT.md) — the per-run build prompt and the dated research notes behind the stack choices.
- [`RUNS.md`](RUNS.md) — newest-first ledger of completed runs with seeds, changed paths, and measurements.
