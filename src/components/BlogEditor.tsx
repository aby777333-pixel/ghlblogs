'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import { HiUpload } from 'react-icons/hi';
import { uploadFile } from '@/lib/upload';
import type { BlogCategory } from '@/lib/types';

interface BlogEditorProps {
  mode: 'create' | 'edit';
  postId?: string;
}

export default function BlogEditor({ mode, postId }: BlogEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [coverUploading, setCoverUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category_id: '',
    post_type: 'blog' as 'blog' | 'insight' | 'report',
    status: 'draft' as 'draft' | 'published',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    tags: '' as string,
  });

  useEffect(() => {
    fetch('/api/categories').then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) setCategories(data);
    });

    if (mode === 'edit' && postId) {
      fetch(`/api/blogs/${postId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            ...data,
            category_id: data.category_id || '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            meta_title: data.meta_title || '',
            meta_description: data.meta_description || '',
            meta_keywords: data.meta_keywords || '',
            cover_image: data.cover_image || '',
          });
        });
    }
  }, [mode, postId]);

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setForm({ ...form, title, slug: mode === 'create' ? slug : form.slug });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverUploading(true);
    try {
      const result = await uploadFile(file, 'blog-images');
      setForm({ ...form, cover_image: result.url });
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setCoverUploading(false);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!form.title || !form.content) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      const url = mode === 'edit' ? `/api/blogs/${postId}` : '/api/blogs';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status, tags }),
      });

      if (res.status === 401) {
        toast.error('Session expired. Redirecting to login...');
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to save');

      toast.success(status === 'published' ? 'Published!' : 'Saved as draft');
      router.push('/admin/blogs');
    } catch {
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brand-grey-700 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none text-lg"
              placeholder="Your blog post title..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-grey-700 mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2.5 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-grey-700 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none"
              placeholder="Brief summary of the post..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-grey-700 mb-1">Content *</label>
            <RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cover Image */}
          <div className="bg-white rounded-2xl p-5 border border-brand-grey-200">
            <label className="block text-sm font-semibold text-brand-grey-700 mb-3">Cover Image</label>
            {form.cover_image ? (
              <div className="relative mb-3">
                <img src={form.cover_image} alt="Cover" className="w-full h-40 object-cover rounded-xl" />
                <button
                  onClick={() => setForm({ ...form, cover_image: '' })}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-lg text-xs"
                >
                  Remove
                </button>
              </div>
            ) : null}
            <label className="flex items-center gap-2 justify-center border-2 border-dashed border-brand-grey-300 rounded-xl py-4 cursor-pointer hover:border-brand-red/30 transition-colors">
              <HiUpload className="text-brand-grey-400" />
              <span className="text-sm text-brand-grey-500">
                {coverUploading ? 'Uploading...' : 'Upload Image'}
              </span>
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </label>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl p-5 border border-brand-grey-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brand-grey-700 mb-1">Post Type</label>
              <select
                value={form.post_type}
                onChange={(e) => setForm({ ...form, post_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-brand-grey-300 rounded-xl text-sm"
              >
                <option value="blog">Blog</option>
                <option value="insight">Insight</option>
                <option value="report">Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-grey-700 mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-brand-grey-300 rounded-xl text-sm"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-grey-700 mb-1">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-3 py-2 border border-brand-grey-300 rounded-xl text-sm"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl p-5 border border-brand-grey-200 space-y-4">
            <h3 className="font-semibold text-brand-grey-900">SEO Settings</h3>
            <div>
              <label className="block text-xs font-medium text-brand-grey-500 mb-1">Meta Title</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                className="w-full px-3 py-2 border border-brand-grey-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-grey-500 mb-1">Meta Description</label>
              <textarea
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-brand-grey-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-grey-500 mb-1">Meta Keywords</label>
              <input
                type="text"
                value={form.meta_keywords}
                onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                className="w-full px-3 py-2 border border-brand-grey-300 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubmit('published')}
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Publish'}
            </button>
            <button
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              className="w-full bg-brand-grey-200 hover:bg-brand-grey-300 text-brand-grey-700 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
