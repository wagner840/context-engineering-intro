'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Download, Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  placeholder?: string
  className?: string
  height?: number
  readOnly?: boolean
}

export function CodeEditor({
  value,
  onChange,
  language = 'html',
  placeholder = 'Digite seu código aqui...',
  className = '',
  height = 400,
  readOnly = false,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    const lines = value.split('\n').length
    setLineCount(lines)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly) {
      onChange(e.target.value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return

    const textarea = e.currentTarget
    const { selectionStart, selectionEnd } = textarea

    // Tab para indentação
    if (e.key === 'Tab') {
      e.preventDefault()
      const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd)
      onChange(newValue)
      
      // Ajustar cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2
      }, 0)
    }

    // Enter para auto-indentação
    if (e.key === 'Enter') {
      e.preventDefault()
      const currentLine = value.substring(0, selectionStart).split('\n').pop() || ''
      const indent = currentLine.match(/^\s*/)?.[0] || ''
      const newValue = value.substring(0, selectionStart) + '\n' + indent + value.substring(selectionEnd)
      onChange(newValue)
      
      // Ajustar cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + indent.length
      }, 0)
    }

    // Fechar tags automaticamente para HTML
    if (language === 'html' && e.key === '>') {
      const beforeCursor = value.substring(0, selectionStart)
      const tagMatch = beforeCursor.match(/<(\w+)(?:\s[^>]*)?$/)
      
      if (tagMatch) {
        const tagName = tagMatch[1]
        const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']
        
        if (!selfClosingTags.includes(tagName.toLowerCase())) {
          e.preventDefault()
          const newValue = value.substring(0, selectionStart) + '>' + value.substring(selectionEnd) + `</${tagName}>`
          onChange(newValue)
          
          // Posicionar cursor entre as tags
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 1
          }, 0)
        }
      }
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Código copiado para a área de transferência')
    } catch (error) {
      toast.error('Erro ao copiar código')
    }
  }

  const downloadCode = () => {
    const blob = new Blob([value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `codigo.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatCode = () => {
    if (language === 'html') {
      // Formatação básica para HTML
      let formatted = value
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/g, '')
      
      const lines = formatted.split('\n')
      let indentLevel = 0
      const indentSize = 2
      
      formatted = lines.map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''
        
        // Diminuir indentação para tags de fechamento
        if (trimmed.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1)
        }
        
        const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmed
        
        // Aumentar indentação para tags de abertura (não auto-fechadas)
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indentLevel++
        }
        
        return indentedLine
      }).join('\n')
      
      onChange(formatted)
      toast.success('Código formatado')
    }
  }

  const renderLineNumbers = () => {
    return (
      <div className="bg-gray-100 p-2 text-right text-sm text-gray-500 border-r select-none">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} className="leading-6">
            {i + 1}
          </div>
        ))}
      </div>
    )
  }

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white'
    : `${className} border rounded-lg overflow-hidden`

  return (
    <div className={containerClass}>
      {/* Barra de ferramentas */}
      <div className="bg-gray-50 border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium capitalize">{language}</span>
          <span className="text-xs text-gray-500">
            {lineCount} linha{lineCount !== 1 ? 's' : ''} • {value.length} caracteres
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {language === 'html' && (
            <Button variant="ghost" size="sm" onClick={formatCode}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={downloadCode}>
            <Download className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex" style={{ height: isFullscreen ? 'calc(100vh - 60px)' : `${height}px` }}>
        {/* Números das linhas */}
        {renderLineNumbers()}
        
        {/* Área de código */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            readOnly={readOnly}
            className="w-full h-full p-2 font-mono text-sm bg-transparent resize-none outline-none leading-6"
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
            spellCheck={false}
          />
          
          {/* Highlight de sintaxe básico */}
          <div className="absolute inset-0 p-2 pointer-events-none font-mono text-sm leading-6 overflow-hidden">
            <div
              className="text-transparent"
              dangerouslySetInnerHTML={{
                __html: highlightSyntax(value, language)
              }}
            />
          </div>
        </div>
      </div>

      {/* Shortcuts info */}
      <div className="bg-gray-50 border-t p-2 text-xs text-gray-500">
        <span>Dicas: Tab para indentação • Ctrl+A para selecionar tudo • Ctrl+C para copiar</span>
      </div>
    </div>
  )
}

function highlightSyntax(code: string, language: string): string {
  if (language === 'html') {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '<span class="text-blue-600">$1$2</span>')
      .replace(/(&lt;[^&]*?)(\s+[a-zA-Z-]+)(=)/g, '$1<span class="text-purple-600">$2</span><span class="text-gray-500">$3</span>')
      .replace(/(=)(&quot;[^&]*?&quot;|&#x27;[^&]*?&#x27;)/g, '<span class="text-gray-500">$1</span><span class="text-green-600">$2</span>')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-gray-400">$1</span>')
  }
  
  return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}