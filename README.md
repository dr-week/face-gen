# Facegen

Offline desktop workspace for preparing face-swap jobs. Image selection and previews stay local. Inference and export are not implemented; add a licensed model before enabling processing.

## Develop

- `npm install`
- `npm run tauri dev`
- `npm run tauri build`
- `npm run build` checks TypeScript and builds the frontend.

Windows desktop builds require Rust MSVC, Visual Studio C++ Build Tools, and WebView2. Runtime direction: WinML on Windows 11 24H2+, with an interchangeable CPU fallback. Keep models outside the installer until model license and distribution are decided.
