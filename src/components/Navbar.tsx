'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 border border-white/10 backdrop-blur-md rounded-full px-6 py-2">
  <nav className="flex items-center gap-4 text-sm text-white">
    {navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition',
          pathname === item.href && 'bg-white/10'
        )}
      >
        {/* Optional: Add icons here */}
        <span>{item.label}</span>
      </Link>
    ))}
  </nav>
</header>

  );
}