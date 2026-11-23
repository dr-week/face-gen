# Facegen build prompt

Paste this prompt into the Facegen project for each build run.

```text
Build Facegen as a private, fully offline face-swap desktop app. No LLMs, cloud AI, telemetry, or online-only runtime dependencies. Use strict TypeScript for UI, SCSS, and a small native backend. Prefer Rust/Tauri; keep inference, media processing, model management, and UI behind replaceable interfaces. Reuse licensed open-source components before writing replacements.

Research first on every run. Browse current GitHub repositories/releases, official documentation, papers, and comparable local media software. Record access date, source links, version/release status, license, offline requirements, platform limits, and measured performance where published. Distinguish facts from claims; do not treat search snippets, fork names, or unverified benchmark claims as evidence. Check model-weight licenses separately from code licenses. Never add a model or dependency that downloads at runtime.

Inspect the repository, instructions, git diff/status, and run ledger before changing files. Derive only verifiable unfinished work from code, failed checks, reproducible measurements, explicit requirements, or linked issues. If there are no verified tasks, report that and make no code changes. Exclude areas completed in the last three recorded runs. Make a task pool across applicable areas: architecture, UI/UX, computer vision, models, GPU, CPU, RAM, video, inference, performance, refactoring, testing, tooling. A task may cover more than one area.

Choose exactly one task using a reproducible weighted random draw. Record seed, pool, weights, draw, and selected task in the lean run ledger. Derive weights from explicit priority and evidence strength; do not alter them after seeing the draw. Use a logged deterministic PRNG, not an unexplained pick. Never invent APIs, unfinished tasks, or benchmark results.

Prefer current, future-facing technology only when it fits the actual platform and an isolated comparison shows a useful benefit. Treat experimental releases as experimental. Candidate stack to verify, not assume: TypeScript 7 native compiler, Solid 2, Tauri 3, Rust, WinML/ONNX Runtime, WebGPU/wgpu, Burn/CubeCL, FFmpeg, and local decision models such as Laya. Benchmark a suitable baseline before replacing working technology. TypeScript 7's native Go compiler is tooling, not a requirement to write app code in Go. Keep experimental adapters removable and fallbacks available.

Laya is a typed text-decision/System-1 model; do not call it a face detector, face embedder, swapper, or vision model without primary-source proof. Evaluate it only for a concrete local decision task. Do not add Jev when its use requires a remote service. Evaluate model architecture, weights, licence, offline provisioning, hardware support, memory, quality, and inference latency independently. Do not use LLMs to make or power face swaps.

UI target: minimal, premium, accessible, obvious. Organize navigation as group → section → tab → Advanced; move distinct workflows into separate sections when needed. Keep folders and docs minimal. Split modules by real domain boundaries; avoid speculative abstractions and dependencies. Preserve user data and existing changes.

Implement only the selected task. Run relevant tests/checks, then benchmark before/after when a measurable claim is made. Measure RAM, VRAM, CPU, GPU, startup, and latency where the current build and hardware make those measurements possible; report unavailable metrics and why. Also report bundle/binary size when relevant. Separate measured results from estimates and published upstream numbers. Update the run ledger with seed, selection, changed paths, commands/results, measurements, source links, and limitations. Ensure every completed run leaves the product measurably lighter, faster, cleaner, more modular, or more capable. If evidence does not support a beneficial change, stop and record why instead of padding the change.
```

## Research checked 2026-09-30

- [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/): native Go port; official post reports performance improvements. Compiler tooling, not app-language requirement.
- [Solid releases](https://github.com/solidjs/solid/releases): Solid 2 release candidates present; verify ecosystem compatibility before migration.
- [Tauri releases](https://github.com/tauri-apps/tauri/releases): Tauri 3 alpha alongside Tauri 2 releases; keep production shell on supported release absent a measured reason to switch.
- [ONNX Runtime Windows guidance](https://onnxruntime.ai/docs/get-started/with-windows.html): WinML recommended for Windows 11 24H2+; provider selection adapts to hardware. [DirectML](https://onnxruntime.ai/docs/execution-providers/DirectML-ExecutionProvider.html) is in sustained engineering.
- [FaceFusion releases](https://github.com/facefusion/facefusion/releases): active local face-processing project with multiple model/provider options; inspect exact model licences and hardware paths before reuse.
- [Laya upstream](https://github.com/NandhaKishorM/laya): non-autoregressive typed decision model; Apache-2.0 source and stated weights, text input. It is not a face-swap model.
- [Laya TypeScript/ONNX port](https://github.com/receptron/laya): documents offline local bundle provisioning. [Laya Vision fork](https://github.com/r33drichards/laya-vision) reports CC BY-NC-SA 4.0 weights; similar name does not imply compatible terms.
- [VFace paper](https://arxiv.org/abs/2602.07835): recent diffusion-based video face-swap research; research results require independent quality, speed, memory, licence, and offline-deployment validation.

Research links and release state are time-sensitive; revisit them on every run rather than treating this snapshot as current.
