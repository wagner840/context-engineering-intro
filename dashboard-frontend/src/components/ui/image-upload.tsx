"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  X,
  ImageIcon,
  File,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  url?: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

interface ImageUploadProps {
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onUpload?: (files: File[]) => Promise<string[]>;
  onRemove?: (fileId: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function ImageUpload({
  multiple = false,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  onUpload,
  className = "",
  children,
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      setIsDragOver(false);
      setErrors([]);

      // Validar número máximo de arquivos
      if (files.length > maxFiles) {
        setErrors([
          `Máximo de ${maxFiles} ${maxFiles === 1 ? "arquivo" : "arquivos"} permitido`,
        ]);
        return;
      }

      // Validar cada arquivo
      const allErrors: string[] = [];
      const validFiles: File[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          allErrors.push(`${file.name}: Tipo de arquivo não suportado`);
          continue;
        }

        if (file.size > maxSize * 1024 * 1024) {
          allErrors.push(
            `${file.name}: Arquivo muito grande (máximo ${(maxSize / 1024 / 1024).toFixed(1)}MB)`
          );
          continue;
        }

        validFiles.push(file);
      }

      if (allErrors.length > 0) {
        setErrors(allErrors);
        return;
      }

      // Processar arquivos válidos
      const newFiles: UploadedFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: "uploading",
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Simular upload
      for (const uploadedFile of newFiles) {
        try {
          // Simular progresso
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id ? { ...f, progress } : f
              )
            );
          }

          // Simular URL após upload
          const url = URL.createObjectURL(uploadedFile.file);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, status: "completed" as const, url }
                : f
            )
          );

          if (onUpload) {
            const urls = await onUpload(validFiles);
            setUploadedFiles((prev) =>
              prev.map((f) => {
                if (newFiles.some((nf) => nf.id === f.id)) {
                  return {
                    ...f,
                    progress: 100,
                    status: "completed",
                    url: urls[newFiles.findIndex((nf) => nf.id === f.id)],
                  };
                }
                return f;
              })
            );
          }
        } catch (error) {
          console.error("Upload error:", error);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, status: "error" as const, error: "Erro no upload" }
                : f
            )
          );
        }
      }
    },
    [maxFiles, maxSize, onUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFiles,
    accept: { "image/*": [] },
    maxSize,
    maxFiles,
    noClick: !!children,
  });

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      {children ? (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {children}
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors",
            isDragOver ? "border-primary bg-primary/5" : "border-border",
            className
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isDragOver ? "Solte os arquivos aqui" : "Enviar imagens"}
          </h3>
          <p className="text-gray-600 mb-4">
            Arraste e solte {multiple ? "arquivos" : "um arquivo"} ou clique
            para selecionar
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Escolher {multiple ? "Arquivos" : "Arquivo"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(",")}
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFiles(Array.from(files));
              }
              // Reset input value
              e.target.value = "";
            }}
            className="hidden"
          />

          <div className="mt-4 text-xs text-gray-500">
            <p>
              Formatos suportados:{" "}
              {acceptedTypes
                .map((type) => type.split("/")[1].toUpperCase())
                .join(", ")}
            </p>
            <p>
              Tamanho máximo: {maxSize}MB{" "}
              {multiple && `• Máximo ${maxFiles} arquivos`}
            </p>
          </div>
        </div>
      )}

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
                      <Image
                        src={uploadedFile.url}
                        alt={uploadedFile.file.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <Badge
                        variant={
                          uploadedFile.status === "completed"
                            ? "default"
                            : uploadedFile.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {uploadedFile.status === "uploading" && (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        )}
                        {uploadedFile.status === "completed" && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {uploadedFile.status === "error" && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {uploadedFile.status === "uploading"
                          ? "Enviando"
                          : uploadedFile.status === "completed"
                            ? "Concluído"
                            : "Erro"}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-600">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>

                    {uploadedFile.status === "uploading" && (
                      <Progress
                        value={uploadedFile.progress}
                        className="mt-2 h-1"
                      />
                    )}

                    {uploadedFile.status === "error" && uploadedFile.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {uploadedFile.error}
                      </p>
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
  );
}
