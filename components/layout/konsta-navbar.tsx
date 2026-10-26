'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from 'konsta/react';
import { Search } from 'lucide-react';
import { SearchBarDialog } from './search-bar';

export function KonstaNavbar() {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <>
      <Navbar
        title={
          <Link
            href="/"
            className="flex items-center gap-1.5 font-extrabold tracking-tighter text-lg text-ink uppercase"
          >
            <span className="bg-accent px-1.5 py-0.5 text-xs font-black tracking-widest text-white rounded-none">
              FL
            </span>
            <span>OW</span>
          </Link>
        }
        right={
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:text-white cursor-pointer active:opacity-60"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>
        }
        className="sticky top-0 z-40 w-full border-b border-line bg-bg/95 pt-safe"
        bgClassName="bg-bg"
        innerClassName="px-4 h-14 flex items-center justify-between"
      />

      <SearchBarDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
