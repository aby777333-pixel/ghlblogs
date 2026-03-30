'use client';

import { useState } from 'react';
import { HiX, HiDownload, HiEye } from 'react-icons/hi';
import toast from 'react-hot-toast';
import type { PdfReport } from '@/lib/types';
import { apiUrl } from '@/lib/api';

interface LeadCaptureModalProps {
  report: PdfReport;
  onClose: () => void;
}

export default function LeadCaptureModal({ report, onClose }: LeadCaptureModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          pdf_report_id: report.id,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setStep('success');
      toast.success('Thank you! Your report is ready.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-brand-black p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <HiX size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-red rounded-xl flex items-center justify-center">
              <HiDownload className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{report.title}</h3>
              <p className="text-brand-grey-400 text-sm">Free PDF Report</p>
            </div>
          </div>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-brand-grey-500 text-sm">
              Enter your details below to access this report instantly.
            </p>

            <div>
              <label className="block text-sm font-medium text-brand-grey-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-grey-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-grey-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-colors"
                placeholder="+91 9876543210"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Get Free Report'}
            </button>

            <p className="text-xs text-brand-grey-400 text-center">
              We respect your privacy. Your data is secure with us.
            </p>
          </form>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-brand-grey-900 mb-2">Your Report is Ready!</h3>
            <p className="text-brand-grey-500 text-sm mb-6">{report.title}</p>

            <div className="space-y-3">
              <a
                href={report.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <HiEye size={18} />
                View Report
              </a>
              <a
                href={report.pdf_url}
                download={report.pdf_filename}
                className="w-full bg-brand-black hover:bg-brand-darkgrey text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <HiDownload size={18} />
                Download PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
