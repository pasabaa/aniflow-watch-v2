'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabbar, TabbarLink } from 'konsta/react';
import { Home, Compass, Search, Bookmark, Clock } from 'lucide-react';
import { SearchBarDialog } from './search-bar';

export function KonstaTabbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);

  const isHome = pathname === '/';
  const isCatalog = pathname.startsWith('/catalogo');
  const isWatchlist = pathname.startsWith('/mi-lista');
  const isHistory = pathname.startsWith('/historial');

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 w-full border-t border-line bg-bg pb-safe">
        <Tabbar
          labels={true}
          icons={true}
          className="h-16 w-full bg-bg text-muted flex items-center justify-around"
        >
          <TabbarLink
            active={isHome}
            component={Link}
            linkProps={{ href: '/' }}
            icon={<Home className="h-5 w-5" strokeWidth={1.5} />}
            label="INICIO"
            colors={{
              textActiveMaterial: 'text-accent font-bold',
              textMaterial: 'text-muted text-[10px] tracking-wider',
              iconBgActiveMaterial: 'bg-transparent text-accent',
            }}
          />

          <TabbarLink
            active={isCatalog}
            component={Link}
            linkProps={{ href: '/catalogo' }}
            icon={<Compass className="h-5 w-5" strokeWidth={1.5} />}
            label="CATÁLOGO"
            colors={{
              textActiveMaterial: 'text-accent font-bold',
              textMaterial: 'text-muted text-[10px] tracking-wider',
              iconBgActiveMaterial: 'bg-transparent text-accent',
            }}
          />

          <TabbarLink
            active={searchOpen}
            onClick={() => setSearchOpen(true)}
            icon={<Search className="h-5 w-5" strokeWidth={1.5} />}
            label="BUSCAR"
            colors={{
              textActiveMaterial: 'text-accent font-bold',
              textMaterial: 'text-muted text-[10px] tracking-wider',
              iconBgActiveMaterial: 'bg-transparent text-accent',
            }}
          />

          <TabbarLink
            active={isWatchlist}
            component={Link}
            linkProps={{ href: '/mi-lista' }}
            icon={<Bookmark className="h-5 w-5" strokeWidth={1.5} />}
            label="MI LISTA"
            colors={{
              textActiveMaterial: 'text-accent font-bold',
              textMaterial: 'text-muted text-[10px] tracking-wider',
              iconBgActiveMaterial: 'bg-transparent text-accent',
            }}
          />

          <TabbarLink
            active={isHistory}
            component={Link}
            linkProps={{ href: '/historial' }}
            icon={<Clock className="h-5 w-5" strokeWidth={1.5} />}
            label="HISTORIAL"
            colors={{
              textActiveMaterial: 'text-accent font-bold',
              textMaterial: 'text-muted text-[10px] tracking-wider',
              iconBgActiveMaterial: 'bg-transparent text-accent',
            }}
          />
        </Tabbar>
      </div>

      <SearchBarDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
