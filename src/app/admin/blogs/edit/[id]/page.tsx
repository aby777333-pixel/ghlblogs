'use client';

import { use } from 'react';
import BlogEditor from '@/components/BlogEditor';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-grey-900 mb-6">Edit Post</h1>
      <BlogEditor mode="edit" postId={id} />
    </div>
  );
}
