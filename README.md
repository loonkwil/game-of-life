# Game of Life

![Preview of the game](https://github.com/loonkwil/game-of-life/assets/1401202/be550a99-0766-48b9-b882-64a8f7654f9d)

https://game-of-life-alpha-three.vercel.app/

This is a simple web app to play with
[Svelte](https://svelte.dev/),
[SvelteKit](https://kit.svelte.dev/),
Server Side Rendering,
[bitboard](https://en.wikipedia.org/wiki/Bitboard),
[BitInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt),
various ARIA roles,
and the [roving tabindex](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets#technique_1_roving_tabindex) technique.

## About the Game

It is a mathematical simulation played on a grid of cells, where each cell can
be alive or dead. The game evolves over generations based on simple rules: cells
with too few or too many live neighbors die, and dead cells with exactly three
live neighbors come to life. This leads to the emergence of various interesting
patterns, making it a fascinating and widely studied cellular automaton.
