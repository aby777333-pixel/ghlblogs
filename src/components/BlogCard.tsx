import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { BlogPost } from '@/lib/types';

export default function BlogCard({ post }: { post: BlogPost }) {
  const typeColors: Record<string, string> = {
    blog: 'bg-blue-100 text-blue-700',
    insight: 'bg-amber-100 text-amber-700',
    report: 'bg-green-100 text-green-700',
  };

  const typeRoute: Record<string, string> = {
    blog: '/blog',
    insight: '/blog',
    report: '/blog',
  };

  return (
    <Link
      href={`${typeRoute[post.post_type] || '/blog'}/${post.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-grey-200 hover:border-brand-red/20 hover:-translate-y-1"
    >
      <div className="relative h-48 bg-brand-grey-200 overflow-hidden">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 to-brand-black/10 flex items-center justify-center">
            <div className="w-16 h-16 bg-brand-red/20 rounded-2xl flex items-center justify-center">
              <span className="text-brand-red font-bold text-2xl">GHL</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColors[post.post_type] || typeColors.blog}`}>
            {post.post_type === 'insight' ? 'Insight' : post.post_type === 'report' ? 'Report' : 'Blog'}
          </span>
        </div>
      </div>

      <div className="p-5">
        {post.blog_categories && (
          <span className="text-brand-red text-xs font-semibold uppercase tracking-wide">
            {post.blog_categories.name}
          </span>
        )}
        <h3 className="text-lg font-bold text-brand-grey-900 mt-1 mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-brand-grey-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-brand-grey-400">
          <span>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}</span>
          {post.reading_time && <span>{post.reading_time} min read</span>}
        </div>
      </div>
    </Link>
  );
}
