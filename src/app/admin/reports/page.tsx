'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { HiPlus, HiPencil, HiTrash, HiDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import type { PdfReport } from '@/lib/types';
import { apiUrl } from '@/lib/api';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<PdfReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  async function fetchReports() {
    const res = await fetch(apiUrl('/api/reports'));
    const data = await res.json();
    setReports(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function deleteReport(id: string) {
    if (!confirm('Delete this report?')) return;
    const res = await fetch(apiUrl(`/api/reports/${id}`), { method: 'DELETE' });
    if (res.ok) { toast.success('Report deleted'); fetchReports(); }
    else toast.error('Failed to delete');
  }

  const statusColors: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-grey-900">PDF Reports</h1>
        <Link
          href="/admin/reports/new"
          className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
        >
          <HiPlus size={18} /> New Report
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-grey-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brand-grey-500">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-brand-grey-500">No reports yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-grey-100 text-brand-grey-700">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Title</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-left px-6 py-3 font-semibold">Downloads</th>
                  <th className="text-left px-6 py-3 font-semibold">Date</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-grey-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-brand-grey-100/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-grey-900">{report.title}</div>
                      <div className="text-brand-grey-400 text-xs">{report.pdf_filename}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[report.status]}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{report.download_count}</td>
                    <td className="px-6 py-4 text-brand-grey-500">
                      {format(new Date(report.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a href={report.pdf_url} target="_blank" className="p-2 text-brand-grey-400 hover:text-blue-600">
                          <HiDownload size={16} />
                        </a>
                        <button onClick={() => deleteReport(report.id)} className="p-2 text-brand-grey-400 hover:text-red-600">
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
