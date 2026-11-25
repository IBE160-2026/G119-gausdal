'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Fane = {
  href: string;
  navn: string;
};

const FANER: readonly Fane[] = [
  { href: '/', navn: 'Hjem' },
  { href: '/for-kjop', navn: 'Før kjøp' },
  { href: '/kjop', navn: 'Kjøp' },
  { href: '/meg', navn: 'Meg' },
];

export default function NedreNavigasjon() {
  const pathname = usePathname();

  return (
    <nav className="nedre-navigasjon" aria-label="Hovednavigasjon">
      {FANER.map((fane) => {
        const erAktiv = pathname === fane.href;

        return (
          <Link
            key={fane.href}
            href={fane.href}
            className="nedre-navigasjon__fane"
            aria-current={erAktiv ? 'page' : undefined}
          >
            {fane.navn}
          </Link>
        );
      })}
    </nav>
  );
}
