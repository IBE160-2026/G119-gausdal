import { beforeEach, describe, expect, it, vi } from 'vitest';
import { krevSesjon } from '../src/app/krev-sesjon';

// AR-8: krevSesjon() er den eneste beskyttelsen for Hjem/Før kjøp/Kjøp/Meg/
// Oppsett. Mocker auth.api.getSession og next/navigation.redirect slik at
// testen kjører uten database/nettverk.
// `vi.hoisted` er nødvendig siden `vi.mock`-kallene under hoistes til toppen
// av fila av Vitest — vanlige `const`/`let` ville blitt referert før de er
// initialisert.
const { getSessionMock, redirectMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  redirectMock: vi.fn((url: string) => {
    // Ekte `redirect()` returnerer aldri — kaster, slik at koden etter den
    // ikke kjører. Mocken må gjøre det samme for at kontrollflyten i
    // krev-sesjon.ts skal testes riktig.
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock('../src/app/auth', () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

describe('krevSesjon (AR-8)', () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    redirectMock.mockClear();
  });

  it('omdirigerer til /logg-inn når det ikke finnes en sesjon', async () => {
    getSessionMock.mockResolvedValueOnce(null);

    await expect(krevSesjon()).rejects.toThrow('REDIRECT:/logg-inn');
    expect(redirectMock).toHaveBeenCalledWith('/logg-inn');
  });

  it('returnerer sesjonen uten å omdirigere når den finnes', async () => {
    const sesjon = { user: { id: '1' }, session: { id: 'abc' } };
    getSessionMock.mockResolvedValueOnce(sesjon);

    await expect(krevSesjon()).resolves.toEqual(sesjon);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('omdirigerer til /logg-inn (feiler lukket) når getSession kaster en feil', async () => {
    getSessionMock.mockRejectedValueOnce(new Error('nettverksfeil'));

    await expect(krevSesjon()).rejects.toThrow('REDIRECT:/logg-inn');
    expect(redirectMock).toHaveBeenCalledWith('/logg-inn');
  });
});
