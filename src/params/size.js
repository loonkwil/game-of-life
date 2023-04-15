/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  return /\d+x\d+/i.test(param);
}
