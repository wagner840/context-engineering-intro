'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  X, 
  Image, 
  File, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface UploadedFile {
  id: string
  file: File
  url?: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

interface ImageUploadProps {
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  onUpload?: (files: File[]) => Promise<string[]>
  onRemove?: (fileId: string) => void
  className?: string
}

export function ImageUpload({
  multiple = false,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  onUpload,
  className = ''
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de arquivo não suportado: ${file.type}`
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(1)}MB (máximo: ${maxSize}MB)`
    }
    return null
  }, [acceptedTypes, maxSize])

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const newErrors: string[] = []

    // Validate total file count
    if (!multiple && fileArray.length > 1) {
      newErrors.push('Apenas um arquivo é permitido')
      setErrors(newErrors)
      return
    }

    if (uploadedFiles.length + fileArray.length > maxFiles) {
      newErrors.push(`Máximo de ${maxFiles} arquivos permitidos`)
      setErrors(newErrors)
      return
    }

    // Validate each file
    const validFiles: File[] = []
    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        newErrors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])

    // Create uploaded file entries
    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading'
    }))

    if (!multiple) {
      setUploadedFiles(newUploadedFiles)
    } else {
      setUploadedFiles(prev => [...prev, ...newUploadedFiles])
    }

    // Start uploads
    try {
      if (onUpload) {
        // Simulate upload progress
        newUploadedFiles.forEach(uploadedFile => {
          const interval = setInterval(() => {
            setUploadedFiles(prev => prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f
            ))
          }, 200)

          setTimeout(() => {
            clearInterval(interval)
          }, 2000)
        })

        const urls = await onUpload(validFiles)
        
        // Update with completed status
        setUploadedFiles(prev => prev.map((f) => {
          if (newUploadedFiles.some(nf => nf.id === f.id)) {
            return {
              ...f,
              progress: 100,
              status: 'completed',
              url: urls[newUploadedFiles.findIndex(nf => nf.id === f.id)]
            }
          }
          return f
        }))
      } else {
        // No upload handler, just show as completed
        setUploadedFiles(prev => prev.map(f => 
          newUploadedFiles.some(nf => nf.id === f.id)
            ? { ...f, progress: 100, status: 'completed', url: URL.createObjectURL(f.file) }
            : f
        ))
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadedFiles(prev => prev.map(f => 
        newUploadedFiles.some(nf => nf.id === f.id)
          ? { ...f, status: 'error', error: 'Falha no upload' }
          : f
      ))
    }
  }, [uploadedFiles.length, maxFiles, multiple, validateFile, onUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }, [processFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input value
    e.target.value = ''
  }, [processFiles])

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Image className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isDragOver ? 'Solte os arquivos aqui' : 'Enviar imagens'}
        </h3>
        <p className="text-gray-600 mb-4">
          Arraste e solte {multiple ? 'arquivos' : 'um arquivo'} ou clique para selecionar
        </p>
        
        <Button 
          type="button"
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Escolher {multiple ? 'Arquivos' : 'Arquivo'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="mt-4 text-xs text-gray-500">
          <p>Formatos suportados: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}</p>
          <p>Tamanho máximo: {maxSize}MB {multiple && `• Máximo ${maxFiles} arquivos`}</p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">
            Arquivos ({uploadedFiles.length}/{maxFiles})
          </h4>
          
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {uploadedFile.url ? (
                      <img
                        src={uploadedFile.url}
                        alt={uploadedFile.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <File className="w-12 h-12 text-gray-400" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <Badge variant={
                        uploadedFile.status === 'completed' ? 'default' :
                        uploadedFile.status === 'error' ? 'destructive' : 'secondary'
                      }>
                        {uploadedFile.status === 'uploading' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                        {uploadedFile.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {uploadedFile.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {uploadedFile.status === 'uploading' ? 'Enviando' :
                         uploadedFile.status === 'completed' ? 'Concluído' : 'Erro'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>

                    {uploadedFile.status === 'uploading' && (
                      <Progress value={uploadedFile.progress} className="mt-2 h-1" />
                    )}

                    {uploadedFile.status === 'error' && uploadedFile.error && (
                      <p className="text-xs text-red-600 mt-1">{uploadedFile.error}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}