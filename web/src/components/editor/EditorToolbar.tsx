import type { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import {
  Bold, Italic, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered,
  Quote, Code, Minus,
  Undo, Redo, Link as LinkIcon,
} from 'lucide-react'

type Props = { editor: Editor | null }

const Divider = () => <div className="mx-1 h-5 w-px bg-border" />

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null

  const btn = (
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    tip: string,
  ) => (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      size="icon"
      className="size-8"
      onClick={onClick}
      title={tip}
    >
      {icon}
    </Button>
  )

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-xl border border-border bg-card px-2 py-1.5">
      {/* Headings */}
      {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 className="size-4" />, '标题 1')}
      {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="size-4" />, '标题 2')}
      {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="size-4" />, '标题 3')}

      <Divider />

      {/* Inline */}
      {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold className="size-4" />, '加粗')}
      {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic className="size-4" />, '斜体')}
      {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), <Strikethrough className="size-4" />, '删除线')}
      {btn(editor.isActive('code'), () => editor.chain().focus().toggleCode().run(), <Code className="size-4" />, '行内代码')}

      <Divider />

      {/* Lists */}
      {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List className="size-4" />, '无序列表')}
      {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="size-4" />, '有序列表')}

      <Divider />

      {/* Block */}
      {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="size-4" />, '引用')}
      {btn(false, () => editor.chain().focus().setHorizontalRule().run(), <Minus className="size-4" />, '分割线')}

      <Divider />

      {/* Link */}
      {btn(editor.isActive('link'), () => {
        const url = window.prompt('输入链接地址:')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      }, <LinkIcon className="size-4" />, '链接')}

      {/* Spacer */}
      <div className="flex-1" />

      {/* History */}
      {btn(false, () => editor.chain().focus().undo().run(), <Undo className="size-4" />, '撤销')}
      {btn(false, () => editor.chain().focus().redo().run(), <Redo className="size-4" />, '重做')}
    </div>
  )
}
