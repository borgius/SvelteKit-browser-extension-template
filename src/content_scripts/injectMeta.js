import { extMetaName } from './constants.js';

(async () => {
  const p = '../meta.js';
  const { meta } = await import(p);
  window[extMetaName] = meta;
})();


