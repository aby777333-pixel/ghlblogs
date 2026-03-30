import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  const { slug } = await params;

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*, blog_categories(*), admin_users(name)')
    .eq('id', slug)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: Props) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { slug } = await params;
  const body = await request.json();

  const cleanContent = (body.content || '').replace(/&nbsp;/g, ' ');

  const wordCount = cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const updateData: Record<string, unknown> = {
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content: cleanContent,
    cover_image: body.cover_image,
    category_id: body.category_id || null,
    post_type: body.post_type || 'blog',
    status: body.status,
    meta_title: body.meta_title,
    meta_description: body.meta_description,
    meta_keywords: body.meta_keywords,
    tags: body.tags || [],
    reading_time: readingTime,
    updated_at: new Date().toISOString(),
  };

  if (body.status === 'published' && !body.published_at) {
    updateData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update(updateData)
    .eq('id', slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { slug } = await params;

  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
