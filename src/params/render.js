/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  return /(?:ssr|csr)/i.test(param);
}
