'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { href: '/', label: 'INICIO' },
  { href: '/catalogo', label: 'CATÁLOGO' },
  { href: '/mi-lista', label: 'MI LISTA' },
  { href: '/historial', label: 'HISTORIAL' },
];

export function Nav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn('hidden md:flex items-center gap-6', className)}>
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === '/'
            ? pathname === '/'
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            prefetch={true}
            className={cn(
              'text-xs font-bold uppercase tracking-widest transition-colors py-1',
              isActive
                ? 'text-ink border-b-2 border-accent'
                : 'text-muted hover:text-ink'
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
