'use client';

import { useState } from 'react';
import { HiChat, HiX } from 'react-icons/hi';
import LeadForm from './LeadForm';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Form Popup */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/20 sm:bg-transparent" onClick={() => setOpen(false)} />
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-brand-grey-200 overflow-hidden animate-fade-in">
            <div className="bg-brand-black p-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm">Contact Us</h3>
                <p className="text-brand-grey-400 text-xs">We&apos;ll get back to you soon</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-brand-grey-400 hover:text-white">
                <HiX size={20} />
              </button>
            </div>
            <div className="p-4">
              <LeadForm variant="floating" onSuccess={() => setTimeout(() => setOpen(false), 3000)} />
            </div>
          </div>
        </>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-brand-grey-800 hover:bg-brand-grey-900 rotate-0'
            : 'bg-brand-red hover:bg-brand-red-dark hover:scale-110'
        }`}
      >
        {open ? (
          <HiX className="text-white" size={24} />
        ) : (
          <HiChat className="text-white" size={24} />
        )}
      </button>
    </div>
  );
}
