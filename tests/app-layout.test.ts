import { beforeEach, describe, expect, it, vi } from 'vitest';
import AppLayout from '../src/app/(app)/layout';

// Story 1.5 / FR-3: (app)/layout.tsx er det som tetter onboarding-hullet
// denne historien finnes for å fikse (logg-inn sender alltid til "/"
// uansett oppsett-status) — derfor den mest sikkerhetsrelevante logikken i
// appen. Samme mocking-mønster som tests/krev-sesjon.test.ts: mocker
// krevSesjon, db og next/navigations redirect (som kaster, siden ekte
// redirect() aldri returnerer) slik at testen kjører uten database/nettverk.
const { findUniqueMock, krevSesjonMock, redirectMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  krevSesjonMock: vi.fn(),
  redirectMock: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock('../src/app/db', () => ({
  db: { brukerProfil: { findUnique: findUniqueMock } },
}));

vi.mock('../src/app/krev-sesjon', () => ({
  krevSesjon: krevSesjonMock,
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

describe('(app)/layout (FR-3)', () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    krevSesjonMock.mockReset();
    redirectMock.mockClear();
    krevSesjonMock.mockResolvedValue({ user: { id: 'bruker-1' } });
  });

  it('omdirigerer til /oppsett når ingen BrukerProfil-rad finnes', async () => {
    findUniqueMock.mockResolvedValueOnce(null);

    await expect(AppLayout({ children: null })).rejects.toThrow('REDIRECT:/oppsett');
    expect(redirectMock).toHaveBeenCalledWith('/oppsett');
  });

  it('omdirigerer til /oppsett/mal når raden finnes men poengmal er null', async () => {
    findUniqueMock.mockResolvedValueOnce({ poengmal: null });

    await expect(AppLayout({ children: null })).rejects.toThrow('REDIRECT:/oppsett/mal');
    expect(redirectMock).toHaveBeenCalledWith('/oppsett/mal');
  });

  it('rendrer innholdet uten omdirigering når poengmal er satt', async () => {
    findUniqueMock.mockResolvedValueOnce({ poengmal: 180000 });

    const resultat = await AppLayout({ children: null });

    expect(redirectMock).not.toHaveBeenCalled();
    expect(resultat).toBeTruthy();
  });

  it('omdirigerer til /oppsett (feiler lukket) når databasekallet kaster en feil', async () => {
    findUniqueMock.mockRejectedValueOnce(new Error('nettverksfeil'));

    await expect(AppLayout({ children: null })).rejects.toThrow('REDIRECT:/oppsett');
    expect(redirectMock).toHaveBeenCalledWith('/oppsett');
  });
});
