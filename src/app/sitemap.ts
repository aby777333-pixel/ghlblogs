import { supabase } from '@/lib/supabase';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.ghlindiaventures.com';

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const { data: reports } = await supabase
    .from('pdf_reports')
    .select('slug, updated_at')
    .eq('status', 'published');

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/insights`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/reports`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}
