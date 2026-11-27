import { describe, expect, it } from 'vitest';
import { parserHeltall, parserKronerTilOre } from '../src/app/oppsett/tall';

// FR-4: rene funksjoner, ingen database/nettverk — samme mønster som
// tests/valider-kort.test.ts.
describe('parserHeltall (FR-4)', () => {
  it('parser et gyldig heltall', () => {
    expect(parserHeltall('180000')).toBe(180000);
  });

  it('avviser tomt felt', () => {
    expect(parserHeltall('')).toBeNull();
  });

  it('avviser negative tall', () => {
    expect(parserHeltall('-5')).toBeNull();
  });

  it('avviser desimaler i heltallsfelt', () => {
    expect(parserHeltall('12,5')).toBeNull();
  });

  it('avviser ikke-numerisk tekst', () => {
    expect(parserHeltall('abc')).toBeNull();
  });

  it('avviser tall over Postgres INTEGER-grensen', () => {
    expect(parserHeltall('2147483648')).toBeNull();
  });
});

describe('parserKronerTilOre (FR-4, UX-DR15)', () => {
  it('parser et gyldig beløp uten desimaler', () => {
    expect(parserKronerTilOre('100')).toBe(10000);
  });

  it('avviser tomt felt', () => {
    expect(parserKronerTilOre('')).toBeNull();
  });

  it('avviser negative tall', () => {
    expect(parserKronerTilOre('-100')).toBeNull();
  });

  it('parser et beløp med nøyaktig 2 desimaler', () => {
    expect(parserKronerTilOre('100,50')).toBe(10050);
  });

  it('runder ned et beløp med komma og mer enn 2 desimaler', () => {
    expect(parserKronerTilOre('1234,567')).toBe(123456);
  });

  it('godtar mellomrom som tusenskille uten desimaldel', () => {
    expect(parserKronerTilOre('12 000')).toBe(1200000);
  });

  it('avviser etterhengende komma', () => {
    expect(parserKronerTilOre('12,')).toBeNull();
  });

  it('avviser flere komma', () => {
    expect(parserKronerTilOre('12,34,56')).toBeNull();
  });

  it('avviser beløp som i øre overstiger Postgres INTEGER-grensen', () => {
    expect(parserKronerTilOre('21474837')).toBeNull();
  });
});
