/**
 * Ren kjernefunksjon (AD-2): ingen database, nettverk, miljøvariabler eller
 * klokke. Tar bare argumenter inn og returnerer en verdi.
 */
export function hilsen(navn: string): string {
  const trimmetNavn = navn.trim();
  return trimmetNavn.length > 0 ? `Hei, ${trimmetNavn}!` : 'Hei!';
}
