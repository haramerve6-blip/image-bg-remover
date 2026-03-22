'use client'

import { useState, useRef } from 'react'

export default function Home() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)
  const [resultPreview, setResultPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Replace with your Cloudflare Worker URL or deploy to /api/remove-bg
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://image-bg-remover.your-account.workers.dev'

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Unsupported format. Use JPG, PNG or WebP.')
      return
    }

    setError(null)
    setResultPreview(null)
    setDownloadUrl(null)
    setFileName(file.name.replace(/\.[^.]+$/, '-nobg.png'))

    // Show original preview
    const originalUrl = URL.createObjectURL(file)
    setOriginalPreview(originalUrl)

    // Process
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image_file', file)

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Processing failed' }))
        throw new Error(err.error || `HTTP ${response.status}`)
      }

      const blob = await response.blob()
      const resultUrl = URL.createObjectURL(blob)
      setResultPreview(resultUrl)
      setDownloadUrl(resultUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!downloadUrl) return
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = fileName || 'removed-bg.png'
    a.click()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && fileInputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      fileInputRef.current.files = dt.files
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <main className="flex flex-col items-center px-4 py-12 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Image Background Remover</h1>

      {/* Upload Area */}
      <div
        className="w-full max-w-md mb-10 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
          Choose Image
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
        <p className="mt-3 text-sm text-gray-500">JPG, PNG, WebP · Max 10MB</p>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-md mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="mt-3 text-gray-600">Removing background...</p>
        </div>
      )}

      {/* Preview */}
      {(originalPreview || resultPreview) && !isLoading && (
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          {/* Original */}
          <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">Original</h2>
            <div className="flex items-center justify-center min-h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              {originalPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={originalPreview} alt="Original" className="max-w-full max-h-96 object-contain rounded" />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>
          </div>

          {/* Result */}
          <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">Result</h2>
            <div className="flex items-center justify-center min-h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200" style={{ backgroundImage: 'repeating-conic-gradient(#e5e5e5 0% 25%, white 0% 50%)', backgroundSize: '20px 20px' }}>
              {resultPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resultPreview} alt="Result" className="max-w-full max-h-96 object-contain rounded" />
              ) : (
                <span className="text-gray-400">Result will appear here</span>
              )}
            </div>
            {downloadUrl && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md"
                >
                  Download PNG
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
