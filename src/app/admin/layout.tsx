'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { HiDocumentText, HiDocumentReport, HiUsers, HiLogout, HiMenu, HiX, HiHome } from 'react-icons/hi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuth(true);
      return;
    }
    fetch('/api/auth/verify')
      .then((res) => {
        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
          router.push('/admin/login');
        }
      })
      .catch(() => {
        setIsAuth(false);
        router.push('/admin/login');
      });
  }, [pathname, router]);

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 bg-brand-red rounded-xl flex items-center justify-center font-bold text-white mx-auto mb-3 animate-pulse">GHL</div>
          <p className="text-brand-grey-400 text-sm">Loading admin...</p>
        </div>
      </div>
    );
  }

  if (isAuth === false) return null;

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: HiHome },
    { href: '/admin/blogs', label: 'Blog Posts', icon: HiDocumentText },
    { href: '/admin/reports', label: 'PDF Reports', icon: HiDocumentReport },
    { href: '/admin/leads', label: 'Leads', icon: HiUsers },
  ];

  return (
    <div className="min-h-screen bg-brand-grey-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-brand-black text-white p-4 flex items-center justify-between">
        <span className="font-bold">GHL Admin</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-brand-black text-white transform transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center font-bold text-sm">
                GHL
              </div>
              <div>
                <div className="font-bold text-sm">Blog Admin</div>
                <div className="text-xs text-brand-grey-400">CMS Panel</div>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-brand-red text-white' : 'text-brand-grey-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 text-brand-grey-400 hover:text-white text-sm mb-2 transition-colors"
            >
              <HiHome size={18} /> View Blog
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-brand-grey-400 hover:text-red-400 text-sm w-full transition-colors"
            >
              <HiLogout size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:min-h-[calc(100vh-0px)]">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
