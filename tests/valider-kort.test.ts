import { describe, expect, it } from 'vitest';
import { validerKortvalg } from '../src/app/oppsett/valider-kort';

// FR-2: ren funksjon, ingen database/nettverk — samme mønster som
// tests/krev-sesjon.test.ts.
describe('validerKortvalg (FR-2)', () => {
  it('returnerer feil når ingen kort er valgt', () => {
    expect(validerKortvalg([])).toEqual({ ok: false, feil: 'Velg minst ett kort.' });
  });

  it('er ok når ett kort er valgt', () => {
    expect(validerKortvalg(['amex-elite'])).toEqual({ ok: true });
  });

  it('er ok når flere kort er valgt', () => {
    expect(validerKortvalg(['amex-elite', 'mastercard-premium'])).toEqual({ ok: true });
  });
});
