'use client';

import { HiDownload } from 'react-icons/hi';
import type { PdfReport } from '@/lib/types';

interface ReportCardProps {
  report: PdfReport;
  onDownload: (report: PdfReport) => void;
}

export default function ReportCard({ report, onDownload }: ReportCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-grey-200 hover:border-brand-red/20 group">
      <div className="relative h-48 bg-brand-grey-200 overflow-hidden">
        {report.cover_image && report.cover_image.length > 5 ? (
          <img
            src={report.cover_image}
            alt={report.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-brand-black/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <HiDownload className="text-brand-red" size={28} />
              </div>
              <span className="text-white text-xs font-medium bg-brand-red/80 px-3 py-1 rounded-full">PDF Report</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        {report.blog_categories && (
          <span className="text-brand-red text-xs font-semibold uppercase tracking-wide">
            {report.blog_categories.name}
          </span>
        )}
        <h3 className="text-lg font-bold text-brand-grey-900 mt-1 mb-2 line-clamp-2">
          {report.title}
        </h3>
        {report.description && (
          <p className="text-brand-grey-500 text-sm line-clamp-2 mb-4">{report.description}</p>
        )}
        <button
          onClick={() => onDownload(report)}
          className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <HiDownload size={18} />
          Download Report
        </button>
        <p className="text-xs text-brand-grey-400 text-center mt-2">
          {report.download_count} downloads
        </p>
      </div>
    </div>
  );
}
