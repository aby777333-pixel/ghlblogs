import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('pdf_reports')
    .select('*, blog_categories(*)')
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

    const { data, error } = await supabaseAdmin.from('pdf_reports').insert({
      title: body.title,
      slug,
      description: body.description,
      cover_image: body.cover_image,
      pdf_url: body.pdf_url,
      pdf_filename: body.pdf_filename,
      category_id: body.category_id || null,
      status: body.status || 'draft',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
