'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
} from 'react-icons/md';

interface Props {
  state: string;
  setState: (state: string) => void;
}

export default function TipTap({ state, setState }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: state,
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  editor.on('update', () => {
    setState(editor.getHTML());
  });

  return (
    <div>
      <div className="menu-bar space-x-4 bg-backgroundSecondary rounded p-2 flex items-center">
        <label
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <MdFormatBold />
        </label>
        <label
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <MdFormatItalic />
        </label>
        <label
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
        >
          <MdFormatUnderlined />
        </label>
        <label
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <MdFormatListBulleted />
        </label>
        <label
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <MdFormatListNumbered />
        </label>
      </div>

      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
