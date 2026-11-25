import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './tema.css';

export const metadata: Metadata = {
  title: 'EuroBonus Poeng-stacker',
  description: 'Hold oversikt over EuroBonus- og Trumf-poeng.',
};

// Story 1.3: fanelinjen flyttet til (app)/layout.tsx — den hører bare til
// den beskyttede rutegruppen, ikke til Oppsett eller innloggingssidene.
// Rotlayouten legger IKKE på .skall-innhold selv — (app)/layout.tsx gjør det
// for sine sider, og de andre sidene (logg-inn, opprett-konto, oppsett)
// setter klassen på sitt eget <main>. To nestede .skall-innhold ville doblet
// sidemargen (padding-inline telles to ganger).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
