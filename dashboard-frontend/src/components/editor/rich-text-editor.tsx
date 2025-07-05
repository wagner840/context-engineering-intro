'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Undo,
  Redo,
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MediaUploader } from '@/components/media/media-uploader'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  height?: number
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Escreva seu conteúdo aqui...',
  className = '',
  height = 400
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [selectedRange, setSelectedRange] = useState<Range | null>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      onChange(html)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Atalhos de teclado
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
        case 'z':
          e.preventDefault()
          if (e.shiftKey) {
            execCommand('redo')
          } else {
            execCommand('undo')
          }
          break
      }
    }
  }

  const handleLinkClick = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      setSelectedRange(selection.getRangeAt(0))
      setLinkText(selection.toString())
    }
    setIsLinkDialogOpen(true)
  }

  const insertLink = () => {
    if (selectedRange) {
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(selectedRange)
      
      if (linkText && linkUrl) {
        execCommand('insertHTML', `<a href="${linkUrl}" target="_blank">${linkText}</a>`)
      }
    }
    
    setIsLinkDialogOpen(false)
    setLinkUrl('')
    setLinkText('')
    setSelectedRange(null)
  }

  const insertImage = (imageUrl: string) => {
    execCommand('insertHTML', `<img src="${imageUrl}" alt="" style="max-width: 100%; height: auto;" />`)
  }

  const formatHeading = (level: string) => {
    if (level === 'p') {
      execCommand('formatBlock', 'P')
    } else {
      execCommand('formatBlock', `H${level}`)
    }
  }

  const formatTextColor = (color: string) => {
    execCommand('foreColor', color)
  }

  const formatBackgroundColor = (color: string) => {
    execCommand('backColor', color)
  }

  const isCommandActive = (command: string): boolean => {
    return document.queryCommandState(command)
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Barra de ferramentas */}
      <div className="border-b bg-gray-50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Formatação de texto */}
          <div className="flex items-center gap-1">
            <Select defaultValue="p" onValueChange={formatHeading}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p">Parágrafo</SelectItem>
                <SelectItem value="1">Título 1</SelectItem>
                <SelectItem value="2">Título 2</SelectItem>
                <SelectItem value="3">Título 3</SelectItem>
                <SelectItem value="4">Título 4</SelectItem>
                <SelectItem value="5">Título 5</SelectItem>
                <SelectItem value="6">Título 6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Formatação básica */}
          <div className="flex items-center gap-1">
            <Button
              variant={isCommandActive('bold') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('bold')}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={isCommandActive('italic') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={isCommandActive('underline') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('underline')}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant={isCommandActive('strikeThrough') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('strikeThrough')}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Cores */}
          <div className="flex items-center gap-1">
            <input
              type="color"
              title="Cor do texto"
              onChange={(e) => formatTextColor(e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <input
              type="color"
              title="Cor do fundo"
              onChange={(e) => formatBackgroundColor(e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Alinhamento */}
          <div className="flex items-center gap-1">
            <Button
              variant={isCommandActive('justifyLeft') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('justifyLeft')}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={isCommandActive('justifyCenter') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('justifyCenter')}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={isCommandActive('justifyRight') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('justifyRight')}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={isCommandActive('justifyFull') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('justifyFull')}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Listas */}
          <div className="flex items-center gap-1">
            <Button
              variant={isCommandActive('insertUnorderedList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('insertUnorderedList')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={isCommandActive('insertOrderedList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => execCommand('insertOrderedList')}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Outros elementos */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('formatBlock', 'BLOCKQUOTE')}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('formatBlock', 'PRE')}
            >
              <Code className="h-4 w-4" />
            </Button>
            
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleLinkClick}>
                  <Link className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Inserir Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="link-text">Texto do link</Label>
                    <Input
                      id="link-text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Texto que será exibido"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://exemplo.com"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={insertLink} disabled={!linkText || !linkUrl}>
                      Inserir Link
                    </Button>
                    <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <MediaUploader onUpload={insertImage} accept="image/*" maxSize={5 * 1024 * 1024}>
              <Button variant="ghost" size="sm">
                <Image className="h-4 w-4" />
              </Button>
            </MediaUploader>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Desfazer/Refazer */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('undo')}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand('redo')}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Área de edição */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="p-4 outline-none"
        style={{ minHeight: `${height}px` }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}