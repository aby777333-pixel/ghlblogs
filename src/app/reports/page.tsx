'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ReportCard from '@/components/ReportCard';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import type { PdfReport } from '@/lib/types';

export default function ReportsPage() {
  const [reports, setReports] = useState<PdfReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<PdfReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      const { data } = await supabase
        .from('pdf_reports')
        .select('*, blog_categories(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      setReports(data || []);
      setLoading(false);
    }
    fetchReports();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-brand-grey-900">Research Reports</h1>
        <p className="text-brand-grey-500 mt-2 text-lg">
          Download comprehensive PDF reports and analysis documents for free
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-brand-grey-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-brand-grey-200 rounded w-1/3" />
                <div className="h-5 bg-brand-grey-200 rounded w-3/4" />
                <div className="h-4 bg-brand-grey-200 rounded w-full" />
                <div className="h-10 bg-brand-grey-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onDownload={setSelectedReport} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-brand-grey-200">
          <h3 className="text-xl font-bold text-brand-grey-900 mb-2">No Reports Yet</h3>
          <p className="text-brand-grey-500">Research reports coming soon. Stay tuned!</p>
        </div>
      )}

      {selectedReport && (
        <LeadCaptureModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
