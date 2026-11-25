// FR-1: Better Auths rutehåndterer. Alle auth-kall (sign-up, sign-in,
// sign-out, session osv.) går via denne catch-all-ruten.
import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/app/auth';

export const { GET, POST } = toNextJsHandler(auth);
