import { redirect } from '@sveltejs/kit';
import { fromString } from '$lib/game';

/** @type {import('./$types').PageLoad} */
export function load() {
  const exampleGame = fromString(`
      . . . . . . . . . . . . .
      . . . . . . . . . . . . .
      . . . . . . . . . . . . .
      . . . . . x x x . . . . .
      . . . . . x . x . . . . .
      . . . . . x . x . . . . .
      . . . . . . . . . . . . .
      . . . . . x . x . . . . .
      . . . . . x . x . . . . .
      . . . . . x x x . . . . .
      . . . . . . . . . . . . .
      . . . . . . . . . . . . .
      . . . . . . . . . . . . .
    `);
  throw redirect(307, `/${exampleGame}`);
}
