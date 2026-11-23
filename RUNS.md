# Runs

Completed areas, newest first:

- 2026-09-30 · seed `20260930-05` · removed 3 unreferenced Vite/Solid scaffold assets (33,364 bytes) · `npm run build` passed · bundle unchanged: JS 16.46 kB (6.83 gzip), CSS 4.92 kB (1.67 gzip)
- 2026-09-30 · seed `20260930-04` · latest image selection wins during async decode; reset picker for same-file reselection · `npm run build` passed; Vite served HTTP 200 · dev server ready 744 ms · JS 16.46 kB (6.83 gzip), CSS 4.92 kB (1.67 gzip)
- 2026-09-30 · seed `20260930-03` · TypeScript 6 → 7.0.2 native compiler · build passed · five forced `tsc -b` runs: median 1,366.5 ms (6.0.2) → 287.5 ms (7.0.2), 4.8× faster · Vite bundle unchanged: JS 16.36 kB (6.78 gzip), CSS 4.92 kB (1.67 gzip)
- 2026-09-30 · seed `20260930-02` · picker DOM lookup → typed role refs · `npm run build` passed · JS 16.36 kB (6.78 gzip), CSS 4.92 kB (1.67 gzip)
- 2026-09-30 · seed `20260930-01` · image decode/pixel validation and bitmap cleanup · `npm run build` passed · JS 16.31 kB (6.77 gzip), CSS 4.92 kB (1.67 gzip)

Repo had no initial run ledger or commits. Runtime RAM/VRAM/CPU/GPU, startup, and inference latency unavailable: no swap runtime/model is installed.
- 2026-09-30 · seed `20260930` · input-state: invalidate pending image decode on empty picker result · `npm run build` passed (2,534 ms wall; Vite 683 ms) · JS 16.46 kB (6.84 gzip), CSS 4.92 kB (1.67 gzip) · no image/inference performance measurement; swap runtime absent · research: WinML guidance, FaceFusion releases, VFace paper, Laya upstream (text-only; not vision), TypeScript 7/Solid 2/Tauri 3 status
- 2026-09-30 · seed `2026093006` · accessibility: show focus ring on upload button when clipped file input receives keyboard focus · `npm run build` passed (2,732 ms wall; Vite 781 ms) · JS 16.49 kB (6.85 gzip), CSS 5.00 kB (1.69 gzip) · CSS adjacent sibling + focus-visible supported by target WebView2; runtime metrics unavailable
- 2026-09-30 · seed `2026093007` · UI: replace inert `href="#"` brand link with a non-interactive label · `npm run build` passed (3,572 ms wall; Vite 1,220 ms) · JS 16.48 kB (6.83 gzip), CSS 5.00 kB (1.69 gzip) · no inference runtime; system performance unavailable · research: Electrobun v2 beta release channel, Solid 2 rc.10, TypeScript 7, ORT WebGPU/WinML, FaceFusion 3.9, VFace paper, Laya text-only
- 2026-09-30 · seed `2026093008` · media: allow replacing selected image by dropping onto its card; file-only drag affordance · `npm run build` passed (2,460 ms wall; Vite 683 ms) · JS 16.77 kB (6.90 gzip), CSS 5.07 kB (1.71 gzip) · no swap runtime, so inference/RAM/VRAM/GPU metrics unavailable · research: TypeScript 7, Solid 2 RC, Electrobun beta, ONNX WebGPU/WinML, FaceFusion, VFace, Laya text-only
