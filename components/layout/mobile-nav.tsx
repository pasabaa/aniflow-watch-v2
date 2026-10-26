'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Bookmark, Clock, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface MobileNavProps {
  onOpenSearch: () => void;
}

export function MobileNav({ onOpenSearch }: MobileNavProps) {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/catalogo', label: 'Catálogo', icon: Compass },
    { href: '#search', label: 'Buscar', icon: Search, isAction: true },
    { href: '/mi-lista', label: 'Mi lista', icon: Bookmark },
    { href: '/historial', label: 'Historial', icon: Clock },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-line bg-bg">
      <div className="flex h-14 items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isAction && (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));

          if (item.isAction) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={onOpenSearch}
                className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted hover:text-ink cursor-pointer"
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors',
                isActive ? 'text-accent' : 'text-muted hover:text-ink'
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
