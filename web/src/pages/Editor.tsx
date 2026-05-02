import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Send } from 'lucide-react'
import { createArticle } from '@/services'
import EditorToolbar from '@/components/editor/EditorToolbar'
import '@/components/editor/editor.css'

const modules = [
  { value: 'learn', label: '学习互助' },
  { value: 'trade', label: '二手交易' },
  { value: 'canteen', label: '食堂点评' },
  { value: 'activity', label: '活动广场' },
  { value: 'life', label: '校园生活' },
  { value: 'confession', label: '表白墙' },
]

export default function EditorPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [module, setModule] = useState('')
  const [tags, setTags] = useState('')
  const [publishing, setPublishing] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: '开始撰写你的文章...' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
  })

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('请输入文章标题')
      return
    }
    if (!editor?.getText().trim()) {
      alert('请输入文章内容')
      return
    }

    setPublishing(true)
    try {
      const html = editor.getHTML()
      const result = await createArticle({
        title,
        content: html,
        module: module || undefined,
        tags: tags ? tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean) : undefined,
      })
      navigate(`/article?id=${result.id}`)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" /> 返回
        </Button>
        <h1 className="text-lg font-extrabold text-foreground">发布文章</h1>
        <Button
          size="sm"
          className="gap-1.5 rounded-full px-5"
          onClick={handlePublish}
          disabled={publishing}
        >
          <Send className="size-4" />
          {publishing ? '发布中...' : '发布'}
        </Button>
      </div>

      {/* Title */}
      <Input
        className="h-auto border-0 px-0 text-2xl font-extrabold shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0"
        placeholder="请输入文章标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Content */}
      <div className="flex-1 rounded-xl border border-border bg-card px-6 py-4" style={{ minHeight: 500 }}>
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4">
        <select
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          value={module}
          onChange={(e) => setModule(e.target.value)}
        >
          <option value="">选择板块</option>
          {modules.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <Input
          className="max-w-xs"
          placeholder="添加标签（用逗号分隔）"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
    </div>
  )
}
