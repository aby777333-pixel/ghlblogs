import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { HiArrowLeft, HiClock, HiEye, HiTag } from 'react-icons/hi';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  const { data } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(*), admin_users(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data;
}

async function getRelatedPosts(categoryId: string | null, currentSlug: string) {
  if (!categoryId) return [];
  const { data } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(*)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(3);
  return data || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.meta_title || `${post.title} | GHL India Ventures Blog`,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.category_id, slug);

  // Increment views
  await supabase.from('blog_posts').update({ views: (post.views || 0) + 1 }).eq('id', post.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.meta_description || '',
    image: post.cover_image || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: 'GHL India Ventures' },
    publisher: {
      '@type': 'Organization',
      name: 'GHL India Ventures',
      url: 'https://ghlindiaventures.com',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/blog" className="inline-flex items-center gap-1 text-brand-red hover:text-brand-red-dark text-sm font-medium mb-8">
        <HiArrowLeft /> Back to Blog
      </Link>

      {post.cover_image && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-brand-grey-200 overflow-hidden">
        <div className="mb-8">
          {post.blog_categories && (
            <span className="text-brand-red text-sm font-semibold uppercase tracking-wide">
              {post.blog_categories.name}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-brand-grey-900 mt-2 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-brand-grey-500 border-b border-brand-grey-200 pb-4">
            {post.admin_users && <span>By {post.admin_users.name}</span>}
            {post.published_at && (
              <span className="flex items-center gap-1">
                <HiClock size={14} />
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </span>
            )}
            {post.reading_time && (
              <span className="flex items-center gap-1">
                <HiClock size={14} />
                {post.reading_time} min read
              </span>
            )}
            <span className="flex items-center gap-1">
              <HiEye size={14} />
              {post.views} views
            </span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-brand-grey-100 text-brand-grey-700 px-3 py-1 rounded-full text-xs">
                  <HiTag size={12} /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="blog-content text-brand-grey-800 leading-relaxed max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-8">
          <h3 className="text-2xl font-bold text-brand-grey-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group bg-white rounded-xl p-4 border border-brand-grey-200 hover:border-brand-red/20 hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-brand-grey-900 group-hover:text-brand-red transition-colors line-clamp-2">
                  {p.title}
                </h4>
                <p className="text-brand-grey-500 text-sm mt-2 line-clamp-2">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
    </>
  );
}
