import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './tema.css';
import NedreNavigasjon from './components/nedre-navigasjon';

export const metadata: Metadata = {
  title: 'EuroBonus Poeng-stacker',
  description: 'Hold oversikt over EuroBonus- og Trumf-poeng.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="no">
      <body>
        <div className="skall-innhold">{children}</div>
        <NedreNavigasjon />
      </body>
    </html>
  );
}
