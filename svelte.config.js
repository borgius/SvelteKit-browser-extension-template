import adapter from 'sveltekit-adapter-chrome-extension';
import preprocess from 'svelte-preprocess';
import {
  extensionId,
  updateManifestKey,
  getManifest,
} from './scripts/utils.js';

const key = updateManifestKey();
const id = extensionId();
const manifest = getManifest();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({}),

  kit: {
    adapter: adapter({
      meta: { id },
      importPrefix: `chrome-extension://${id}/`,
    }),
    appDir: 'app',
  },
};

export default config;
