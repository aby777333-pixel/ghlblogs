import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, phone, pdf_report_id } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required' }, { status: 400 });
    }

    const { data, error } = await supabase.from('leads').insert({
      name,
      email,
      phone,
      pdf_report_id: pdf_report_id || null,
      source: 'pdf_download',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Increment download count if report
    if (pdf_report_id) {
      const { data: report } = await supabaseAdmin
        .from('pdf_reports')
        .select('download_count')
        .eq('id', pdf_report_id)
        .single();

      if (report) {
        await supabaseAdmin
          .from('pdf_reports')
          .update({ download_count: (report.download_count || 0) + 1 })
          .eq('id', pdf_report_id);
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*, pdf_reports(title)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
