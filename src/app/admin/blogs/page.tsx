'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import toast from 'react-hot-toast';
import type { BlogPost } from '@/lib/types';
import { apiUrl } from '@/lib/api';

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const res = await fetch(apiUrl('/api/blogs'));
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function deletePost(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const res = await fetch(apiUrl(`/api/blogs/${id}`), { method: 'DELETE' });
    if (res.ok) {
      toast.success('Post deleted');
      fetchPosts();
    } else {
      toast.error('Failed to delete post');
    }
  }

  const statusColors: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-grey-900">Blog Posts</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
        >
          <HiPlus size={18} /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-grey-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brand-grey-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-brand-grey-500">No posts yet. Create your first post!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-grey-100 text-brand-grey-700">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Title</th>
                  <th className="text-left px-6 py-3 font-semibold">Type</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-left px-6 py-3 font-semibold">Views</th>
                  <th className="text-left px-6 py-3 font-semibold">Date</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-grey-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-brand-grey-100/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-grey-900 max-w-xs truncate">{post.title}</div>
                      <div className="text-brand-grey-400 text-xs">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">{post.post_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[post.status]}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{post.views}</td>
                    <td className="px-6 py-4 text-brand-grey-500">
                      {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'published' && (
                          <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-brand-grey-400 hover:text-blue-600">
                            <HiEye size={16} />
                          </Link>
                        )}
                        <Link href={`/admin/blogs/edit/${post.id}`} className="p-2 text-brand-grey-400 hover:text-brand-red">
                          <HiPencil size={16} />
                        </Link>
                        <button onClick={() => deletePost(post.id)} className="p-2 text-brand-grey-400 hover:text-red-600">
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
