"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link2,
  Unlink,
  Undo,
  Redo,
  Terminal,
} from "lucide-react"
import { useEffect } from "react"

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "Write something beautiful...",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-600 dark:text-indigo-400 underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "tiptap-content focus:outline-none min-h-[300px] md:min-h-[450px] p-5 text-base leading-relaxed text-foreground select-text",
      },
    },
  })

  // Keep content in sync if updated externally (like when loading initial database values)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter the URL:", previousUrl)

    if (url === null) {
      return
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  // Helper to check active state and style toolbar buttons
  const btnClass = (isActive: boolean) =>
    `p-1.5 rounded-md transition-colors hover:bg-muted hover:text-foreground ${
      isActive
        ? "bg-muted text-foreground font-semibold border shadow-xs"
        : "text-muted-foreground bg-transparent border-transparent"
    }`

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground">
      {/* Editor custom styles to ensure headings, lists, and quotes look pristine */}
      <style jsx global>{`
        .tiptap-content h1 {
          font-family: var(--font-serif, Georgia, serif);
          font-size: 2rem;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.25;
        }
        .tiptap-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        .tiptap-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .tiptap-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .tiptap-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-content li {
          margin-bottom: 0.25rem;
        }
        .tiptap-content blockquote {
          border-left: 4px solid var(--border, #e2e8f0);
          padding-left: 1rem;
          font-style: italic;
          color: var(--muted-foreground, #64748b);
          margin: 1.5rem 0;
        }
        .tiptap-content code {
          background-color: var(--muted, #f1f5f9);
          color: var(--foreground);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
        .tiptap-content pre {
          background-color: var(--muted, #f1f5f9);
          padding: 1rem;
          border-radius: 0.5rem;
          font-family: monospace;
          overflow-x: auto;
          margin: 1.25rem 0;
        }
        .tiptap-content pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
          color: inherit;
        }
        .tiptap-content mark {
          background-color: #fef08a; /* Soft amber/yellow highlight */
          color: #1e293b;
          border-radius: 0.125rem;
          padding: 0 0.125rem;
        }
      `}</style>

      {/* Toolbar Area */}
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/20 p-2 select-none">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btnClass(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-border" />

        {/* Basic formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive("underline"))}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btnClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={btnClass(editor.isActive("highlight"))}
          title="Highlight"
        >
          <Highlighter size={16} />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-border" />

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={btnClass(editor.isActive({ textAlign: "left" }))}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={btnClass(editor.isActive({ textAlign: "center" }))}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={btnClass(editor.isActive({ textAlign: "right" }))}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={btnClass(editor.isActive({ textAlign: "justify" }))}
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-border" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-border" />

        {/* Blocks */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive("blockquote"))}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={btnClass(editor.isActive("code"))}
          title="Inline Code"
        >
          <Code size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={btnClass(editor.isActive("codeBlock"))}
          title="Code Block"
        >
          <Terminal size={16} />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-border" />

        {/* Links */}
        <button
          type="button"
          onClick={addLink}
          className={btnClass(editor.isActive("link"))}
          title="Insert Link"
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className={btnClass(false) + " disabled:opacity-30 disabled:pointer-events-none"}
          title="Remove Link"
        >
          <Unlink size={16} />
        </button>

        <div className="flex-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={btnClass(false) + " disabled:opacity-30 disabled:pointer-events-none"}
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={btnClass(false) + " disabled:opacity-30 disabled:pointer-events-none"}
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="bg-background">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
