'use client';

import { fetchImage } from '@/lib/firebase/storage';
import { Memento } from '@/schemas/memento';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Account } from '@/schemas/account';
import { getDateFromWeek } from '@/utils/lifeUtils';

interface Props {
  memento: Memento;
  account: Account;
}

export default function MementoCard({ memento, account }: Props) {
  const [image, setImage] = useState('');

  const sanitizedHtml = DOMPurify.sanitize(memento.body);

  useEffect(() => {
    const getImage = async () => {
      if (image) {
        return;
      }

      const imageUrl = await fetchImage(
        memento.heroImage.url.replace(
          'https://storage.googleapis.com/memento-mori-4ee04.appspot.com/',
          ''
        )
      );

      if (imageUrl) {
        setImage(imageUrl);
      }
    };

    getImage();
  }, [image, memento.heroImage.url]);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: sanitizedHtml,
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
    immediatelyRender: false,
    editable: false,
  });

  if (!editor) {
    return null;
  }
  return (
    <div
      key={memento.uid}
      className="mb-4 p-4 bg-background shadow-md rounded-lg"
    >
      {!image ? (
        <div className="animate-pulse h-48 bg-gray-400 rounded-t-lg"></div>
      ) : (
        memento.heroImage && (
          <img
            src={image}
            alt={``}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )
      )}
      <h2 className="text-xl font-semibold mt-2">{memento.title}</h2>

      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>
      <p className="text-gray-500 text-sm mt-2">
        {getDateFromWeek(account.dob.unix, memento.week)}
      </p>
    </div>
  );
}
