'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { HiUpload } from 'react-icons/hi';
import type { BlogCategory } from '@/lib/types';

export default function NewReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    cover_image: '',
    pdf_url: '',
    pdf_filename: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    fetch('/api/categories').then((res) => res.json()).then(setCategories);
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'pdf-reports');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }
      const data = await res.json();
      if (data.url) {
        setForm({ ...form, pdf_url: data.url, pdf_filename: file.name });
        toast.success('PDF uploaded');
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed. Please login again.');
    } finally {
      setPdfUploading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'blog-images');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }
      const data = await res.json();
      if (data.url) {
        setForm({ ...form, cover_image: data.url });
        toast.success('Cover uploaded');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setCoverUploading(false);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!form.title || !form.pdf_url) {
      toast.error('Title and PDF are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status }),
      });

      if (!res.ok) throw new Error('Failed');

      toast.success(status === 'published' ? 'Published!' : 'Saved as draft');
      router.push('/admin/reports');
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-grey-900 mb-6">New PDF Report</h1>

      <div className="max-w-2xl space-y-5">
        <div>
          <label className="block text-sm font-semibold text-brand-grey-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none"
            placeholder="Report title..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-grey-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none"
            placeholder="Brief description of the report..."
          />
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

        {/* PDF Upload */}
        <div className="bg-white rounded-2xl p-5 border border-brand-grey-200">
          <label className="block text-sm font-semibold text-brand-grey-700 mb-3">PDF File *</label>
          {form.pdf_url ? (
            <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl mb-3">
              <span className="text-green-700 text-sm font-medium">{form.pdf_filename}</span>
              <button onClick={() => setForm({ ...form, pdf_url: '', pdf_filename: '' })} className="text-red-500 text-xs ml-auto">Remove</button>
            </div>
          ) : null}
          <label className="flex items-center gap-2 justify-center border-2 border-dashed border-brand-grey-300 rounded-xl py-6 cursor-pointer hover:border-brand-red/30 transition-colors">
            <HiUpload className="text-brand-grey-400" size={24} />
            <span className="text-sm text-brand-grey-500">
              {pdfUploading ? 'Uploading PDF...' : 'Upload PDF File'}
            </span>
            <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
          </label>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-2xl p-5 border border-brand-grey-200">
          <label className="block text-sm font-semibold text-brand-grey-700 mb-3">Cover Image</label>
          {form.cover_image ? (
            <div className="relative mb-3">
              <img src={form.cover_image} alt="Cover" className="w-full h-40 object-cover rounded-xl" />
              <button onClick={() => setForm({ ...form, cover_image: '' })} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-lg text-xs">Remove</button>
            </div>
          ) : null}
          <label className="flex items-center gap-2 justify-center border-2 border-dashed border-brand-grey-300 rounded-xl py-4 cursor-pointer hover:border-brand-red/30 transition-colors">
            <HiUpload className="text-brand-grey-400" />
            <span className="text-sm text-brand-grey-500">{coverUploading ? 'Uploading...' : 'Upload Cover Image'}</span>
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit('published')}
            disabled={loading}
            className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Publish Report'}
          </button>
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="flex-1 bg-brand-grey-200 hover:bg-brand-grey-300 text-brand-grey-700 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}
