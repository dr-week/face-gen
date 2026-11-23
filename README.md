<div align="center">

# Facegen

**A private, on-device workspace for preparing face-swap jobs.**

Select a source face and a target frame, validate and preview both locally, then stage the pair for processing — without a single byte leaving your machine.

[![Status](https://img.shields.io/badge/status-UI%20prototype-f59e0b?style=flat-square)](#status)
[![Platform](https://img.shields.io/badge/platform-Windows%2011-0078D6?style=flat-square&logo=windows&logoColor=white)](#requirements)
[![Privacy](https://img.shields.io/badge/privacy-100%25%20offline-52634d?style=flat-square)](#privacy-and-security-model)
[![License](https://img.shields.io/badge/license-not%20declared-b91c1c?style=flat-square)](#license)

[![Tauri](https://img.shields.io/badge/Tauri-2.12-24C8DB?style=flat-square&logo=tauri&logoColor=white)](https://tauri.app)
[![Solid](https://img.shields.io/badge/SolidJS-1.9-2C4F7C?style=flat-square&logo=solid&logoColor=white)](https://www.solidjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Rust](https://img.shields.io/badge/Rust-1.90%2B-000000?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org)

</div>

---

> [!IMPORTANT]
> **No swap engine yet.** This repository ships a finished image-selection and preview workspace. Face swapping, export and video are *not* implemented — the processing action is an intentionally disabled placeholder. See [Status](#status) before expecting output.

## Contents

- [Overview](#overview)
- [Status](#status)
- [Features](#features)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Image rules](#image-rules)
- [Architecture](#architecture)
- [Project layout](#project-layout)
- [Privacy and security model](#privacy-and-security-model)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [License](#license)

---

## Overview

Facegen is a desktop application built on **Tauri 2** with a **SolidJS** renderer. The interface follows a single, focused workflow: give it an identity and a frame, and it prepares the pair for processing locally.

The design goals are narrow and deliberate:

| Goal | How it is enforced |
| --- | --- |
| **Fully offline** | No network calls, no telemetry, no LLM, no cloud inference anywhere in the code |
| **Local by construction** | Images live in `blob:` URLs inside the renderer; nothing is written to disk or uploaded |
| **Minimal surface** | One screen, one stylesheet, no router, no state library, no CSS framework |
| **Hardened shell** | CSP locks IPC to self; the Rust side grants only `core:default` — no filesystem, shell or HTTP plugin |

## Status

The renderer is a working image workspace; the processing half is deliberately absent.

| Area | State |
| :--- | :--- |
| Source / target image selection | ✅ Works — file picker and drag-and-drop |
| Validation (type, size, dimensions, decode) | ✅ Works, with inline errors |
| Local previews, file name and size | ✅ Works |
| Remove or replace a selection | ✅ Works |
| `Prepare swap` action | ⏸️ Disabled placeholder — nothing behind it |
| Face swap, export, video | ❌ Not implemented |
| Rust backend | ⏸️ Bare Tauri shell — no custom commands, no extra plugins |

> Until a licensed offline model is integrated, treat this project as a UI and file-handling reference rather than a face-swap tool.

## Features

**Implemented**

- Two independent image slots — *Source face* (the identity) and *Target frame* (the image to transform).
- File picking **and** drag-and-drop per card, with a drag affordance that only reacts to real files.
- Full validation before a selection is accepted, with a readable inline error and the previous image preserved on failure.
- Lossless local previews with file name and human-readable size.
- Per-slot removal and replacement, including re-selecting the same file.
- Race-safe asynchronous decoding: a newer selection always wins and stale decodes are discarded.
- Object URLs revoked on replace, clear and unmount — no leaked `blob:` handles.
- Keyboard-accessible pickers: the hidden file input shows a focus ring on its dropzone.

**Deliberately missing**

- Inference of any kind; there is no model, runtime or weight in the repository.
- Export, batch processing, video, and settings.
- Persistence — selections are memory-only by design.

## Requirements

| Dependency | Version / note |
| :--- | :--- |
| **Node.js** | `^20.19.0` or `>=22.12.0` — required by Vite 8 and `sass-embedded` |
| **Rust** | 1.90+ with edition 2024 support (desktop shell only) |
| **Windows** | Visual Studio C++ Build Tools (MSVC) + WebView2 runtime |
| **Target platform** | WinML on Windows 11 24H2+, with an interchangeable CPU fallback |

The frontend alone (`npm run dev`) needs **Node only** — Rust is required just for the desktop build.

## Quick start

```bash
# 1 · Install exactly what the lockfile pins
npm ci

# 2 · Run the UI in a browser (fastest loop, no Rust needed)
npm run dev            # → http://localhost:5173

# 3 · Or run the real desktop window
npm run tauri dev
```

### Production build

```bash
npm run build          # tsc -b type check → Vite build into dist/
npm run preview        # serve the built output to sanity-check it
npm run tauri build    # packaged desktop installer (Cargo release)
```

`npm run build` is the fastest complete check: it type-checks `src/` under `noUnusedLocals` and `noUnusedParameters`, then bundles.

> [!NOTE]
> **Last verified** — TypeScript 7.0.2 · Vite 8.3.1 · 8 modules transformed in 1.37 s.
> `dist`: **16.77 kB JS** (6.90 kB gzip) · **5.07 kB CSS** (1.71 kB gzip).

## Scripts

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Vite dev server with HMR at `localhost:5173` |
| `npm run build` | `tsc -b` type check, then production Vite build into `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run tauri dev` | Desktop window; runs the Vite dev server for you |
| `npm run tauri build` | Packaged installer via a Cargo release build |

## Image rules

Both slots accept the same files and enforce identical limits (`maxImageBytes`, `maxImagePixels` in `src/App.tsx`):

| Rule | Value |
| :--- | :--- |
| Accepted types | JPEG · PNG · WebP · BMP (checked via `file.type`) |
| Maximum file size | **100 MB** |
| Maximum dimensions | **40 megapixels** |
| Decode check | `createImageBitmap` must succeed |

A rejected selection never clears the existing image. If a second file is chosen while the first is still decoding, only the newest one is kept.

## Architecture

```
┌──────────────────────────── Tauri 2 window ────────────────────────────┐
│                                                                        │
│  Renderer — WebView2                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  SolidJS  ·  src/App.tsx                                         │  │
│  │                                                                  │  │
│  │   picker / drag-drop ──► validate ──► decode ──► blob: preview   │  │
│  │        │                   │           │                         │  │
│  │        └── rejected ───────┴─── error ┘   (previous image kept)  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │  blob: URLs only                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Rust  ·  src-tauri/  — tauri::Builder::default()                │  │
│  │  no custom commands · permissions: core:default · no FS/shell/HTTP│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  CSP: script-src 'self' · connect-src ipc: http://ipc.localhost         │
└────────────────────────────────────────────────────────────────────────┘
                 no network · no telemetry · no model weights
```

**Stack decisions**

- **Tauri over Electron** — a native WebView shell with a small Rust core, without bundling a browser.
- **Solid over React** — fine-grained reactivity for a single-screen app, with no virtual DOM overhead.
- **SCSS + one stylesheet** — component styles in `App.scss`, tokens and resets in `index.css`; no framework.
- **No abstraction layers yet** — the app is one component until a real domain boundary appears.

## Project layout

```text
.
├── index.html                 Vite entry point
├── src/
│   ├── index.tsx              Renders <App/> into #root
│   ├── App.tsx                Whole UI: state, validation, drops, previews
│   ├── App.scss               Component styles
│   └── index.css              Global tokens and resets
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src-tauri/
│   ├── src/lib.rs             tauri::Builder::default(), no commands
│   ├── src/main.rs            Desktop entry point
│   ├── tauri.conf.json        Window, CSP, bundle targets, icons
│   ├── capabilities/default.json   core:default permissions only
│   ├── Cargo.toml             Tauri 2.12, edition 2024
│   └── icons/                 App icon set (Tauri logo — replace before release)
├── FACEGEN_PROMPT.md          Per-run build prompt + dated research notes
├── RUNS.md                    Run ledger: seeds, changes, measurements
└── package.json               Scripts and frontend dependencies
```

## Privacy and security model

| Layer | Guarantee |
| :--- | :--- |
| **Image handling** | Read in the renderer via `URL.createObjectURL`; displayed from `blob:` URLs only |
| **Persistence** | None. Images are never copied, cached to disk, or persisted |
| **Network** | CSP restricts `connect-src` to `ipc: http://ipc.localhost` — there is nothing to call home to |
| **Scripts** | `script-src 'self'` — no remote code, no inline scripts |
| **Backend** | Capability grants only `core:default`; no filesystem, shell or HTTP plugin |
| **Third parties** | No analytics, telemetry, LLM or cloud inference in the codebase |

Any future model or dependency **must run fully offline**. Do not add anything that downloads weights or media at runtime.

## Known limitations

- **No processing engine** — the core function of the app does not exist yet.
- **No automated tests, linter, formatter or CI** in the repository.
- **No license file** — treat the code as all rights reserved until one is added.
- **Windows only in practice** — macOS and Linux desktop builds are untested.
- **No performance data** — RAM, VRAM, GPU and latency cannot be measured without a runtime; none is bundled.

## Roadmap

Direction taken from [`FACEGEN_PROMPT.md`](FACEGEN_PROMPT.md); each item is gated on an offline-capable, license-compatible component.

1. Define the inference, media and model-management interfaces behind replaceable boundaries.
2. Integrate a licensed offline swap model with WinML on Windows 11 24H2+, plus a CPU fallback.
3. Add the processing pipeline, progress reporting and cancellation.
4. Add export with explicit output settings.
5. Introduce packaging for models *outside* the installer until license and distribution terms are settled.

## Documentation

| Document | Purpose |
| :--- | :--- |
| [`FACEGEN_PROMPT.md`](FACEGEN_PROMPT.md) | The per-run build prompt and the dated research behind the stack choices |
| [`RUNS.md`](RUNS.md) | Newest-first ledger of completed runs: seeds, changed paths, checks, measurements |

## License

No license has been declared for this project. Until one is added, all rights are reserved and no permission is granted for reuse, modification or distribution.

<div align="center">
<sub>Built for local work · Private by design</sub>
</div>
