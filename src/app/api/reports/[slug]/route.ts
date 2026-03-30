import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

type Props = { params: Promise<{ slug: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { slug } = await params;
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from('pdf_reports')
    .update({
      title: body.title,
      slug: body.slug,
      description: body.description,
      cover_image: body.cover_image,
      pdf_url: body.pdf_url,
      pdf_filename: body.pdf_filename,
      category_id: body.category_id || null,
      status: body.status,
      updated_at: new Date().toISOString(),
    })
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

  const { error } = await supabaseAdmin.from('pdf_reports').delete().eq('id', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
