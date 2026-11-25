import { describe, expect, it } from 'vitest';
import { hilsen } from '../../src/domain/hello';

// Dekker AR-11 / AD-2: domain/ skal kunne testes uten database, nettverk eller nøkler.
describe('hilsen (AD-2, AR-11)', () => {
  it('hilser med navn når navn er gitt', () => {
    expect(hilsen('Anneli')).toBe('Hei, Anneli!');
  });

  it('hilser generelt når navn er tomt', () => {
    expect(hilsen('   ')).toBe('Hei!');
  });
});
