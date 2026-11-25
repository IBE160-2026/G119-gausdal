import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config';
import type { Lagringsgrensesnitt, LagretFil } from './typer';

/**
 * AD-9: Standardimplementasjonen i v1 — en lokal mappe på disk. Databasen
 * skal bare lagre `sti` og `type`, aldri selve filinnholdet.
 */
async function lagre(data: Uint8Array, filnavn: string, type: string): Promise<LagretFil> {
  await mkdir(config.storageDir, { recursive: true });
  const sti = path.join(config.storageDir, filnavn);
  await writeFile(sti, data);
  return { sti, type };
}

async function hent(sti: string): Promise<Uint8Array> {
  return readFile(sti);
}

async function slett(sti: string): Promise<void> {
  await rm(sti, { force: true });
}

export const lokalLagring: Lagringsgrensesnitt = { lagre, hent, slett };
