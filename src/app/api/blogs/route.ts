import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*, blog_categories(*), admin_users(name)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const body = await request.json();

    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Clean non-breaking spaces from pasted content
    const cleanContent = (body.content || '').replace(/&nbsp;/g, ' ');

    const wordCount = cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const { data, error } = await supabaseAdmin.from('blog_posts').insert({
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: cleanContent,
      cover_image: body.cover_image,
      category_id: body.category_id || null,
      author_id: user.id,
      post_type: body.post_type || 'blog',
      status: body.status || 'draft',
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      meta_keywords: body.meta_keywords,
      tags: body.tags || [],
      reading_time: readingTime,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
