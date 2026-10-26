'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Nav } from './nav';
import { SearchBarDialog } from './search-bar';
import { MobileNav } from './mobile-nav';

export function Header() {
  const [searchOpen, setSearchOpen] = React.useState(false);

  // ⌘K shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-line bg-bg">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-extrabold tracking-tighter text-xl text-ink uppercase"
            >
              <span className="bg-accent px-1.5 py-0.5 text-xs font-black tracking-widest text-white rounded-none">
                FL
              </span>
              <span>OW</span>
            </Link>

            <Nav />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-neutral-500 hover:text-ink cursor-pointer"
              aria-label="Abrir buscador"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden sm:inline font-bold uppercase tracking-wider text-[11px]">BUSCAR...</span>
              <kbd className="hidden sm:inline-block rounded-none border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted">
                ⌘K
              </kbd>
            </button>
          </div>
        </Container>
      </header>

      <SearchBarDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav onOpenSearch={() => setSearchOpen(true)} />
    </>
  );
}
