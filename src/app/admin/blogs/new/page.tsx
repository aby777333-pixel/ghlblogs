'use client';

import BlogEditor from '@/components/BlogEditor';

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-grey-900 mb-6">Create New Post</h1>
      <BlogEditor mode="create" />
    </div>
  );
}
