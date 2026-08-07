import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    const { code } = warning;
    // console.log(code); // <= uncomment to check other warnings
    if (code === 'css_unused_selector')
      return;
    if (code === 'a11y_invalid_attribute')
      return;
    handler(warning);
  },
};
