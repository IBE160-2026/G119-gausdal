import { lokalLagring } from './lokal-lagring';
import type { Lagringsgrensesnitt } from './typer';

export type { Lagringsgrensesnitt, LagretFil } from './typer';

/**
 * AD-9: Resten av `src/app/` bruker alltid dette grensesnittet, aldri
 * `node:fs` direkte. Lokal mappe er standard; byttes uten omskriving av
 * resten av appen når v1 begynner å lagre filer.
 */
export const lagring: Lagringsgrensesnitt = lokalLagring;
