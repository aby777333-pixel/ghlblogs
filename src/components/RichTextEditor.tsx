'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef, useCallback, useEffect } from 'react';
import { uploadFile } from '@/lib/upload';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Get the Quill instance from the DOM
      const editorEl = editorRef.current?.querySelector('.ql-editor');
      const quillContainer = editorRef.current?.querySelector('.ql-container');
      // @ts-expect-error - accessing Quill instance from DOM
      const quill = quillContainer?.__quill;

      if (!quill) {
        // Fallback: insert via onChange with img tag
        try {
          const { url } = await uploadFile(file, 'blog-images');
          const imgTag = `<p><img src="${url}" alt="Article image" /></p>`;
          onChange(value + imgTag);
        } catch (err) {
          alert('Failed to upload image. Please try again.');
          console.error('Image upload error:', err);
        }
        return;
      }

      const range = quill.getSelection(true);

      try {
        const { url } = await uploadFile(file, 'blog-images');
        quill.insertEmbed(range.index, 'image', url);
        quill.setSelection(range.index + 1);
      } catch (err) {
        alert('Failed to upload image. Please try again.');
        console.error('Image upload error:', err);
      }
    };
  }, [value, onChange]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), [imageHandler]);

  return (
    <div ref={editorRef}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="bg-white rounded-xl"
      />
    </div>
  );
}
