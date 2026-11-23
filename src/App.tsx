import { createSignal, For, onCleanup } from 'solid-js'
import './App.scss'

type ImageRole = 'source' | 'target'
type Selection = { file: File; url: string }

const maxImageBytes = 100 * 1024 * 1024
const maxImagePixels = 40_000_000
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/bmp'])

function App() {
  const [source, setSource] = createSignal<Selection>()
  const [target, setTarget] = createSignal<Selection>()
  const [error, setError] = createSignal('')
  let sourceInput!: HTMLInputElement
  let targetInput!: HTMLInputElement
  const selectionVersion: Record<ImageRole, number> = { source: 0, target: 0 }

  onCleanup(() => [source(), target()].forEach((selection) => {
    if (selection) URL.revokeObjectURL(selection.url)
  }))

  const acceptFile = async (role: ImageRole, file?: File) => {
    const version = ++selectionVersion[role]
    setError('')
    if (!file) {
      selectionVersion[role]++
      return
    }
    if (!imageTypes.has(file.type)) {
      setError('Choose a JPG, PNG, WebP, or BMP image.')
      return
    }
    if (file.size > maxImageBytes) {
      setError('Image must be smaller than 100 MB.')
      return
    }

    let bitmap: ImageBitmap
    try {
      bitmap = await createImageBitmap(file)
    } catch {
      if (version === selectionVersion[role]) setError('This image could not be decoded.')
      return
    }
    const pixels = bitmap.width * bitmap.height
    bitmap.close()
    if (version !== selectionVersion[role]) return
    if (pixels > maxImagePixels) {
      setError('Image dimensions must be 40 megapixels or smaller.')
      return
    }

    const next = { file, url: URL.createObjectURL(file) }
    const previous = role === 'source' ? source() : target()
    if (previous) URL.revokeObjectURL(previous.url)
    if (role === 'source') setSource(next)
    else setTarget(next)
  }

  const clearFile = (role: ImageRole) => {
    selectionVersion[role]++
    const current = role === 'source' ? source() : target()
    if (current) URL.revokeObjectURL(current.url)
    if (role === 'source') setSource(undefined)
    else setTarget(undefined)
    setError('')
  }

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${Math.max(1, Math.round(bytes / 1024))} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  const picker = (role: ImageRole) => {
    ;(role === 'source' ? sourceInput : targetInput).click()
  }

  const dropFile = (role: ImageRole, event: DragEvent) => {
    event.preventDefault()
    acceptFile(role, event.dataTransfer?.files[0])
  }

  return (
    <main class="app-shell">
      <header class="topbar">
        <div class="brand" aria-label="Facegen">
          <span class="brand-mark" aria-hidden="true">f</span>
          <span>facegen</span>
        </div>
        <div class="local-status"><span class="status-dot" /> On-device workspace</div>
      </header>

      <section class="workspace" aria-labelledby="page-title">
        <div class="intro">
          <div class="eyebrow">IMAGE WORKSPACE <span>·</span> 01</div>
          <h1 id="page-title">A better fit,<br /><em>frame by frame.</em></h1>
          <p>Choose a face and a frame to prepare your project.</p>
        </div>

        <div class="media-grid">
          <For each={[
            { role: 'source' as const, title: 'Source face', detail: 'The identity to use' },
            { role: 'target' as const, title: 'Target image', detail: 'The image to transform' },
          ]}>{({ role, title, detail }) => {
            const selection = () => role === 'source' ? source() : target()
            return (
              <article class="media-card" onDragOver={(event) => { if (event.dataTransfer?.types.includes('Files')) { event.preventDefault(); event.currentTarget.dataset.dragging = 'true' } }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) delete event.currentTarget.dataset.dragging }} onDrop={(event) => { if (event.dataTransfer?.types.includes('Files')) { delete event.currentTarget.dataset.dragging; dropFile(role, event) } }}>
                <div class="card-heading">
                  <div><h2>{title}</h2><p>{detail}</p></div>
                  <span class="step-number">{role === 'source' ? '01' : '02'}</span>
                </div>
                <input
                  ref={role === 'source' ? sourceInput : targetInput}
                  class="visually-hidden"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/bmp"
                  onChange={(event) => {
                    const input = event.currentTarget
                    void acceptFile(role, input.files?.[0])
                    input.value = ''
                  }}
                />
                {selection() ? (
                  <div class="preview-wrap">
                    <img class="preview-image" src={selection()!.url} alt={`${title} preview`} />
                    <div class="file-detail">
                      <span class="file-icon" aria-hidden="true">↗</span>
                      <span class="file-copy"><strong>{selection()!.file.name}</strong><small>{formatSize(selection()!.file.size)}</small></span>
                      <button class="remove-button" type="button" aria-label={`Remove ${title.toLowerCase()}`} onClick={() => clearFile(role)}>×</button>
                    </div>
                  </div>
                ) : (
                  <button class="dropzone" type="button" data-file-picker={role} onClick={() => picker(role)}>
                    <span class="upload-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v5h14v-5" /></svg></span>
                    <strong>Choose an image</strong>
                    <span>or drop it here</span>
                    <small>JPG, PNG, WebP, BMP · up to 100 MB</small>
                  </button>
                )}
              </article>
            )
          }}</For>
        </div>

        <div class="action-row">
          <p class="privacy-note"><span aria-hidden="true">◈</span> Files stay on this device</p>
          <button class="primary-button" type="button" disabled>
            Prepare swap <span aria-hidden="true">↗</span>
          </button>
        </div>
        {error() && <p class="error-message" role="alert">{error()}</p>}

        <aside class="runtime-note">
          <span class="runtime-icon" aria-hidden="true">i</span>
          <p><strong>Swap engine not installed</strong><br />Your images are only previewed locally. Add a licensed offline model to enable processing.</p>
          <span class="runtime-badge">LOCAL ONLY</span>
        </aside>
      </section>
      <footer class="footer"><span>FACEGEN DESKTOP</span><span>Private by design</span></footer>
    </main>
  )
}

export default App
