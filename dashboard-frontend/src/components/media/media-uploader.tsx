'use client'

import { useState, useCallback, ReactNode } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, X, File, FileText, Check, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface MediaFile {
  id: string
  file: File
  preview?: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  url?: string
  error?: string
}

interface MediaUploaderProps {
  onUpload: (url: string) => void
  accept?: string
  maxSize?: number
  maxFiles?: number
  children?: ReactNode
  className?: string
}

export function MediaUploader({
  onUpload,
  accept = '*',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  children,
  className,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return publicUrl
  }, [])

  const processFile = useCallback(async (file: File, mediaFile: MediaFile) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === mediaFile.id ? { ...f, status: 'uploading', progress: 0 } : f
      ))

      // Simular progresso
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === mediaFile.id && f.progress < 90 
            ? { ...f, progress: f.progress + 10 } 
            : f
        ))
      }, 200)

      const url = await uploadFile(file)
      
      clearInterval(progressInterval)
      
      setFiles(prev => prev.map(f => 
        f.id === mediaFile.id 
          ? { ...f, status: 'success', progress: 100, url } 
          : f
      ))

      onUpload(url)
      toast.success('Arquivo enviado com sucesso!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      setFiles(prev => prev.map(f => 
        f.id === mediaFile.id 
          ? { ...f, status: 'error', error: errorMessage } 
          : f
      ))

      toast.error(errorMessage)
    }
  }, [uploadFile, onUpload])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: MediaFile[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'uploading',
      progress: 0,
    }))

    setFiles(prev => [...prev, ...newFiles])
    setIsUploading(true)

    // Processar arquivos
    Promise.all(
      newFiles.map(mediaFile => processFile(mediaFile.file, mediaFile))
    ).finally(() => {
      setIsUploading(false)
    })
  }, [processFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept === '*' ? undefined : { [accept]: [] },
    maxSize,
    maxFiles,
    disabled: isUploading,
  })

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }, [])

  const clearAllFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
  }, [files])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6" />
    } else if (file.type.startsWith('text/')) {
      return <FileText className="h-6 w-6" />
    } else {
      return <File className="h-6 w-6" />
    }
  }

  const getStatusIcon = (status: MediaFile['status']) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (children) {
    return (
      <div className={className}>
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          {children}
        </div>
        {files.length > 0 && (
          <div className="mt-4 space-y-3">
            {files.map((mediaFile) => (
              <Card key={mediaFile.id} className="p-3">
                <div className="flex items-center gap-3">
                  {mediaFile.preview ? (
                    <Image
                      src={mediaFile.preview}
                      alt="Preview do arquivo carregado"
                      width={48}
                      height={48}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                      {getFileIcon(mediaFile.file)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {mediaFile.file.name}
                      </p>
                      {getStatusIcon(mediaFile.status)}
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      {formatFileSize(mediaFile.file.size)}
                    </p>
                    
                    {mediaFile.status === 'uploading' && (
                      <Progress value={mediaFile.progress} className="mt-2" />
                    )}
                    
                    {mediaFile.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">
                        {mediaFile.error}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(mediaFile.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            
            {isDragActive ? (
              <p className="text-lg font-medium text-blue-600">
                Solte os arquivos aqui...
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500">
                  Máximo {maxFiles} arquivos, até {formatFileSize(maxSize)} cada
                </p>
              </div>
            )}
          </div>
          
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Arquivos</h3>
                <Button variant="outline" size="sm" onClick={clearAllFiles}>
                  Limpar tudo
                </Button>
              </div>
              
              <div className="space-y-3">
                {files.map((mediaFile) => (
                  <div key={mediaFile.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {mediaFile.preview ? (
                      <Image
                        src={mediaFile.preview}
                        alt="Preview do arquivo carregado"
                        width={48}
                        height={48}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                        {getFileIcon(mediaFile.file)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {mediaFile.file.name}
                        </p>
                        {getStatusIcon(mediaFile.status)}
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        {formatFileSize(mediaFile.file.size)}
                      </p>
                      
                      {mediaFile.status === 'uploading' && (
                        <Progress value={mediaFile.progress} className="mt-2" />
                      )}
                      
                      {mediaFile.status === 'error' && (
                        <p className="text-xs text-red-600 mt-1">
                          {mediaFile.error}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(mediaFile.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}