import { useState } from 'react'

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<UploadStatus>('idle')

  const uploadFile = async (file: File, subjectId: number) => {
    if (!file || !subjectId) return

    setIsUploading(true)
    setProgress(0)
    setStatus('uploading')

    try {
      // Smooth visual progress bar
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 5 : prev))
      }, 300)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('subject_id', subjectId.toString())

      // Using the Next.js proxy bridge!
      const response = await fetch('/api/documents/', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      // Success!
      setProgress(100)
      setStatus('done')

      setTimeout(() => {
        setIsUploading(false)
        setStatus('idle')
        setProgress(0)
        window.location.reload() 
      }, 1500)

    } catch (error) {
      console.error("Upload error:", error)
      setStatus('error')
      
      setTimeout(() => {
        setIsUploading(false)
        setStatus('idle')
        setProgress(0)
      }, 4000)
    }
  }

  return { uploadFile, isUploading, progress, status }
}