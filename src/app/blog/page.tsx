import { supabase } from '@/lib/supabase';
import BlogCard from '@/components/BlogCard';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog | GHL India Ventures',
  description: 'Read the latest AIF analysis, real estate investment insights, and expert research from GHL India Ventures.',
};

async function getPosts() {
  const { data } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(*), admin_users(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  return data || [];
}

async function getCategories() {
  const { data } = await supabase.from('blog_categories').select('*').order('name');
  return data || [];
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-brand-grey-900">Blog & Analysis</h1>
        <p className="text-brand-grey-500 mt-2 text-lg">
          Expert insights on AIF, real estate investments, and wealth-building strategies
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-brand-grey-200">
          <h3 className="text-xl font-bold text-brand-grey-900 mb-2">No Posts Yet</h3>
          <p className="text-brand-grey-500">Check back soon for new content.</p>
        </div>
      )}
    </div>
  );
}
