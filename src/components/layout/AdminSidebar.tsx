'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin',           label: 'Dashboard', icon: '◈' },
  { href: '/admin/products',  label: 'Products',  icon: '◻' },
  { href: '/admin/orders',    label: 'Orders',    icon: '⊡' },
  { href: '/admin/banners',   label: 'Banners',   icon: '▤' },
  { href: '/admin/media',     label: 'Story & Hero Media', icon: '▣' },
  { href: '/admin/themes',    label: 'Festival Themes', icon: '◎' },
  { href: '/admin/discounts', label: 'Discounts', icon: '◇' },
];

export function AdminSidebar() {
  const path = usePathname();

  const logout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    window.location.href = '/admin';
  };

  return (
    <aside className="w-[220px] min-h-screen bg-charcoal flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-ivory/8 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full border border-gold flex items-center justify-center font-display text-[11px] text-gold">
          ME
        </div>
        <span className="text-[13px] text-ivory/90 font-sans tracking-wide">
          minnie <span className="text-gold">admin</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        <p className="label-xs text-ivory/25 px-5 pb-2">Store</p>
        {NAV.slice(0, 3).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-item ${
              (item.href === '/admin' ? path === '/admin' : path.startsWith(item.href))
                ? 'active'
                : ''
            }`}
          >
            <span className="text-base leading-none w-4">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <p className="label-xs text-ivory/25 px-5 pt-5 pb-2">Customise</p>
        {NAV.slice(3).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-item ${path.startsWith(item.href) ? 'active' : ''}`}
          >
            <span className="text-base leading-none w-4">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-ivory/8 space-y-2">
        <Link href="/" className="admin-nav-item text-[11px]" target="_blank">
          ↗ View Site
        </Link>
        <button onClick={logout} className="admin-nav-item w-full text-left text-[11px]">
          ← Log Out
        </button>
      </div>
    </aside>
  );
}
