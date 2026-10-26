import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-bg py-10 pb-20 md:pb-10">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted">
        <div className="flex items-center gap-3">
          <span className="font-extrabold uppercase tracking-widest text-ink">FLOW</span>
          <span className="text-line">•</span>
          <p className="font-mono text-[11px]">
            © {currentYear} FLOW STREAMING. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>

        <div className="flex items-center gap-6 font-bold uppercase tracking-widest text-[11px]">
          <Link href="/catalogo" className="hover:text-ink transition-colors">
            Catálogo
          </Link>
          <Link href="/mi-lista" className="hover:text-ink transition-colors">
            Mi Lista
          </Link>
          <Link href="/historial" className="hover:text-ink transition-colors">
            Historial
          </Link>
        </div>
      </Container>
    </footer>
  );
}
