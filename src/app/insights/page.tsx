import { supabase } from '@/lib/supabase';
import BlogCard from '@/components/BlogCard';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Investment Insights | GHL India Ventures',
  description: 'Expert AIF and real estate investment insights, market perspectives, and analysis from GHL India Ventures.',
};

async function getInsights() {
  const { data } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(*), admin_users(name)')
    .eq('status', 'published')
    .eq('post_type', 'insight')
    .order('published_at', { ascending: false });
  return data || [];
}

export default async function InsightsPage() {
  const posts = await getInsights();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-brand-grey-900">Investment Insights</h1>
        <p className="text-brand-grey-500 mt-2 text-lg">
          Expert perspectives on AIF performance, real estate opportunities, and investment strategies
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
          <h3 className="text-xl font-bold text-brand-grey-900 mb-2">No Insights Yet</h3>
          <p className="text-brand-grey-500">Expert investment insights coming soon. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
