'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState } from 'react';

interface Props {
  content: string;
}

export default function TipTapContent({ content }: Props) {
  const [contentState, setContentState] = useState(content);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: contentState,
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
    immediatelyRender: false,
    editable: false,
  });

  useEffect(() => {
    if (editor && content !== contentState) {
      setContentState(content);
      editor.commands.setContent(content);
    }
  }, [content, contentState, editor]);

  return (
    <div className="editor-container padding-0">
      <EditorContent editor={editor} />
    </div>
  );
}
