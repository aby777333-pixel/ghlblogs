'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiDocumentText, HiDocumentReport, HiUsers, HiPlus } from 'react-icons/hi';
import { apiUrl } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, reports: 0, leads: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [postsRes, reportsRes, leadsRes] = await Promise.all([
        fetch(apiUrl('/api/blogs')),
        fetch(apiUrl('/api/reports')),
        fetch(apiUrl('/api/leads')),
      ]);
      const [posts, reports, leads] = await Promise.all([
        postsRes.json(),
        reportsRes.json(),
        leadsRes.json(),
      ]);
      setStats({
        posts: Array.isArray(posts) ? posts.length : 0,
        reports: Array.isArray(reports) ? reports.length : 0,
        leads: Array.isArray(leads) ? leads.length : 0,
      });
    }
    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-grey-900">Dashboard</h1>
          <p className="text-brand-grey-500 mt-1">Welcome to GHL Blog Admin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-grey-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <HiDocumentText className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-grey-900">{stats.posts}</div>
              <div className="text-brand-grey-500 text-sm">Blog Posts</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-grey-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <HiDocumentReport className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-grey-900">{stats.reports}</div>
              <div className="text-brand-grey-500 text-sm">PDF Reports</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-grey-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <HiUsers className="text-amber-600" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-grey-900">{stats.leads}</div>
              <div className="text-brand-grey-500 text-sm">Leads Captured</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/blogs/new"
          className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-brand-grey-300 hover:border-brand-red/30 transition-colors flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center group-hover:bg-brand-red/20 transition-colors">
            <HiPlus className="text-brand-red" size={24} />
          </div>
          <div>
            <div className="font-bold text-brand-grey-900">New Blog Post</div>
            <div className="text-brand-grey-500 text-sm">Create a new article or insight</div>
          </div>
        </Link>

        <Link
          href="/admin/reports/new"
          className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-brand-grey-300 hover:border-brand-red/30 transition-colors flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center group-hover:bg-brand-red/20 transition-colors">
            <HiPlus className="text-brand-red" size={24} />
          </div>
          <div>
            <div className="font-bold text-brand-grey-900">New PDF Report</div>
            <div className="text-brand-grey-500 text-sm">Upload a gated PDF report</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
