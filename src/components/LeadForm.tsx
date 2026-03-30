'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiCheckCircle } from 'react-icons/hi';

interface LeadFormProps {
  variant?: 'hero' | 'floating';
  onSuccess?: () => void;
}

export default function LeadForm({ variant = 'hero', onSuccess }: LeadFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: variant === 'hero' ? 'hero_form' : 'floating_widget' }),
      });

      if (!res.ok) throw new Error('Failed');

      setSubmitted(true);
      toast.success('Thank you! We\'ll be in touch soon.');
      onSuccess?.();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`text-center ${variant === 'hero' ? 'py-8' : 'py-6'}`}>
        <HiCheckCircle className="text-green-500 mx-auto mb-3" size={48} />
        <h3 className={`font-bold mb-1 ${variant === 'hero' ? 'text-white text-xl' : 'text-brand-grey-900 text-lg'}`}>
          Thank You!
        </h3>
        <p className={`text-sm ${variant === 'hero' ? 'text-brand-grey-400' : 'text-brand-grey-500'}`}>
          Our team will contact you shortly.
        </p>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8">
        <h3 className="text-white font-bold text-xl mb-1">Get Expert Advice</h3>
        <p className="text-brand-grey-400 text-sm mb-5">Free consultation on AIF & real estate investments</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-brand-grey-400 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red outline-none text-sm"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email Address"
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-brand-grey-400 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red outline-none text-sm"
          />
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone Number"
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-brand-grey-400 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Submitting...' : 'Request Free Consultation'}
          </button>
        </form>

        <p className="text-brand-grey-500 text-xs text-center mt-3">
          We respect your privacy. No spam, ever.
        </p>
      </div>
    );
  }

  // Floating variant
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Full Name"
        className="w-full px-4 py-2.5 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none text-sm"
      />
      <input
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email Address"
        className="w-full px-4 py-2.5 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none text-sm"
      />
      <input
        type="tel"
        required
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Phone Number"
        className="w-full px-4 py-2.5 border border-brand-grey-300 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 text-sm"
      >
        {loading ? 'Submitting...' : 'Get In Touch'}
      </button>
      <p className="text-brand-grey-400 text-xs text-center">
        No spam. We respect your privacy.
      </p>
    </form>
  );
}
