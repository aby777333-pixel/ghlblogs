import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BlogCard from '@/components/BlogCard';
import { HiArrowRight, HiTrendingUp, HiLightBulb, HiDocumentReport } from 'react-icons/hi';
import LeadForm from '@/components/LeadForm';

export const revalidate = 60;

async function getLatestPosts() {
  const { data } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(*), admin_users(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6);
  return data || [];
}

async function getReportCount() {
  const { count } = await supabase
    .from('pdf_reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  return count || 0;
}

export default async function HomePage() {
  const [posts, reportCount] = await Promise.all([getLatestPosts(), getReportCount()]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-brand-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-red rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 text-brand-red px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
                Investment Insights Updated Daily
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Expert AIF &{' '}
                <span className="text-brand-red">Real Estate</span>{' '}
                Investment Insights
              </h1>

              <p className="text-brand-grey-400 text-lg leading-relaxed mb-8 max-w-xl">
                Stay informed with in-depth analysis, investment strategies,
                and expert research reports on AIF and real estate from GHL India Ventures.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/blog"
                  className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  Read Latest Posts <HiArrowRight />
                </Link>
                <Link
                  href="/reports"
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-colors border border-white/10"
                >
                  Free Reports ({reportCount})
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{posts.length}+</div>
                  <div className="text-brand-grey-400 text-xs mt-1">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{reportCount}</div>
                  <div className="text-brand-grey-400 text-xs mt-1">Free Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Daily</div>
                  <div className="text-brand-grey-400 text-xs mt-1">Updates</div>
                </div>
              </div>
            </div>

            {/* Right: Lead Capture Form */}
            <div className="lg:col-span-2">
              <LeadForm variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/blog" className="group p-6 rounded-2xl border-2 border-brand-grey-200 hover:border-brand-red/30 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <HiTrendingUp className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg text-brand-grey-900 mb-2">Investment Analysis</h3>
              <p className="text-brand-grey-500 text-sm">In-depth AIF performance analysis, real estate trends, and market commentary.</p>
            </Link>

            <Link href="/insights" className="group p-6 rounded-2xl border-2 border-brand-grey-200 hover:border-brand-red/30 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                <HiLightBulb className="text-amber-600" size={24} />
              </div>
              <h3 className="font-bold text-lg text-brand-grey-900 mb-2">Investment Insights</h3>
              <p className="text-brand-grey-500 text-sm">Expert perspectives on AIF, real estate opportunities, and wealth-building strategies.</p>
            </Link>

            <Link href="/reports" className="group p-6 rounded-2xl border-2 border-brand-grey-200 hover:border-brand-red/30 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <HiDocumentReport className="text-green-600" size={24} />
              </div>
              <h3 className="font-bold text-lg text-brand-grey-900 mb-2">Research Reports</h3>
              <p className="text-brand-grey-500 text-sm">Download comprehensive PDF reports and analysis documents.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-brand-grey-900">Latest Articles</h2>
              <p className="text-brand-grey-500 mt-2">Fresh insights and analysis from our experts</p>
            </div>
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-1 text-brand-red hover:text-brand-red-dark font-semibold text-sm transition-colors"
            >
              View All <HiArrowRight />
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-brand-grey-200">
              <div className="w-20 h-20 bg-brand-grey-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiDocumentReport className="text-brand-grey-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-grey-900 mb-2">Content Coming Soon</h3>
              <p className="text-brand-grey-500 max-w-md mx-auto">
                We&apos;re preparing insightful content for you. Stay tuned for AIF analysis, real estate insights, and more.
              </p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-brand-red font-semibold"
            >
              View All Articles <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Wealth?
          </h2>
          <p className="text-brand-grey-400 text-lg mb-8 max-w-2xl mx-auto">
            Join smart investors who rely on GHL India Ventures for AIF and real estate investment insights.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/reports"
              className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Download Free Reports
            </Link>
            <a
              href="https://ghlindiaventures.com"
              target="_blank"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-colors border border-white/10"
            >
              Visit GHL India Ventures
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
