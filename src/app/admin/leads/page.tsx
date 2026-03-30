'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { HiDownload, HiUsers } from 'react-icons/hi';
import type { Lead } from '@/lib/types';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => {
        setLeads(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Report', 'Source', 'Date'];
    const rows = leads.map((l) => [
      l.name,
      l.email,
      l.phone,
      l.pdf_reports?.title || '-',
      l.source,
      format(new Date(l.created_at), 'yyyy-MM-dd HH:mm'),
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-grey-900">Leads</h1>
          <p className="text-brand-grey-500 text-sm mt-1">{leads.length} total leads captured</p>
        </div>
        {leads.length > 0 && (
          <button
            onClick={exportCSV}
            className="bg-brand-black hover:bg-brand-darkgrey text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            <HiDownload size={18} /> Export CSV
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-grey-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brand-grey-500">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center">
            <HiUsers className="text-brand-grey-300 mx-auto mb-3" size={48} />
            <p className="text-brand-grey-500">No leads captured yet. Share your reports to start collecting leads!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-grey-100 text-brand-grey-700">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Name</th>
                  <th className="text-left px-6 py-3 font-semibold">Email</th>
                  <th className="text-left px-6 py-3 font-semibold">Phone</th>
                  <th className="text-left px-6 py-3 font-semibold">Report</th>
                  <th className="text-left px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-grey-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-brand-grey-100/50">
                    <td className="px-6 py-4 font-medium text-brand-grey-900">{lead.name}</td>
                    <td className="px-6 py-4 text-blue-600">{lead.email}</td>
                    <td className="px-6 py-4">{lead.phone}</td>
                    <td className="px-6 py-4 text-brand-grey-500 max-w-xs truncate">
                      {lead.pdf_reports?.title || '-'}
                    </td>
                    <td className="px-6 py-4 text-brand-grey-500">
                      {format(new Date(lead.created_at), 'MMM d, yyyy h:mm a')}
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
